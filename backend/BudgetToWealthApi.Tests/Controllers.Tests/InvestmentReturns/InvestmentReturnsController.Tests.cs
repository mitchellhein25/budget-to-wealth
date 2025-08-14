using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

public class InvestmentReturnsControllerTests : IDisposable
{
    private readonly string _user1Id = "auth0|user1";
    private readonly string _user2Id = "auth0|user2";
    private InvestmentReturnsControllerTestObjects _testObjects = null!;
    private ApplicationDbContext _context;
    private InvestmentReturnsController _controller;
    private readonly IDbContextTransaction _transaction;

    public InvestmentReturnsControllerTests()
    {
        _context = DatabaseSetup.GetDbContext();
        _transaction = DatabaseSetup.GetTransaction(_context);
        _controller = new InvestmentReturnsController(_context);
        SetupTestData();
        SetupUserContext(_user1Id);
    }

    private void SetupTestData()
    {
        _testObjects = new(_context);
        _context.InvestmentReturns.Add(_testObjects.TestDefaultInvestmentReturn1);
        _context.InvestmentReturns.Add(_testObjects.TestUser2InvestmentReturn2);
        _context.InvestmentReturns.Add(_testObjects.TestUser1InvestmentReturn3);
        _context.InvestmentReturns.Add(_testObjects.TestUser2InvestmentReturn4);
        _context.InvestmentReturns.Add(_testObjects.TestDefaultManualInvestmentReturn1);
        _context.InvestmentReturns.Add(_testObjects.TestUser1ManualInvestmentReturn2);
        _context.InvestmentReturns.Add(_testObjects.TestUser2ManualInvestmentReturn3);
        _context.InvestmentReturns.Add(_testObjects.TestDefaultManualInvestmentReturn4);
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
    public async Task Get_QueryWithoutDateReturnsAllUserInvestmentReturns()
    {
        OkObjectResult? result = await _controller.Get(null, null) as OkObjectResult;
        IEnumerable<InvestmentReturn> investmentReturns = Assert.IsAssignableFrom<IEnumerable<InvestmentReturn>>(result!.Value);

        Assert.Contains(investmentReturns, ir => ir.TotalContributions == _testObjects.TestDefaultInvestmentReturn1.TotalContributions);
        Assert.Contains(investmentReturns, ir => ir.TotalContributions == _testObjects.TestUser1InvestmentReturn3.TotalContributions);
        Assert.Contains(investmentReturns, ir => ir.TotalContributions == _testObjects.TestDefaultManualInvestmentReturn1.TotalContributions);
        Assert.Contains(investmentReturns, ir => ir.TotalContributions == _testObjects.TestUser1ManualInvestmentReturn2.TotalContributions);
        Assert.Equal(4, investmentReturns.Count());
    }

    [Fact]
    public async Task Get_FilterByStartDate_ReturnsCorrectResults()
    {
        OkObjectResult? result = await _controller.Get(startDate: DateOnly.Parse("2023-04-01"), endDate: null) as OkObjectResult;
        IEnumerable<InvestmentReturn> investmentReturns = Assert.IsAssignableFrom<IEnumerable<InvestmentReturn>>(result!.Value);

        Assert.Contains(investmentReturns, ir => ir.TotalContributions == _testObjects.TestDefaultInvestmentReturn1.TotalContributions);
        Assert.Contains(investmentReturns, ir => ir.TotalContributions == _testObjects.TestUser1InvestmentReturn3.TotalContributions);
        Assert.Contains(investmentReturns, ir => ir.TotalContributions == _testObjects.TestDefaultManualInvestmentReturn1.TotalContributions);
        Assert.True(investmentReturns.Count() >= 3);
    }

    [Fact]
    public async Task Get_FilterByEndDate_ReturnsCorrectResults()
    {
        OkObjectResult? result = await _controller.Get(startDate: null, endDate: DateOnly.Parse("2023-04-30")) as OkObjectResult;
        IEnumerable<InvestmentReturn> investmentReturns = Assert.IsAssignableFrom<IEnumerable<InvestmentReturn>>(result!.Value);

        Assert.Contains(investmentReturns, ir => ir.TotalContributions == _testObjects.TestDefaultInvestmentReturn1.TotalContributions);
        Assert.Contains(investmentReturns, ir => ir.TotalContributions == _testObjects.TestUser1InvestmentReturn3.TotalContributions);
        Assert.Contains(investmentReturns, ir => ir.TotalContributions == _testObjects.TestDefaultManualInvestmentReturn1.TotalContributions);
        Assert.True(investmentReturns.Count() >= 3);
    }

    [Fact]
    public async Task Get_FilterByStartAndEndDate_ReturnsCorrectResults()
    {
        OkObjectResult? result = await _controller.Get(startDate: DateOnly.Parse("2023-04-01"), endDate: DateOnly.Parse("2023-04-30")) as OkObjectResult;
        IEnumerable<InvestmentReturn> investmentReturns = Assert.IsAssignableFrom<IEnumerable<InvestmentReturn>>(result!.Value);

        Assert.Contains(investmentReturns, ir => ir.TotalContributions == _testObjects.TestDefaultInvestmentReturn1.TotalContributions);
        Assert.Contains(investmentReturns, ir => ir.TotalContributions == _testObjects.TestUser1InvestmentReturn3.TotalContributions);
        Assert.Contains(investmentReturns, ir => ir.TotalContributions == _testObjects.TestDefaultManualInvestmentReturn1.TotalContributions);
        Assert.True(investmentReturns.Count() >= 3);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenTotalContributionsIsNegative()
    {
        InvestmentReturn newInvestmentReturn = new()
        {
            TotalContributions = -1000,
            TotalWithdrawals = 0,
            ManualInvestmentCategoryId = _testObjects.TestUser1ManualCategory.Id,
            ManualInvestmentStartDate = DateOnly.Parse("2023-08-01"),
            ManualInvestmentEndDate = DateOnly.Parse("2023-08-31"),
            ManualInvestmentPercentageReturn = 0.10m
        };

        var result = await _controller.Create(newInvestmentReturn);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("TotalContributions must be positive.", badRequestResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenTotalWithdrawalsIsNegative()
    {
        InvestmentReturn newInvestmentReturn = new()
        {
            TotalContributions = 1000,
            TotalWithdrawals = -100,
            ManualInvestmentCategoryId = _testObjects.TestUser1ManualCategory.Id,
            ManualInvestmentStartDate = DateOnly.Parse("2023-08-01"),
            ManualInvestmentEndDate = DateOnly.Parse("2023-08-31"),
            ManualInvestmentPercentageReturn = 0.10m
        };

        var result = await _controller.Create(newInvestmentReturn);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("TotalWithdrawals must be positive.", badRequestResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenManualInvestmentCategoryDoesNotExist()
    {
        InvestmentReturn newInvestmentReturn = new()
        {
            TotalContributions = 1000,
            TotalWithdrawals = 0,
            ManualInvestmentCategoryId = Guid.NewGuid(),
            ManualInvestmentStartDate = DateOnly.Parse("2023-08-01"),
            ManualInvestmentEndDate = DateOnly.Parse("2023-08-31"),
            ManualInvestmentPercentageReturn = 0.10m
        };

        var result = await _controller.Create(newInvestmentReturn);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Invalid or unauthorized ManualInvestmentCategoryId.", badRequestResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenManualInvestmentStartDateIsNull()
    {
        InvestmentReturn newInvestmentReturn = new()
        {
            TotalContributions = 1000,
            TotalWithdrawals = 0,
            ManualInvestmentCategoryId = _testObjects.TestUser1ManualCategory.Id,
            ManualInvestmentStartDate = null,
            ManualInvestmentEndDate = DateOnly.Parse("2023-08-31"),
            ManualInvestmentPercentageReturn = 0.10m
        };

        var result = await _controller.Create(newInvestmentReturn);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("ManualInvestmentStartDate is required for manual investment.", badRequestResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenManualInvestmentEndDateIsNull()
    {
        InvestmentReturn newInvestmentReturn = new()
        {
            TotalContributions = 1000,
            TotalWithdrawals = 0,
            ManualInvestmentCategoryId = _testObjects.TestUser1ManualCategory.Id,
            ManualInvestmentStartDate = DateOnly.Parse("2023-08-01"),
            ManualInvestmentEndDate = null,
            ManualInvestmentPercentageReturn = 0.10m
        };

        var result = await _controller.Create(newInvestmentReturn);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("ManualInvestmentEndDate is required for manual investment.", badRequestResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenManualInvestmentPercentageReturnIsNull()
    {
        InvestmentReturn newInvestmentReturn = new()
        {
            TotalContributions = 1000,
            TotalWithdrawals = 0,
            ManualInvestmentCategoryId = _testObjects.TestUser1ManualCategory.Id,
            ManualInvestmentStartDate = DateOnly.Parse("2023-08-01"),
            ManualInvestmentEndDate = DateOnly.Parse("2023-08-31"),
            ManualInvestmentPercentageReturn = null
        };

        var result = await _controller.Create(newInvestmentReturn);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("ManualInvestmentPercentageReturn is required for manual investment.", badRequestResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenManualInvestmentStartDateIsAfterEndDate()
    {
        InvestmentReturn newInvestmentReturn = new()
        {
            TotalContributions = 1000,
            TotalWithdrawals = 0,
            ManualInvestmentCategoryId = _testObjects.TestUser1ManualCategory.Id,
            ManualInvestmentStartDate = DateOnly.Parse("2023-08-31"),
            ManualInvestmentEndDate = DateOnly.Parse("2023-08-01"),
            ManualInvestmentPercentageReturn = 0.10m
        };

        var result = await _controller.Create(newInvestmentReturn);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("ManualInvestmentStartDate must be before ManualInvestmentEndDate.", badRequestResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenStartHoldingSnapshotDoesNotExist()
    {
        InvestmentReturn newInvestmentReturn = new()
        {
            TotalContributions = 1000,
            TotalWithdrawals = 0,
            StartHoldingSnapshotId = Guid.NewGuid(),
            EndHoldingSnapshotId = _testObjects.TestUser1EndSnapshot.Id
        };

        var result = await _controller.Create(newInvestmentReturn);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Invalid or unauthorized StartHoldingSnapshotId.", badRequestResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenEndHoldingSnapshotDoesNotExist()
    {
        InvestmentReturn newInvestmentReturn = new()
        {
            TotalContributions = 1000,
            TotalWithdrawals = 0,
            StartHoldingSnapshotId = _testObjects.TestUser1StartSnapshot.Id,
            EndHoldingSnapshotId = Guid.NewGuid()
        };

        var result = await _controller.Create(newInvestmentReturn);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Invalid or unauthorized EndSnapshotId.", badRequestResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenStartAndEndHoldingSnapshotsAreForDifferentHoldings()
    {
        InvestmentReturn newInvestmentReturn = new()
        {
            TotalContributions = 1000,
            TotalWithdrawals = 0,
            StartHoldingSnapshotId = _testObjects.TestUser1StartSnapshot.Id,
            EndHoldingSnapshotId = _testObjects.TestUser1SecondEndSnapshot.Id
        };

        var result = await _controller.Create(newInvestmentReturn);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("StartHoldingSnapshotId and EndHoldingSnapshotId must be for the same Holding.", badRequestResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenStartHoldingSnapshotDateIsAfterEndDate()
    {
        InvestmentReturn newInvestmentReturn = new()
        {
            TotalContributions = 1000,
            TotalWithdrawals = 0,
            StartHoldingSnapshotId = _testObjects.TestUser1EndSnapshot.Id,
            EndHoldingSnapshotId = _testObjects.TestUser1StartSnapshot.Id
        };

        var result = await _controller.Create(newInvestmentReturn);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("StartHoldingSnapshotId must be before EndHoldingSnapshotId.", badRequestResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsCreatedAtAction_WhenManualInvestmentIsValid()
    {
        InvestmentReturn newInvestmentReturn = new()
        {
            TotalContributions = 1000,
            TotalWithdrawals = 0,
            ManualInvestmentCategoryId = _testObjects.TestUser1ManualCategory.Id,
            ManualInvestmentStartDate = DateOnly.Parse("2023-08-01"),
            ManualInvestmentEndDate = DateOnly.Parse("2023-08-31"),
            ManualInvestmentPercentageReturn = 0.10m
        };

        var result = await _controller.Create(newInvestmentReturn);

        var createdAtActionResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(StatusCodes.Status201Created, createdAtActionResult.StatusCode);
        Assert.Equal(newInvestmentReturn, createdAtActionResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsCreatedAtAction_WhenHoldingSnapshotInvestmentIsValid()
    {
        InvestmentReturn newInvestmentReturn = new()
        {
            TotalContributions = 1000,
            TotalWithdrawals = 0,
            StartHoldingSnapshotId = _testObjects.TestUser1StartSnapshot.Id,
            EndHoldingSnapshotId = _testObjects.TestUser1EndSnapshot.Id
        };

        var result = await _controller.Create(newInvestmentReturn);

        var createdAtActionResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(StatusCodes.Status201Created, createdAtActionResult.StatusCode);
        Assert.Equal(newInvestmentReturn, createdAtActionResult.Value);
    }

    [Fact]
    public async Task Update_ReturnsNotFound_WhenInvestmentReturnDoesNotExist()
    {
        InvestmentReturn updatedInvestmentReturn = new()
        {
            TotalContributions = 1000,
            TotalWithdrawals = 0,
            ManualInvestmentCategoryId = _testObjects.TestUser1ManualCategory.Id,
            ManualInvestmentStartDate = DateOnly.Parse("2023-08-01"),
            ManualInvestmentEndDate = DateOnly.Parse("2023-08-31"),
            ManualInvestmentPercentageReturn = 0.10m
        };

        var result = await _controller.Update(Guid.NewGuid(), updatedInvestmentReturn);
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Update_ReturnsBadRequest_WhenValidationFails()
    {
        InvestmentReturn updatedInvestmentReturn = new()
        {
            TotalContributions = -1000,
            TotalWithdrawals = 0,
            ManualInvestmentCategoryId = _testObjects.TestUser1ManualCategory.Id,
            ManualInvestmentStartDate = DateOnly.Parse("2023-08-01"),
            ManualInvestmentEndDate = DateOnly.Parse("2023-08-31"),
            ManualInvestmentPercentageReturn = 0.10m
        };

        InvestmentReturn? investmentReturnToUpdate = _context.InvestmentReturns.FirstOrDefault(ir => ir.UserId == _user1Id);
        var result = await _controller.Update(investmentReturnToUpdate!.Id, updatedInvestmentReturn);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("TotalContributions must be positive.", badRequestResult.Value);
    }

    [Fact]
    public async Task Update_ReturnsOk_WhenInvestmentReturnIsUpdatedSuccessfully()
    {
        InvestmentReturn updatedInvestmentReturn = new()
        {
            TotalContributions = 2000,
            TotalWithdrawals = 100,
            ManualInvestmentCategoryId = _testObjects.TestUser1ManualCategory.Id,
            ManualInvestmentStartDate = DateOnly.Parse("2023-09-01"),
            ManualInvestmentEndDate = DateOnly.Parse("2023-09-30"),
            ManualInvestmentPercentageReturn = 0.15m,
            RecurrenceFrequency = RecurrenceFrequency.Monthly,
            RecurrenceEndDate = DateOnly.Parse("2024-09-30")
        };

        InvestmentReturn? investmentReturnToUpdate = _context.InvestmentReturns.FirstOrDefault(ir => ir.UserId == _user1Id);
        var result = await _controller.Update(investmentReturnToUpdate!.Id, updatedInvestmentReturn);

        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedInvestmentReturn = Assert.IsType<InvestmentReturn>(okResult.Value);

        Assert.Equal(updatedInvestmentReturn.TotalContributions, returnedInvestmentReturn.TotalContributions);
        Assert.Equal(updatedInvestmentReturn.TotalWithdrawals, returnedInvestmentReturn.TotalWithdrawals);
        Assert.Equal(updatedInvestmentReturn.ManualInvestmentCategoryId, returnedInvestmentReturn.ManualInvestmentCategoryId);
        Assert.Equal(updatedInvestmentReturn.ManualInvestmentStartDate, returnedInvestmentReturn.ManualInvestmentStartDate);
        Assert.Equal(updatedInvestmentReturn.ManualInvestmentEndDate, returnedInvestmentReturn.ManualInvestmentEndDate);
        Assert.Equal(updatedInvestmentReturn.ManualInvestmentPercentageReturn, returnedInvestmentReturn.ManualInvestmentPercentageReturn);
        Assert.Equal(updatedInvestmentReturn.RecurrenceFrequency, returnedInvestmentReturn.RecurrenceFrequency);
        Assert.Equal(updatedInvestmentReturn.RecurrenceEndDate, returnedInvestmentReturn.RecurrenceEndDate);
    }

    [Fact]
    public async Task Delete_ReturnsNotFound_WhenInvestmentReturnDoesNotExist()
    {
        var investmentReturnId = Guid.NewGuid();
        var result = await _controller.Delete(investmentReturnId);
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Delete_ReturnsNoContent_WhenInvestmentReturnIsDeletedSuccessfully()
    {
        InvestmentReturn newInvestmentReturnToDelete = new()
        {
            TotalContributions = 1000,
            TotalWithdrawals = 0,
            ManualInvestmentCategoryId = _testObjects.TestUser1ManualCategory.Id,
            ManualInvestmentStartDate = DateOnly.Parse("2023-08-01"),
            ManualInvestmentEndDate = DateOnly.Parse("2023-08-31"),
            ManualInvestmentPercentageReturn = 0.10m,
            UserId = _user1Id
        };

        _context.InvestmentReturns.Add(newInvestmentReturnToDelete);
        await _context.SaveChangesAsync();
        var result = await _controller.Delete(newInvestmentReturnToDelete.Id);
        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task Delete_DoesNotAllowDeletingOthersInvestmentReturns()
    {
        InvestmentReturn? otherUserInvestmentReturn = _context.InvestmentReturns.FirstOrDefault(ir => ir.UserId == _user2Id);
        IActionResult result = await _controller.Delete(otherUserInvestmentReturn!.Id);
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
        InvestmentReturn? userInvestmentReturn = _context.InvestmentReturns.FirstOrDefault(ir => ir.UserId == _user1Id);
        IActionResult result = action switch
        {
            "Get" => await _controller.Get(null, null),
            "Create" => await _controller.Create(userInvestmentReturn!),
            "Update" => await _controller.Update(userInvestmentReturn!.Id, userInvestmentReturn),
            "Delete" => await _controller.Delete(userInvestmentReturn!.Id),
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
        InvestmentReturn updatedInvestmentReturn = new()
        {
            TotalContributions = 1000,
            TotalWithdrawals = 0,
            ManualInvestmentCategoryId = _testObjects.TestUser1ManualCategory.Id,
            ManualInvestmentStartDate = DateOnly.Parse("2023-08-01"),
            ManualInvestmentEndDate = DateOnly.Parse("2023-08-31"),
            ManualInvestmentPercentageReturn = 0.10m
        };

        InvestmentReturn? userInvestmentReturn = _context.InvestmentReturns.FirstOrDefault(ir => ir.UserId == _user1Id);
        IActionResult result = action switch
        {
            "Create" => await _controller.Create(updatedInvestmentReturn),
            "Update" => await _controller.Update(userInvestmentReturn!.Id, updatedInvestmentReturn),
            _ => throw new ArgumentOutOfRangeException(nameof(action), action, "Unsupported action")
        };

        if (action == "Create")
        {
            var createdAtActionResult = Assert.IsType<ObjectResult>(result);
            InvestmentReturn? investmentReturn = Assert.IsType<InvestmentReturn>(createdAtActionResult.Value);
            Assert.NotEqual(DateTime.MinValue, investmentReturn?.CreatedAt);
            Assert.Equal(DateTime.MinValue, investmentReturn?.UpdatedAt);
        }
        if (action == "Update")
        {
            var okResult = Assert.IsType<OkObjectResult>(result);
            InvestmentReturn? investmentReturn = Assert.IsType<InvestmentReturn>(okResult.Value);
            Assert.NotEqual(DateTime.MinValue, investmentReturn.CreatedAt);
            Assert.NotEqual(DateTime.MinValue, investmentReturn.UpdatedAt);
            Assert.True(investmentReturn.UpdatedAt > investmentReturn.CreatedAt);
            Assert.True(investmentReturn.UpdatedAt > DateTime.UtcNow.AddMinutes(-1));
        }
    }
}
