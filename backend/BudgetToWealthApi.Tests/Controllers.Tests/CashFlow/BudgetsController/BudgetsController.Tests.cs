using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore;

public class BudgetsControllerTests : IDisposable
{
    private readonly string _user1Id = "auth0|user1";
    private readonly string _user2Id = "auth0|user2";
    private BudgetsControllerTestObjects _testObjects = null!;
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
        _context.Budgets.Add(_testObjects.TestBudget7);
        _context.Budgets.Add(_testObjects.TestBudget8);
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

        Assert.Contains(budgets, budget => budget.Amount == _testObjects.TestBudget3.Amount);
        Assert.Equal(3, budgets.Count());
    }

    [Theory]
    [InlineData("2024-09-01", 3)]
    [InlineData("2024-10-15", 3)]
    [InlineData("2024-11-15", 3)]
    [InlineData("2024-12-15", 3)]
    [InlineData("2025-01-15", 3)]
    [InlineData("2025-03-15", 3)]
    [InlineData("2025-04-15", 3)]
    [InlineData("2025-05-15", 2)]
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
    [InlineData("2024-09-30", 0)]
    [InlineData("2024-10-31", 1)]
    [InlineData("2024-11-30", 1)]
    [InlineData("2025-01-31", 2)]
    [InlineData("2025-02-28", 2)]
    [InlineData("2025-04-30", 3)]
    [InlineData("2025-05-31", 3)]
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
    [InlineData("2024-09-01", "2024-09-30", 0)]
    [InlineData("2024-10-01", "2024-10-31", 1)]
    [InlineData("2024-11-01", "2024-11-30", 1)]
    [InlineData("2025-01-01", "2025-01-31", 2)]
    [InlineData("2025-02-01", "2025-02-28", 2)]
    [InlineData("2025-03-01", "2025-04-30", 3)]
    [InlineData("2025-04-01", "2025-05-31", 3)]
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

        Assert.Single(budgets);
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
    public async Task Create_StartDateIsSetToFirstDayOfThisMonth_WhenNewBudgetCreated()
    {
        Budget newBudget = new()
        {
            Amount = 11223,
            CategoryId = _testObjects.TestUser1CategoryExpense.Id,
            Category = _testObjects.TestUser1CategoryExpense
        };

        var result = await _controller.Create(newBudget);

        var objectResult = Assert.IsType<ObjectResult>(result);
        Budget createdBudget = Assert.IsType<Budget>(objectResult.Value);
        Assert.NotEqual(DateOnly.MinValue, createdBudget.StartDate);
        Assert.Equal(new DateOnly(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1), createdBudget.StartDate);
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
        Assert.Equal(BudgetsController.GetLastDayOfPreviousMonth(), createdOldBudget.EndDate);
        Assert.Equal(new DateOnly(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1), createdNewBudget.StartDate);
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
    public async Task Update_ReturnsOkAndArchivesPreviousBudget_WhenBudgetIsUpdatedSuccessfully()
    {
        Budget updatedBudget = new()
        {
            Amount = 9999,
            CategoryId = _testObjects.TestUser1CategoryExpense.Id,
            Category = _testObjects.TestUser1CategoryExpense
        };
        Budget? budgetToUpdate = _context.Budgets.FirstOrDefault(budget => budget.UserId == _user1Id);
        Guid budgetToUpdateGuid = budgetToUpdate!.Id;
        var result = await _controller.Update(budgetToUpdate!.Id, updatedBudget);

        Budget? budgetToUpdateArchived = _context.Budgets.FirstOrDefault(budget => budget.Id == budgetToUpdateGuid);
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedBudget = Assert.IsType<Budget>(okResult.Value);

        Assert.Equal(BudgetsController.GetLastDayOfPreviousMonth(), budgetToUpdateArchived!.EndDate);

        Assert.Equal(updatedBudget.Amount, returnedBudget.Amount);
        Assert.Equal(new DateOnly(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1), returnedBudget.StartDate);
        Assert.Null(returnedBudget.EndDate);
        Assert.Equal(updatedBudget.CategoryId, returnedBudget.CategoryId);
    }

    [Fact]
    public async Task DeleteAndArchive_ReturnsNotFound_WhenBudgetDoesNotExist()
    {
        var budgetId = Guid.NewGuid();
        var result = await _controller.Delete(budgetId);
        Assert.IsType<NotFoundResult>(result);
        var resultArchive = await _controller.Archive(budgetId);
        Assert.IsType<NotFoundResult>(resultArchive);
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
    public async Task DeleteAndArchive_DoesNotAllowDeletingOthersBudgets()
    {
        Budget? otherUserBudget = _context.Budgets.FirstOrDefault(budget => budget.UserId == _user2Id);
        IActionResult result = await _controller.Delete(otherUserBudget!.Id);
        Assert.IsType<NotFoundResult>(result);
        var resultArchive = await _controller.Archive(otherUserBudget!.Id);
        Assert.IsType<NotFoundResult>(resultArchive);
    }

    [Theory]
    [InlineData("Get")]
    [InlineData("Create")]
    [InlineData("Update")]
    [InlineData("Delete")]
    [InlineData("Archive")]
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
            "Archive" => await _controller.Archive(userBudget!.Id),
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
            _ => throw new ArgumentOutOfRangeException(nameof(action), action, "Unsupported action")
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

    private Task ValidateImportResponse(ImportResponse response, int expectedImportedCount, int expectedErrorCount, bool expectedSuccess = true)
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
        return Task.CompletedTask;
    }

    private async Task<List<Budget>> GetSavedBudgetsForImport(List<BudgetImport> budgetsToImport)
    {
        var userBudgets = await _context.Budgets
            .Where(b => b.UserId == _user1Id)
            .Include(b => b.Category)
            .ToListAsync();
        
        return userBudgets
            .Where(b => budgetsToImport.Any(bi => bi.AmountInCents == b.Amount && 
                                                   bi.CategoryName == b.Category!.Name))
            .ToList();
    }

    private async Task ValidateSavedBudgets(List<BudgetImport> budgetsToImport, int expectedCount)
    {
        var savedBudgets = await GetSavedBudgetsForImport(budgetsToImport);
        Assert.Equal(expectedCount, savedBudgets.Count);
        
        foreach (var budgetImport in budgetsToImport.Where(b => b.AmountInCents > 0 && !string.IsNullOrWhiteSpace(b.CategoryName)))
        {
            var matchingBudget = savedBudgets.FirstOrDefault(b => b.Amount == budgetImport.AmountInCents && 
                                                                  b.Category!.Name == budgetImport.CategoryName);
            if (savedBudgets.Any(b => b.Amount == budgetImport.AmountInCents && b.Category!.Name == budgetImport.CategoryName))
            {
                Assert.NotNull(matchingBudget);
            }
        }
    }

    private async Task ValidateBadRequestForImport(List<BudgetImport>? budgets, string expectedMessage)
    {
        var result = await _controller.Import(budgets!);
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(expectedMessage, badRequestResult.Value);
    }

    [Fact]
    public async Task Import_SuccessfullyImportsValidBudgets()
    {
        var budgetsToImport = new List<BudgetImport>
        {
            new() { AmountInCents = 150000, CategoryName = _testObjects.TestUser1CategoryExpense.Name },
            new() { AmountInCents = 250000, CategoryName = _testObjects.DefaultCategoryExpense.Name },
            new() { AmountInCents = 100000, CategoryName = _testObjects.TestUser1CategoryExpense.Name }
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
            budgets.Add(new() { AmountInCents = 100000, CategoryName = _testObjects.TestUser1CategoryExpense.Name });
        
        var result = await _controller.Import(budgets);
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Contains("Cannot import more than 100 budgets at once", $"{badRequestResult.Value}");
    }

    [Fact]
    public async Task Import_SkipsBudgetsWithNegativeAmounts()
    {
        var budgetsToImport = new List<BudgetImport>
        {
            new() { AmountInCents = 150000, CategoryName = _testObjects.TestUser1CategoryExpense.Name },
            new() { AmountInCents = -10000, CategoryName = _testObjects.TestUser1CategoryExpense.Name },
            new() { AmountInCents = 250000, CategoryName = _testObjects.DefaultCategoryExpense.Name }
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
            new() { AmountInCents = 150000, CategoryName = _testObjects.TestUser1CategoryExpense.Name },
            new() { AmountInCents = 100000, CategoryName = "" },
            new() { AmountInCents = 250000, CategoryName = _testObjects.DefaultCategoryExpense.Name }
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
            new() { AmountInCents = 150000, CategoryName = _testObjects.TestUser1CategoryExpense.Name },
            new() { AmountInCents = 100000, CategoryName = "NonExistentCategory" },
            new() { AmountInCents = 250000, CategoryName = _testObjects.DefaultCategoryExpense.Name }
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
            CategoryId = _testObjects.TestUser1Category2Expense.Id,
            StartDate = new DateOnly(2025, 1, 1),
            EndDate = null,
            UserId = _user1Id
        };
        _context.Budgets.Add(activeBudget);
        await _context.SaveChangesAsync();

        var budgetsToImport = new List<BudgetImport>
        {
            new() { AmountInCents = 150000, CategoryName = _testObjects.TestUser1Category2Expense.Name }
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
            new() { AmountInCents = 150000, CategoryName = _testObjects.TestUser1CategoryExpense.Name },
            new() { AmountInCents = -10000, CategoryName = _testObjects.TestUser1CategoryExpense.Name },
            new() { AmountInCents = 100000, CategoryName = "NonExistentCategory" }
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
            new() { AmountInCents = 150000, CategoryName = _testObjects.TestUser1CategoryExpense.Name }
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
            new() { AmountInCents = 150000, CategoryName = _testObjects.TestUser1CategoryExpense.Name },
            new() { AmountInCents = -10000, CategoryName = _testObjects.TestUser1CategoryExpense.Name },
            new() { AmountInCents = 100000, CategoryName = "NonExistentCategory" },
            new() { AmountInCents = 250000, CategoryName = _testObjects.DefaultCategoryExpense.Name },
            new() { AmountInCents = 50000, CategoryName = _testObjects.TestUser1CategoryIncome.Name },
            new() { AmountInCents = 75000, CategoryName = _testObjects.TestUser1CategoryExpense.Name }
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
            new() { AmountInCents = -10000, CategoryName = _testObjects.TestUser1CategoryExpense.Name },
            new() { AmountInCents = 100000, CategoryName = "NonExistentCategory" },
            new() { AmountInCents = 50000, CategoryName = _testObjects.TestUser1CategoryIncome.Name }
        };
        
        var response = await ExecuteImportAndGetResponse(budgetsToImport);
        await ValidateImportResponse(response, 0, 3, false);
        await ValidateSavedBudgets(budgetsToImport, 0);
    }

    [Fact]
    public async Task Create_ArchivesExistingActiveBudget_WhenCreatingNewBudgetForSameCategory()
    {
        var existingBudget = new Budget
        {
            Amount = 5000,
            CategoryId = _testObjects.TestUser1Category2Expense.Id,
            StartDate = new DateOnly(2025, 8, 15),
            EndDate = null,
            UserId = _user1Id
        };
        _context.Budgets.Add(existingBudget);
        await _context.SaveChangesAsync();

        var newBudget = new Budget
        {
            Amount = 7500,
            CategoryId = _testObjects.TestUser1Category2Expense.Id,
            Category = _testObjects.TestUser1Category2Expense
        };

        var result = await _controller.Create(newBudget);

        var objectResult = Assert.IsType<ObjectResult>(result);
        var createdBudget = Assert.IsType<Budget>(objectResult.Value);

        var archivedBudget = await _context.Budgets.FindAsync(existingBudget.Id);
        Assert.NotNull(archivedBudget);
        Assert.NotNull(archivedBudget.EndDate);
        Assert.Equal(BudgetsController.GetLastDayOfPreviousMonth(), archivedBudget.EndDate);

        Assert.Equal(newBudget.Amount, createdBudget.Amount);
        Assert.Equal(new DateOnly(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1), createdBudget.StartDate);
        Assert.Null(createdBudget.EndDate);
    }

    [Fact]
    public async Task Create_AdjustsStartDate_WhenExistingBudgetStartDateIsAfterFirstDayOfLastMonth()
    {
        var existingBudget = new Budget
        {
            Amount = 3000,
            CategoryId = _testObjects.TestUser1Category2Expense.Id,
            StartDate = new DateOnly(2025, 8, 15),
            EndDate = null,
            UserId = _user1Id
        };
        _context.Budgets.Add(existingBudget);
        await _context.SaveChangesAsync();

        var newBudget = new Budget
        {
            Amount = 4000,
            CategoryId = _testObjects.TestUser1Category2Expense.Id,
            Category = _testObjects.TestUser1Category2Expense
        };

        await _controller.Create(newBudget);

        var archivedBudget = await _context.Budgets.FindAsync(existingBudget.Id);
        Assert.NotNull(archivedBudget);
        
        var lastDayOfPreviousMonth = BudgetsController.GetLastDayOfPreviousMonth();
        var firstDayOfLastMonth = new DateOnly(lastDayOfPreviousMonth.Year, lastDayOfPreviousMonth.Month, 1);
        
        Assert.Equal(firstDayOfLastMonth, archivedBudget.StartDate);
        Assert.Equal(lastDayOfPreviousMonth, archivedBudget.EndDate);
    }

    [Fact]
    public async Task Create_DoesNotAdjustStartDate_WhenExistingBudgetStartDateIsBeforeFirstDayOfLastMonth()
    {
        var originalStartDate = new DateOnly(2024, 12, 1);
        var existingBudget = new Budget
        {
            Amount = 3000,
            CategoryId = _testObjects.TestUser1Category2Expense.Id,
            StartDate = originalStartDate,
            EndDate = null,
            UserId = _user1Id
        };
        _context.Budgets.Add(existingBudget);
        await _context.SaveChangesAsync();

        var newBudget = new Budget
        {
            Amount = 4000,
            CategoryId = _testObjects.TestUser1Category2Expense.Id,
            Category = _testObjects.TestUser1Category2Expense
        };

        await _controller.Create(newBudget);

        var archivedBudget = await _context.Budgets.FindAsync(existingBudget.Id);
        Assert.NotNull(archivedBudget);
        
        Assert.Equal(originalStartDate, archivedBudget.StartDate);
        Assert.Equal(BudgetsController.GetLastDayOfPreviousMonth(), archivedBudget.EndDate);
    }

    [Fact]
    public async Task Update_ArchivesExistingBudget_WhenUpdatingBudget()
    {
        var existingBudget = new Budget
        {
            Amount = 5000,
            CategoryId = _testObjects.TestUser1Category2Expense.Id,
            StartDate = new DateOnly(2025, 8, 1),
            EndDate = null,
            UserId = _user1Id
        };
        _context.Budgets.Add(existingBudget);
        await _context.SaveChangesAsync();

        var updatedBudget = new Budget
        {
            Amount = 7500,
            CategoryId = _testObjects.TestUser1Category2Expense.Id,
            Category = _testObjects.TestUser1Category2Expense
        };

        var result = await _controller.Update(existingBudget.Id, updatedBudget);

        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedBudget = Assert.IsType<Budget>(okResult.Value);

        var archivedBudget = await _context.Budgets.FindAsync(existingBudget.Id);
        Assert.NotNull(archivedBudget);
        Assert.NotNull(archivedBudget.EndDate);
        Assert.Equal(BudgetsController.GetLastDayOfPreviousMonth(), archivedBudget.EndDate);

        Assert.Equal(updatedBudget.Amount, returnedBudget.Amount);
        Assert.Equal(new DateOnly(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1), returnedBudget.StartDate);
        Assert.Null(returnedBudget.EndDate);
    }

    [Fact]
    public async Task Get_ReturnsLatestBudgetPerCategory_WhenMultipleBudgetsExistForSameCategory()
    {
        var categoryId = _testObjects.TestUser1CategoryExpense.Id;
        
        var oldBudget = new Budget
        {
            Amount = 1000,
            CategoryId = categoryId,
            StartDate = new DateOnly(2024, 10, 1),
            EndDate = new DateOnly(2024, 11, 30),
            UserId = _user1Id
        };
        
        var middleBudget = new Budget
        {
            Amount = 2000,
            CategoryId = categoryId,
            StartDate = new DateOnly(2024, 12, 1),
            EndDate = new DateOnly(2025, 1, 31),
            UserId = _user1Id
        };
        
        var latestBudget = new Budget
        {
            Amount = 9000,
            CategoryId = categoryId,
            StartDate = new DateOnly(2025, 6, 1),
            EndDate = null,
            UserId = _user1Id
        };

        _context.Budgets.AddRange(oldBudget, middleBudget, latestBudget);
        await _context.SaveChangesAsync();

        var result = await _controller.Get(categoryId: categoryId) as OkObjectResult;
        Assert.NotNull(result);

        var budgets = Assert.IsAssignableFrom<IEnumerable<Budget>>(result.Value);
        Assert.Single(budgets);
        
        var returnedBudget = budgets.First();
        Assert.Equal(latestBudget.Amount, returnedBudget.Amount);
        Assert.Equal(latestBudget.StartDate, returnedBudget.StartDate);
        Assert.Equal(latestBudget.EndDate, returnedBudget.EndDate);
    }
    
    [Theory]
    [InlineData("2024-11-15", "2024-11-30", 2000)]
    [InlineData("2024-11-15", null, 9000)]
    [InlineData(null, "2024-11-30", 2000)]
    public async Task Get_ReturnsCorrectBudget_WhenFilteringByDateRangeWithMultipleBudgets(string startDateString, string? endDateString, int expectedAmount)
    {
        var categoryId = _testObjects.TestUser1Category3Expense.Id;
        
        var budget1 = new Budget
        {
            Amount = 1000,
            CategoryId = categoryId,
            StartDate = new DateOnly(2024, 10, 1),
            EndDate = new DateOnly(2024, 10, 31),
            UserId = _user1Id,
            CreatedAt = DateTime.UtcNow.AddDays(-3)
        };
        
        var budget2 = new Budget
        {
            Amount = 2000,
            CategoryId = categoryId,
            StartDate = new DateOnly(2024, 11, 1),
            EndDate = new DateOnly(2024, 11, 30),
            UserId = _user1Id,
            CreatedAt = DateTime.UtcNow.AddDays(-2)
        };
        
        var budget3 = new Budget
        {
            Amount = 9000,
            CategoryId = categoryId,
            StartDate = new DateOnly(2024, 12, 1),
            EndDate = null,
            UserId = _user1Id,
            CreatedAt = DateTime.UtcNow.AddDays(-1)
        };

        _context.Budgets.AddRange(budget1, budget2, budget3);
        await _context.SaveChangesAsync();

        var result = await _controller.Get(categoryId: categoryId, startDate: startDateString != null ? DateOnly.Parse(startDateString) : null, endDate: endDateString != null ? DateOnly.Parse(endDateString) : null) as OkObjectResult;
        Assert.NotNull(result);

        var budgets = Assert.IsAssignableFrom<IEnumerable<Budget>>(result.Value);
        Assert.Single(budgets);
        
        var returnedBudget = budgets.First();
        Assert.Equal(expectedAmount, returnedBudget.Amount);
    }
}
