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

        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotAsset1User1_Early);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotAsset2User1_GapStart);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotAsset3User1_Evening);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotAsset4User1_VeryOld);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotAsset1User1_Mid);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotAsset2User1_GapEnd);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotAsset1User1_Late);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotDebt1User1_Early);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotDebt1User1_Mid);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotDebt1User1_Late);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotDebt2User1_Future);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotDebt2User1_GapEnd);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotDebt3User1);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotDebt4User1);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotAsset1User1);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotAsset2User1);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotAsset3User1);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotDebt1User1);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotDebt2User1);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotAssetUser2);
        _context.HoldingSnapshots.Add(_testObjects.TestHoldingSnapshotDebtUser2);

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

    private void AssertNetWorthDashboardEntryValues(NetWorthDashboard netWorthDashboard, int index, long assetValueInCents, long debtValueInCents)
    {
        var entry = netWorthDashboard.Entries[index];
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
        NetWorthDashboard netWorthDashboard = Assert.IsAssignableFrom<NetWorthDashboard>(result!.Value);

        Assert.Equal(40, netWorthDashboard.Entries.Count());
    }

    [Fact]
    public async Task Get_WithNoDateRange_UsesAllAvailableData()
    {
        OkObjectResult? result = await _controller.Get() as OkObjectResult;
        NetWorthDashboard netWorthDashboard = Assert.IsAssignableFrom<NetWorthDashboard>(result!.Value);

        Assert.Equal(7, netWorthDashboard.Entries.Count());
    }
    
    [Fact]
    public async Task Get_WithPastDateRange_ReturnsEmptyDashboard()
    {
        DateOnly startDate = new(2010, 1, 1);
        DateOnly endDate = new(2010, 1, 31);
        OkObjectResult? result = await _controller.Get(startDate, endDate) as OkObjectResult;
        NetWorthDashboard netWorthDashboard = Assert.IsAssignableFrom<NetWorthDashboard>(result!.Value);

        Assert.Equal(endDate.DayNumber - startDate.DayNumber + 1, netWorthDashboard.Entries.Count());
        Assert.All(netWorthDashboard.Entries, entry => 
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
        NetWorthDashboard netWorthDashboard = Assert.IsAssignableFrom<NetWorthDashboard>(result!.Value);

        Assert.Equal(endDate.DayNumber - startDate.DayNumber + 1, netWorthDashboard.Entries.Count());
        
        AssertNetWorthDashboardEntryValues(netWorthDashboard, 10, _testObjects.TestUser1AssetTotal2025_03_10, _testObjects.TestUser1DebtTotal2025_03_10);
        AssertNetWorthDashboardEntryValues(netWorthDashboard, 15, _testObjects.TestUser1AssetTotal2025_03_15, _testObjects.TestUser1DebtTotal2025_03_15);
    }

    [Fact]
    public async Task Get_ShortDateRangeWithGaps_ReturnsCorrectEntryValues()
    {
        DateOnly startDate = new(2025, 4, 1);
        DateOnly endDate = new(2025, 4, 30);
        OkObjectResult? result = await _controller.Get(startDate, endDate) as OkObjectResult;
        NetWorthDashboard netWorthDashboard = Assert.IsAssignableFrom<NetWorthDashboard>(result!.Value);

        Assert.Equal(endDate.DayNumber - startDate.DayNumber + 1, netWorthDashboard.Entries.Count());
        
        AssertNetWorthDashboardEntryValues(netWorthDashboard, 25, _testObjects.TestUser1AssetTotal2025_04_25, _testObjects.TestUser1DebtTotal2025_04_25);
        
        var beforeGapEntry = netWorthDashboard.Entries.First(e => e.Date == new DateOnly(2025, 4, 19));
        Assert.Equal(_testObjects.TestUser1AssetTotal2025_03_15, beforeGapEntry.AssetValueInCents);
        Assert.Equal(_testObjects.TestUser1DebtTotal2025_03_15, beforeGapEntry.DebtValueInCents);
    }

    [Fact]
    public async Task Get_FutureDateRange_ReturnsCorrectEntryValues()
    {
        DateOnly startDate = new(2025, 12, 1);
        DateOnly endDate = new(2025, 12, 31);
        OkObjectResult? result = await _controller.Get(startDate, endDate) as OkObjectResult;
        NetWorthDashboard netWorthDashboard = Assert.IsAssignableFrom<NetWorthDashboard>(result!.Value);

        Assert.Equal(endDate.DayNumber - startDate.DayNumber + 1, netWorthDashboard.Entries.Count());
        
        Assert.All(netWorthDashboard.Entries, entry => 
        {
            Assert.Equal(_testObjects.TestUser1AssetTotal2025_06_15, entry.AssetValueInCents);
            Assert.Equal(_testObjects.TestUser1DebtTotal2025_06_15, entry.DebtValueInCents);
            Assert.Equal(_testObjects.TestUser1AssetTotal2025_06_15 - _testObjects.TestUser1DebtTotal2025_06_15, entry.NetWorthInCents);
        });
    }

    [Fact]
    public async Task Get_DateRangeSpanningMultipleYears_ReturnsCorrectEntryValues()
    {
        DateOnly startDate = new(2024, 12, 1);
        DateOnly endDate = new(2025, 2, 28);
        OkObjectResult? result = await _controller.Get(startDate, endDate) as OkObjectResult;
        NetWorthDashboard netWorthDashboard = Assert.IsAssignableFrom<NetWorthDashboard>(result!.Value);

        Assert.Equal(3, netWorthDashboard.Entries.Count());
        
        var early2024Entry = netWorthDashboard.Entries.First();
        Assert.Equal(5000, early2024Entry.AssetValueInCents);
        Assert.Equal(10000, early2024Entry.DebtValueInCents);
        Assert.Equal(5000 - 10000, early2024Entry.NetWorthInCents);
        
        AssertNetWorthDashboardEntryValues(netWorthDashboard, 2, _testObjects.TestUser1AssetTotal2025_03_10, _testObjects.TestUser1DebtTotal2025_03_10);
    }

    [Fact]
    public async Task Get_SingleDayDateRange_ReturnsCorrectEntryValues()
    {
        DateOnly startDate = new(2025, 5, 4);
        DateOnly endDate = new(2025, 5, 4);
        OkObjectResult? result = await _controller.Get(startDate, endDate) as OkObjectResult;
        NetWorthDashboard netWorthDashboard = Assert.IsAssignableFrom<NetWorthDashboard>(result!.Value);

        Assert.Single(netWorthDashboard.Entries);
        
        AssertNetWorthDashboardEntryValues(netWorthDashboard, 0, _testObjects.TestUser1AssetTotal2025_05_04, _testObjects.TestUser1DebtTotal2025_05_04);
    }

    [Fact]
    public async Task Get_DateRangeWithVeryOldData_ReturnsCorrectEntryValues()
    {
        DateOnly startDate = new(2020, 1, 1);
        DateOnly endDate = new(2020, 1, 31);
        OkObjectResult? result = await _controller.Get(startDate, endDate) as OkObjectResult;
        NetWorthDashboard netWorthDashboard = Assert.IsAssignableFrom<NetWorthDashboard>(result!.Value);

        Assert.Equal(endDate.DayNumber - startDate.DayNumber + 1, netWorthDashboard.Entries.Count());
        
        var veryOldEntry = netWorthDashboard.Entries.First(e => e.Date == new DateOnly(2020, 1, 1));
        Assert.Equal(5000, veryOldEntry.AssetValueInCents);
        Assert.Equal(0, veryOldEntry.DebtValueInCents);
        Assert.Equal(5000, veryOldEntry.NetWorthInCents);
    }

    [Fact]
    public async Task Get_DateRangeWithNoData_ReturnsAllZeroValues()
    {
        DateOnly startDate = new(2019, 1, 1);
        DateOnly endDate = new(2019, 1, 31);
        OkObjectResult? result = await _controller.Get(startDate, endDate) as OkObjectResult;
        NetWorthDashboard netWorthDashboard = Assert.IsAssignableFrom<NetWorthDashboard>(result!.Value);

        Assert.Equal(endDate.DayNumber - startDate.DayNumber + 1, netWorthDashboard.Entries.Count());
        
        Assert.All(netWorthDashboard.Entries, entry => 
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