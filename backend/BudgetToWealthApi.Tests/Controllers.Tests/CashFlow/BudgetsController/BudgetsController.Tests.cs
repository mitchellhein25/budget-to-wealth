using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore;

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

        var objectResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(newBudget, objectResult.Value);
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

        var objectResult = Assert.IsType<ObjectResult>(result);
        Budget createdBudget = objectResult.Value as Budget;
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
            var objectResult = Assert.IsType<ObjectResult>(result);
            Budget? budget = objectResult.Value as Budget;
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

    private async Task<ImportResponse> ExecuteImportAndGetResponse(List<BudgetImport> budgetsToImport)
    {
        var result = await _controller.Import(budgetsToImport);
        var okResult = Assert.IsType<OkObjectResult>(result);
        return Assert.IsType<ImportResponse>(okResult.Value);
    }

    private async Task ValidateImportResponse(ImportResponse response, int expectedImportedCount, int expectedErrorCount, bool expectedSuccess = true)
    {
        Assert.Equal(expectedSuccess, response.Success);
        Assert.Equal(expectedImportedCount, response.ImportedCount);
        Assert.Equal(expectedErrorCount, response.ErrorCount);
        
        if (expectedSuccess)
        {
            Assert.Contains($"Successfully imported {expectedImportedCount} budgets", response.Message);
        }
        else
        {
            Assert.Contains($"Imported {expectedImportedCount} budgets with {expectedErrorCount} errors", response.Message);
        }
    }

    private async Task<List<Budget>> GetSavedBudgetsForImport(List<BudgetImport> budgetsToImport)
    {
        var userBudgets = await _context.Budgets
            .Where(b => b.UserId == _user1Id)
            .Include(b => b.Category)
            .ToListAsync();
        
        return userBudgets
            .Where(b => budgetsToImport.Any(bi => bi.AmountInCents == b.Amount && 
                                                   bi.CategoryName == b.Category!.Name &&
                                                   bi.CategoryType == b.Category.CategoryType &&
                                                   bi.StartDate == b.StartDate))
            .ToList();
    }

    private async Task ValidateSavedBudgets(List<BudgetImport> budgetsToImport, int expectedCount)
    {
        var savedBudgets = await GetSavedBudgetsForImport(budgetsToImport);
        Assert.Equal(expectedCount, savedBudgets.Count);
    }

    private async Task ValidateBadRequestForImport(List<BudgetImport>? budgets, string expectedMessage)
    {
        var result = await _controller.Import(budgets);
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(expectedMessage, badRequestResult.Value);
    }

    [Fact]
    public async Task Import_SuccessfullyImportsValidBudgets()
    {
        var budgetsToImport = new List<BudgetImport>
        {
            new() { AmountInCents = 150000, CategoryName = _testObjects.TestUser1CategoryExpense.Name, CategoryType = CashFlowType.Expense, StartDate = new DateOnly(2025, 1, 1) },
            new() { AmountInCents = 250000, CategoryName = _testObjects.DefaultCategoryExpense.Name, CategoryType = CashFlowType.Expense, StartDate = new DateOnly(2025, 1, 1), EndDate = new DateOnly(2025, 12, 31) },
            new() { AmountInCents = 100000, CategoryName = _testObjects.TestUser1CategoryExpense.Name, CategoryType = CashFlowType.Expense, StartDate = new DateOnly(2025, 2, 1) }
        };
        
        var response = await ExecuteImportAndGetResponse(budgetsToImport);
        await ValidateImportResponse(response, 3, 0, true);
        await ValidateSavedBudgets(budgetsToImport, 3);
    }

    [Fact]
    public async Task Import_ReturnsBadRequestWhenNoBudgetsProvided()
    {
        await ValidateBadRequestForImport(null, "No budgets provided for import.");
    }

    [Fact]
    public async Task Import_ReturnsBadRequestWhenEmptyListProvided()
    {
        await ValidateBadRequestForImport(new List<BudgetImport>(), "No budgets provided for import.");
    }

    [Fact]
    public async Task Import_ReturnsBadRequestWhenTooManyBudgetsProvided()
    {
        var budgets = new List<BudgetImport>();
        for (int i = 0; i < 101; i++)
            budgets.Add(new() { AmountInCents = 100000, CategoryName = _testObjects.TestUser1CategoryExpense.Name, CategoryType = CashFlowType.Expense, StartDate = new DateOnly(2025, 1, 1).AddDays(i) });
        
        var result = await _controller.Import(budgets);
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Contains("Cannot import more than 100 budgets at once", badRequestResult.Value.ToString());
    }

    [Fact]
    public async Task Import_SkipsBudgetsWithNegativeAmounts()
    {
        var budgetsToImport = new List<BudgetImport>
        {
            new() { AmountInCents = 150000, CategoryName = _testObjects.TestUser1CategoryExpense.Name, CategoryType = CashFlowType.Expense, StartDate = new DateOnly(2025, 1, 1) },
            new() { AmountInCents = -10000, CategoryName = _testObjects.TestUser1CategoryExpense.Name, CategoryType = CashFlowType.Expense, StartDate = new DateOnly(2025, 1, 1) },
            new() { AmountInCents = 250000, CategoryName = _testObjects.DefaultCategoryExpense.Name, CategoryType = CashFlowType.Expense, StartDate = new DateOnly(2025, 1, 1) }
        };
        
        var response = await ExecuteImportAndGetResponse(budgetsToImport);
        await ValidateImportResponse(response, 2, 1, false);
        await ValidateSavedBudgets(budgetsToImport, 2);
    }

    [Fact]
    public async Task Import_SkipsBudgetsWithEmptyCategoryNames()
    {
        var budgetsToImport = new List<BudgetImport>
        {
            new() { AmountInCents = 150000, CategoryName = _testObjects.TestUser1CategoryExpense.Name, CategoryType = CashFlowType.Expense, StartDate = new DateOnly(2025, 1, 1) },
            new() { AmountInCents = 100000, CategoryName = "", CategoryType = CashFlowType.Expense, StartDate = new DateOnly(2025, 1, 1) },
            new() { AmountInCents = 250000, CategoryName = _testObjects.DefaultCategoryExpense.Name, CategoryType = CashFlowType.Expense, StartDate = new DateOnly(2025, 1, 1) }
        };
        
        var response = await ExecuteImportAndGetResponse(budgetsToImport);
        await ValidateImportResponse(response, 2, 1, false);
        await ValidateSavedBudgets(budgetsToImport, 2);
    }

    [Fact]
    public async Task Import_SkipsBudgetsWithNonExistentCategories()
    {
        var budgetsToImport = new List<BudgetImport>
        {
            new() { AmountInCents = 150000, CategoryName = _testObjects.TestUser1CategoryExpense.Name, CategoryType = CashFlowType.Expense, StartDate = new DateOnly(2025, 1, 1) },
            new() { AmountInCents = 100000, CategoryName = "NonExistentCategory", CategoryType = CashFlowType.Expense, StartDate = new DateOnly(2025, 1, 1) },
            new() { AmountInCents = 250000, CategoryName = _testObjects.DefaultCategoryExpense.Name, CategoryType = CashFlowType.Expense, StartDate = new DateOnly(2025, 1, 1) }
        };
        
        var response = await ExecuteImportAndGetResponse(budgetsToImport);
        await ValidateImportResponse(response, 2, 1, false);
        await ValidateSavedBudgets(budgetsToImport, 2);
    }

    [Fact]
    public async Task Import_SkipsBudgetsWithNonExpenseCategories()
    {
        var budgetsToImport = new List<BudgetImport>
        {
            new() { AmountInCents = 150000, CategoryName = _testObjects.TestUser1CategoryExpense.Name, CategoryType = CashFlowType.Expense, StartDate = new DateOnly(2025, 1, 1) },
            new() { AmountInCents = 100000, CategoryName = _testObjects.TestUser1CategoryIncome.Name, CategoryType = CashFlowType.Income, StartDate = new DateOnly(2025, 1, 1) },
            new() { AmountInCents = 250000, CategoryName = _testObjects.DefaultCategoryExpense.Name, CategoryType = CashFlowType.Expense, StartDate = new DateOnly(2025, 1, 1) }
        };
        
        var response = await ExecuteImportAndGetResponse(budgetsToImport);
        await ValidateImportResponse(response, 2, 1, false);
        await ValidateSavedBudgets(budgetsToImport, 2);
    }

    [Fact]
    public async Task Import_HandlesActiveBudgetReplacement()
    {
        var activeBudget = new Budget
        {
            Amount = 100000,
            CategoryId = _testObjects.TestUser1CategoryExpense.Id,
            StartDate = new DateOnly(2025, 1, 1),
            EndDate = null,
            UserId = _user1Id
        };
        _context.Budgets.Add(activeBudget);
        await _context.SaveChangesAsync();

        var budgetsToImport = new List<BudgetImport>
        {
            new() { AmountInCents = 150000, CategoryName = _testObjects.TestUser1CategoryExpense.Name, CategoryType = CashFlowType.Expense, StartDate = new DateOnly(2025, 2, 1) }
        };
        
        var response = await ExecuteImportAndGetResponse(budgetsToImport);
        await ValidateImportResponse(response, 1, 0, true);
        await ValidateSavedBudgets(budgetsToImport, 1);

        var updatedActiveBudget = await _context.Budgets.FindAsync(activeBudget.Id);
        Assert.NotNull(updatedActiveBudget);
        Assert.NotNull(updatedActiveBudget.EndDate);
    }

    [Fact]
    public async Task Import_ProvidesDetailedResultsForEachBudget()
    {
        var budgetsToImport = new List<BudgetImport>
        {
            new() { AmountInCents = 150000, CategoryName = _testObjects.TestUser1CategoryExpense.Name, CategoryType = CashFlowType.Expense, StartDate = new DateOnly(2025, 1, 1) },
            new() { AmountInCents = -10000, CategoryName = _testObjects.TestUser1CategoryExpense.Name, CategoryType = CashFlowType.Expense, StartDate = new DateOnly(2025, 1, 1) },
            new() { AmountInCents = 100000, CategoryName = "NonExistentCategory", CategoryType = CashFlowType.Expense, StartDate = new DateOnly(2025, 1, 1) }
        };
        
        var response = await ExecuteImportAndGetResponse(budgetsToImport);
        var results = response.Results as List<ImportResult>;
        Assert.Equal(3, results.Count);
        
        var successResult = results.First(r => r.Success);
        Assert.Contains(_testObjects.TestUser1CategoryExpense.Name, successResult.Message);
        Assert.Contains("imported successfully", successResult.Message);
        
        var negativeAmountResult = results.First(r => !r.Success && r.Message.Contains("must be positive"));
        Assert.Equal(2, negativeAmountResult.Row);
        
        var categoryNotFoundResult = results.First(r => !r.Success && r.Message.Contains("not found"));
        Assert.Equal(3, categoryNotFoundResult.Row);
    }

    [Fact]
    public async Task Import_UnauthorizedUserCannotImport()
    {
        SetUserUnauthorized();
        var budgetsToImport = new List<BudgetImport>
        {
            new() { AmountInCents = 150000, CategoryName = _testObjects.TestUser1CategoryExpense.Name, CategoryType = CashFlowType.Expense, StartDate = new DateOnly(2025, 1, 1) }
        };
        
        var result = await _controller.Import(budgetsToImport);
        Assert.IsType<UnauthorizedResult>(result);
        
        var savedBudgets = await GetSavedBudgetsForImport(budgetsToImport);
        Assert.Empty(savedBudgets);
        
        SetupUserContext(_user1Id);
    }

    [Fact]
    public async Task Import_HandlesMixedValidAndInvalidBudgets()
    {
        var budgetsToImport = new List<BudgetImport>
        {
            new() { AmountInCents = 150000, CategoryName = _testObjects.TestUser1CategoryExpense.Name, CategoryType = CashFlowType.Expense, StartDate = new DateOnly(2025, 1, 1) },
            new() { AmountInCents = -10000, CategoryName = _testObjects.TestUser1CategoryExpense.Name, CategoryType = CashFlowType.Expense, StartDate = new DateOnly(2025, 1, 1) },
            new() { AmountInCents = 100000, CategoryName = "NonExistentCategory", CategoryType = CashFlowType.Expense, StartDate = new DateOnly(2025, 1, 1) },
            new() { AmountInCents = 250000, CategoryName = _testObjects.DefaultCategoryExpense.Name, CategoryType = CashFlowType.Expense, StartDate = new DateOnly(2025, 1, 1) },
            new() { AmountInCents = 50000, CategoryName = _testObjects.TestUser1CategoryIncome.Name, CategoryType = CashFlowType.Income, StartDate = new DateOnly(2025, 1, 1) },
            new() { AmountInCents = 75000, CategoryName = _testObjects.TestUser1CategoryExpense.Name, CategoryType = CashFlowType.Expense, StartDate = new DateOnly(2025, 2, 1) }
        };
        
        var response = await ExecuteImportAndGetResponse(budgetsToImport);
        await ValidateImportResponse(response, 3, 3, false);
        await ValidateSavedBudgets(budgetsToImport, 3);
    }

    [Fact]
    public async Task Import_DoesNotSaveAnyBudgetsWhenAllAreInvalid()
    {
        var budgetsToImport = new List<BudgetImport>
        {
            new() { AmountInCents = -10000, CategoryName = _testObjects.TestUser1CategoryExpense.Name, CategoryType = CashFlowType.Expense, StartDate = new DateOnly(2025, 1, 1) },
            new() { AmountInCents = 100000, CategoryName = "NonExistentCategory", CategoryType = CashFlowType.Expense, StartDate = new DateOnly(2025, 1, 1) },
            new() { AmountInCents = 50000, CategoryName = _testObjects.TestUser1CategoryIncome.Name, CategoryType = CashFlowType.Income, StartDate = new DateOnly(2025, 1, 1) }
        };
        
        var response = await ExecuteImportAndGetResponse(budgetsToImport);
        await ValidateImportResponse(response, 0, 3, false);
        await ValidateSavedBudgets(budgetsToImport, 0);
    }
}
