using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

public class HoldingSnapshotsControllerTests : IDisposable
{
    private readonly string _user1Id = "auth0|user1";
    private readonly string _user2Id = "auth0|user2";
    private HoldingSnapshotsControllerTestObjects _testObjects = null!;
    private ApplicationDbContext _context;
    private HoldingSnapshotsController _controller;
    private readonly IDbContextTransaction _transaction;
    public HoldingSnapshotsControllerTests()
    {
        _context = DatabaseSetup.GetDbContext();
        _transaction = DatabaseSetup.GetTransaction(_context);
        _controller = new HoldingSnapshotsController(_context);
        SetupTestData();
        SetupUserContext(_user1Id);
    }

    private void SetupTestData()
    {
        _testObjects = new(_context);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotHolding1User1A);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotHolding1User1B);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotHolding2User1);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotHolding1User2A);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotHolding1User2B);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotHolding2User2);
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

    private async Task<HoldingSnapshot> CreateTestHoldingSnapshots(HoldingSnapshot holdingSnapshot)
    {
        _context.HoldingSnapshots.Add(holdingSnapshot);
        await _context.SaveChangesAsync();
        return holdingSnapshot;
    }

    public void Dispose()
    {
        _transaction.Rollback();
        _transaction.Dispose();
        _context.Dispose();
    }

    [Fact]
    public async Task Get_QueryWithoutHoldingIdReturnsAllUserHoldingSnapshots()
    {
        OkObjectResult? result = await _controller.Get() as OkObjectResult;
        IEnumerable<HoldingSnapshot> HoldingSnapshots = Assert.IsAssignableFrom<IEnumerable<HoldingSnapshot>>(result!.Value);

        Assert.Contains(HoldingSnapshots, snapshot => snapshot.Balance == _testObjects.TestHoldingSnapshotHolding1User1A.Balance);
        Assert.Equal(3, HoldingSnapshots.Count());
    }

    [Fact]
    public async Task Get_FilterByHolding()
    {
        OkObjectResult? result = await _controller.Get(holdingId: _testObjects.TestUser1Holding1.Id) as OkObjectResult;
        IEnumerable<HoldingSnapshot> HoldingSnapshots = Assert.IsAssignableFrom<IEnumerable<HoldingSnapshot>>(result!.Value);
        Assert.Contains(HoldingSnapshots, snapshot => snapshot.Balance == _testObjects.TestHoldingSnapshotHolding1User1A.Balance);
        Assert.Equal(2, HoldingSnapshots.Count());
    }

    [Fact]
    public async Task Get_LatestOnly_ReturnsLatestForEachHolding()
    {
        OkObjectResult? result = await _controller.Get(latestOnly: true) as OkObjectResult;
        IEnumerable<HoldingSnapshot> snapshots = Assert.IsAssignableFrom<IEnumerable<HoldingSnapshot>>(result!.Value);

        Assert.Equal(2, snapshots.Count());

        var latestHolding1 = snapshots.FirstOrDefault(s => s.HoldingId == _testObjects.TestUser1Holding1.Id);
        Assert.NotNull(latestHolding1);
        Assert.Equal(_testObjects.TestHoldingSnapshotHolding1User1A.Date, latestHolding1!.Date);

        var latestHolding2 = snapshots.FirstOrDefault(s => s.HoldingId == _testObjects.TestUser1Holding2.Id);
        Assert.NotNull(latestHolding2);
        Assert.Equal(_testObjects.TestHoldingSnapshotHolding2User1.Date, latestHolding2!.Date);
    }

    [Fact]
    public async Task Get_LatestOnly_WithHoldingId_ReturnsSingleLatest()
    {
        OkObjectResult? result = await _controller.Get(holdingId: _testObjects.TestUser1Holding1.Id, latestOnly: true) as OkObjectResult;
        IEnumerable<HoldingSnapshot> snapshots = Assert.IsAssignableFrom<IEnumerable<HoldingSnapshot>>(result!.Value);

        Assert.Single(snapshots);
        var snapshot = snapshots.First();
        Assert.Equal(_testObjects.TestUser1Holding1.Id, snapshot.HoldingId);
        Assert.Equal(_testObjects.TestHoldingSnapshotHolding1User1A.Date, snapshot.Date);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenHoldingIdIsEmpty()
    {
        HoldingSnapshot newHoldingSnapshot = new()
        {
            Balance = 124,
            Date = new DateOnly(2025, 12, 12),
            HoldingId = Guid.Empty
        };

        var result = await _controller.Create(newHoldingSnapshot);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("HoldingId is required.", badRequestResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenHoldingDoesNotExistForUser()
    {
        HoldingSnapshot newHoldingSnapshot = new()
        {
            Balance = 124,
            Date = new DateOnly(2025, 12, 12),
            HoldingId = _testObjects.TestUser2Holding1.Id
        };

        var result = await _controller.Create(newHoldingSnapshot);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Invalid or unauthorized HoldingId.", badRequestResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsCreatedAtAction_WhenHoldingSnapshotIsValid()
    {
        HoldingSnapshot newHoldingSnapshot = new()
        {
            Balance = 124,
            Date = new DateOnly(2025, 12, 12),
            HoldingId = _testObjects.TestUser1Holding1.Id
        };

        var result = await _controller.Create(newHoldingSnapshot);

        var createdAtActionResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(newHoldingSnapshot, createdAtActionResult.Value);
    }

    [Fact]
    public async Task Update_ReturnsNotFound_WhenHoldingDoesNotExist()
    {
        HoldingSnapshot updatedHoldingSnapshot = new()
        {
            Balance = 124,
            Date = new DateOnly(2025, 12, 12),
            HoldingId = _testObjects.TestUser1Holding1.Id
        };
        var result = await _controller.Update(Guid.NewGuid(), updatedHoldingSnapshot);
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Update_ReturnsBadRequest_WhenValidationFails()
    {
        HoldingSnapshot updatedHoldingSnapshot = new()
        {
            Balance = 124,
            Date = new DateOnly(2025, 12, 12),
            HoldingId = Guid.Empty
        };
        HoldingSnapshot? snapshotToUpdate = _context.HoldingSnapshots.FirstOrDefault(snapshot => snapshot.UserId == _user1Id);
        var result = await _controller.Update(snapshotToUpdate!.Id, updatedHoldingSnapshot);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("HoldingId is required.", badRequestResult.Value);
    }

    [Fact]
    public async Task Update_ReturnsOk_WhenHoldingIsUpdatedSuccessfully()
    {
        HoldingSnapshot updatedHoldingSnapshot = new()
        {
            Balance = 124,
            Date = new DateOnly(2025, 12, 12),
            HoldingId = _testObjects.TestUser1Holding1.Id
        };
        HoldingSnapshot? snapshotToUpdate = _context.HoldingSnapshots.FirstOrDefault(snapshot => snapshot.UserId == _user1Id);
        var result = await _controller.Update(snapshotToUpdate!.Id, updatedHoldingSnapshot);

        OkObjectResult okResult = Assert.IsType<OkObjectResult>(result);
        HoldingSnapshot returnedHolding = Assert.IsType<HoldingSnapshot>(okResult.Value);

        Assert.Equal(updatedHoldingSnapshot.Balance, returnedHolding.Balance);
        Assert.Equal(updatedHoldingSnapshot.Date, returnedHolding.Date);
        Assert.Equal(updatedHoldingSnapshot.HoldingId, returnedHolding.HoldingId);
    }

    [Fact]
    public async Task Delete_ReturnsNotFound_WhenHoldingSnapshotDoesNotExist()
    {
        var holdingId = Guid.NewGuid();
        var result = await _controller.Delete(holdingId);
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Delete_ReturnsNoContent_WhenHoldingSnapshotIsDeletedSuccessfully()
    {
        HoldingSnapshot newSnapshotToDelete = new()
        {
            Balance = 124,
            Date = new DateOnly(2025, 12, 12),
            HoldingId = _testObjects.TestUser1Holding1.Id,
            UserId = _user1Id
        };
        _context.HoldingSnapshots.Add(newSnapshotToDelete);
        await _context.SaveChangesAsync();
        var result = await _controller.Delete(newSnapshotToDelete.Id);
        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task Delete_DoesNotAllowDeletingOthersHoldingSnapshots()
    {
        HoldingSnapshot? otherUserSnapshot = _context.HoldingSnapshots.FirstOrDefault(snapshot => snapshot.UserId == _user2Id);
        IActionResult result = await _controller.Delete(otherUserSnapshot!.Id);
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
        HoldingSnapshot? userSnapshot = _context.HoldingSnapshots.FirstOrDefault(snapshot => snapshot.UserId == _user1Id);
        IActionResult result = action switch
        {
            "Get" => await _controller.Get(),
            "Create" => await _controller.Create(userSnapshot!),
            "Update" => await _controller.Update(userSnapshot!.Id, userSnapshot),
            "Delete" => await _controller.Delete(userSnapshot!.Id),
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
        HoldingSnapshot newOrUpdatedSnapshot = new()
        {
            Balance = 124,
            Date = new DateOnly(2025, 12, 12),
            HoldingId = _testObjects.TestUser1Holding1.Id
        };
        HoldingSnapshot? userHoldingSnapshots = _context.HoldingSnapshots.FirstOrDefault(snapshot => snapshot.UserId == _user1Id);
        IActionResult result = action switch
        {
            "Create" => await _controller.Create(newOrUpdatedSnapshot),
            "Update" => await _controller.Update(userHoldingSnapshots!.Id, newOrUpdatedSnapshot),
            _ => throw new ArgumentOutOfRangeException(nameof(action), action, "Unsupported action")
        };
        if (action == "Create")
        {
            var createdAtActionResult = Assert.IsType<ObjectResult>(result);
            HoldingSnapshot? snapshot = Assert.IsType<HoldingSnapshot>(createdAtActionResult.Value);
            Assert.NotEqual(DateTime.MinValue, snapshot?.CreatedAt);
            Assert.Equal(DateTime.MinValue, snapshot?.UpdatedAt);
        }
        if (action == "Update")
        {
            var okResult = Assert.IsType<OkObjectResult>(result);
            HoldingSnapshot? snapshot = Assert.IsType<HoldingSnapshot>(okResult.Value);
            Assert.NotEqual(DateTime.MinValue, snapshot.CreatedAt);
            Assert.NotEqual(DateTime.MinValue, snapshot.UpdatedAt);
            Assert.True(snapshot.UpdatedAt > snapshot.CreatedAt);
            Assert.True(snapshot.UpdatedAt > DateTime.UtcNow.AddMinutes(-1));
        }
    }

    // Import test helper methods
    private async Task<ImportResponse> ExecuteImportAndGetResponse(List<HoldingSnapshotImport> snapshotsToImport)
    {
        var result = await _controller.Import(snapshotsToImport);
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
            Assert.Contains($"Successfully imported {expectedImportedCount} snapshots", response.Message);
        }
        else
        {
            Assert.Contains($"Imported {expectedImportedCount} snapshots with {expectedErrorCount} errors", response.Message);
        }
        return Task.CompletedTask;
    }

    private async Task<List<HoldingSnapshot>> GetSavedSnapshotsForImport(List<HoldingSnapshotImport> snapshotsToImport)
    {
        var userSnapshots = await _context.HoldingSnapshots
            .Where(s => s.UserId == _user1Id)
            .Include(s => s.Holding)
            .ToListAsync();
        
        return userSnapshots
            .Where(s => snapshotsToImport.Any(si => si.HoldingName == s.Holding!.Name && si.Date == s.Date))
            .ToList();
    }

    private async Task ValidateSavedSnapshots(List<HoldingSnapshotImport> snapshotsToImport, int expectedCount)
    {
        var savedSnapshots = await GetSavedSnapshotsForImport(snapshotsToImport);
        Assert.Equal(expectedCount, savedSnapshots.Count);
    }

    private async Task ValidateBadRequestForImport(List<HoldingSnapshotImport>? snapshots, string expectedMessage)
    {
        var result = await _controller.Import(snapshots!);
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(expectedMessage, badRequestResult.Value);
    }

    [Fact]
    public async Task Import_SuccessfullyImportsValidSnapshots()
    {
        var snapshotsToImport = new List<HoldingSnapshotImport>
        {
            new() { 
                HoldingName = _testObjects.TestUser1Holding1.Name, 
                Date = new DateOnly(2025, 1, 15), 
                BalanceInCents = 150000,
                HoldingCategoryName = _testObjects.DefaultCategory.Name,
                HoldingType = _testObjects.TestUser1Holding1.Type
            },
            new() { 
                HoldingName = _testObjects.TestUser1Holding2.Name, 
                Date = new DateOnly(2025, 1, 15), 
                BalanceInCents = 250000,
                HoldingCategoryName = _testObjects.TestUser1Category.Name,
                HoldingType = _testObjects.TestUser1Holding2.Type
            },
            new() { 
                HoldingName = _testObjects.TestUser1Holding1.Name, 
                Date = new DateOnly(2025, 1, 20), 
                BalanceInCents = 160000,
                HoldingCategoryName = _testObjects.DefaultCategory.Name,
                HoldingType = _testObjects.TestUser1Holding1.Type
            }
        };
        
        var response = await ExecuteImportAndGetResponse(snapshotsToImport);
        await ValidateImportResponse(response, 3, 0, true);
        await ValidateSavedSnapshots(snapshotsToImport, 3);
    }

    [Fact]
    public async Task Import_ReturnsBadRequestWhenNoSnapshotsProvided()
    {
        await ValidateBadRequestForImport(null, "No snapshots provided for import.");
    }

    [Fact]
    public async Task Import_ReturnsBadRequestWhenEmptyListProvided()
    {
        await ValidateBadRequestForImport(new List<HoldingSnapshotImport>(), "No snapshots provided for import.");
    }

    [Fact]
    public async Task Import_ReturnsBadRequestWhenTooManySnapshotsProvided()
    {
        var snapshots = new List<HoldingSnapshotImport>();
        for (int i = 0; i < 101; i++)
            snapshots.Add(new() { 
                HoldingName = _testObjects.TestUser1Holding1.Name, 
                Date = new DateOnly(2025, 1, 1).AddDays(i), 
                BalanceInCents = 100000,
                HoldingCategoryName = _testObjects.DefaultCategory.Name,
                HoldingType = _testObjects.TestUser1Holding1.Type
            });
        
        var result = await _controller.Import(snapshots);
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Contains("Cannot import more than 100 snapshots at once", $"{badRequestResult.Value}");
    }

    [Fact]
    public async Task Import_SkipsSnapshotsWithEmptyHoldingNames()
    {
        var snapshotsToImport = new List<HoldingSnapshotImport>
        {
            new() { 
                HoldingName = _testObjects.TestUser1Holding1.Name, 
                Date = new DateOnly(2025, 1, 15), 
                BalanceInCents = 150000,
                HoldingCategoryName = _testObjects.DefaultCategory.Name,
                HoldingType = _testObjects.TestUser1Holding1.Type
            },
            new() { 
                HoldingName = "", 
                Date = new DateOnly(2025, 1, 15), 
                BalanceInCents = 150000,
                HoldingCategoryName = _testObjects.DefaultCategory.Name,
                HoldingType = _testObjects.TestUser1Holding1.Type
            },
            new() { 
                HoldingName = "   ", 
                Date = new DateOnly(2025, 1, 15), 
                BalanceInCents = 150000,
                HoldingCategoryName = _testObjects.DefaultCategory.Name,
                HoldingType = _testObjects.TestUser1Holding1.Type
            },
            new() { 
                HoldingName = _testObjects.TestUser1Holding2.Name, 
                Date = new DateOnly(2025, 1, 15), 
                BalanceInCents = 250000,
                HoldingCategoryName = _testObjects.TestUser1Category.Name,
                HoldingType = _testObjects.TestUser1Holding2.Type
            }
        };
        
        var response = await ExecuteImportAndGetResponse(snapshotsToImport);
        await ValidateImportResponse(response, 2, 2, false);
        await ValidateSavedSnapshots(snapshotsToImport, 2);
    }

    [Fact]
    public async Task Import_SkipsSnapshotsWithNonExistentHoldings()
    {
        var snapshotsToImport = new List<HoldingSnapshotImport>
        {
            new() { 
                HoldingName = _testObjects.TestUser1Holding1.Name, 
                Date = new DateOnly(2025, 1, 15), 
                BalanceInCents = 150000,
                HoldingCategoryName = _testObjects.DefaultCategory.Name,
                HoldingType = _testObjects.TestUser1Holding1.Type
            },
            new() { 
                HoldingName = "NonExistentHolding", 
                Date = new DateOnly(2025, 1, 15), 
                BalanceInCents = 150000,
                HoldingCategoryName = _testObjects.DefaultCategory.Name,
                HoldingType = _testObjects.TestUser1Holding1.Type
            },
            new() { 
                HoldingName = _testObjects.TestUser1Holding2.Name, 
                Date = new DateOnly(2025, 1, 15), 
                BalanceInCents = 250000,
                HoldingCategoryName = _testObjects.TestUser1Category.Name,
                HoldingType = _testObjects.TestUser1Holding2.Type
            }
        };
        
        var response = await ExecuteImportAndGetResponse(snapshotsToImport);
        await ValidateImportResponse(response, 2, 1, false);
        await ValidateSavedSnapshots(snapshotsToImport, 2);
    }

    [Fact]
    public async Task Import_SkipsSnapshotsThatAlreadyExist()
    {
        var snapshotsToImport = new List<HoldingSnapshotImport>
        {
            new() { 
                HoldingName = _testObjects.TestUser1Holding1.Name, 
                Date = new DateOnly(2025, 1, 25), 
                BalanceInCents = 150000,
                HoldingCategoryName = _testObjects.DefaultCategory.Name,
                HoldingType = _testObjects.TestUser1Holding1.Type
            },
            new() { 
                HoldingName = _testObjects.TestUser1Holding1.Name, 
                Date = _testObjects.TestHoldingSnapshotHolding1User1A.Date, 
                BalanceInCents = 150000,
                HoldingCategoryName = _testObjects.DefaultCategory.Name,
                HoldingType = _testObjects.TestUser1Holding1.Type
            },
            new() { 
                HoldingName = _testObjects.TestUser1Holding2.Name, 
                Date = new DateOnly(2025, 1, 25), 
                BalanceInCents = 250000,
                HoldingCategoryName = _testObjects.TestUser1Category.Name,
                HoldingType = _testObjects.TestUser1Holding2.Type
            }
        };
        
        var response = await ExecuteImportAndGetResponse(snapshotsToImport);
        await ValidateImportResponse(response, 2, 1, false);
        await ValidateSavedSnapshots(snapshotsToImport, 3);
    }

    [Fact]
    public async Task Import_HandlesCaseInsensitiveHoldingNameConflicts()
    {
        var snapshotsToImport = new List<HoldingSnapshotImport>
        {
            new() { 
                HoldingName = _testObjects.TestUser1Holding1.Name, 
                Date = new DateOnly(2025, 1, 25), 
                BalanceInCents = 150000,
                HoldingCategoryName = _testObjects.DefaultCategory.Name,
                HoldingType = _testObjects.TestUser1Holding1.Type
            },
            new() { 
                HoldingName = _testObjects.TestUser1Holding1.Name.ToUpper(), 
                Date = _testObjects.TestHoldingSnapshotHolding1User1A.Date, 
                BalanceInCents = 150000,
                HoldingCategoryName = _testObjects.DefaultCategory.Name,
                HoldingType = _testObjects.TestUser1Holding1.Type
            },
            new() { 
                HoldingName = _testObjects.TestUser1Holding2.Name, 
                Date = new DateOnly(2025, 1, 25), 
                BalanceInCents = 250000,
                HoldingCategoryName = _testObjects.TestUser1Category.Name,
                HoldingType = _testObjects.TestUser1Holding2.Type
            }
        };
        
        var response = await ExecuteImportAndGetResponse(snapshotsToImport);
        await ValidateImportResponse(response, 2, 1, false);
        await ValidateSavedSnapshots(snapshotsToImport, 2);
    }

    [Fact]
    public async Task Import_AllowsMultipleSnapshotsForSameHoldingOnDifferentDates()
    {
        var snapshotsToImport = new List<HoldingSnapshotImport>
        {
            new() { 
                HoldingName = _testObjects.TestUser1Holding1.Name, 
                Date = new DateOnly(2025, 1, 25), 
                BalanceInCents = 150000,
                HoldingCategoryName = _testObjects.DefaultCategory.Name,
                HoldingType = _testObjects.TestUser1Holding1.Type
            },
            new() { 
                HoldingName = _testObjects.TestUser1Holding1.Name, 
                Date = new DateOnly(2025, 1, 26), 
                BalanceInCents = 160000,
                HoldingCategoryName = _testObjects.DefaultCategory.Name,
                HoldingType = _testObjects.TestUser1Holding1.Type
            },
            new() { 
                HoldingName = _testObjects.TestUser1Holding1.Name, 
                Date = new DateOnly(2025, 1, 27), 
                BalanceInCents = 170000,
                HoldingCategoryName = _testObjects.DefaultCategory.Name,
                HoldingType = _testObjects.TestUser1Holding1.Type
            }
        };
        
        var response = await ExecuteImportAndGetResponse(snapshotsToImport);
        await ValidateImportResponse(response, 3, 0, true);
        await ValidateSavedSnapshots(snapshotsToImport, 3);
    }

    [Fact]
    public async Task Import_ProvidesDetailedResultsForEachSnapshot()
    {
        var snapshotsToImport = new List<HoldingSnapshotImport>
        {
            new() { 
                HoldingName = _testObjects.TestUser1Holding1.Name, 
                Date = new DateOnly(2025, 1, 25), 
                BalanceInCents = 150000,
                HoldingCategoryName = _testObjects.DefaultCategory.Name,
                HoldingType = _testObjects.TestUser1Holding1.Type
            },
            new() { 
                HoldingName = "", 
                Date = new DateOnly(2025, 1, 25), 
                BalanceInCents = 150000,
                HoldingCategoryName = _testObjects.DefaultCategory.Name,
                HoldingType = _testObjects.TestUser1Holding1.Type
            },
            new() { 
                HoldingName = "NonExistentHolding", 
                Date = new DateOnly(2025, 1, 25), 
                BalanceInCents = 150000,
                HoldingCategoryName = _testObjects.DefaultCategory.Name,
                HoldingType = _testObjects.TestUser1Holding1.Type
            }
        };
        
        var response = await ExecuteImportAndGetResponse(snapshotsToImport);
        var results = response.Results as List<ImportResult>;
        Assert.Equal(3, results.Count);
        
        var successResult = results.First(r => r.Success);
        Assert.Contains(_testObjects.TestUser1Holding1.Name, successResult.Message);
        Assert.Contains("imported successfully", successResult.Message);
        
        var emptyNameResult = results.First(r => !r.Success && r.Message.Contains("cannot be empty"));
        Assert.Equal(2, emptyNameResult.Row);
        
        var notFoundResult = results.First(r => !r.Success && r.Message.Contains("not found"));
        Assert.Equal(3, notFoundResult.Row);
    }

    [Fact]
    public async Task Import_UnauthorizedUserCannotImport()
    {
        SetUserUnauthorized();
        var snapshotsToImport = new List<HoldingSnapshotImport>
        {
            new() { 
                HoldingName = _testObjects.TestUser1Holding1.Name, 
                Date = new DateOnly(2025, 1, 25), 
                BalanceInCents = 150000,
                HoldingCategoryName = _testObjects.DefaultCategory.Name,
                HoldingType = _testObjects.TestUser1Holding1.Type
            }
        };
        
        var result = await _controller.Import(snapshotsToImport);
        Assert.IsType<UnauthorizedResult>(result);
        
        var savedSnapshots = await GetSavedSnapshotsForImport(snapshotsToImport);
        Assert.Empty(savedSnapshots);
        
        SetupUserContext(_user1Id);
    }

    [Fact]
    public async Task Import_HandlesMixedValidAndInvalidSnapshots()
    {
        var snapshotsToImport = new List<HoldingSnapshotImport>
        {
            new() { 
                HoldingName = _testObjects.TestUser1Holding1.Name, 
                Date = new DateOnly(2025, 1, 25), 
                BalanceInCents = 150000,
                HoldingCategoryName = _testObjects.DefaultCategory.Name,
                HoldingType = _testObjects.TestUser1Holding1.Type
            },
            new() { 
                HoldingName = "", 
                Date = new DateOnly(2025, 1, 25), 
                BalanceInCents = 150000,
                HoldingCategoryName = _testObjects.DefaultCategory.Name,
                HoldingType = _testObjects.TestUser1Holding1.Type
            },
            new() { 
                HoldingName = "NonExistentHolding", 
                Date = new DateOnly(2025, 1, 25), 
                BalanceInCents = 150000,
                HoldingCategoryName = _testObjects.DefaultCategory.Name,
                HoldingType = _testObjects.TestUser1Holding1.Type
            },
            new() { 
                HoldingName = _testObjects.TestUser1Holding2.Name, 
                Date = new DateOnly(2025, 1, 25), 
                BalanceInCents = 250000,
                HoldingCategoryName = _testObjects.TestUser1Category.Name,
                HoldingType = _testObjects.TestUser1Holding2.Type
            },
            new() { 
                HoldingName = "   ", 
                Date = new DateOnly(2025, 1, 25), 
                BalanceInCents = 150000,
                HoldingCategoryName = _testObjects.DefaultCategory.Name,
                HoldingType = _testObjects.TestUser1Holding1.Type
            },
            new() { 
                HoldingName = _testObjects.TestUser1Holding1.Name, 
                Date = new DateOnly(2025, 1, 26), 
                BalanceInCents = 160000,
                HoldingCategoryName = _testObjects.DefaultCategory.Name,
                HoldingType = _testObjects.TestUser1Holding1.Type
            }
        };
        
        var response = await ExecuteImportAndGetResponse(snapshotsToImport);
        await ValidateImportResponse(response, 3, 3, false);
        await ValidateSavedSnapshots(snapshotsToImport, 3);
    }

    [Fact]
    public async Task Import_DoesNotSaveAnySnapshotsWhenAllAreInvalid()
    {
        var snapshotsToImport = new List<HoldingSnapshotImport>
        {
            new() { 
                HoldingName = "", 
                Date = new DateOnly(2025, 1, 25), 
                BalanceInCents = 150000,
                HoldingCategoryName = _testObjects.DefaultCategory.Name,
                HoldingType = _testObjects.TestUser1Holding1.Type
            },
            new() { 
                HoldingName = "NonExistentHolding", 
                Date = new DateOnly(2025, 1, 25), 
                BalanceInCents = 150000,
                HoldingCategoryName = _testObjects.DefaultCategory.Name,
                HoldingType = _testObjects.TestUser1Holding1.Type
            },
            new() { 
                HoldingName = "   ", 
                Date = new DateOnly(2025, 1, 25), 
                BalanceInCents = 150000,
                HoldingCategoryName = _testObjects.DefaultCategory.Name,
                HoldingType = _testObjects.TestUser1Holding1.Type
            }
        };
        
        var response = await ExecuteImportAndGetResponse(snapshotsToImport);
        await ValidateImportResponse(response, 0, 3, false);
        await ValidateSavedSnapshots(snapshotsToImport, 0);
    }
}
