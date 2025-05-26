using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage;

public class BudgetsControllerTests : IDisposable
{
    private readonly string _user1Id = "auth0|user1";
    private readonly string _user2Id = "auth0|user2";
    private BudgetsControllerTestObjects _testObjects;
    private ApplicationDbContext _context;
    private BudgetsController _controller;
    private readonly IDbContextTransaction _transaction;
    public BudgetsControllerTests()
    {
        _context = DatabaseSetup.GetDbContext();
        _transaction = DatabaseSetup.GetTransaction(_context);
        _controller = new BudgetsController(_context);
        SetupTestData();
        SetupUserContext(_user1Id);
    }

    private void SetupTestData()
    {
        _testObjects = new(_context);
        _context.Budgets.Add(_testObjects.TestBudget1);
        _context.Budgets.Add(_testObjects.TestBudget2);
        _context.Budgets.Add(_testObjects.TestBudget3);
        _context.Budgets.Add(_testObjects.TestBudget4);
        _context.Budgets.Add(_testObjects.TestBudget5);
        _context.Budgets.Add(_testObjects.TestBudget6);
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

    private async Task<Budget> CreateTestBudget(Budget budget)
    {
        _context.Budgets.Add(budget);
        await _context.SaveChangesAsync();
        return budget;
    }

    public void Dispose()
    {
        _transaction.Rollback();
        _transaction.Dispose();
        _context.Dispose();
    }

    [Fact]
    public async Task Get_QueryWithoutParams_ReturnsAllUserBudgets()
    {
        var result = await _controller.Get() as OkObjectResult;
        Assert.NotNull(result);

        var budgets = Assert.IsAssignableFrom<IEnumerable<Budget>>(result.Value);
        Assert.NotNull(budgets);

        Assert.Contains(budgets, budget => budget.Amount == _testObjects.TestBudget1.Amount);
        Assert.Equal(3, budgets.Count());
    }

    [Theory]
    [InlineData("2025-01-01", 3)]
    [InlineData("2025-01-02", 3)]
    [InlineData("2025-01-03", 2)]
    [InlineData("2024-12-23", 3)]
    [InlineData("2024-12-22", 3)]
    [InlineData("2024-12-21", 3)]
    public async Task Get_FilterByStartDate_ReturnsCorrectBudgets(string startDateString, int expectedCount)
    {
        var startDate = DateOnly.Parse(startDateString);
        var result = await _controller.Get(startDate: startDate) as OkObjectResult;
        Assert.NotNull(result);

        var budgets = Assert.IsAssignableFrom<IEnumerable<Budget>>(result.Value);
        Assert.NotNull(budgets);

        Assert.Equal(expectedCount, budgets.Count());
    }

    [Theory]
    [InlineData("2025-01-02", 3)]
    [InlineData("2025-01-03", 3)]
    [InlineData("2024-12-23", 2)]
    [InlineData("2025-01-01", 2)]
    [InlineData("2024-12-22", 2)]
    [InlineData("2024-12-21", 2)]
    public async Task Get_FilterByEndDate_ReturnsCorrectBudgets(string endDateString, int expectedCount)
    {
        var endDate = DateOnly.Parse(endDateString);
        var result = await _controller.Get(endDate: endDate) as OkObjectResult;
        Assert.NotNull(result);

        var budgets = Assert.IsAssignableFrom<IEnumerable<Budget>>(result.Value);
        Assert.NotNull(budgets);

        Assert.Equal(expectedCount, budgets.Count());
    }

    [Theory]
    [InlineData("2025-01-01", "2025-01-01", 2)]
    [InlineData("2025-01-01", "2025-01-03", 3)]
    [InlineData("2025-01-03", "2025-01-10", 2)]
    [InlineData("2024-12-22", "2024-12-24", 2)]
    [InlineData("2024-12-23", "2024-12-28", 2)]
    [InlineData("2024-12-02", "2025-12-22", 3)]
    public async Task Get_FilterByStartAndEndDate_ReturnsCorrectBudgets(string startDateString, string endDateString, int expectedCount)
    {
        var startDate = DateOnly.Parse(startDateString);
        var endDate = DateOnly.Parse(endDateString);
        var result = await _controller.Get(startDate: startDate, endDate: endDate) as OkObjectResult;
        Assert.NotNull(result);

        var budgets = Assert.IsAssignableFrom<IEnumerable<Budget>>(result.Value);
        Assert.NotNull(budgets);

        Assert.Equal(expectedCount, budgets.Count());
    }

    [Fact]
    public async Task Get_FilterByCategory_ReturnsCorrectBudgets()
    {
        CashFlowCategory category = _testObjects.DefaultCategoryExpense;
        var result = await _controller.Get(categoryId: category.Id) as OkObjectResult;
        Assert.NotNull(result);

        var budgets = Assert.IsAssignableFrom<IEnumerable<Budget>>(result.Value);
        Assert.NotNull(budgets);

        Assert.Equal(2, budgets.Count());
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenAmountIsNegative()
    {
        Budget newBudget = new()
        {
            Amount = -12345,
            StartDate = new DateOnly(2025, 02, 02),
            CategoryId = _testObjects.TestUser1CategoryExpense.Id,
        };

        var result = await _controller.Create(newBudget);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Amount must be positive.", badRequestResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenBudgetCategoryIdIsEmpty()
    {
        Budget newBudget = new()
        {
            Amount = 12345,
            StartDate = new DateOnly(2025, 02, 02),
            CategoryId = Guid.Empty,
        };

        var result = await _controller.Create(newBudget);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("CategoryId is required.", badRequestResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenCategoryDoesNotExistForUser()
    {
        Budget newBudget = new()
        {
            Amount = 12345,
            StartDate = new DateOnly(2025, 02, 02),
            CategoryId = _testObjects.TestUser2CategoryExpense.Id,
        };

        var result = await _controller.Create(newBudget);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Invalid or unauthorized CategoryId.", badRequestResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenCategoryIsNotExpense()
    {
        Budget newBudget = new()
        {
            Amount = 12345,
            StartDate = new DateOnly(2025, 02, 02),
            CategoryId = _testObjects.TestUser1CategoryIncome.Id,
        };

        var result = await _controller.Create(newBudget);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Budgets can only be entered for Expense categories.", badRequestResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsCreatedAtAction_WhenBudgetIsValid()
    {
        Budget newBudget = new()
        {
            Amount = 12345,
            StartDate = new DateOnly(2025, 02, 02),
            CategoryId = _testObjects.TestUser1CategoryExpense.Id,
            Category = _testObjects.TestUser1CategoryExpense
        };

        var result = await _controller.Create(newBudget);

        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal(nameof(BudgetsController.Get), createdAtActionResult.ActionName);
        Assert.Equal(newBudget, createdAtActionResult.Value);
    }

    [Fact]
    public async Task Create_StartDateIsSet_WhenNewBudgetCreated()
    {
        Budget newBudget = new()
        {
            Amount = 11223,
            CategoryId = _testObjects.TestUser1CategoryExpense.Id,
            Category = _testObjects.TestUser1CategoryExpense
        };

        var result = await _controller.Create(newBudget);

        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
        Budget createdBudget = _context.Budgets.First(budget => budget.Amount == 11223 && budget.CategoryId == _testObjects.TestUser1CategoryExpense.Id);
        Assert.NotEqual(DateOnly.MinValue, createdBudget.StartDate);
        Assert.Equal(DateOnly.FromDateTime(DateTime.Now), createdBudget.StartDate);
    }

    [Fact]
    public async Task Create_StartAndEndDateIsSet_WhenNewBudgetCreatedForExistingBudgetCategory()
    {
        Budget oldestBudget = new()
        {
            Amount = 999,
            StartDate = new DateOnly(2023, 01, 05),
            EndDate = new DateOnly(2024, 01, 05),
            CategoryId = _testObjects.TestUser1CategoryExpense.Id,
            Category = _testObjects.TestUser1CategoryExpense
        };
        var oldestCreate = await _controller.Create(oldestBudget);
        Budget oldBudget = new()
        {
            Amount = 11223,
            StartDate = new DateOnly(2024, 01, 05),
            CategoryId = _testObjects.TestUser1CategoryExpense.Id,
            Category = _testObjects.TestUser1CategoryExpense
        };
        var oldCreate = await _controller.Create(oldBudget);
        Budget newBudget = new()
        {
            Amount = 1343,
            CategoryId = _testObjects.TestUser1CategoryExpense.Id,
            Category = _testObjects.TestUser1CategoryExpense
        };
        var newCreate = await _controller.Create(newBudget);

        Budget createdOldestBudget = _context.Budgets.First(budget => budget.Amount == 999 && budget.CategoryId == _testObjects.TestUser1CategoryExpense.Id);
        Budget createdOldBudget = _context.Budgets.First(budget => budget.Amount == 11223 && budget.CategoryId == _testObjects.TestUser1CategoryExpense.Id);
        Budget createdNewBudget = _context.Budgets.First(budget => budget.Amount == 1343 && budget.CategoryId == _testObjects.TestUser1CategoryExpense.Id);

        Assert.Equal(new DateOnly(2024, 01, 05), createdOldestBudget.EndDate);
        Assert.NotEqual(DateOnly.MinValue, createdOldBudget.EndDate);
        Assert.Equal(DateOnly.FromDateTime(DateTime.Now), createdOldBudget.EndDate);
        Assert.Equal(DateOnly.FromDateTime(DateTime.Now), createdNewBudget.StartDate);
    }

    [Fact]
    public async Task Update_ReturnsNotFound_WhenBudgetDoesNotExist()
    {
        Budget updatedBudget = new()
        {
            Amount = 1343,
            CategoryId = _testObjects.TestUser1CategoryExpense.Id,
            Category = _testObjects.TestUser1CategoryExpense
        };
        var result = await _controller.Update(Guid.NewGuid(), updatedBudget);
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Update_ReturnsBadRequest_WhenValidationFails()
    {
        Budget updatedBudget = new()
        {
            Amount = -1343,
            CategoryId = _testObjects.TestUser1CategoryExpense.Id,
            Category = _testObjects.TestUser1CategoryExpense
        };
        Budget? budgetToUpdate = _context.Budgets.FirstOrDefault(budget => budget.UserId == _user1Id);
        var result = await _controller.Update(budgetToUpdate!.Id, updatedBudget);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Amount must be positive.", badRequestResult.Value);
    }

    [Fact]
    public async Task Update_ReturnsOk_WhenBudgetIsUpdatedSuccessfully()
    {
        Budget updatedBudget = new()
        {
            Amount = 9999,
            CategoryId = _testObjects.TestUser1CategoryExpense.Id,
            Category = _testObjects.TestUser1CategoryExpense
        };
        Budget? budgetToUpdate = _context.Budgets.FirstOrDefault(budget => budget.UserId == _user1Id);
        var result = await _controller.Update(budgetToUpdate!.Id, updatedBudget);

        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedBudget = Assert.IsType<Budget>(okResult.Value);

        Assert.Equal(updatedBudget.Amount, returnedBudget.Amount);
        Assert.Null(returnedBudget.EndDate);
        Assert.Equal(updatedBudget.CategoryId, returnedBudget.CategoryId);
    }

    [Fact]
    public async Task Delete_ReturnsNotFound_WhenBudgetDoesNotExist()
    {
        var budgetId = Guid.NewGuid();
        var result = await _controller.Delete(budgetId);
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Delete_ReturnsNoContent_WhenBudgetIsDeletedSuccessfully()
    {
        Budget updatedBudget = new()
        {
            Amount = 9999,
            CategoryId = _testObjects.TestUser1CategoryExpense.Id,
            Category = _testObjects.TestUser1CategoryExpense,
            UserId = _user1Id
        };
        _context.Budgets.Add(updatedBudget);
        await _context.SaveChangesAsync();
        var result = await _controller.Delete(updatedBudget.Id);
        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task Delete_DoesNotAllowDeletingOthersBudgets()
    {
        Budget? otherUserBudget = _context.Budgets.FirstOrDefault(budget => budget.UserId == _user2Id);
        IActionResult result = await _controller.Delete(otherUserBudget!.Id);
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
        Budget? userBudget = _context.Budgets.FirstOrDefault(budget => budget.UserId == _user1Id);
        IActionResult result = action switch
        {
            "Get" => await _controller.Get(),
            "Create" => await _controller.Create(userBudget!),
            "Update" => await _controller.Update(userBudget!.Id, userBudget),
            "Delete" => await _controller.Delete(userBudget!.Id),
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
        Budget updatedBudget = new()
        {
            Amount = 9999,
            CategoryId = _testObjects.TestUser1CategoryExpense.Id,
            Category = _testObjects.TestUser1CategoryExpense
        };
        Budget? userBudget = _context.Budgets.FirstOrDefault(budget => budget.UserId == _user1Id);
        IActionResult result = action switch
        {
            "Create" => await _controller.Create(updatedBudget),
            "Update" => await _controller.Update(userBudget!.Id, updatedBudget),
        };
        if (action == "Create")
        {
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
            Budget? budget = createdAtActionResult.Value as Budget;
            Assert.NotEqual(DateTime.MinValue, budget?.CreatedAt);
            Assert.Equal(DateTime.MinValue, budget?.UpdatedAt);
        }
        if (action == "Update")
        {
            var okResult = Assert.IsType<OkObjectResult>(result);
            Budget? budget = Assert.IsType<Budget>(okResult.Value);
            Assert.NotEqual(DateTime.MinValue, budget.CreatedAt);
            Assert.NotEqual(DateTime.MinValue, budget.UpdatedAt);
            Assert.True(budget.UpdatedAt > budget.CreatedAt);
            Assert.True(budget.UpdatedAt > DateTime.UtcNow.AddMinutes(-1));
        }
    }
}
