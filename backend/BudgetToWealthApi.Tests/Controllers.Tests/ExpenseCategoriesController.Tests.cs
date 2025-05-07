using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class ExpenseCategoriesControllerTests
{
    private const string ConflictMessage = "Category already exists.";
    private const string NameRequiredMessage = "Category name cannot be empty.";
    private readonly string _defaultCatName = "Default";
    private readonly string _userCatName = "User's";
    private readonly string _otherUserCatName = "Another User's";
    private readonly string _newCatName = "New Category";
    private readonly string _user1Id = "auth0|user1";
    private readonly string _user2Id = "auth0|user2";
    private readonly Guid _cat1Guid = Guid.NewGuid();
    private readonly Guid _cat2Guid = Guid.NewGuid();
    private readonly Guid _cat3Guid = Guid.NewGuid();
    private ApplicationDbContext _context;
    private ExpenseCategoriesController _controller;
    public ExpenseCategoriesControllerTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _context = new ApplicationDbContext(options);
        _context.ExpenseCategories.AddRange(
            new ExpenseCategory { Id = _cat1Guid, Name = _defaultCatName, UserId = null },
            new ExpenseCategory { Id = _cat2Guid, Name = _userCatName, UserId = _user1Id },
            new ExpenseCategory { Id = _cat3Guid, Name = _otherUserCatName, UserId = _user2Id }
        );
        _context.SaveChanges();
        _controller = new ExpenseCategoriesController(_context);

        ResetUserContext();
    }

    private void SetUserUnauthorized()
    {
        var claimsPrincipal = new ClaimsPrincipal();

        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = claimsPrincipal }
        };
    }

    private void ResetUserContext()
    {
        var claims = new List<Claim> { new Claim("sub", _user1Id) };
        var identity = new ClaimsIdentity(claims, "TestAuthType");
        var claimsPrincipal = new ClaimsPrincipal(identity);

        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = claimsPrincipal }
        };
    }

    [Fact]
    public async Task Get_ReturnsDefaultAndUserCategories()
    {
        var result = await _controller.Get() as OkObjectResult;
        var categories = Assert.IsAssignableFrom<IEnumerable<ExpenseCategory>>(result!.Value);

        Assert.Contains(categories, c => c.Name == _defaultCatName);
        Assert.Contains(categories, c => c.Name == _userCatName);
        Assert.DoesNotContain(categories, c => c.Name == _otherUserCatName);
    }

    [Fact]
    public async Task Create_AddsNewCategoryForUser()
    {
        var newCategory = new ExpenseCategory { Name = _newCatName };

        var result = await _controller.Create(newCategory) as OkObjectResult;

        Assert.NotNull(result);
        var saved = await _context.ExpenseCategories.FirstOrDefaultAsync(c => c.Name == _newCatName);
        Assert.Equal(_user1Id, saved!.UserId);
        _context.ExpenseCategories.Remove(saved);
    }

    [Fact]
    public async Task Create_DoesNotAllowNewCategoryWithSameNameAsDefault()
    {
        var newCategory = new ExpenseCategory { Name = _defaultCatName };
        var result = await _controller.Create(newCategory);

        var conflictResult = Assert.IsType<ConflictObjectResult>(result);    
        Assert.Equal(ConflictMessage, conflictResult.Value);
    }

    [Fact]
    public async Task Create_DoesNotAllowNewCategoryWithSameNameAsExistingUserCategory()
    {
        var newCategory = new ExpenseCategory { Name = _userCatName };

        var result = await _controller.Create(newCategory);

        var conflictResult = Assert.IsType<ConflictObjectResult>(result);    
        Assert.Equal(ConflictMessage, conflictResult.Value);
    }

    [Fact]
    public async Task Create_DoesNotAllowCategoryWithSameNameDifferentCasing()
    {
        var newCategory = new ExpenseCategory { Name = _defaultCatName.ToLower() };

        var result = await _controller.Create(newCategory);

        var conflictResult = Assert.IsType<ConflictObjectResult>(result);
        Assert.Equal(ConflictMessage, conflictResult.Value);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData(" ")]
    public async Task Create_InvalidNameReturnsBadRequest(string? invalidName)
    {
        var result = await _controller.Create(new ExpenseCategory { Name = invalidName });

        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(NameRequiredMessage, badRequest.Value);
    }

    [Fact]
    public async Task Update_ModifiesOwnedCategory()
    {
        Guid updateGuid = Guid.NewGuid();
        _context.ExpenseCategories.Add(new ExpenseCategory { Id = updateGuid, Name = "Old", UserId = _user1Id });
        await _context.SaveChangesAsync();

        string newName = "Updated";
        var result = await _controller.Update(updateGuid, new ExpenseCategory { Name = newName }) as OkObjectResult;

        var updated = await _context.ExpenseCategories.FindAsync(updateGuid);
        Assert.Equal(newName, updated?.Name);
    }

    [Fact]
    public async Task Update_DoesNotAllowModifyingOtherUsersCategory()
    {
        var result = await _controller.Update(_cat3Guid, new ExpenseCategory { Name = "Updated" });
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Update_DoesNotAllowModifyingDefaultCategories()
    {
        var result = await _controller.Update(_cat1Guid, new ExpenseCategory { Name = "Updated" });
        Assert.IsType<NotFoundResult>(result);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData(" ")]
    public async Task Update_InvalidNameReturnsBadRequest(string? invalidName)
    {
        var result = await _controller.Update(_cat2Guid, new ExpenseCategory { Name = invalidName });

        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(NameRequiredMessage, badRequest.Value);
    }

    [Fact]
    public async Task Delete_RemovesUserCategory()
    {
        Guid deleteGuid = Guid.NewGuid();
        string deleteName = "ToDelete";
        _context.ExpenseCategories.Add(new ExpenseCategory { Id = deleteGuid, Name = deleteName, UserId = _user1Id });
        await _context.SaveChangesAsync();

        var result = await _controller.Delete(deleteGuid);

        Assert.IsType<NoContentResult>(result);
        Assert.False(_context.ExpenseCategories.Any(c => c.Name == deleteName && c.UserId == _user1Id));
    }

    [Fact]
    public async Task Delete_DoesNotAllowDeletingOthersCategories()
    {
        var result = await _controller.Delete(_cat3Guid);
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
        var result = action switch
        {
            "Get" => await _controller.Get(),
            "Create" => await _controller.Create(new ExpenseCategory { Name = _newCatName }),
            "Update" => await _controller.Update(_cat2Guid, new ExpenseCategory { Name = "Test" }),
            "Delete" => await _controller.Delete(_cat2Guid),
            _ => throw new ArgumentOutOfRangeException()
        };
        Assert.IsType<UnauthorizedResult>(result);
        ResetUserContext();
    }
}
