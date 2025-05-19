using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

public class ExpensesControllerTests : IDisposable
{
    private readonly string _user1Id = "auth0|user1";
    private readonly string _user2Id = "auth0|user2";
    private ExpensesControllerTestObjects _testObjects;
    private ApplicationDbContext _context;
    private ExpensesController _controller;
    private readonly IDbContextTransaction _transaction;
    public ExpensesControllerTests()
    {
        _context = DatabaseSetup.GetDbContext();
        _transaction = DatabaseSetup.GetTransaction(_context);
        _controller = new ExpensesController(_context);
        SetupTestData();
        SetupUserContext(_user1Id);
    }

    private void SetupTestData()
    {
        _testObjects = new(_context);
        _context.Expenses.Add(_testObjects.TestExpense1);
        _context.Expenses.Add(_testObjects.TestExpense2);
        _context.Expenses.Add(_testObjects.TestExpense3);
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

    private async Task<Expense> CreateTestExpense(Expense expense)
    {
        _context.Expenses.Add(expense);
        await _context.SaveChangesAsync();
        return expense;
    }

    public void Dispose()
    {
        _transaction.Rollback();
        _transaction.Dispose();
        _context.Dispose();
    }

    [Fact]
    public async Task Get_QueryWithoutDateReturnsAllUserExpenses()
    {
        OkObjectResult? result = await _controller.Get() as OkObjectResult;
        IEnumerable<Expense> expenses = Assert.IsAssignableFrom<IEnumerable<Expense>>(result!.Value);

        Assert.Contains(expenses, exp => exp.Amount == _testObjects.TestExpense1.Amount);
        Assert.Equal(2, expenses.Count());
    }

    // [Fact]
    // public async Task Create_AddsNewCategoryForUser()
    // {
    //     Expense newCategory = new() { Name = _newCatName };
    //     OkObjectResult? result = await _controller.Create(newCategory) as OkObjectResult;
    //     Expense? savedCategory = await _context.Expenses.FirstOrDefaultAsync(c => c.Name == _newCatName);

    //     Assert.NotNull(result);
    //     Assert.NotNull(savedCategory);
    //     Assert.Equal(_user1Id, savedCategory!.UserId);
    // }

    // [Fact]
    // public async Task Create_DoesNotAllowNewCategoryWithSameNameAsDefault()
    // {
    //     Expense newCategory = new() { Name = _defaultCatName };
    //     IActionResult result = await _controller.Create(newCategory);

    //     ConflictObjectResult conflictResult = Assert.IsType<ConflictObjectResult>(result);    
    //     Assert.Equal(ConflictMessage, conflictResult.Value);
    // }

    // [Fact]
    // public async Task Create_DoesNotAllowNewCategoryWithSameNameAsExistingUserCategory()
    // {
    //     Expense newCategory = new() { Name = _userCatName };

    //     IActionResult result = await _controller.Create(newCategory);

    //     ConflictObjectResult conflictResult = Assert.IsType<ConflictObjectResult>(result);    
    //     Assert.Equal(ConflictMessage, conflictResult.Value);
    // }

    // [Fact]
    // public async Task Create_DoesNotAllowCategoryWithSameNameDifferentCasing()
    // {
    //     Expense newCategory = new() { Name = _defaultCatName.ToLower() };

    //     IActionResult result = await _controller.Create(newCategory);

    //     ConflictObjectResult conflictResult = Assert.IsType<ConflictObjectResult>(result);
    //     Assert.Equal(ConflictMessage, conflictResult.Value);
    // }

    // [Theory]
    // [InlineData(null)]
    // [InlineData("")]
    // [InlineData(" ")]
    // public async Task Create_InvalidNameReturnsBadRequest(string? invalidName)
    // {
    //     IActionResult result = await _controller.Create(new Expense { Name = invalidName });

    //     BadRequestObjectResult badRequest = Assert.IsType<BadRequestObjectResult>(result);
    //     Assert.Equal(NameRequiredMessage, badRequest.Value);
    // }

    // [Fact]
    // public async Task Update_ModifiesOwnedCategory()
    // {
    //     Expense oldCatCategory = await CreateTestExpense(_oldCatName, _user1Id);

    //     string newName = _updatedCatName;
    //     OkObjectResult? result = await _controller.Update(oldCatCategory.Id, new Expense { Name = newName }) as OkObjectResult;

    //     Expense? updated = await _context.Expenses.FindAsync(oldCatCategory.Id);
    //     Assert.NotNull(result);
    //     Assert.Equal(newName, updated?.Name);
    // }

    // [Fact]
    // public async Task Update_DoesNotAllowModifyingOtherUsersCategory()
    // {
    //     Expense otherUserCategory = await CreateTestExpense(_testOtherUserCat, _user2Id);
    //     IActionResult result = await _controller.Update(otherUserCategory.Id, new Expense { Name = _updatedCatName });
    //     Assert.IsType<NotFoundResult>(result);
    // }

    // [Fact]
    // public async Task Update_DoesNotAllowModifyingDefaultExpenses()
    // {
    //     Expense? defaultCategory = _context.Expenses.FirstOrDefault(c => c.Name == _defaultCatName);
    //     IActionResult result = await _controller.Update(defaultCategory!.Id, new Expense { Name = _updatedCatName });
    //     Assert.IsType<NotFoundResult>(result);
    // }

    // [Theory]
    // [InlineData(null)]
    // [InlineData("")]
    // [InlineData(" ")]
    // public async Task Update_InvalidNameReturnsBadRequest(string? invalidName)
    // {
    //     Expense? userCategory = _context.Expenses.FirstOrDefault(c => c.Name == _userCatName);
    //     IActionResult result = await _controller.Update(userCategory!.Id, new Expense { Name = invalidName });

    //     BadRequestObjectResult badRequest = Assert.IsType<BadRequestObjectResult>(result);
    //     Assert.Equal(NameRequiredMessage, badRequest.Value);
    // }

    // [Fact]
    // public async Task Delete_RemovesUserCategory()
    // {
    //     Expense toDeleteCategory = await CreateTestExpense(_toDeleteCat, _user1Id);
    //     IActionResult result = await _controller.Delete(toDeleteCategory.Id);

    //     Assert.IsType<NoContentResult>(result);
    //     Assert.False(_context.Expenses.Any(c => c.Name == _toDeleteCat && c.UserId == _user1Id));
    // }

    // [Fact]
    // public async Task Delete_DoesNotAllowDeletingOthersExpenses()
    // {
    //     Expense? otherUserCategory = _context.Expenses.FirstOrDefault(c => c.Name == _otherUserCatName);
    //     IActionResult result = await _controller.Delete(otherUserCategory!.Id);
    //     Assert.IsType<NotFoundResult>(result);
    // }

    // [Theory]
    // [InlineData("Get")]
    // [InlineData("Create")]
    // [InlineData("Update")]
    // [InlineData("Delete")]
    // public async Task UnauthorizedUser_CannotAccessEndpoints(string action)
    // {
    //     SetUserUnauthorized();
    //     Expense? userCategory = _context.Expenses.FirstOrDefault(c => c.Name == _userCatName);
    //     IActionResult result = action switch
    //     {
    //         "Get" => await _controller.Get(),
    //         "Create" => await _controller.Create(new Expense { Name = _newCatName }),
    //         "Update" => await _controller.Update(userCategory!.Id, new Expense { Name = _newCatName }),
    //         "Delete" => await _controller.Delete(userCategory!.Id),
    //         _ => throw new ArgumentOutOfRangeException()
    //     };
    //     Assert.IsType<UnauthorizedResult>(result);
    //     SetupUserContext(_user1Id);
    // }

    // [Theory]
    // [InlineData("Create")]
    // [InlineData("Update")]
    // public async Task CreateAndUpdateDates(string action)
    // {
    //     Expense? userCategory = _context.Expenses.FirstOrDefault(c => c.Name == _userCatName);
    //     IActionResult result = action switch
    //     {
    //         "Create" => await _controller.Create(new Expense { Name = _newCatName }),
    //         "Update" => await _controller.Update(userCategory!.Id, new Expense { Name = _newCatName }),
    //     };
    //     OkObjectResult? okResult = result as OkObjectResult;
    //     Expense? expense = Assert.IsType<Expense>(okResult!.Value);
    //     if (action == "Create")
    //     {
    //         Assert.NotEqual(DateTime.MinValue, expense.CreatedAt);
    //         Assert.Equal(DateTime.MinValue, expense.UpdatedAt);
    //     }
    //     if (action == "Update")
    //     {
    //         Assert.NotEqual(DateTime.MinValue, expense.CreatedAt);
    //         Assert.NotEqual(DateTime.MinValue, expense.UpdatedAt);
    //         Assert.True(expense.UpdatedAt > expense.CreatedAt);
    //         Assert.True(expense.UpdatedAt > DateTime.UtcNow.AddMinutes(-1));
    //     }
    // }
}
