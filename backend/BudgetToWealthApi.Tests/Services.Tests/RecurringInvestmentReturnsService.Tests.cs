using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

public class RecurringInvestmentReturnsServiceTests : IDisposable
{
    private readonly string _user1Id = "auth0|user1";
    private readonly string _user2Id = "auth0|user2";
    private RecurringInvestmentReturnsServiceTestObjects _testObjects = null!;
    private ApplicationDbContext _context;
    private readonly IDbContextTransaction _transaction;
    private readonly RecurringInvestmentReturnsService _service;
    private readonly RecurrenceService _recurrenceService;

    public RecurringInvestmentReturnsServiceTests()
    {
        _context = DatabaseSetup.GetDbContext();
        _transaction = DatabaseSetup.GetTransaction(_context);
        _recurrenceService = new RecurrenceService();
        _service = new RecurringInvestmentReturnsService(_context, _recurrenceService);
        SetupTestData();
    }

    private void SetupTestData()
    {
        _testObjects = new(_context);
        _context.InvestmentReturns.Add(_testObjects.WeeklyRecurringInvestmentReturn);
        _context.InvestmentReturns.Add(_testObjects.MonthlyRecurringInvestmentReturn);
        _context.InvestmentReturns.Add(_testObjects.Every2WeeksRecurringInvestmentReturn);
        _context.InvestmentReturns.Add(_testObjects.NonRecurringInvestmentReturn);
        _context.InvestmentReturns.Add(_testObjects.ExpiredRecurringInvestmentReturn);
        _context.SaveChanges();
    }

    public void Dispose()
    {
        _transaction.Rollback();
        _transaction.Dispose();
        _context.Dispose();
    }

    [Fact]
    public async Task ProcessRecurringInvestmentReturns_NoRecurringEntries_ReturnsSuccessWithZeroCreatedEntries()
    {
        _context.InvestmentReturns.RemoveRange(_context.InvestmentReturns.ToList());
        await _context.SaveChangesAsync();

        ProcessingResult result = await _service.ProcessRecurringInvestmentReturns();

        Assert.True(result.Success);
        Assert.Equal(0, result.CreatedEntriesCount);
        Assert.Equal(DateOnly.FromDateTime(DateTime.UtcNow), result.ProcessedDate);
        Assert.Null(result.ErrorMessage);
    }

    [Fact]
    public async Task ProcessRecurringInvestmentReturns_OnlyNonRecurringEntries_ReturnsSuccessWithZeroCreatedEntries()
    {
        _context.InvestmentReturns.RemoveRange(_context.InvestmentReturns.Where(ir => ir.RecurrenceFrequency != null).ToList());
        await _context.SaveChangesAsync();

        ProcessingResult result = await _service.ProcessRecurringInvestmentReturns();

        Assert.True(result.Success);
        Assert.Equal(0, result.CreatedEntriesCount);
    }

    [Fact]
    public async Task ProcessRecurringInvestmentReturns_OnlyExpiredRecurringEntries_ReturnsSuccessWithZeroCreatedEntries()
    {
        _context.InvestmentReturns.RemoveRange(_context.InvestmentReturns.Where(ir => ir.RecurrenceEndDate > DateOnly.FromDateTime(DateTime.UtcNow)).ToList());
        await _context.SaveChangesAsync();

        ProcessingResult result = await _service.ProcessRecurringInvestmentReturns();

        Assert.True(result.Success);
        Assert.Equal(0, result.CreatedEntriesCount);
    }

    [Fact]
    public async Task ProcessRecurringInvestmentReturns_WeeklyRecurrenceDue_CreatesNewInvestmentReturn()
    {
        ProcessingResult result = await _service.ProcessRecurringInvestmentReturns();

        Assert.True(result.Success);
        Assert.Equal(1, result.CreatedEntriesCount);

        InvestmentReturn? newInvestmentReturn = await _context.InvestmentReturns
            .FirstOrDefaultAsync(ir => ir.ManualInvestmentStartDate == DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-7)) &&
                                      ir.ManualInvestmentCategoryId == _testObjects.TestUser1ManualCategory.Id);

        Assert.NotNull(newInvestmentReturn);
        Assert.Equal(_testObjects.WeeklyRecurringInvestmentReturn.TotalContributions, newInvestmentReturn.TotalContributions);
        Assert.Equal(_testObjects.WeeklyRecurringInvestmentReturn.TotalWithdrawals, newInvestmentReturn.TotalWithdrawals);
        Assert.Equal(_testObjects.WeeklyRecurringInvestmentReturn.ManualInvestmentPercentageReturn, newInvestmentReturn.ManualInvestmentPercentageReturn);
        Assert.Equal(_testObjects.WeeklyRecurringInvestmentReturn.RecurrenceFrequency, newInvestmentReturn.RecurrenceFrequency);
        Assert.Equal(_testObjects.WeeklyRecurringInvestmentReturn.RecurrenceEndDate, newInvestmentReturn.RecurrenceEndDate);
    }

    [Fact]
    public async Task ProcessRecurringInvestmentReturns_MonthlyRecurrenceDue_CreatesNewInvestmentReturn()
    {
        ProcessingResult result = await _service.ProcessRecurringInvestmentReturns();

        Assert.True(result.Success);
        Assert.Equal(1, result.CreatedEntriesCount);

        InvestmentReturn? newInvestmentReturn = await _context.InvestmentReturns
            .FirstOrDefaultAsync(ir => ir.ManualInvestmentStartDate == DateOnly.Parse("2023-02-15") &&
                                      ir.ManualInvestmentCategoryId == _testObjects.TestUser1ManualCategory.Id);

        Assert.NotNull(newInvestmentReturn);
        Assert.Equal(_testObjects.MonthlyRecurringInvestmentReturn.TotalContributions, newInvestmentReturn.TotalContributions);
        Assert.Equal(_testObjects.MonthlyRecurringInvestmentReturn.TotalWithdrawals, newInvestmentReturn.TotalWithdrawals);
    }

    [Fact]
    public async Task ProcessRecurringInvestmentReturns_Every2WeeksRecurrenceDue_CreatesNewInvestmentReturn()
    {
        ProcessingResult result = await _service.ProcessRecurringInvestmentReturns();

        Assert.True(result.Success);
        Assert.Equal(1, result.CreatedEntriesCount);

        InvestmentReturn? newInvestmentReturn = await _context.InvestmentReturns
            .FirstOrDefaultAsync(ir => ir.ManualInvestmentStartDate == DateOnly.Parse("2023-01-15") &&
                                      ir.ManualInvestmentCategoryId == _testObjects.TestUser2ManualCategory.Id);

        Assert.NotNull(newInvestmentReturn);
        Assert.Equal(_testObjects.Every2WeeksRecurringInvestmentReturn.TotalContributions, newInvestmentReturn.TotalContributions);
    }

    [Fact]
    public async Task ProcessRecurringInvestmentReturns_RecurrenceNotDue_DoesNotCreateNewInvestmentReturn()
    {
        ProcessingResult result = await _service.ProcessRecurringInvestmentReturns();

        Assert.True(result.Success);
        Assert.Equal(0, result.CreatedEntriesCount);
    }

    [Fact]
    public async Task ProcessRecurringInvestmentReturns_RecurrenceAlreadyExistsForToday_DoesNotCreateDuplicate()
    {
        InvestmentReturn existingInvestmentReturn = new()
        {
            ManualInvestmentCategoryId = _testObjects.TestUser1ManualCategory.Id,
            ManualInvestmentCategory = _testObjects.TestUser1ManualCategory,
            ManualInvestmentStartDate = DateOnly.Parse("2023-01-08"),
            ManualInvestmentEndDate = DateOnly.Parse("2023-02-07"),
            ManualInvestmentPercentageReturn = 0.10m,
            TotalContributions = 1000,
            TotalWithdrawals = 0,
            RecurrenceFrequency = RecurrenceFrequency.Weekly,
            RecurrenceEndDate = DateOnly.Parse("2024-12-31"),
            UserId = _user1Id
        };

        _context.InvestmentReturns.Add(existingInvestmentReturn);
        await _context.SaveChangesAsync();

        ProcessingResult result = await _service.ProcessRecurringInvestmentReturns();

        Assert.True(result.Success);
        Assert.Equal(0, result.CreatedEntriesCount);
    }

    [Fact]
    public async Task ProcessRecurringInvestmentReturns_MultipleRecurrencesDue_CreatesAllNewInvestmentReturns()
    {
        ProcessingResult result = await _service.ProcessRecurringInvestmentReturns();

        Assert.True(result.Success);
        Assert.Equal(2, result.CreatedEntriesCount);

        List<InvestmentReturn> newInvestmentReturns = await _context.InvestmentReturns
            .Where(ir => ir.ManualInvestmentStartDate == DateOnly.Parse("2023-01-08"))
            .ToListAsync();

        Assert.Equal(2, newInvestmentReturns.Count);
        Assert.Contains(newInvestmentReturns, ir => ir.ManualInvestmentCategoryId == _testObjects.TestUser1ManualCategory.Id);
        Assert.Contains(newInvestmentReturns, ir => ir.ManualInvestmentCategoryId == _testObjects.TestUser2ManualCategory.Id);
    }

    [Fact]
    public async Task ProcessRecurringInvestmentReturns_NewInvestmentReturnHasCorrectEndDate()
    {
        await _service.ProcessRecurringInvestmentReturns();

        InvestmentReturn? newInvestmentReturn = await _context.InvestmentReturns
            .FirstOrDefaultAsync(ir => ir.ManualInvestmentStartDate == DateOnly.Parse("2023-01-08") &&
                                      ir.ManualInvestmentCategoryId == _testObjects.TestUser1ManualCategory.Id);

        Assert.NotNull(newInvestmentReturn);
        Assert.Equal(DateOnly.Parse("2023-02-07"), newInvestmentReturn.ManualInvestmentEndDate);
    }

    [Fact]
    public async Task ProcessRecurringInvestmentReturns_ExceptionOccurs_ReturnsErrorResult()
    {
        _context.Dispose();

        ProcessingResult result = await _service.ProcessRecurringInvestmentReturns();

        Assert.False(result.Success);
        Assert.NotNull(result.ErrorMessage);
        Assert.Equal(0, result.CreatedEntriesCount);
    }
}
