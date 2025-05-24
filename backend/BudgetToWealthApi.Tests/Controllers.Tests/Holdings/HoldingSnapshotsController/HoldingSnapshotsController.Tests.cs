using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage;

public class HoldingSnapshotsControllerTests : IDisposable
{
    private readonly string _user1Id = "auth0|user1";
    private readonly string _user2Id = "auth0|user2";
    private HoldingSnapshotsControllerTestObjects _testObjects;
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
        Assert.Contains(HoldingSnapshots, snapshot => snapshot.Balance  == _testObjects.TestHoldingSnapshotHolding1User1A.Balance);
        Assert.Equal(2, HoldingSnapshots.Count());
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

        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal(nameof(HoldingSnapshotsController.Get), createdAtActionResult.ActionName);
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
        };
        if (action == "Create")
        {
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
            HoldingSnapshot? snapshot = createdAtActionResult.Value as HoldingSnapshot;
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
}
