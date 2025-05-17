using System.Runtime.CompilerServices;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class ExpenseCategoriesControllerTests : IDisposable
{
    private const string ConflictMessage = "Category already exists.";
    private const string NameRequiredMessage = "Category name cannot be empty.";
    private const string _testPrefix = "Test_";
    private readonly string _defaultCatName = $"{_testPrefix}Test_Default";
    private readonly string _userCatName = $"{_testPrefix}User's";
    private readonly string _otherUserCatName = $"{_testPrefix}Another User's";
    private readonly string _newCatName = $"{_testPrefix}New Category";
    private readonly string _oldCatName = $"{_testPrefix}Old";
    private readonly string _updatedCatName = $"{_testPrefix}Updated";
    private readonly string _testOtherUserCat = $"{_testPrefix}OtherUser";
    private readonly string _toDeleteCat = $"{_testPrefix}ToDelete";
    private readonly string _user1Id = "auth0|user1";
    private readonly string _user2Id = "auth0|user2";
    private ApplicationDbContext _context;
    private ExpenseCategoriesController _controller;
    private readonly List<Guid> _testCategoryIds = new();
    public ExpenseCategoriesControllerTests()
    {
        DbContextOptions<ApplicationDbContext> options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseNpgsql("Host=localhost;Port=5432;Database=budget_to_wealth_development;")
            .Options;

        _context = new ApplicationDbContext(options);
        
        CleanupPreviousTestData();
        
        SetupTestData().Wait();
        
        _controller = new ExpenseCategoriesController(_context);
        SetupUserContext(_user1Id);
    }

    private void CleanupPreviousTestData()
    {
        List<ExpenseCategory> categories = _context.ExpenseCategories.Where(c => 
            c.Name.StartsWith(_testPrefix)).ToList();
            
        if (categories.Any())
        {
            _context.ExpenseCategories.RemoveRange(categories);
            _context.SaveChanges();
        }
    }

    private async Task SetupTestData()
    {
        await CreateTestCategory(_defaultCatName, null);
        await CreateTestCategory(_userCatName, _user1Id);
        await CreateTestCategory(_otherUserCatName, _user2Id);
        _context.SaveChanges();
    }

    private void SetupUserContext(string userId)
    {
        List<Claim> claims = new() { new Claim(ClaimTypes.NameIdentifier, userId) };
        ClaimsIdentity identity = new(claims, "TestAuthType");
        ClaimsPrincipal claimsPrincipal = new(identity);

        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = claimsPrincipal }
        };
    }

    private void SetUserUnauthorized()
    {
        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal() }
        };
    }
    private async Task<ExpenseCategory> CreateTestCategory(string name, string userId = null)
    {
        ExpenseCategory category = new() { Name = name, UserId = userId };
        _context.ExpenseCategories.Add(category);
        await _context.SaveChangesAsync();
        _testCategoryIds.Add(category.Id);
        return category;
    }

    public void Dispose()
    {
        foreach (Guid id in _testCategoryIds)
        {
            ExpenseCategory? category = _context.ExpenseCategories.Find(id);
            if (category != null)
                _context.ExpenseCategories.Remove(category);
        }
        _context.SaveChanges();
        _context.Dispose();
    }

    [Fact]
    public async Task Get_ReturnsDefaultAndUserCategories()
    {
        OkObjectResult? result = await _controller.Get() as OkObjectResult;
        IEnumerable<ExpenseCategory> categories = Assert.IsAssignableFrom<IEnumerable<ExpenseCategory>>(result!.Value);

        Assert.Contains(categories, c => c.Name == _defaultCatName);
        Assert.Contains(categories, c => c.Name == _userCatName);
        Assert.DoesNotContain(categories, c => c.Name == _otherUserCatName);
    }

    [Fact]
    public async Task Create_AddsNewCategoryForUser()
    {
        ExpenseCategory newCategory = new() { Name = _newCatName };
        OkObjectResult? result = await _controller.Create(newCategory) as OkObjectResult;
        ExpenseCategory? savedCategory = await _context.ExpenseCategories.FirstOrDefaultAsync(c => c.Name == _newCatName);

        if (savedCategory != null)
            _testCategoryIds.Add(savedCategory.Id);

        Assert.NotNull(result);
        Assert.NotNull(savedCategory);
        Assert.Equal(_user1Id, savedCategory!.UserId);
    }

    [Fact]
    public async Task Create_DoesNotAllowNewCategoryWithSameNameAsDefault()
    {
        ExpenseCategory newCategory = new() { Name = _defaultCatName };
        IActionResult result = await _controller.Create(newCategory);

        ConflictObjectResult conflictResult = Assert.IsType<ConflictObjectResult>(result);    
        Assert.Equal(ConflictMessage, conflictResult.Value);
    }

    [Fact]
    public async Task Create_DoesNotAllowNewCategoryWithSameNameAsExistingUserCategory()
    {
        ExpenseCategory newCategory = new() { Name = _userCatName };

        IActionResult result = await _controller.Create(newCategory);

        ConflictObjectResult conflictResult = Assert.IsType<ConflictObjectResult>(result);    
        Assert.Equal(ConflictMessage, conflictResult.Value);
    }

    [Fact]
    public async Task Create_DoesNotAllowCategoryWithSameNameDifferentCasing()
    {
        ExpenseCategory newCategory = new() { Name = _defaultCatName.ToLower() };

        IActionResult result = await _controller.Create(newCategory);

        ConflictObjectResult conflictResult = Assert.IsType<ConflictObjectResult>(result);
        Assert.Equal(ConflictMessage, conflictResult.Value);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData(" ")]
    public async Task Create_InvalidNameReturnsBadRequest(string? invalidName)
    {
        IActionResult result = await _controller.Create(new ExpenseCategory { Name = invalidName });

        BadRequestObjectResult badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(NameRequiredMessage, badRequest.Value);
    }

    [Fact]
    public async Task Update_ModifiesOwnedCategory()
    {
        ExpenseCategory oldCatCategory = await CreateTestCategory(_oldCatName, _user1Id);

        string newName = _updatedCatName;
        OkObjectResult? result = await _controller.Update(oldCatCategory.Id, new ExpenseCategory { Name = newName }) as OkObjectResult;

        ExpenseCategory? updated = await _context.ExpenseCategories.FindAsync(oldCatCategory.Id);
        Assert.NotNull(result);
        Assert.Equal(newName, updated?.Name);
    }

    [Fact]
    public async Task Update_DoesNotAllowModifyingOtherUsersCategory()
    {
        ExpenseCategory otherUserCategory = await CreateTestCategory(_testOtherUserCat, _user2Id);
        IActionResult result = await _controller.Update(otherUserCategory.Id, new ExpenseCategory { Name = _updatedCatName });
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Update_DoesNotAllowModifyingDefaultCategories()
    {
        ExpenseCategory? defaultCategory = _context.ExpenseCategories.FirstOrDefault(c => c.Name == _defaultCatName);
        IActionResult result = await _controller.Update(defaultCategory!.Id, new ExpenseCategory { Name = _updatedCatName });
        Assert.IsType<NotFoundResult>(result);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData(" ")]
    public async Task Update_InvalidNameReturnsBadRequest(string? invalidName)
    {
        ExpenseCategory? userCategory = _context.ExpenseCategories.FirstOrDefault(c => c.Name == _userCatName);
        IActionResult result = await _controller.Update(userCategory!.Id, new ExpenseCategory { Name = invalidName });

        BadRequestObjectResult badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(NameRequiredMessage, badRequest.Value);
    }

    [Fact]
    public async Task Delete_RemovesUserCategory()
    {
        ExpenseCategory toDeleteCategory = await CreateTestCategory(_toDeleteCat, _user1Id);
        IActionResult result = await _controller.Delete(toDeleteCategory.Id);

        Assert.IsType<NoContentResult>(result);
        Assert.False(_context.ExpenseCategories.Any(c => c.Name == _toDeleteCat && c.UserId == _user1Id));
    }

    [Fact]
    public async Task Delete_DoesNotAllowDeletingOthersCategories()
    {
        ExpenseCategory? otherUserCategory = _context.ExpenseCategories.FirstOrDefault(c => c.Name == _otherUserCatName);
        IActionResult result = await _controller.Delete(otherUserCategory!.Id);
        Assert.IsType<NotFoundResult>(result);
    }

    [Theory]
    [InlineData("Get")]
    [InlineData("Create")]
    [InlineData("Update")]
    [InlineData("Delete")]
    public async Task UnauthorizedUser_CannotAccessEndpoints(string action)
    {
        SetUserUnauthorized();
        ExpenseCategory? userCategory = _context.ExpenseCategories.FirstOrDefault(c => c.Name == _userCatName);
        IActionResult result = action switch
        {
            "Get" => await _controller.Get(),
            "Create" => await _controller.Create(new ExpenseCategory { Name = _newCatName }),
            "Update" => await _controller.Update(userCategory!.Id, new ExpenseCategory { Name = _newCatName }),
            "Delete" => await _controller.Delete(userCategory!.Id),
            _ => throw new ArgumentOutOfRangeException()
        };
        Assert.IsType<UnauthorizedResult>(result);
        SetupUserContext(_user1Id);
    }

    [Theory]
    [InlineData("Create")]
    [InlineData("Update")]
    public async Task CreateAndUpdateDates(string action)
    {
        ExpenseCategory? userCategory = _context.ExpenseCategories.FirstOrDefault(c => c.Name == _userCatName);
        IActionResult result = action switch
        {
            "Create" => await _controller.Create(new ExpenseCategory { Name = _newCatName }),
            "Update" => await _controller.Update(userCategory!.Id, new ExpenseCategory { Name = _newCatName }),
        };
        OkObjectResult? okResult = result as OkObjectResult;
        ExpenseCategory? category = Assert.IsType<ExpenseCategory>(okResult!.Value);
        if (action == "Create")
        {
            Assert.NotEqual(DateTime.MinValue, category.CreatedAt);
            Assert.Equal(DateTime.MinValue, category.UpdatedAt);
        }
        if (action == "Update")
        {
            Assert.NotEqual(DateTime.MinValue, category.CreatedAt);
            Assert.NotEqual(DateTime.MinValue, category.UpdatedAt);
            Assert.True(category.UpdatedAt > category.CreatedAt);
            Assert.True(category.UpdatedAt > DateTime.UtcNow.AddMinutes(-1));
        }
    }
}
