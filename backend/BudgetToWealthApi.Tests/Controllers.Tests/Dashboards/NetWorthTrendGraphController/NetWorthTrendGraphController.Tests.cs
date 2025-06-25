using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage;

public class NetWorthTrendGraphControllerTests : IDisposable
{
    private readonly string _user1Id = "auth0|user1";
    private NetWorthTrendGraphControllerTestObjects _testObjects;
    private ApplicationDbContext _context;
    private NetWorthTrendGraphController _controller;
    private readonly IDbContextTransaction _transaction;
    public NetWorthTrendGraphControllerTests()
    {
        _context = DatabaseSetup.GetDbContext();
        _transaction = DatabaseSetup.GetTransaction(_context);
        _controller = new NetWorthTrendGraphController(_context);
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
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotAsset1User1_2);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotAsset2User1_2);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotAsset3User1_2);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotAsset1User1_3);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotAsset2User1_3);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotAsset1User1_4);

        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotDebt1User1);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotDebt2User1);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotDebt3User1);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotDebt4User1);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotDebt1User1_2);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotDebt2User1_2);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotDebt3User1_2);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotDebt1User1_3);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotDebt2User1_3);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotDebt1User1_4);

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

    private void AssertNetWorthTrendGraphEntryValues(NetWorthTrendGraph netWorthTrendGraph, int index, long assetValueInCents, long debtValueInCents)
    {
        var entry = netWorthTrendGraph.Entries[index];
        Assert.Equal(assetValueInCents, entry.AssetValueInCents);
        Assert.Equal(debtValueInCents, entry.DebtValueInCents);
        Assert.Equal(assetValueInCents - debtValueInCents, entry.NetWorthInCents);
    }

    [Fact]
    public async Task Get_LargeDateRangeFiltering_ReturnsAllCorrectEntryValues()
    {
        DateOnly startDate = new(2022, 3, 1);
        DateOnly endDate = new(2025, 6, 30);
        OkObjectResult? result = await _controller.Get(startDate, endDate, IntervalType.Monthly) as OkObjectResult;
        NetWorthTrendGraph netWorthTrendGraph = Assert.IsAssignableFrom<NetWorthTrendGraph>(result!.Value);

        Assert.Equal(40, netWorthTrendGraph.Entries.Count());
    }

    [Fact]
    public async Task Get_WithNoDateRange_UsesAllAvailableData()
    {
        OkObjectResult? result = await _controller.Get() as OkObjectResult;
        NetWorthTrendGraph netWorthTrendGraph = Assert.IsAssignableFrom<NetWorthTrendGraph>(result!.Value);

        Assert.Equal(7, netWorthTrendGraph.Entries.Count());
    }
    
    [Fact]
    public async Task Get_WithPastDateRange_ReturnsEmptyDashboard()
    {
        DateOnly startDate = new(2010, 1, 1);
        DateOnly endDate = new(2010, 1, 31);
        OkObjectResult? result = await _controller.Get(startDate, endDate) as OkObjectResult;
        NetWorthTrendGraph netWorthTrendGraph = Assert.IsAssignableFrom<NetWorthTrendGraph>(result!.Value);

        Assert.Equal(endDate.DayNumber - startDate.DayNumber + 1, netWorthTrendGraph.Entries.Count());
        Assert.All(netWorthTrendGraph.Entries, entry => 
        {
            Assert.Equal(0, entry.AssetValueInCents);
            Assert.Equal(0, entry.DebtValueInCents);
            Assert.Equal(0, entry.NetWorthInCents);
        });
    }

    [Fact]
    public async Task Get_SingleMonthDateRange_ReturnsCorrectEntryValues()
    {
        DateOnly startDate = new(2025, 3, 1);
        DateOnly endDate = new(2025, 3, 31);
        OkObjectResult? result = await _controller.Get(startDate, endDate) as OkObjectResult;
        NetWorthTrendGraph netWorthTrendGraph = Assert.IsAssignableFrom<NetWorthTrendGraph>(result!.Value);

        Assert.Equal(endDate.DayNumber - startDate.DayNumber + 1, netWorthTrendGraph.Entries.Count());
        
        AssertNetWorthTrendGraphEntryValues(netWorthTrendGraph, 10, _testObjects.TestUser1AssetTotal2025_02_01, _testObjects.TestUser1DebtTotal2025_02_01);
        AssertNetWorthTrendGraphEntryValues(netWorthTrendGraph, 15, _testObjects.TestUser1AssetTotal2025_04_01, _testObjects.TestUser1DebtTotal2025_04_01);
    }

    [Fact]
    public async Task Get_ShortDateRangeWithGaps_ReturnsCorrectEntryValues()
    {
        DateOnly startDate = new(2025, 4, 1);
        DateOnly endDate = new(2025, 4, 30);
        OkObjectResult? result = await _controller.Get(startDate, endDate) as OkObjectResult;
        NetWorthTrendGraph netWorthTrendGraph = Assert.IsAssignableFrom<NetWorthTrendGraph>(result!.Value);

        Assert.Equal(endDate.DayNumber - startDate.DayNumber + 1, netWorthTrendGraph.Entries.Count());
        
        AssertNetWorthTrendGraphEntryValues(netWorthTrendGraph, 5, _testObjects.TestUser1AssetTotal2025_04_01, _testObjects.TestUser1DebtTotal2025_04_01);
        
        AssertNetWorthTrendGraphEntryValues(netWorthTrendGraph, 25, _testObjects.TestUser1AssetTotal2025_05_01, _testObjects.TestUser1DebtTotal2025_05_01);
    }

    [Fact]
    public async Task Get_FutureDateRange_ReturnsCorrectEntryValues()
    {
        DateOnly startDate = new(2025, 12, 1);
        DateOnly endDate = new(2025, 12, 31);
        OkObjectResult? result = await _controller.Get(startDate, endDate) as OkObjectResult;
        NetWorthTrendGraph netWorthTrendGraph = Assert.IsAssignableFrom<NetWorthTrendGraph>(result!.Value);

        Assert.Equal(endDate.DayNumber - startDate.DayNumber + 1, netWorthTrendGraph.Entries.Count());
        
        Assert.All(netWorthTrendGraph.Entries, entry => 
        {
            Assert.Equal(_testObjects.TestUser1AssetTotal2025_07_01, entry.AssetValueInCents);
            Assert.Equal(_testObjects.TestUser1DebtTotal2025_07_01, entry.DebtValueInCents);
            Assert.Equal(_testObjects.TestUser1AssetTotal2025_07_01 - _testObjects.TestUser1DebtTotal2025_07_01, entry.NetWorthInCents);
        });
    }

    [Fact]
    public async Task Get_DateRangeSpanningMultipleYears_ReturnsCorrectEntryValues()
    {
        DateOnly startDate = new(2024, 12, 1);
        DateOnly endDate = new(2025, 2, 28);
        OkObjectResult? result = await _controller.Get(startDate, endDate) as OkObjectResult;
        NetWorthTrendGraph netWorthTrendGraph = Assert.IsAssignableFrom<NetWorthTrendGraph>(result!.Value);

        Assert.Equal(3, netWorthTrendGraph.Entries.Count());
        
        AssertNetWorthTrendGraphEntryValues(netWorthTrendGraph, 3, _testObjects.TestUser1AssetTotal2025_02_01, _testObjects.TestUser1DebtTotal2025_02_01);
    }

    [Fact]
    public async Task Get_SingleDayDateRange_ReturnsCorrectEntryValues()
    {
        DateOnly startDate = new(2025, 5, 1);
        DateOnly endDate = new(2025, 5, 1);
        OkObjectResult? result = await _controller.Get(startDate, endDate) as OkObjectResult;
        NetWorthTrendGraph netWorthTrendGraph = Assert.IsAssignableFrom<NetWorthTrendGraph>(result!.Value);

        Assert.Single(netWorthTrendGraph.Entries);
        
        AssertNetWorthTrendGraphEntryValues(netWorthTrendGraph, 0, _testObjects.TestUser1AssetTotal2025_05_01, _testObjects.TestUser1DebtTotal2025_05_01);
    }

    [Fact]
    public async Task Get_DateRangeWithVeryOldData_ReturnsCorrectEntryValues()
    {
        DateOnly startDate = new(2020, 1, 1);
        DateOnly endDate = new(2020, 1, 31);
        OkObjectResult? result = await _controller.Get(startDate, endDate) as OkObjectResult;
        NetWorthTrendGraph netWorthTrendGraph = Assert.IsAssignableFrom<NetWorthTrendGraph>(result!.Value);

        Assert.Equal(endDate.DayNumber - startDate.DayNumber + 1, netWorthTrendGraph.Entries.Count());
        
        AssertNetWorthTrendGraphEntryValues(netWorthTrendGraph, 0, _testObjects.TestUser1AssetTotal2020_01_01, _testObjects.TestUser1DebtTotal2020_01_01);
    }

    [Fact]
    public async Task Get_DateRangeWithNoData_ReturnsAllZeroValues()
    {
        DateOnly startDate = new(2019, 1, 1);
        DateOnly endDate = new(2019, 1, 31);
        OkObjectResult? result = await _controller.Get(startDate, endDate) as OkObjectResult;
        NetWorthTrendGraph netWorthTrendGraph = Assert.IsAssignableFrom<NetWorthTrendGraph>(result!.Value);
        
        Assert.All(netWorthTrendGraph.Entries, entry => 
        {
            Assert.Equal(0, entry.AssetValueInCents);
            Assert.Equal(0, entry.DebtValueInCents);
            Assert.Equal(0, entry.NetWorthInCents);
        });
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