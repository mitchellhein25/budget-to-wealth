using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

public class ManualInvestmentCategoriesControllerTests : IDisposable
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
    private ManualInvestmentCategoriesController _controller;
    private readonly IDbContextTransaction _transaction;
    public ManualInvestmentCategoriesControllerTests()
    {
        _context = DatabaseSetup.GetDbContext();
        _transaction = DatabaseSetup.GetTransaction(_context);
        _controller = new ManualInvestmentCategoriesController(_context);
        SetupTestData().Wait();
        SetupUserContext(_user1Id);
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

    private async Task<ManualInvestmentCategory> CreateTestCategory(string name, string? userId = null)
    {
        ManualInvestmentCategory category = new()
        {
            Name = name,
            UserId = userId
        };
        _context.ManualInvestmentCategories.Add(category);
        await _context.SaveChangesAsync();
        return category;
    }

    public void Dispose()
    {
        _transaction.Rollback();
        _transaction.Dispose();
        _context.Dispose();
    }

    [Fact]
    public async Task Get_ReturnsDefaultAndUserCategories()
    {
        OkObjectResult? result = await _controller.Get() as OkObjectResult;
        IEnumerable<ManualInvestmentCategory> categories = Assert.IsAssignableFrom<IEnumerable<ManualInvestmentCategory>>(result!.Value);

        Assert.Contains(categories, c => c.Name == _defaultCatName);
        Assert.Contains(categories, c => c.Name == _userCatName);
        Assert.DoesNotContain(categories, c => c.Name == _otherUserCatName);
    }

    [Fact]
    public async Task Create_AddsNewCategoryForUser()
    {
        ManualInvestmentCategory newCategory = new()
        {
            Name = _newCatName,
        };
        var createdAtActionResult = Assert.IsType<ObjectResult>(await _controller.Create(newCategory));
        Assert.Equal(_newCatName, (createdAtActionResult.Value as ManualInvestmentCategory)?.Name);
    }

    [Fact]
    public async Task Create_DoesNotAllowNewCategoryWithSameNameAsDefault()
    {
        ManualInvestmentCategory newCategory = new()
        {
            Name = _defaultCatName,
        };
        IActionResult result = await _controller.Create(newCategory);

        ConflictObjectResult conflictResult = Assert.IsType<ConflictObjectResult>(result);
        Assert.Equal(ConflictMessage, conflictResult.Value);
    }

    [Fact]
    public async Task Create_DoesNotAllowNewCategoryWithSameNameAsExistingUserCategory()
    {
        ManualInvestmentCategory newCategory = new()
        {
            Name = _userCatName,
        };

        IActionResult result = await _controller.Create(newCategory);

        ConflictObjectResult conflictResult = Assert.IsType<ConflictObjectResult>(result);
        Assert.Equal(ConflictMessage, conflictResult.Value);
    }

    [Fact]
    public async Task Create_DoesNotAllowCategoryWithSameNameDifferentCasing()
    {
        ManualInvestmentCategory newCategory = new()
        {
            Name = _defaultCatName.ToLower(),
        };

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
        IActionResult result = await _controller.Create(new ManualInvestmentCategory { Name = invalidName! });

        BadRequestObjectResult badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(NameRequiredMessage, badRequest.Value);
    }

    [Fact]
    public async Task Update_ModifiesOwnedCategory()
    {
        ManualInvestmentCategory oldCatCategory = await CreateTestCategory(_oldCatName, _user1Id);

        string newName = _updatedCatName;
        OkObjectResult? result = await _controller.Update(oldCatCategory.Id, new ManualInvestmentCategory { Name = newName }) as OkObjectResult;

        ManualInvestmentCategory? updated = await _context.ManualInvestmentCategories.FindAsync(oldCatCategory.Id);
        Assert.NotNull(result);
        Assert.Equal(newName, updated!.Name);
    }

    [Fact]
    public async Task Update_DoesNotAllowModifyingOtherUsersCategory()
    {
        ManualInvestmentCategory otherUserCategory = await CreateTestCategory(_testOtherUserCat, _user2Id);
        IActionResult result = await _controller.Update(otherUserCategory.Id, new ManualInvestmentCategory { Name = _updatedCatName });
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Update_DoesNotAllowModifyingDefaultCategories()
    {
        ManualInvestmentCategory? defaultCategory = _context.ManualInvestmentCategories.FirstOrDefault(c => c.Name == _defaultCatName);
        IActionResult result = await _controller.Update(defaultCategory!.Id, new ManualInvestmentCategory { Name = _updatedCatName });
        Assert.IsType<NotFoundResult>(result);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData(" ")]
    public async Task Update_InvalidNameReturnsBadRequest(string? invalidName)
    {
        ManualInvestmentCategory? userCategory = _context.ManualInvestmentCategories.FirstOrDefault(c => c.Name == _userCatName);
        IActionResult result = await _controller.Update(userCategory!.Id, new ManualInvestmentCategory { Name = invalidName! });

        BadRequestObjectResult badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(NameRequiredMessage, badRequest.Value);
    }

    [Fact]
    public async Task Delete_RemovesUserCategory()
    {
        ManualInvestmentCategory toDeleteCategory = await CreateTestCategory(_toDeleteCat, _user1Id);
        IActionResult result = await _controller.Delete(toDeleteCategory.Id);

        Assert.IsType<NoContentResult>(result);
        Assert.False(_context.ManualInvestmentCategories.Any(c => c.Name == _toDeleteCat && c.UserId == _user1Id));
    }

    [Fact]
    public async Task Delete_DoesNotAllowDeletingOthersCategories()
    {
        ManualInvestmentCategory? otherUserCategory = _context.ManualInvestmentCategories.FirstOrDefault(c => c.Name == _otherUserCatName);
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
        ManualInvestmentCategory? userCategory = _context.ManualInvestmentCategories.FirstOrDefault(c => c.Name == _userCatName);
        IActionResult result = action switch
        {
            "Get" => await _controller.Get(),
            "Create" => await _controller.Create(new ManualInvestmentCategory { Name = _newCatName }),
            "Update" => await _controller.Update(userCategory!.Id, new ManualInvestmentCategory { Name = _newCatName }),
            "Delete" => await _controller.Delete(userCategory!.Id),
            _ => throw new ArgumentOutOfRangeException(nameof(action), action, "Unsupported action")
        };
        Assert.IsType<UnauthorizedResult>(result);
        SetupUserContext(_user1Id);
    }

    [Theory]
    [InlineData("Create")]
    [InlineData("Update")]
    public async Task CreateAndUpdateDates(string action)
    {
        ManualInvestmentCategory? userCategory = _context.ManualInvestmentCategories.FirstOrDefault(c => c.Name == _userCatName);
        IActionResult result = action switch
        {
            "Create" => await _controller.Create(new ManualInvestmentCategory { Name = _newCatName }),
            "Update" => await _controller.Update(userCategory!.Id, new ManualInvestmentCategory { Name = _newCatName }),
            _ => throw new ArgumentOutOfRangeException(nameof(action), action, "Unsupported action")
        };
        if (action == "Create")
        {
            var createdAtActionResult = Assert.IsType<ObjectResult>(result);
            ManualInvestmentCategory? category = createdAtActionResult.Value as ManualInvestmentCategory;
            Assert.NotEqual(DateTime.MinValue, category?.CreatedAt);
            Assert.Equal(DateTime.MinValue, category?.UpdatedAt);
        }
        if (action == "Update")
        {
            var okResult = Assert.IsType<OkObjectResult>(result);
            ManualInvestmentCategory? category = Assert.IsType<ManualInvestmentCategory>(okResult.Value);
            Assert.NotEqual(DateTime.MinValue, category.CreatedAt);
            Assert.NotEqual(DateTime.MinValue, category.UpdatedAt);
            Assert.True(category.UpdatedAt > category.CreatedAt);
            Assert.True(category.UpdatedAt > DateTime.UtcNow.AddMinutes(-1));
        }
    }
}
