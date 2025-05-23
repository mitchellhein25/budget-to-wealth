using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage;

public class HoldingsControllerTests : IDisposable
{
    private readonly string _user1Id = "auth0|user1";
    private readonly string _user2Id = "auth0|user2";
    private HoldingsControllerTestObjects _testObjects;
    private ApplicationDbContext _context;
    private HoldingsController _controller;
    private readonly IDbContextTransaction _transaction;
    public HoldingsControllerTests()
    {
        _context = DatabaseSetup.GetDbContext();
        _transaction = DatabaseSetup.GetTransaction(_context);
        _controller = new HoldingsController(_context);
        SetupTestData();
        SetupUserContext(_user1Id);
    }

    private void SetupTestData()
    {
        _testObjects = new(_context);
        _context.Holdings.Add(_testObjects.TestHolding1);
        _context.Holdings.Add(_testObjects.TestHolding2);
        _context.Holdings.Add(_testObjects.TestHolding3);
        _context.Holdings.Add(_testObjects.TestHolding4);
        _context.Holdings.Add(_testObjects.TestHolding5);
        _context.Holdings.Add(_testObjects.TestHolding6);
        _context.Holdings.Add(_testObjects.TestHolding7);
        _context.Holdings.Add(_testObjects.TestHolding8);
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

    private async Task<Holding> CreateTestHoldings(Holding holding)
    {
        _context.Holdings.Add(holding);
        await _context.SaveChangesAsync();
        return holding;
    }

    public void Dispose()
    {
        _transaction.Rollback();
        _transaction.Dispose();
        _context.Dispose();
    }

    [Fact]
    public async Task Get_QueryWithoutDateReturnsAllUserHoldings()
    {
        OkObjectResult? result = await _controller.Get() as OkObjectResult;
        IEnumerable<Holding> holdings = Assert.IsAssignableFrom<IEnumerable<Holding>>(result!.Value);

        Assert.Contains(holdings, exp => exp.Name == _testObjects.TestHolding1.Name);
        Assert.Equal(4, holdings.Count());
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
        IEnumerable<Holdings> expenses = Assert.IsAssignableFrom<IEnumerable<Holdings>>(result!.Value);

        List<string> returnBoth = new() { "2023-04-01", "2023-04-12", "2023-01-01" };
        if (returnBoth.Contains(startDateString))
        {
            Assert.Contains(expenses, exp => exp.Amount == _testObjects.TestHoldings1.Amount);
            Assert.Contains(expenses, exp => exp.Amount == _testObjects.TestHoldings3.Amount);
            Assert.Equal(4, expenses.Count());
        }
        else if (startDateString == "2023-04-13")
        {
            Assert.Contains(expenses, exp => exp.Amount == _testObjects.TestHoldings3.Amount);
            Assert.Equal(2, expenses.Count());
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
        IEnumerable<Holdings> expenses = Assert.IsAssignableFrom<IEnumerable<Holdings>>(result!.Value);

        List<string> returnNone = new() { "2023-04-01", "2023-01-01" };
        List<string> returnOne = new() { "2023-04-13", "2023-04-12" };
        if (endDateString == "2024-01-01")
        {
            Assert.Contains(expenses, exp => exp.Amount == _testObjects.TestHoldings1.Amount);
            Assert.Contains(expenses, exp => exp.Amount == _testObjects.TestHoldings3.Amount);
            Assert.Equal(4, expenses.Count());
        }
        else if (returnOne.Contains(endDateString))
        {
            Assert.Contains(expenses, exp => exp.Amount == _testObjects.TestHoldings1.Amount);
            Assert.Equal(2, expenses.Count());
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
        IEnumerable<Holdings> expenses = Assert.IsAssignableFrom<IEnumerable<Holdings>>(result!.Value);

        if ((startDateString == "2023-04-01" && endDateString == "2023-04-01") || (startDateString == "2023-05-23" && endDateString == "2024-05-23"))
        {
            Assert.Empty(expenses);
        }
        else if ((startDateString == "2023-04-01" && endDateString == "2023-04-12") || (startDateString == "2023-04-12" && endDateString == "2023-05-14"))
        {
            Assert.Contains(expenses, exp => exp.Amount == _testObjects.TestHoldings1.Amount);
            Assert.Equal(2, expenses.Count());
        }
        else if (startDateString == "2023-04-12" && endDateString == "2023-05-15")
        {
            Assert.Contains(expenses, exp => exp.Amount == _testObjects.TestHoldings1.Amount);
            Assert.Contains(expenses, exp => exp.Amount == _testObjects.TestHoldings3.Amount);
            Assert.Equal(4, expenses.Count());
        }
        else if (startDateString == "2023-05-15" && endDateString == "2023-05-23")
        {
            Assert.Contains(expenses, exp => exp.Amount == _testObjects.TestHoldings3.Amount);
            Assert.Equal(2, expenses.Count());
        }
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenAmountIsNegative()
    {
        Holdings newHoldings = new()
        {   
            Amount = -12345,
            EntryType = CashFlowType.Expense,
            Date = new DateOnly(2025, 02, 03),
            CategoryId = _testObjects.TestUser1CategoryExpense.Id,
        };

        var result = await _controller.Create(newHoldings);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Amount must be positive.", badRequestResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenHoldingsCategoryIdIsEmpty()
    {
        Holdings newHoldings = new()
        {   
            Amount = 12345,
            EntryType = CashFlowType.Expense,
            Date = new DateOnly(2025, 02, 03),
            CategoryId = Guid.Empty,
        };

        var result = await _controller.Create(newHoldings);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("CategoryId is required.", badRequestResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenDateIsDefault()
    {
        Holdings newHoldings = new()
        {   
            Amount = 12345,
            EntryType = CashFlowType.Expense,
            Date = default,
            CategoryId = _testObjects.TestUser1CategoryExpense.Id,
        };

        var result = await _controller.Create(newHoldings);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Date is required.", badRequestResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenCategoryDoesNotExistForUser()
    {
        Holdings newHoldings = new()
        {   
            Amount = 12345,
            EntryType = CashFlowType.Expense,
            Date = new DateOnly(2025, 02, 03),
            CategoryId = _testObjects.TestUser2CategoryExpense.Id,
        };

        var result = await _controller.Create(newHoldings);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Invalid or unauthorized CategoryId.", badRequestResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsCreatedAtAction_WhenHoldingsIsValid()
    {
        Holdings newHoldings = new()
        {   
            Amount = 12345,
            EntryType = CashFlowType.Expense,
            Date = new DateOnly(2025, 02, 03),
            CategoryId = _testObjects.TestUser1CategoryExpense.Id,
        };

        var result = await _controller.Create(newHoldings);

        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal(nameof(HoldingsController.Get), createdAtActionResult.ActionName);
        Assert.Equal(newHoldings, createdAtActionResult.Value);
    }

    [Fact]
    public async Task Update_ReturnsNotFound_WhenHoldingsDoesNotExist()
    {
        Holdings updatedHoldings = new()
        {   
            Amount = 12345,
            EntryType = CashFlowType.Expense,
            Date = new DateOnly(2025, 02, 03),
            CategoryId = _testObjects.TestUser1CategoryExpense.Id,
        };
        var result = await _controller.Update(Guid.NewGuid(), updatedHoldings);
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Update_ReturnsBadRequest_WhenValidationFails()
    {
        Holdings updatedHoldings = new()
        {   
            Amount = 12345,
            EntryType = CashFlowType.Expense,
            Date = default,
            CategoryId = _testObjects.TestUser1CategoryExpense.Id,
        };
        Holdings? expenseToUpdate = _context.Holdings.FirstOrDefault(exp => exp.UserId == _user1Id);
        var result = await _controller.Update(expenseToUpdate!.Id, updatedHoldings);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Date is required.", badRequestResult.Value);
    }

    [Fact]
    public async Task Update_ReturnsOk_WhenHoldingsIsUpdatedSuccessfully()
    {
        Holdings updatedHoldings = new()
        {   
            Amount = 12345,
            EntryType = CashFlowType.Expense,
            Date = new DateOnly(2025, 01, 02),
            Description = "Test descript",
            CategoryId = _testObjects.TestUser1CategoryExpense.Id,
        };
        Holdings? expenseToUpdate = _context.Holdings.FirstOrDefault(exp => exp.UserId == _user1Id);
        var result = await _controller.Update(expenseToUpdate!.Id, updatedHoldings);

        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedHoldings = Assert.IsType<Holdings>(okResult.Value);

        Assert.Equal(updatedHoldings.Amount, returnedHoldings.Amount);
        Assert.Equal(updatedHoldings.Description, returnedHoldings.Description);
        Assert.Equal(updatedHoldings.Date, returnedHoldings.Date);
        Assert.Equal(updatedHoldings.CategoryId, returnedHoldings.CategoryId);
    }

    [Fact]
    public async Task Delete_ReturnsNotFound_WhenHoldingsDoesNotExist()
    {
        var expenseId = Guid.NewGuid();
        var result = await _controller.Delete(expenseId);
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Delete_ReturnsNoContent_WhenHoldingsIsDeletedSuccessfully()
    {
        Holdings newHoldingsToDelete = new()
        {   
            Amount = 12345,
            EntryType = CashFlowType.Expense,
            Date = new DateOnly(2025, 01, 02),
            Description = "Test descript",
            CategoryId = _testObjects.TestUser1CategoryExpense.Id,
            UserId = _user1Id
        };
        _context.Holdings.Add(newHoldingsToDelete);
        await _context.SaveChangesAsync();
        var result = await _controller.Delete(newHoldingsToDelete.Id);
        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task Delete_DoesNotAllowDeletingOthersHoldings()
    {
        Holdings? otherUserHoldings = _context.Holdings.FirstOrDefault(exp => exp.UserId == _user2Id);
        IActionResult result = await _controller.Delete(otherUserHoldings!.Id);
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
        Holdings? userHoldings = _context.Holdings.FirstOrDefault(exp => exp.UserId == _user1Id);
        IActionResult result = action switch
        {
            "Get" => await _controller.Get(),
            "Create" => await _controller.Create(userHoldings!),
            "Update" => await _controller.Update(userHoldings!.Id, userHoldings),
            "Delete" => await _controller.Delete(userHoldings!.Id),
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
        Holdings updatedHoldings = new()
        {   
            Amount = 12345,
            EntryType = CashFlowType.Expense,
            Date = new DateOnly(2025, 01, 02),
            Description = "Test descript",
            CategoryId = _testObjects.TestUser1CategoryExpense.Id,
        };
        Holdings? userHoldings = _context.Holdings.FirstOrDefault(exp => exp.UserId == _user1Id);
        IActionResult result = action switch
        {
            "Create" => await _controller.Create(updatedHoldings),
            "Update" => await _controller.Update(userHoldings!.Id, updatedHoldings),
        };
        if (action == "Create")
        {
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
            Holdings? expense = createdAtActionResult.Value as Holdings;
            Assert.NotEqual(DateTime.MinValue, expense?.CreatedAt);
            Assert.Equal(DateTime.MinValue, expense?.UpdatedAt);
        }
        if (action == "Update")
        {
            var okResult = Assert.IsType<OkObjectResult>(result);
            Holdings? expense = Assert.IsType<Holdings>(okResult.Value);
            Assert.NotEqual(DateTime.MinValue, expense.CreatedAt);
            Assert.NotEqual(DateTime.MinValue, expense.UpdatedAt);
            Assert.True(expense.UpdatedAt > expense.CreatedAt);
            Assert.True(expense.UpdatedAt > DateTime.UtcNow.AddMinutes(-1));
        }
    }
}
