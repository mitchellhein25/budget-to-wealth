using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage;

public class CashFlowEntriesControllerTests : IDisposable
{
    private readonly string _user1Id = "auth0|user1";
    private readonly string _user2Id = "auth0|user2";
    private CashFlowEntryControllerTestObjects _testObjects;
    private ApplicationDbContext _context;
    private CashFlowEntriesController _controller;
    private readonly IDbContextTransaction _transaction;
    public CashFlowEntriesControllerTests()
    {
        _context = DatabaseSetup.GetDbContext();
        _transaction = DatabaseSetup.GetTransaction(_context);
        _controller = new CashFlowEntriesController(_context);
        SetupTestData();
        SetupUserContext(_user1Id);
    }

    private void SetupTestData()
    {
        _testObjects = new(_context);
        _context.CashFlowEntries.Add(_testObjects.TestCashFlowEntry1);
        _context.CashFlowEntries.Add(_testObjects.TestCashFlowEntry2);
        _context.CashFlowEntries.Add(_testObjects.TestCashFlowEntry3);
        _context.CashFlowEntries.Add(_testObjects.TestCashFlowEntry4);
        _context.CashFlowEntries.Add(_testObjects.TestCashFlowEntry5);
        _context.CashFlowEntries.Add(_testObjects.TestCashFlowEntry6);
        _context.CashFlowEntries.Add(_testObjects.TestCashFlowEntry7);
        _context.CashFlowEntries.Add(_testObjects.TestCashFlowEntry8);
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

    private async Task<CashFlowEntry> CreateTestCashFlowEntry(CashFlowEntry expense)
    {
        _context.CashFlowEntries.Add(expense);
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
    public async Task Get_QueryWithoutDateReturnsAllUserCashFlowEntries()
    {
        OkObjectResult? result = await _controller.Get() as OkObjectResult;
        IEnumerable<CashFlowEntry> expenses = Assert.IsAssignableFrom<IEnumerable<CashFlowEntry>>(result!.Value);

        Assert.Contains(expenses, exp => exp.Amount == _testObjects.TestCashFlowEntry1.Amount);
        Assert.Equal(4, expenses.Count());
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
        IEnumerable<CashFlowEntry> expenses = Assert.IsAssignableFrom<IEnumerable<CashFlowEntry>>(result!.Value);

        List<string> returnBoth = new() { "2023-04-01", "2023-04-12", "2023-01-01" };
        if (returnBoth.Contains(startDateString))
        {
            Assert.Contains(expenses, exp => exp.Amount == _testObjects.TestCashFlowEntry1.Amount);
            Assert.Contains(expenses, exp => exp.Amount == _testObjects.TestCashFlowEntry3.Amount);
            Assert.Equal(4, expenses.Count());
        }
        else if (startDateString == "2023-04-13")
        {
            Assert.Contains(expenses, exp => exp.Amount == _testObjects.TestCashFlowEntry3.Amount);
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
        IEnumerable<CashFlowEntry> expenses = Assert.IsAssignableFrom<IEnumerable<CashFlowEntry>>(result!.Value);

        List<string> returnNone = new() { "2023-04-01", "2023-01-01" };
        List<string> returnOne = new() { "2023-04-13", "2023-04-12" };
        if (endDateString == "2024-01-01")
        {
            Assert.Contains(expenses, exp => exp.Amount == _testObjects.TestCashFlowEntry1.Amount);
            Assert.Contains(expenses, exp => exp.Amount == _testObjects.TestCashFlowEntry3.Amount);
            Assert.Equal(4, expenses.Count());
        }
        else if (returnOne.Contains(endDateString))
        {
            Assert.Contains(expenses, exp => exp.Amount == _testObjects.TestCashFlowEntry1.Amount);
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
        IEnumerable<CashFlowEntry> expenses = Assert.IsAssignableFrom<IEnumerable<CashFlowEntry>>(result!.Value);

        if ((startDateString == "2023-04-01" && endDateString == "2023-04-01") || (startDateString == "2023-05-23" && endDateString == "2024-05-23"))
        {
            Assert.Empty(expenses);
        }
        else if ((startDateString == "2023-04-01" && endDateString == "2023-04-12") || (startDateString == "2023-04-12" && endDateString == "2023-05-14"))
        {
            Assert.Contains(expenses, exp => exp.Amount == _testObjects.TestCashFlowEntry1.Amount);
            Assert.Equal(2, expenses.Count());
        }
        else if (startDateString == "2023-04-12" && endDateString == "2023-05-15")
        {
            Assert.Contains(expenses, exp => exp.Amount == _testObjects.TestCashFlowEntry1.Amount);
            Assert.Contains(expenses, exp => exp.Amount == _testObjects.TestCashFlowEntry3.Amount);
            Assert.Equal(4, expenses.Count());
        }
        else if (startDateString == "2023-05-15" && endDateString == "2023-05-23")
        {
            Assert.Contains(expenses, exp => exp.Amount == _testObjects.TestCashFlowEntry3.Amount);
            Assert.Equal(2, expenses.Count());
        }
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenAmountIsNegative()
    {
        CashFlowEntry newCashFlowEntry = new()
        {
            Amount = -12345,
            EntryType = CashFlowType.Expense,
            Date = new DateOnly(2025, 02, 03),
            CategoryId = _testObjects.TestUser1CategoryExpense.Id,
        };

        var result = await _controller.Create(newCashFlowEntry);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Amount must be positive.", badRequestResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenCashFlowEntryCategoryIdIsEmpty()
    {
        CashFlowEntry newCashFlowEntry = new()
        {
            Amount = 12345,
            EntryType = CashFlowType.Expense,
            Date = new DateOnly(2025, 02, 03),
            CategoryId = Guid.Empty,
        };

        var result = await _controller.Create(newCashFlowEntry);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("CategoryId is required.", badRequestResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenDateIsDefault()
    {
        CashFlowEntry newCashFlowEntry = new()
        {
            Amount = 12345,
            EntryType = CashFlowType.Expense,
            Date = default,
            CategoryId = _testObjects.TestUser1CategoryExpense.Id,
        };

        var result = await _controller.Create(newCashFlowEntry);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Date is required.", badRequestResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenCategoryDoesNotExistForUser()
    {
        CashFlowEntry newCashFlowEntry = new()
        {
            Amount = 12345,
            EntryType = CashFlowType.Expense,
            Date = new DateOnly(2025, 02, 03),
            CategoryId = _testObjects.TestUser2CategoryExpense.Id,
        };

        var result = await _controller.Create(newCashFlowEntry);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Invalid or unauthorized CategoryId.", badRequestResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsCreatedAtAction_WhenCashFlowEntryIsValid()
    {
        CashFlowEntry newCashFlowEntry = new()
        {
            Amount = 12345,
            EntryType = CashFlowType.Expense,
            Date = new DateOnly(2025, 02, 03),
            CategoryId = _testObjects.TestUser1CategoryExpense.Id,
        };

        var result = await _controller.Create(newCashFlowEntry);

        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal(nameof(CashFlowEntriesController.Get), createdAtActionResult.ActionName);
        Assert.Equal(newCashFlowEntry, createdAtActionResult.Value);
    }

    [Fact]
    public async Task Update_ReturnsNotFound_WhenCashFlowEntryDoesNotExist()
    {
        CashFlowEntry updatedCashFlowEntry = new()
        {
            Amount = 12345,
            EntryType = CashFlowType.Expense,
            Date = new DateOnly(2025, 02, 03),
            CategoryId = _testObjects.TestUser1CategoryExpense.Id,
        };
        var result = await _controller.Update(Guid.NewGuid(), updatedCashFlowEntry);
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Update_ReturnsBadRequest_WhenValidationFails()
    {
        CashFlowEntry updatedCashFlowEntry = new()
        {
            Amount = 12345,
            EntryType = CashFlowType.Expense,
            Date = default,
            CategoryId = _testObjects.TestUser1CategoryExpense.Id,
        };
        CashFlowEntry? expenseToUpdate = _context.CashFlowEntries.FirstOrDefault(exp => exp.UserId == _user1Id);
        var result = await _controller.Update(expenseToUpdate!.Id, updatedCashFlowEntry);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Date is required.", badRequestResult.Value);
    }

    [Fact]
    public async Task Update_ReturnsOk_WhenCashFlowEntryIsUpdatedSuccessfully()
    {
        CashFlowEntry updatedCashFlowEntry = new()
        {
            Amount = 12345,
            EntryType = CashFlowType.Expense,
            Date = new DateOnly(2025, 01, 02),
            Description = "Test descript",
            CategoryId = _testObjects.TestUser1CategoryExpense.Id,
        };
        CashFlowEntry? expenseToUpdate = _context.CashFlowEntries.FirstOrDefault(exp => exp.UserId == _user1Id);
        var result = await _controller.Update(expenseToUpdate!.Id, updatedCashFlowEntry);

        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedCashFlowEntry = Assert.IsType<CashFlowEntry>(okResult.Value);

        Assert.Equal(updatedCashFlowEntry.Amount, returnedCashFlowEntry.Amount);
        Assert.Equal(updatedCashFlowEntry.Description, returnedCashFlowEntry.Description);
        Assert.Equal(updatedCashFlowEntry.Date, returnedCashFlowEntry.Date);
        Assert.Equal(updatedCashFlowEntry.CategoryId, returnedCashFlowEntry.CategoryId);
    }

    [Fact]
    public async Task Delete_ReturnsNotFound_WhenCashFlowEntryDoesNotExist()
    {
        var expenseId = Guid.NewGuid();
        var result = await _controller.Delete(expenseId);
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Delete_ReturnsNoContent_WhenCashFlowEntryIsDeletedSuccessfully()
    {
        CashFlowEntry newCashFlowEntryToDelete = new()
        {
            Amount = 12345,
            EntryType = CashFlowType.Expense,
            Date = new DateOnly(2025, 01, 02),
            Description = "Test descript",
            CategoryId = _testObjects.TestUser1CategoryExpense.Id,
            UserId = _user1Id
        };
        _context.CashFlowEntries.Add(newCashFlowEntryToDelete);
        await _context.SaveChangesAsync();
        var result = await _controller.Delete(newCashFlowEntryToDelete.Id);
        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task Delete_DoesNotAllowDeletingOthersCashFlowEntries()
    {
        CashFlowEntry? otherUserCashFlowEntry = _context.CashFlowEntries.FirstOrDefault(exp => exp.UserId == _user2Id);
        IActionResult result = await _controller.Delete(otherUserCashFlowEntry!.Id);
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
        CashFlowEntry? userCashFlowEntry = _context.CashFlowEntries.FirstOrDefault(exp => exp.UserId == _user1Id);
        IActionResult result = action switch
        {
            "Get" => await _controller.Get(),
            "Create" => await _controller.Create(userCashFlowEntry!),
            "Update" => await _controller.Update(userCashFlowEntry!.Id, userCashFlowEntry),
            "Delete" => await _controller.Delete(userCashFlowEntry!.Id),
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
        CashFlowEntry updatedCashFlowEntry = new()
        {
            Amount = 12345,
            EntryType = CashFlowType.Expense,
            Date = new DateOnly(2025, 01, 02),
            Description = "Test descript",
            CategoryId = _testObjects.TestUser1CategoryExpense.Id,
        };
        CashFlowEntry? userCashFlowEntry = _context.CashFlowEntries.FirstOrDefault(exp => exp.UserId == _user1Id);
        IActionResult result = action switch
        {
            "Create" => await _controller.Create(updatedCashFlowEntry),
            "Update" => await _controller.Update(userCashFlowEntry!.Id, updatedCashFlowEntry),
        };
        if (action == "Create")
        {
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
            CashFlowEntry? expense = createdAtActionResult.Value as CashFlowEntry;
            Assert.NotEqual(DateTime.MinValue, expense?.CreatedAt);
            Assert.Equal(DateTime.MinValue, expense?.UpdatedAt);
        }
        if (action == "Update")
        {
            var okResult = Assert.IsType<OkObjectResult>(result);
            CashFlowEntry? expense = Assert.IsType<CashFlowEntry>(okResult.Value);
            Assert.NotEqual(DateTime.MinValue, expense.CreatedAt);
            Assert.NotEqual(DateTime.MinValue, expense.UpdatedAt);
            Assert.True(expense.UpdatedAt > expense.CreatedAt);
            Assert.True(expense.UpdatedAt > DateTime.UtcNow.AddMinutes(-1));
        }
    }
}
