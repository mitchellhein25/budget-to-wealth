using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage;

public class CashFlowTrendGraphControllerTests : IDisposable
{
    private readonly string _user1Id = "auth0|user1";
    private CashFlowTrendGraphControllerTestObjects _testObjects;
    private ApplicationDbContext _context;
    private CashFlowTrendGraphController _controller;
    private readonly IDbContextTransaction _transaction;
    public CashFlowTrendGraphControllerTests()
    {
        _context = DatabaseSetup.GetDbContext();
        _transaction = DatabaseSetup.GetTransaction(_context);
        _controller = new CashFlowTrendGraphController(_context);
        SetupTestData();
        SetupUserContext(_user1Id);
    }

    private void SetupTestData()
    {
        _testObjects = new(_context);

        _context.CashFlowEntries.Add(_testObjects.TestCashFlowEntryIncomeCategory1User1_2025_01_01);
        _context.CashFlowEntries.Add(_testObjects.TestCashFlowEntryIncomeCategory1User1_2025_01_05);
        _context.CashFlowEntries.Add(_testObjects.TestCashFlowEntryIncomeCategory1User1_2025_01_10);
        _context.CashFlowEntries.Add(_testObjects.TestCashFlowEntryIncomeCategory1User1_2025_03_12);
        _context.CashFlowEntries.Add(_testObjects.TestCashFlowEntryIncomeCategory1User1_2025_03_30);
        _context.CashFlowEntries.Add(_testObjects.TestCashFlowEntryIncomeCategory1User1_2025_04_01);
        _context.CashFlowEntries.Add(_testObjects.TestCashFlowEntryIncomeCategory1User1_2025_04_05);
        _context.CashFlowEntries.Add(_testObjects.TestCashFlowEntryIncomeCategory1User1_2025_04_10);
        _context.CashFlowEntries.Add(_testObjects.TestCashFlowEntryExpenseCategory1User1_2025_01_01);
        _context.CashFlowEntries.Add(_testObjects.TestCashFlowEntryExpenseCategory1User1_2025_01_05);
        _context.CashFlowEntries.Add(_testObjects.TestCashFlowEntryExpenseCategory1User1_2025_01_10);
        _context.CashFlowEntries.Add(_testObjects.TestCashFlowEntryExpenseCategory1User1_2025_03_12);
        _context.CashFlowEntries.Add(_testObjects.TestCashFlowEntryExpenseCategory1User1_2025_03_30);
        _context.CashFlowEntries.Add(_testObjects.TestCashFlowEntryExpenseCategory1User1_2025_04_01);
        _context.CashFlowEntries.Add(_testObjects.TestCashFlowEntryExpenseCategory1User1_2025_04_05);
        _context.CashFlowEntries.Add(_testObjects.TestCashFlowEntryExpenseCategory1User1_2025_04_10);
        _context.CashFlowEntries.Add(_testObjects.TestCashFlowEntryExpenseCategory2User2_2025_01_01);
        _context.CashFlowEntries.Add(_testObjects.TestCashFlowEntryIncomeCategory2User2_2025_01_10);

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

    private void AssertCashFlowTrendGraphEntryValues(CashFlowTrendGraph cashFlowTrendGraph, int index, long incomeValueInCents, long expensesValueInCents)
    {
        var entry = cashFlowTrendGraph.Entries[index];
        Assert.Equal(incomeValueInCents, entry.IncomeInCents);
        Assert.Equal(expensesValueInCents, entry.ExpensesInCents);
        Assert.Equal(incomeValueInCents - expensesValueInCents, entry.NetCashFlowInCents);
    }

    [Fact]
    public async Task Get_ReturnsAllCorrectEntryValues()
    {
        DateOnly startDate = new(2025, 1, 1);
        DateOnly endDate = new(2025, 6, 30);
        OkObjectResult? result = await _controller.Get(startDate, endDate) as OkObjectResult;
        CashFlowTrendGraph cashFlowTrendGraph = Assert.IsAssignableFrom<CashFlowTrendGraph>(result!.Value);

        Assert.Equal(6, cashFlowTrendGraph.Entries.Count());
        AssertCashFlowTrendGraphEntryValues(cashFlowTrendGraph, 0, _testObjects.TestUser1IncomeTotal2025_01, _testObjects.TestUser1ExpenseTotal2025_01);
        AssertCashFlowTrendGraphEntryValues(cashFlowTrendGraph, 1, _testObjects.TestUser1IncomeTotal2025_02, _testObjects.TestUser1ExpenseTotal2025_02);
        AssertCashFlowTrendGraphEntryValues(cashFlowTrendGraph, 2, _testObjects.TestUser1IncomeTotal2025_03, _testObjects.TestUser1ExpenseTotal2025_03);
        AssertCashFlowTrendGraphEntryValues(cashFlowTrendGraph, 3, _testObjects.TestUser1IncomeTotal2025_04, _testObjects.TestUser1ExpenseTotal2025_04);
        AssertCashFlowTrendGraphEntryValues(cashFlowTrendGraph, 4, 0, 0);
        AssertCashFlowTrendGraphEntryValues(cashFlowTrendGraph, 5, 0, 0);
    }

    [Fact]
    public async Task Get_WithNoDateRange_UsesAllAvailableData()
    {
        OkObjectResult? result = await _controller.Get() as OkObjectResult;
        CashFlowTrendGraph cashFlowTrendGraph = Assert.IsAssignableFrom<CashFlowTrendGraph>(result!.Value);

        Assert.Equal(4, cashFlowTrendGraph.Entries.Count());
    }
    
    [Fact]
    public async Task Get_WithPastDateRange_ReturnsEmptyDashboard()
    {
        DateOnly startDate = new(2010, 1, 1);
        DateOnly endDate = new(2010, 1, 31);
        OkObjectResult? result = await _controller.Get(startDate, endDate) as OkObjectResult;
        CashFlowTrendGraph cashFlowTrendGraph = Assert.IsAssignableFrom<CashFlowTrendGraph>(result!.Value);

        Assert.Single(cashFlowTrendGraph.Entries);
        AssertCashFlowTrendGraphEntryValues(cashFlowTrendGraph, 0, 0, 0);
    }

    [Fact]
    public async Task Get_SingleMonthDateRange_ReturnsCorrectEntryValues()
    {
        DateOnly startDate = new(2025, 3, 1);
        DateOnly endDate = new(2025, 3, 31);
        OkObjectResult? result = await _controller.Get(startDate, endDate) as OkObjectResult;
        CashFlowTrendGraph cashFlowTrendGraph = Assert.IsAssignableFrom<CashFlowTrendGraph>(result!.Value);

        Assert.Single(cashFlowTrendGraph.Entries);
        
        AssertCashFlowTrendGraphEntryValues(cashFlowTrendGraph, 0, _testObjects.TestUser1IncomeTotal2025_03, _testObjects.TestUser1ExpenseTotal2025_03);
    }

    [Fact]
    public async Task Get_FutureDateRange_ReturnsEmptyValues()
    {
        DateOnly startDate = new(2025, 12, 1);
        DateOnly endDate = new(2025, 12, 31);
        OkObjectResult? result = await _controller.Get(startDate, endDate) as OkObjectResult;
        CashFlowTrendGraph cashFlowTrendGraph = Assert.IsAssignableFrom<CashFlowTrendGraph>(result!.Value);

        Assert.Single(cashFlowTrendGraph.Entries);
        
        AssertCashFlowTrendGraphEntryValues(cashFlowTrendGraph, 0, 0, 0);
    }

    [Fact]
    public async Task UnauthorizedUser_CannotAccessEndpoints()
    {
        SetUserUnauthorized();
        CashFlowEntry? userSnapshot = _context.CashFlowEntries.FirstOrDefault(entry => entry.UserId == _user1Id);
        IActionResult result = await _controller.Get();
        Assert.IsType<UnauthorizedResult>(result);
        SetupUserContext(_user1Id);
    }
}