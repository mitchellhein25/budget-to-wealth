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
    
    [Theory]
    [InlineData("2023-04-01")]
    [InlineData("2023-04-13")]
    [InlineData("2023-04-12")]
    [InlineData("2023-01-01")]
    [InlineData("2024-01-01")]
    public async Task Get_FilterByStartDate(string startDateString)
    {
        OkObjectResult? result = await _controller.Get(startDate: DateOnly.Parse(startDateString)) as OkObjectResult;
        IEnumerable<Expense> expenses = Assert.IsAssignableFrom<IEnumerable<Expense>>(result!.Value);

        List<string> returnBoth = new() { "2023-04-01", "2023-04-12", "2023-01-01" };
        if (returnBoth.Contains(startDateString))
        {
            Assert.Contains(expenses, exp => exp.Amount == _testObjects.TestExpense1.Amount);
            Assert.Contains(expenses, exp => exp.Amount == _testObjects.TestExpense3.Amount);
            Assert.Equal(2, expenses.Count());
        }
        else if (startDateString == "2023-04-13")
        {
            Assert.Contains(expenses, exp => exp.Amount == _testObjects.TestExpense3.Amount);
            Assert.Single(expenses);
        }
        else if (startDateString == "2024-01-01")
        {
            Assert.Empty(expenses);
        }
    }
    
    [Theory]
    [InlineData("2023-04-01")]
    [InlineData("2023-04-13")]
    [InlineData("2023-04-12")]
    [InlineData("2023-01-01")]
    [InlineData("2024-01-01")]
    public async Task Get_FilterByEndDate(string endDateString)
    {
        OkObjectResult? result = await _controller.Get(endDate: DateOnly.Parse(endDateString)) as OkObjectResult;
        IEnumerable<Expense> expenses = Assert.IsAssignableFrom<IEnumerable<Expense>>(result!.Value);

        List<string> returnNone = new() { "2023-04-01", "2023-01-01" };
        List<string> returnOne = new() { "2023-04-13", "2023-04-12" };
        if (endDateString == "2024-01-01")
        {
            Assert.Contains(expenses, exp => exp.Amount == _testObjects.TestExpense1.Amount);
            Assert.Contains(expenses, exp => exp.Amount == _testObjects.TestExpense3.Amount);
            Assert.Equal(2, expenses.Count());
        }
        else if (returnOne.Contains(endDateString))
        {
            Assert.Contains(expenses, exp => exp.Amount == _testObjects.TestExpense1.Amount);
            Assert.Single(expenses);
        }
        else if (returnNone.Contains(endDateString))
        {
            Assert.Empty(expenses);
        }
    }
    
    [Theory]
    [InlineData("2023-04-01", "2023-04-01")]
    [InlineData("2023-04-01", "2023-04-12")]
    [InlineData("2023-04-12", "2023-05-14")]
    [InlineData("2023-04-12", "2023-05-15")]
    [InlineData("2023-05-15", "2023-05-23")]
    [InlineData("2023-05-23", "2024-05-23")]
    public async Task Get_FilterByStartAndEndDate(string startDateString, string endDateString)
    {
        OkObjectResult? result = await _controller.Get(startDate: DateOnly.Parse(startDateString), endDate: DateOnly.Parse(endDateString)) as OkObjectResult;
        IEnumerable<Expense> expenses = Assert.IsAssignableFrom<IEnumerable<Expense>>(result!.Value);

        if ((startDateString == "2023-04-01" && endDateString == "2023-04-01") || (startDateString == "2023-05-23" && endDateString == "2024-05-23"))
        {
            Assert.Empty(expenses);
        }
        else if ((startDateString == "2023-04-01" && endDateString == "2023-04-12") || (startDateString == "2023-04-12" && endDateString == "2023-05-14"))
        {
            Assert.Contains(expenses, exp => exp.Amount == _testObjects.TestExpense1.Amount);
            Assert.Single(expenses);
        }
        else if (startDateString == "2023-04-12" && endDateString == "2023-05-15")
        {
            Assert.Contains(expenses, exp => exp.Amount == _testObjects.TestExpense1.Amount);
            Assert.Contains(expenses, exp => exp.Amount == _testObjects.TestExpense3.Amount);
            Assert.Equal(2, expenses.Count());
        }
        else if (startDateString == "2023-05-15" && endDateString == "2023-05-23")
        {
            Assert.Contains(expenses, exp => exp.Amount == _testObjects.TestExpense3.Amount);
            Assert.Single(expenses);
        }
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenAmountIsNegative()
    {
        Expense newExpense = new()
        {   
            Amount = -123.45m,
            Date = new DateOnly(2025, 02, 03),
            ExpenseCategoryId = _testObjects.TestUser1Category.Id,
        };

        var result = await _controller.Create(newExpense);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Amount must be positive.", badRequestResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenExpenseCategoryIdIsEmpty()
    {
        Expense newExpense = new()
        {   
            Amount = 123.45m,
            Date = new DateOnly(2025, 02, 03),
            ExpenseCategoryId = Guid.Empty,
        };

        var result = await _controller.Create(newExpense);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("ExpenseCategoryId is required.", badRequestResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenDateIsDefault()
    {
        Expense newExpense = new()
        {   
            Amount = 123.45m,
            Date = default,
            ExpenseCategoryId = _testObjects.TestUser1Category.Id,
        };

        var result = await _controller.Create(newExpense);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Date is required.", badRequestResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenCategoryDoesNotExistForUser()
    {
        Expense newExpense = new()
        {   
            Amount = 123.45m,
            Date = new DateOnly(2025, 02, 03),
            ExpenseCategoryId = _testObjects.TestUser2Category.Id,
        };

        var result = await _controller.Create(newExpense);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Invalid or unauthorized ExpenseCategoryId.", badRequestResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsCreatedAtAction_WhenExpenseIsValid()
    {
        Expense newExpense = new()
        {   
            Amount = 123.45m,
            Date = new DateOnly(2025, 02, 03),
            ExpenseCategoryId = _testObjects.TestUser1Category.Id,
        };

        var result = await _controller.Create(newExpense);

        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal(nameof(ExpensesController.Get), createdAtActionResult.ActionName);
        Assert.Equal(newExpense, createdAtActionResult.Value);
    }

    [Fact]
    public async Task Update_ReturnsNotFound_WhenExpenseDoesNotExist()
    {
        Expense updatedExpense = new()
        {   
            Amount = 123.45m,
            Date = new DateOnly(2025, 02, 03),
            ExpenseCategoryId = _testObjects.TestUser1Category.Id,
        };
        var result = await _controller.Update(Guid.NewGuid(), updatedExpense);
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Update_ReturnsBadRequest_WhenValidationFails()
    {
        Expense updatedExpense = new()
        {   
            Amount = 123.45m,
            Date = default,
            ExpenseCategoryId = _testObjects.TestUser1Category.Id,
        };
        Expense? expenseToUpdate = _context.Expenses.FirstOrDefault(exp => exp.UserId == _user1Id);
        var result = await _controller.Update(expenseToUpdate!.Id, updatedExpense);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Date is required.", badRequestResult.Value);
    }

    // [Fact]
    // public async Task Update_ReturnsOk_WhenExpenseIsUpdatedSuccessfully()
    // {
    // // Arrange
    // var expenseId = Guid.NewGuid();
    // var existingExpense = new Expense
    // {
    //     Id = expenseId,
    //     UserId = "test-user-id",
    //     Amount = 50,
    //     Description = "Old Description",
    //     Date = DateTime.UtcNow.AddDays(-1),
    //     ExpenseCategoryId = Guid.NewGuid()
    // };

    // var updatedExpense = new Expense
    // {
    //     Amount = 100,
    //     Description = "Updated Description",
    //     Date = DateTime.UtcNow,
    //     ExpenseCategoryId = Guid.NewGuid()
    // };

    // _mockContext.Setup(c => c.Expenses.FirstOrDefaultAsync(It.IsAny<Func<Expense, bool>>()))
    //     .ReturnsAsync(existingExpense);

    // _mockContext.Setup(c => c.ExpenseCategories.AnyAsync(It.IsAny<Func<ExpenseCategory, bool>>()))
    //     .ReturnsAsync(true);

    // _mockContext.Setup(c => c.SaveChangesAsync(default)).ReturnsAsync(1);

    // // Act
    // var result = await _controller.Update(expenseId, updatedExpense);

    // // Assert
    // var okResult = Assert.IsType<OkObjectResult>(result);
    // var returnedExpense = Assert.IsType<Expense>(okResult.Value);

    // Assert.Equal(updatedExpense.Amount, returnedExpense.Amount);
    // Assert.Equal(updatedExpense.Description, returnedExpense.Description);
    // Assert.Equal(updatedExpense.Date, returnedExpense.Date);
    // Assert.Equal(updatedExpense.ExpenseCategoryId, returnedExpense.ExpenseCategoryId);
    // }


    // [Fact]
    // public async Task Delete_RemovesUserExpense()
    // {
    //     Expense toDeleteExpense = await CreateTestExpense(_toDeleteCat, _user1Id);
    //     IActionResult result = await _controller.Delete(toDeleteExpense.Id);

    //     Assert.IsType<NoContentResult>(result);
    //     Assert.False(_context.Expenses.Any(c => c.Name == _toDeleteCat && c.UserId == _user1Id));
    // }

    // [Fact]
    // public async Task Delete_DoesNotAllowDeletingOthersExpenses()
    // {
    //     Expense? otherUserExpense = _context.Expenses.FirstOrDefault(c => c.Name == _otherUserCatName);
    //     IActionResult result = await _controller.Delete(otherUserExpense!.Id);
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
    //     Expense? userExpense = _context.Expenses.FirstOrDefault(c => c.Name == _userCatName);
    //     IActionResult result = action switch
    //     {
    //         "Get" => await _controller.Get(),
    //         "Create" => await _controller.Create(new Expense { Name = _newCatName }),
    //         "Update" => await _controller.Update(userExpense!.Id, new Expense { Name = _newCatName }),
    //         "Delete" => await _controller.Delete(userExpense!.Id),
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
    //     Expense? userExpense = _context.Expenses.FirstOrDefault(c => c.Name == _userCatName);
    //     IActionResult result = action switch
    //     {
    //         "Create" => await _controller.Create(new Expense { Name = _newCatName }),
    //         "Update" => await _controller.Update(userExpense!.Id, new Expense { Name = _newCatName }),
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
