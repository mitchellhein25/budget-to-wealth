using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

public class CashFlowCategoriesControllerTests : IDisposable
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
    private CashFlowCategoriesController _controller;
    private readonly IDbContextTransaction _transaction;
    public CashFlowCategoriesControllerTests()
    {
        _context = DatabaseSetup.GetDbContext();
        _transaction = DatabaseSetup.GetTransaction(_context);
        _controller = new CashFlowCategoriesController(_context);
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

    private async Task<CashFlowCategory> CreateTestCategory(string name, string userId = null)
    {
        CashFlowCategory category = new()
        {
            Name = name,
            CategoryType = CashFlowType.Expense,
            UserId = userId
        };
        _context.CashFlowCategories.Add(category);
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
        IEnumerable<CashFlowCategory> categories = Assert.IsAssignableFrom<IEnumerable<CashFlowCategory>>(result!.Value);

        Assert.Contains(categories, c => c.Name == _defaultCatName);
        Assert.Contains(categories, c => c.Name == _userCatName);
        Assert.DoesNotContain(categories, c => c.Name == _otherUserCatName);
    }

    [Fact]
    public async Task Create_AddsNewCategoryForUser()
    {
        CashFlowCategory newCategory = new()
        {
            Name = _newCatName,
            CategoryType = CashFlowType.Expense
        };
        var createdAtActionResult = Assert.IsType<ObjectResult>(await _controller.Create(newCategory));
        Assert.Equal(_newCatName, (createdAtActionResult.Value as CashFlowCategory)?.Name);
    }

    [Fact]
    public async Task Create_DoesNotAllowNewCategoryWithSameNameAsDefault()
    {
        CashFlowCategory newCategory = new()
        {
            Name = _defaultCatName,
            CategoryType = CashFlowType.Expense
        };
        IActionResult result = await _controller.Create(newCategory);

        ConflictObjectResult conflictResult = Assert.IsType<ConflictObjectResult>(result);
        Assert.Equal(ConflictMessage, conflictResult.Value);
    }

    [Fact]
    public async Task Create_DoesNotAllowNewCategoryWithSameNameAsExistingUserCategory()
    {
        CashFlowCategory newCategory = new()
        {
            Name = _userCatName,
            CategoryType = CashFlowType.Expense
        };

        IActionResult result = await _controller.Create(newCategory);

        ConflictObjectResult conflictResult = Assert.IsType<ConflictObjectResult>(result);
        Assert.Equal(ConflictMessage, conflictResult.Value);
    }

    [Fact]
    public async Task Create_DoesNotAllowCategoryWithSameNameDifferentCasing()
    {
        CashFlowCategory newCategory = new()
        {
            Name = _defaultCatName.ToLower(),
            CategoryType = CashFlowType.Expense
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
        IActionResult result = await _controller.Create(new CashFlowCategory { Name = invalidName, CategoryType = CashFlowType.Expense });

        BadRequestObjectResult badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(NameRequiredMessage, badRequest.Value);
    }

    [Fact]
    public async Task Update_ModifiesOwnedCategory()
    {
        CashFlowCategory oldCatCategory = await CreateTestCategory(_oldCatName, _user1Id);

        string newName = _updatedCatName;
        OkObjectResult? result = await _controller.Update(oldCatCategory.Id, new CashFlowCategory { Name = newName, CategoryType = CashFlowType.Expense }) as OkObjectResult;

        CashFlowCategory? updated = await _context.CashFlowCategories.FindAsync(oldCatCategory.Id);
        Assert.NotNull(result);
        Assert.Equal(newName, updated?.Name);
    }

    [Fact]
    public async Task Update_DoesNotAllowModifyingOtherUsersCategory()
    {
        CashFlowCategory otherUserCategory = await CreateTestCategory(_testOtherUserCat, _user2Id);
        IActionResult result = await _controller.Update(otherUserCategory.Id, new CashFlowCategory { Name = _updatedCatName, CategoryType = CashFlowType.Expense });
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Update_DoesNotAllowModifyingDefaultCategories()
    {
        CashFlowCategory? defaultCategory = _context.CashFlowCategories.FirstOrDefault(c => c.Name == _defaultCatName);
        IActionResult result = await _controller.Update(defaultCategory!.Id, new CashFlowCategory { Name = _updatedCatName, CategoryType = CashFlowType.Expense });
        Assert.IsType<NotFoundResult>(result);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData(" ")]
    public async Task Update_InvalidNameReturnsBadRequest(string? invalidName)
    {
        CashFlowCategory? userCategory = _context.CashFlowCategories.FirstOrDefault(c => c.Name == _userCatName);
        IActionResult result = await _controller.Update(userCategory!.Id, new CashFlowCategory { Name = invalidName, CategoryType = CashFlowType.Expense });

        BadRequestObjectResult badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(NameRequiredMessage, badRequest.Value);
    }

    [Fact]
    public async Task Delete_RemovesUserCategory()
    {
        CashFlowCategory toDeleteCategory = await CreateTestCategory(_toDeleteCat, _user1Id);
        IActionResult result = await _controller.Delete(toDeleteCategory.Id);

        Assert.IsType<NoContentResult>(result);
        Assert.False(_context.CashFlowCategories.Any(c => c.Name == _toDeleteCat && c.UserId == _user1Id));
    }

    [Fact]
    public async Task Delete_DoesNotAllowDeletingOthersCategories()
    {
        CashFlowCategory? otherUserCategory = _context.CashFlowCategories.FirstOrDefault(c => c.Name == _otherUserCatName);
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
        CashFlowCategory? userCategory = _context.CashFlowCategories.FirstOrDefault(c => c.Name == _userCatName);
        IActionResult result = action switch
        {
            "Get" => await _controller.Get(),
            "Create" => await _controller.Create(new CashFlowCategory { Name = _newCatName, CategoryType = CashFlowType.Expense }),
            "Update" => await _controller.Update(userCategory!.Id, new CashFlowCategory { Name = _newCatName, CategoryType = CashFlowType.Expense }),
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
        CashFlowCategory? userCategory = _context.CashFlowCategories.FirstOrDefault(c => c.Name == _userCatName);
        IActionResult result = action switch
        {
            "Create" => await _controller.Create(new CashFlowCategory { Name = _newCatName, CategoryType = CashFlowType.Expense }),
            "Update" => await _controller.Update(userCategory!.Id, new CashFlowCategory { Name = _newCatName, CategoryType = CashFlowType.Expense }),
        };
        if (action == "Create")
        {
            var createdAtActionResult = Assert.IsType<ObjectResult>(result);
            CashFlowCategory? category = createdAtActionResult.Value as CashFlowCategory;
            Assert.NotEqual(DateTime.MinValue, category?.CreatedAt);
            Assert.Equal(DateTime.MinValue, category?.UpdatedAt);
        }
        if (action == "Update")
        {
            var okResult = Assert.IsType<OkObjectResult>(result);
            CashFlowCategory? category = Assert.IsType<CashFlowCategory>(okResult.Value);
            Assert.NotEqual(DateTime.MinValue, category.CreatedAt);
            Assert.NotEqual(DateTime.MinValue, category.UpdatedAt);
            Assert.True(category.UpdatedAt > category.CreatedAt);
            Assert.True(category.UpdatedAt > DateTime.UtcNow.AddMinutes(-1));
        }
    }

    private async Task<ImportResponse> ExecuteImportAndGetResponse(List<CashFlowCategoryImport> categoriesToImport)
    {
        var result = await _controller.Import(categoriesToImport);
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
            Assert.Contains($"Successfully imported {expectedImportedCount} categories", response.Message);
        }
        else
        {
            Assert.Contains($"Imported {expectedImportedCount} categories with {expectedErrorCount} errors", response.Message);
        }
    }

    private async Task<List<CashFlowCategory>> GetSavedCategoriesForImport(List<CashFlowCategoryImport> categoriesToImport)
    {
        var userCategories = await _context.CashFlowCategories
            .Where(c => c.UserId == _user1Id)
            .ToListAsync();
        
        return userCategories
            .Where(c => categoriesToImport.Any(ci => ci.Name == c.Name && ci.CategoryType == c.CategoryType))
            .ToList();
    }

    private async Task ValidateSavedCategories(List<CashFlowCategoryImport> categoriesToImport, int expectedCount)
    {
        var savedCategories = await GetSavedCategoriesForImport(categoriesToImport);
        Assert.Equal(expectedCount, savedCategories.Count);
    }

    private async Task ValidateBadRequestForImport(List<CashFlowCategoryImport>? categories, string expectedMessage)
    {
        var result = await _controller.Import(categories);
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(expectedMessage, badRequestResult.Value);
    }

    [Fact]
    public async Task Import_SuccessfullyImportsValidCategories()
    {
        var categoriesToImport = new List<CashFlowCategoryImport>
        {
            new() { Name = $"{_testPrefix}Import Category 1", CategoryType = CashFlowType.Expense },
            new() { Name = $"{_testPrefix}Import Category 2", CategoryType = CashFlowType.Income },
            new() { Name = $"{_testPrefix}Import Category 3", CategoryType = CashFlowType.Expense }
        };
        
        var response = await ExecuteImportAndGetResponse(categoriesToImport);
        await ValidateImportResponse(response, 3, 0, true);
        await ValidateSavedCategories(categoriesToImport, 3);
    }

    [Fact]
    public async Task Import_ReturnsBadRequestWhenNoCategoriesProvided()
    {
        await ValidateBadRequestForImport(null, "No categories provided for import.");
    }

    [Fact]
    public async Task Import_ReturnsBadRequestWhenEmptyListProvided()
    {
        await ValidateBadRequestForImport(new List<CashFlowCategoryImport>(), "No categories provided for import.");
    }

    [Fact]
    public async Task Import_ReturnsBadRequestWhenTooManyCategoriesProvided()
    {
        var categories = new List<CashFlowCategoryImport>();
        for (int i = 0; i < 101; i++)
            categories.Add(new() { Name = $"{_testPrefix}Category {i}", CategoryType = CashFlowType.Expense });
        
        var result = await _controller.Import(categories);
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Contains("Cannot import more than 100 categories at once", badRequestResult.Value.ToString());
    }

    [Fact]
    public async Task Import_SkipsCategoriesWithEmptyNames()
    {
        var categoriesToImport = new List<CashFlowCategoryImport>
        {
            new() { Name = $"{_testPrefix}Valid Category", CategoryType = CashFlowType.Expense },
            new() { Name = "", CategoryType = CashFlowType.Expense },
            new() { Name = "   ", CategoryType = CashFlowType.Expense },
            new() { Name = $"{_testPrefix}Another Valid Category", CategoryType = CashFlowType.Income }
        };
        
        var response = await ExecuteImportAndGetResponse(categoriesToImport);
        await ValidateImportResponse(response, 2, 2, false);
        await ValidateSavedCategories(categoriesToImport, 2);
    }

    [Fact]
    public async Task Import_SkipsCategoriesThatAlreadyExist()
    {
        await CreateTestCategory($"{_testPrefix}Existing Category", _user1Id);
        var categoriesToImport = new List<CashFlowCategoryImport>
        {
            new() { Name = $"{_testPrefix}New Category", CategoryType = CashFlowType.Expense },
            new() { Name = $"{_testPrefix}Existing Category", CategoryType = CashFlowType.Expense },
            new() { Name = $"{_testPrefix}Another New Category", CategoryType = CashFlowType.Income }
        };
        
        var response = await ExecuteImportAndGetResponse(categoriesToImport);
        await ValidateImportResponse(response, 2, 1, false);
        await ValidateSavedCategories(categoriesToImport, 3);
    }

    [Fact]
    public async Task Import_SkipsCategoriesThatConflictWithDefaultCategories()
    {
        var categoriesToImport = new List<CashFlowCategoryImport>
        {
            new() { Name = $"{_testPrefix}New Category", CategoryType = CashFlowType.Expense },
            new() { Name = _defaultCatName, CategoryType = CashFlowType.Expense },
            new() { Name = $"{_testPrefix}Another New Category", CategoryType = CashFlowType.Income }
        };
        
        var response = await ExecuteImportAndGetResponse(categoriesToImport);
        await ValidateImportResponse(response, 2, 1, false);
        await ValidateSavedCategories(categoriesToImport, 2);
    }

    [Fact]
    public async Task Import_HandlesCaseInsensitiveNameConflicts()
    {
        await CreateTestCategory($"{_testPrefix}Existing Category", _user1Id);
        var categoriesToImport = new List<CashFlowCategoryImport>
        {
            new() { Name = $"{_testPrefix}New Category", CategoryType = CashFlowType.Expense },
            new() { Name = $"{_testPrefix}EXISTING CATEGORY", CategoryType = CashFlowType.Expense },
            new() { Name = $"{_testPrefix}Another New Category", CategoryType = CashFlowType.Income }
        };
        
        var response = await ExecuteImportAndGetResponse(categoriesToImport);
        await ValidateImportResponse(response, 2, 1, false);
        await ValidateSavedCategories(categoriesToImport, 2);
    }

    [Fact]
    public async Task Import_AllowsSameNameForDifferentTypes()
    {
        var categoriesToImport = new List<CashFlowCategoryImport>
        {
            new() { Name = $"{_testPrefix}Same Name", CategoryType = CashFlowType.Expense },
            new() { Name = $"{_testPrefix}Same Name", CategoryType = CashFlowType.Income }
        };
        
        var response = await ExecuteImportAndGetResponse(categoriesToImport);
        await ValidateImportResponse(response, 2, 0, true);
        await ValidateSavedCategories(categoriesToImport, 2);
    }

    [Fact]
    public async Task Import_ProvidesDetailedResultsForEachCategory()
    {
        await CreateTestCategory($"{_testPrefix}Existing Category", _user1Id);
        var categoriesToImport = new List<CashFlowCategoryImport>
        {
            new() { Name = $"{_testPrefix}New Category", CategoryType = CashFlowType.Expense },
            new() { Name = "", CategoryType = CashFlowType.Expense },
            new() { Name = $"{_testPrefix}Existing Category", CategoryType = CashFlowType.Expense }
        };
        
        var response = await ExecuteImportAndGetResponse(categoriesToImport);
        var results = response.Results as List<ImportResult>;
        Assert.Equal(3, results.Count);
        
        var successResult = results.First(r => r.Success);
        Assert.Contains("New Category", successResult.Message);
        Assert.Contains("imported successfully", successResult.Message);
        
        var emptyNameResult = results.First(r => !r.Success && r.Message.Contains("cannot be empty"));
        Assert.Equal(2, emptyNameResult.Row);
        
        var conflictResult = results.First(r => !r.Success && r.Message.Contains("already exists"));
        Assert.Equal(3, conflictResult.Row);
    }

    [Fact]
    public async Task Import_UnauthorizedUserCannotImport()
    {
        SetUserUnauthorized();
        var categoriesToImport = new List<CashFlowCategoryImport>
        {
            new() { Name = $"{_testPrefix}Test Category", CategoryType = CashFlowType.Expense }
        };
        
        var result = await _controller.Import(categoriesToImport);
        Assert.IsType<UnauthorizedResult>(result);
        
        var savedCategories = await GetSavedCategoriesForImport(categoriesToImport);
        Assert.Empty(savedCategories);
        
        SetupUserContext(_user1Id);
    }

    [Fact]
    public async Task Import_HandlesMixedValidAndInvalidCategories()
    {
        await CreateTestCategory($"{_testPrefix}Existing Category", _user1Id);        
        var categoriesToImport = new List<CashFlowCategoryImport>
        {
            new() { Name = $"{_testPrefix}Valid Category 1", CategoryType = CashFlowType.Expense },
            new() { Name = "", CategoryType = CashFlowType.Expense },
            new() { Name = $"{_testPrefix}Existing Category", CategoryType = CashFlowType.Expense },
            new() { Name = $"{_testPrefix}Valid Category 2", CategoryType = CashFlowType.Income },
            new() { Name = "   ", CategoryType = CashFlowType.Expense },
            new() { Name = $"{_testPrefix}Valid Category 3", CategoryType = CashFlowType.Expense }
        };
        
        var response = await ExecuteImportAndGetResponse(categoriesToImport);
        await ValidateImportResponse(response, 3, 3, false);
        await ValidateSavedCategories(categoriesToImport, 4);
    }

    [Fact]
    public async Task Import_DoesNotSaveAnyCategoriesWhenAllAreInvalid()
    {
        await CreateTestCategory($"{_testPrefix}Existing Category", _user1Id);
        var categoriesToImport = new List<CashFlowCategoryImport>
        {
            new() { Name = "", CategoryType = CashFlowType.Expense },
            new() { Name = $"{_testPrefix}Existing Category", CategoryType = CashFlowType.Expense },
            new() { Name = "   ", CategoryType = CashFlowType.Income }
        };
        
        var response = await ExecuteImportAndGetResponse(categoriesToImport);
        await ValidateImportResponse(response, 0, 3, false);
        await ValidateSavedCategories(categoriesToImport, 1);
    }
}
