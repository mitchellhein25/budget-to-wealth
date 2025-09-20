using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

public class HoldingInvestmentReturnsControllerTests : IDisposable
{
    private readonly string _user1Id = "auth0|user1";
    private readonly string _user2Id = "auth0|user2";
    private HoldingInvestmentReturnsControllerTestObjects _testObjects = null!;
    private ApplicationDbContext _context;
    private HoldingInvestmentReturnsController _controller;
    private readonly IDbContextTransaction _transaction;

    public HoldingInvestmentReturnsControllerTests()
    {
        _context = DatabaseSetup.GetDbContext();
        _transaction = DatabaseSetup.GetTransaction(_context);
        _controller = new HoldingInvestmentReturnsController(_context);
        SetupTestData();
        SetupUserContext(_user1Id);
    }

    private void SetupTestData()
    {
        _testObjects = new(_context);
        _context.HoldingInvestmentReturns.Add(_testObjects.TestDefaultInvestmentReturn1);
        _context.HoldingInvestmentReturns.Add(_testObjects.TestUser2InvestmentReturn2);
        _context.HoldingInvestmentReturns.Add(_testObjects.TestUser1InvestmentReturn3);
        _context.HoldingInvestmentReturns.Add(_testObjects.TestUser1SecondInvestmentReturn4);
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
        IEnumerable<HoldingInvestmentReturn> investmentReturns = Assert.IsAssignableFrom<IEnumerable<HoldingInvestmentReturn>>(result!.Value);

        Assert.Contains(investmentReturns, ir => ir.TotalContributions == _testObjects.TestDefaultInvestmentReturn1.TotalContributions);
        Assert.Contains(investmentReturns, ir => ir.TotalContributions == _testObjects.TestUser1InvestmentReturn3.TotalContributions);
        Assert.Contains(investmentReturns, ir => ir.TotalContributions == _testObjects.TestUser1SecondInvestmentReturn4.TotalContributions);
        Assert.Equal(3, investmentReturns.Count());
    }

    [Fact]
    public async Task Get_FilterByStartDate_ReturnsCorrectResults()
    {
        OkObjectResult? result = await _controller.Get(startDate: DateOnly.Parse("2023-05-01"), endDate: null) as OkObjectResult;
        IEnumerable<HoldingInvestmentReturn> investmentReturns = Assert.IsAssignableFrom<IEnumerable<HoldingInvestmentReturn>>(result!.Value);

        Assert.Contains(investmentReturns, ir => ir.TotalContributions == _testObjects.TestUser1InvestmentReturn3.TotalContributions);
        Assert.Single(investmentReturns);
    }

    [Fact]
    public async Task Get_FilterByEndDate_ReturnsCorrectResults()
    {
        OkObjectResult? result = await _controller.Get(startDate: null, endDate: DateOnly.Parse("2023-04-30")) as OkObjectResult;
        IEnumerable<HoldingInvestmentReturn> investmentReturns = Assert.IsAssignableFrom<IEnumerable<HoldingInvestmentReturn>>(result!.Value);
        Assert.Contains(investmentReturns, ir => ir.TotalContributions == _testObjects.TestDefaultInvestmentReturn1.TotalContributions);
        Assert.Contains(investmentReturns, ir => ir.TotalContributions == _testObjects.TestUser1SecondInvestmentReturn4.TotalContributions);
        Assert.Equal(2, investmentReturns.Count());
    }

    [Fact]
    public async Task Get_FilterByStartAndEndDate_ReturnsCorrectResults()
    {
        OkObjectResult? result = await _controller.Get(startDate: DateOnly.Parse("2023-04-01"), endDate: DateOnly.Parse("2023-05-30")) as OkObjectResult;
        IEnumerable<HoldingInvestmentReturn> investmentReturns = Assert.IsAssignableFrom<IEnumerable<HoldingInvestmentReturn>>(result!.Value);

        Assert.Contains(investmentReturns, ir => ir.TotalContributions == _testObjects.TestDefaultInvestmentReturn1.TotalContributions);
        Assert.Contains(investmentReturns, ir => ir.TotalContributions == _testObjects.TestUser1InvestmentReturn3.TotalContributions);
        Assert.Contains(investmentReturns, ir => ir.TotalContributions == _testObjects.TestUser1SecondInvestmentReturn4.TotalContributions);
        Assert.Equal(3, investmentReturns.Count());
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenTotalContributionsIsNegative()
    {
        HoldingInvestmentReturn newInvestmentReturn = new()
        {
            TotalContributions = -1000,
            TotalWithdrawals = 0,
            StartHoldingSnapshotId = _testObjects.TestUser1StartSnapshot.Id,
            EndHoldingSnapshotId = _testObjects.TestUser1EndSnapshot.Id
        };

        var result = await _controller.Create(newInvestmentReturn);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("TotalContributions must be positive.", badRequestResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenTotalWithdrawalsIsNegative()
    {
        HoldingInvestmentReturn newInvestmentReturn = new()
        {
            TotalContributions = 1000,
            TotalWithdrawals = -100,
            StartHoldingSnapshotId = _testObjects.TestUser1StartSnapshot.Id,
            EndHoldingSnapshotId = _testObjects.TestUser1EndSnapshot.Id
        };

        var result = await _controller.Create(newInvestmentReturn);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("TotalWithdrawals must be positive.", badRequestResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenStartHoldingSnapshotDoesNotExist()
    {
        HoldingInvestmentReturn newInvestmentReturn = new()
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
        HoldingInvestmentReturn newInvestmentReturn = new()
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
        HoldingInvestmentReturn newInvestmentReturn = new()
        {
            TotalContributions = 1000,
            TotalWithdrawals = 0,
            StartHoldingSnapshotId = _testObjects.TestUser1StartSnapshot.Id,
            EndHoldingSnapshotId = _testObjects.TestUser1SecondEndSnapshot.Id
        };

        var result = await _controller.Create(newInvestmentReturn);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("StartHoldingId and EndHoldingId must be for the same Holding.", badRequestResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenStartHoldingSnapshotDateIsAfterEndDate()
    {
        HoldingInvestmentReturn newInvestmentReturn = new()
        {
            TotalContributions = 1000,
            TotalWithdrawals = 0,
            StartHoldingSnapshotId = _testObjects.TestUser1EndSnapshot.Id,
            EndHoldingSnapshotId = _testObjects.TestUser1StartSnapshot.Id
        };

        var result = await _controller.Create(newInvestmentReturn);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("StartHoldingSnapshotId date must be before EndHoldingSnapshotId.", badRequestResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsCreatedAtAction_WhenHoldingSnapshotInvestmentIsValid()
    {
        HoldingInvestmentReturn newInvestmentReturn = new()
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
    public async Task Update_ReturnsOk_WhenInvestmentReturnIsUpdatedSuccessfully()
    {
        HoldingInvestmentReturn updatedInvestmentReturn = new()
        {
            TotalContributions = 2000,
            TotalWithdrawals = 100,
            StartHoldingSnapshotId = _testObjects.TestUser1StartSnapshot.Id,
            EndHoldingSnapshotId = _testObjects.TestUser1EndSnapshot.Id
        };

        HoldingInvestmentReturn? investmentReturnToUpdate = _context.HoldingInvestmentReturns.FirstOrDefault(ir => ir.UserId == _user1Id);
        var result = await _controller.Update(investmentReturnToUpdate!.Id, updatedInvestmentReturn);

        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedInvestmentReturn = Assert.IsType<HoldingInvestmentReturn>(okResult.Value);

        Assert.Equal(updatedInvestmentReturn.TotalContributions, returnedInvestmentReturn.TotalContributions);
        Assert.Equal(updatedInvestmentReturn.TotalWithdrawals, returnedInvestmentReturn.TotalWithdrawals);
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
        HoldingInvestmentReturn newInvestmentReturnToDelete = new()
        {
            TotalContributions = 1000,
            TotalWithdrawals = 0,
            StartHoldingSnapshotId = _testObjects.TestUser1StartSnapshot.Id,
            EndHoldingSnapshotId = _testObjects.TestUser1EndSnapshot.Id,
            UserId = _user1Id
        };

        _context.HoldingInvestmentReturns.Add(newInvestmentReturnToDelete);
        await _context.SaveChangesAsync();
        var result = await _controller.Delete(newInvestmentReturnToDelete.Id);
        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task Delete_DoesNotAllowDeletingOthersInvestmentReturns()
    {
        HoldingInvestmentReturn? otherUserInvestmentReturn = _context.HoldingInvestmentReturns.FirstOrDefault(ir => ir.UserId == _user2Id);
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
        HoldingInvestmentReturn? userInvestmentReturn = _context.HoldingInvestmentReturns.FirstOrDefault(ir => ir.UserId == _user1Id);
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
        HoldingInvestmentReturn updatedInvestmentReturn = new()
        {
            TotalContributions = 1000,
            TotalWithdrawals = 0,
            StartHoldingSnapshotId = _testObjects.TestUser1StartSnapshot.Id,
            EndHoldingSnapshotId = _testObjects.TestUser1EndSnapshot.Id
        };

        HoldingInvestmentReturn? userInvestmentReturn = _context.HoldingInvestmentReturns.FirstOrDefault(ir => ir.UserId == _user1Id);
        IActionResult result = action switch
        {
            "Create" => await _controller.Create(updatedInvestmentReturn),
            "Update" => await _controller.Update(userInvestmentReturn!.Id, updatedInvestmentReturn),
            _ => throw new ArgumentOutOfRangeException(nameof(action), action, "Unsupported action")
        };

        if (action == "Create")
        {
            var createdAtActionResult = Assert.IsType<ObjectResult>(result);
            HoldingInvestmentReturn? investmentReturn = Assert.IsType<HoldingInvestmentReturn>(createdAtActionResult.Value);
            Assert.NotEqual(DateTime.MinValue, investmentReturn?.CreatedAt);
            Assert.Equal(DateTime.MinValue, investmentReturn?.UpdatedAt);
        }
        if (action == "Update")
        {
            var okResult = Assert.IsType<OkObjectResult>(result);
        HoldingInvestmentReturn? investmentReturn = Assert.IsType<HoldingInvestmentReturn>(okResult.Value);
            Assert.NotEqual(DateTime.MinValue, investmentReturn.CreatedAt);
            Assert.NotEqual(DateTime.MinValue, investmentReturn.UpdatedAt);
            Assert.True(investmentReturn.UpdatedAt > investmentReturn.CreatedAt);
            Assert.True(investmentReturn.UpdatedAt > DateTime.UtcNow.AddMinutes(-1));
        }
    }
}
