using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

public class HoldingCategoriesControllerTests : IDisposable
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
    private HoldingCategoriesController _controller;
    private readonly IDbContextTransaction _transaction;
    public HoldingCategoriesControllerTests()
    {
        _context = DatabaseSetup.GetDbContext();
        _transaction = DatabaseSetup.GetTransaction(_context);
        _controller = new HoldingCategoriesController(_context);
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

    private async Task<HoldingCategory> CreateTestCategory(string name, string userId = null)
    {
        HoldingCategory category = new()
        {
            Name = name,
            UserId = userId
        };
        _context.HoldingCategories.Add(category);
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
        IEnumerable<HoldingCategory> categories = Assert.IsAssignableFrom<IEnumerable<HoldingCategory>>(result!.Value);

        Assert.Contains(categories, c => c.Name == _defaultCatName);
        Assert.Contains(categories, c => c.Name == _userCatName);
        Assert.DoesNotContain(categories, c => c.Name == _otherUserCatName);
    }

    [Fact]
    public async Task Create_AddsNewCategoryForUser()
    {
        HoldingCategory newCategory = new()
        {
            Name = _newCatName
        };
        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(await _controller.Create(newCategory));
        Assert.Equal(nameof(HoldingCategoriesController.Get), createdAtActionResult.ActionName);
        Assert.Equal(_newCatName, (createdAtActionResult.Value as HoldingCategory)?.Name);
    }

    [Fact]
    public async Task Create_DoesNotAllowNewCategoryWithSameNameAsDefault()
    {
        HoldingCategory newCategory = new()
        {
            Name = _defaultCatName
        };
        IActionResult result = await _controller.Create(newCategory);

        ConflictObjectResult conflictResult = Assert.IsType<ConflictObjectResult>(result);
        Assert.Equal(ConflictMessage, conflictResult.Value);
    }

    [Fact]
    public async Task Create_DoesNotAllowNewCategoryWithSameNameAsExistingUserCategory()
    {
        HoldingCategory newCategory = new()
        {
            Name = _userCatName
        };

        IActionResult result = await _controller.Create(newCategory);

        ConflictObjectResult conflictResult = Assert.IsType<ConflictObjectResult>(result);
        Assert.Equal(ConflictMessage, conflictResult.Value);
    }

    [Fact]
    public async Task Create_DoesNotAllowCategoryWithSameNameDifferentCasing()
    {
        HoldingCategory newCategory = new()
        {
            Name = _defaultCatName.ToLower()
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
        IActionResult result = await _controller.Create(new HoldingCategory { Name = invalidName });

        BadRequestObjectResult badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(NameRequiredMessage, badRequest.Value);
    }

    [Fact]
    public async Task Update_ModifiesOwnedCategory()
    {
        HoldingCategory oldCatCategory = await CreateTestCategory(_oldCatName, _user1Id);

        string newName = _updatedCatName;
        OkObjectResult? result = await _controller.Update(oldCatCategory.Id, new HoldingCategory { Name = newName }) as OkObjectResult;

        HoldingCategory? updated = await _context.HoldingCategories.FindAsync(oldCatCategory.Id);
        Assert.NotNull(result);
        Assert.Equal(newName, updated?.Name);
    }

    [Fact]
    public async Task Update_DoesNotAllowModifyingOtherUsersCategory()
    {
        HoldingCategory otherUserCategory = await CreateTestCategory(_testOtherUserCat, _user2Id);
        IActionResult result = await _controller.Update(otherUserCategory.Id, new HoldingCategory { Name = _updatedCatName });
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Update_DoesNotAllowModifyingDefaultCategories()
    {
        HoldingCategory? defaultCategory = _context.HoldingCategories.FirstOrDefault(c => c.Name == _defaultCatName);
        IActionResult result = await _controller.Update(defaultCategory!.Id, new HoldingCategory { Name = _updatedCatName });
        Assert.IsType<NotFoundResult>(result);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData(" ")]
    public async Task Update_InvalidNameReturnsBadRequest(string? invalidName)
    {
        HoldingCategory? userCategory = _context.HoldingCategories.FirstOrDefault(c => c.Name == _userCatName);
        IActionResult result = await _controller.Update(userCategory!.Id, new HoldingCategory { Name = invalidName });

        BadRequestObjectResult badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(NameRequiredMessage, badRequest.Value);
    }

    [Fact]
    public async Task Delete_RemovesUserCategory()
    {
        HoldingCategory toDeleteCategory = await CreateTestCategory(_toDeleteCat, _user1Id);
        IActionResult result = await _controller.Delete(toDeleteCategory.Id);

        Assert.IsType<NoContentResult>(result);
        Assert.False(_context.HoldingCategories.Any(c => c.Name == _toDeleteCat && c.UserId == _user1Id));
    }

    [Fact]
    public async Task Delete_DoesNotAllowDeletingOthersCategories()
    {
        HoldingCategory? otherUserCategory = _context.HoldingCategories.FirstOrDefault(c => c.Name == _otherUserCatName);
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
        HoldingCategory? userCategory = _context.HoldingCategories.FirstOrDefault(c => c.Name == _userCatName);
        IActionResult result = action switch
        {
            "Get" => await _controller.Get(),
            "Create" => await _controller.Create(new HoldingCategory { Name = _newCatName }),
            "Update" => await _controller.Update(userCategory!.Id, new HoldingCategory { Name = _newCatName }),
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
        HoldingCategory? userCategory = _context.HoldingCategories.FirstOrDefault(c => c.Name == _userCatName);
        IActionResult result = action switch
        {
            "Create" => await _controller.Create(new HoldingCategory { Name = _newCatName }),
            "Update" => await _controller.Update(userCategory!.Id, new HoldingCategory { Name = _newCatName }),
        };
        if (action == "Create")
        {
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
            HoldingCategory? category = createdAtActionResult.Value as HoldingCategory;
            Assert.NotEqual(DateTime.MinValue, category?.CreatedAt);
            Assert.Equal(DateTime.MinValue, category?.UpdatedAt);
        }
        if (action == "Update")
        {
            var okResult = Assert.IsType<OkObjectResult>(result);
            HoldingCategory? category = Assert.IsType<HoldingCategory>(okResult.Value);
            Assert.NotEqual(DateTime.MinValue, category.CreatedAt);
            Assert.NotEqual(DateTime.MinValue, category.UpdatedAt);
            Assert.True(category.UpdatedAt > category.CreatedAt);
            Assert.True(category.UpdatedAt > DateTime.UtcNow.AddMinutes(-1));
        }
    }

    private async Task<ImportResponse> ExecuteImportAndGetResponse(List<HoldingCategoryImport> categoriesToImport)
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

    private async Task<List<HoldingCategory>> GetSavedCategoriesForImport(List<HoldingCategoryImport> categoriesToImport)
    {
        var userCategories = await _context.HoldingCategories
            .Where(c => c.UserId == _user1Id)
            .ToListAsync();
        
        return userCategories
            .Where(c => categoriesToImport.Any(ci => ci.Name == c.Name))
            .ToList();
    }

    private async Task ValidateSavedCategories(List<HoldingCategoryImport> categoriesToImport, int expectedCount)
    {
        var savedCategories = await GetSavedCategoriesForImport(categoriesToImport);
        Assert.Equal(expectedCount, savedCategories.Count);
    }

    private async Task ValidateBadRequestForImport(List<HoldingCategoryImport>? categories, string expectedMessage)
    {
        var result = await _controller.Import(categories);
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(expectedMessage, badRequestResult.Value);
    }

    [Fact]
    public async Task Import_SuccessfullyImportsValidCategories()
    {
        var categoriesToImport = new List<HoldingCategoryImport>
        {
            new() { Name = $"{_testPrefix}Import Category 1" },
            new() { Name = $"{_testPrefix}Import Category 2" },
            new() { Name = $"{_testPrefix}Import Category 3" }
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
        await ValidateBadRequestForImport(new List<HoldingCategoryImport>(), "No categories provided for import.");
    }

    [Fact]
    public async Task Import_ReturnsBadRequestWhenTooManyCategoriesProvided()
    {
        var categories = new List<HoldingCategoryImport>();
        for (int i = 0; i < 101; i++)
            categories.Add(new() { Name = $"{_testPrefix}Category {i}" });
        
        var result = await _controller.Import(categories);
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Contains("Cannot import more than 100 categories at once", badRequestResult.Value.ToString());
    }

    [Fact]
    public async Task Import_SkipsCategoriesWithEmptyNames()
    {
        var categoriesToImport = new List<HoldingCategoryImport>
        {
            new() { Name = $"{_testPrefix}Valid Category" },
            new() { Name = "" },
            new() { Name = "   " },
            new() { Name = $"{_testPrefix}Another Valid Category" }
        };
        
        var response = await ExecuteImportAndGetResponse(categoriesToImport);
        await ValidateImportResponse(response, 2, 2, false);
        await ValidateSavedCategories(categoriesToImport, 2);
    }

    [Fact]
    public async Task Import_SkipsCategoriesThatAlreadyExist()
    {
        await CreateTestCategory($"{_testPrefix}Existing Category", _user1Id);
        var categoriesToImport = new List<HoldingCategoryImport>
        {
            new() { Name = $"{_testPrefix}New Category" },
            new() { Name = $"{_testPrefix}Existing Category" },
            new() { Name = $"{_testPrefix}Another New Category" }
        };
        
        var response = await ExecuteImportAndGetResponse(categoriesToImport);
        await ValidateImportResponse(response, 2, 1, false);
        await ValidateSavedCategories(categoriesToImport, 3);
    }

    [Fact]
    public async Task Import_SkipsCategoriesThatConflictWithDefaultCategories()
    {
        var categoriesToImport = new List<HoldingCategoryImport>
        {
            new() { Name = $"{_testPrefix}New Category" },
            new() { Name = _defaultCatName },
            new() { Name = $"{_testPrefix}Another New Category" }
        };
        
        var response = await ExecuteImportAndGetResponse(categoriesToImport);
        await ValidateImportResponse(response, 2, 1, false);
        await ValidateSavedCategories(categoriesToImport, 2);
    }

    [Fact]
    public async Task Import_HandlesCaseInsensitiveNameConflicts()
    {
        await CreateTestCategory($"{_testPrefix}Existing Category", _user1Id);
        var categoriesToImport = new List<HoldingCategoryImport>
        {
            new() { Name = $"{_testPrefix}New Category" },
            new() { Name = $"{_testPrefix}EXISTING CATEGORY" },
            new() { Name = $"{_testPrefix}Another New Category" }
        };
        
        var response = await ExecuteImportAndGetResponse(categoriesToImport);
        await ValidateImportResponse(response, 2, 1, false);
        await ValidateSavedCategories(categoriesToImport, 2);
    }

    [Fact]
    public async Task Import_ProvidesDetailedResultsForEachCategory()
    {
        await CreateTestCategory($"{_testPrefix}Existing Category", _user1Id);
        var categoriesToImport = new List<HoldingCategoryImport>
        {
            new() { Name = $"{_testPrefix}New Category" },
            new() { Name = "" },
            new() { Name = $"{_testPrefix}Existing Category" }
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
        var categoriesToImport = new List<HoldingCategoryImport>
        {
            new() { Name = $"{_testPrefix}Test Category" }
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
        var categoriesToImport = new List<HoldingCategoryImport>
        {
            new() { Name = $"{_testPrefix}Valid Category 1" },
            new() { Name = "" },
            new() { Name = $"{_testPrefix}Existing Category" },
            new() { Name = $"{_testPrefix}Valid Category 2" },
            new() { Name = "   " },
            new() { Name = $"{_testPrefix}Valid Category 3" }
        };
        
        var response = await ExecuteImportAndGetResponse(categoriesToImport);
        await ValidateImportResponse(response, 3, 3, false);
        await ValidateSavedCategories(categoriesToImport, 4);
    }

    [Fact]
    public async Task Import_DoesNotSaveAnyCategoriesWhenAllAreInvalid()
    {
        await CreateTestCategory($"{_testPrefix}Existing Category", _user1Id);
        var categoriesToImport = new List<HoldingCategoryImport>
        {
            new() { Name = "" },
            new() { Name = $"{_testPrefix}Existing Category" },
            new() { Name = "   " }
        };
        
        var response = await ExecuteImportAndGetResponse(categoriesToImport);
        await ValidateImportResponse(response, 0, 3, false);
        await ValidateSavedCategories(categoriesToImport, 1);
    }
}
