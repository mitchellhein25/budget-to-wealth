using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage;

public class NetWorthDashboardControllerTests : IDisposable
{
    private readonly string _user1Id = "auth0|user1";
    private NetWorthDashboardControllerTestObjects _testObjects;
    private ApplicationDbContext _context;
    private NetWorthDashboardController _controller;
    private readonly IDbContextTransaction _transaction;
    public NetWorthDashboardControllerTests()
    {
        _context = DatabaseSetup.GetDbContext();
        _transaction = DatabaseSetup.GetTransaction(_context);
        _controller = new NetWorthDashboardController(_context);
        SetupTestData();
        SetupUserContext(_user1Id);
    }

    private void SetupTestData()
    {
        _testObjects = new(_context);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotAsset1User1);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotAsset2User1);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotAsset3User1);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotAsset4User1);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotDebt1User1);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotDebt2User1);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotDebt3User1);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotDebt4User1);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotAsset1User2);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotDebt1User2);

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
        DateOnly startDate = new(2025, 5, 1);
        DateOnly endDate = new(2025, 5, 30);
        OkObjectResult? result = await _controller.Get(startDate, endDate) as OkObjectResult;
        NetWorthDashboard netWorthDashboard = Assert.IsAssignableFrom<NetWorthDashboard>(result!.Value);

        Assert.Equal(5, netWorthDashboard.Entries.Count());
        Assert.Equal(75000, netWorthDashboard.Entries.Aggregate((long)0, (acc, entry) => acc + entry.AssetValueInCents));
        Assert.Equal(47000, netWorthDashboard.Entries.Aggregate((long)0, (acc, entry) => acc + entry.DebtValueInCents));
        Assert.Equal(28000, netWorthDashboard.Entries.Aggregate((long)0, (acc, entry) => acc + entry.NetWorthInCents));
    }

    [Fact]
    public async Task UnauthorizedUser_CannotAccessEndpoints()
    {
        SetUserUnauthorized();
        HoldingSnapshot? userSnapshot = _context.HoldingSnapshots.FirstOrDefault(snapshot => snapshot.UserId == _user1Id);
        IActionResult result = await _controller.Get();
        Assert.IsType<UnauthorizedResult>(result);
        SetupUserContext(_user1Id);
    }
}