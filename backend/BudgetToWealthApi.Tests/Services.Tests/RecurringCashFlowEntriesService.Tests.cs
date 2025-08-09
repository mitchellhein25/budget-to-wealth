using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

public class RecurringCashFlowEntriesServiceTests : IDisposable
{
    private const string _testPrefix = "Test_";
    private readonly string _defaultCatName = $"{_testPrefix}Test_Default";
    private readonly string _userCatName = $"{_testPrefix}User's";
    private readonly string _otherUserCatName = $"{_testPrefix}Another User's";
    private readonly string _user1Id = "auth0|user1";
    private readonly string _user2Id = "auth0|user2";
    private const long _defaultAmount = 12345;
    private const string _defaultUserId = "testuser";
    private const CashFlowType _defaultCashFlowType = CashFlowType.Expense;
    private const string _defaultDescription = "Test entry";
    private ApplicationDbContext _context;
    private readonly IDbContextTransaction _transaction;
    private readonly RecurringCashFlowEntriesService _service;
    public CashFlowCategory DefaultCategory = null!;
    public CashFlowCategory TestUser1Category = null!;
    public CashFlowCategory TestUser2Category = null!;

    public RecurringCashFlowEntriesServiceTests()
    {
        _context = DatabaseSetup.GetDbContext();
        _transaction = DatabaseSetup.GetTransaction(_context);
        _service = new RecurringCashFlowEntriesService(_context);
        SetupTestData().Wait();
    }

    private async Task SetupTestData()
    {
        DefaultCategory = await CreateTestCategory(_defaultCatName, CashFlowType.Expense, null);
        TestUser1Category = await CreateTestCategory(_userCatName, CashFlowType.Income, _user1Id);
        TestUser2Category = await CreateTestCategory(_otherUserCatName, CashFlowType.Expense, _user2Id);
    }

    private async Task<CashFlowCategory> CreateTestCategory(string name, CashFlowType categoryType, string? userId)
    {
        CashFlowCategory category = new()
        {
            Name = name,
            CategoryType = categoryType,
            UserId = userId
        };
        _context.CashFlowCategories.Add(category);
        await _context.SaveChangesAsync();
        return category;
    }

    private CashFlowEntry CreateCashFlowEntry(
        DateOnly? date,
        RecurrenceFrequency? recurrenceFrequency,
        DateOnly? recurrenceEndDate = null,
        long amount = _defaultAmount,
        string userId = _defaultUserId,
        CashFlowType entryType = _defaultCashFlowType,
        string description = _defaultDescription,
        Guid? categoryId = null)
    {
        Guid finalCategoryId = categoryId ?? DefaultCategory.Id;
        return new CashFlowEntry
        {
            Amount = amount,
            Date = date ?? DateOnly.FromDateTime(DateTime.UtcNow),
            RecurrenceFrequency = recurrenceFrequency,
            RecurrenceEndDate = recurrenceEndDate,
            UserId = userId,
            EntryType = entryType,
            CategoryId = finalCategoryId,
            Description = description
        };
    }

    private async Task<CashFlowEntry?> GetDefaultEntryFromToday() =>
        await _context.CashFlowEntries
            .FirstOrDefaultAsync(entry => entry.Date == DateOnly.FromDateTime(DateTime.UtcNow) && 
                                          entry.Amount == _defaultAmount && 
                                          entry.EntryType == _defaultCashFlowType &&
                                          entry.CategoryId == DefaultCategory.Id &&
                                          entry.Description == _defaultDescription &&
                                          entry.UserId == _defaultUserId);

    public void Dispose()
    {
        _transaction.Rollback();
        _transaction.Dispose();
        _context.Dispose();
    }

    [Fact]
    public async Task ProcessRecurringEntries_NoRecurringEntries_ReturnsSuccessWithZeroCreatedEntries()
    {
        ProcessingResult result = await _service.ProcessRecurringEntries();

        Assert.True(result.Success);
        Assert.Equal(0, result.CreatedEntriesCount);
        Assert.Equal(DateOnly.FromDateTime(DateTime.UtcNow), result.ProcessedDate);
        Assert.Null(result.ErrorMessage);
    }

    [Fact]
    public async Task ProcessRecurringEntries_WeeklyRecurrence_CreatesEntryAfterOneWeek()
    {
        DateOnly startDateWeekAgo = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-7));
        CashFlowEntry recurringEntry = CreateCashFlowEntry(
            date: startDateWeekAgo,
            recurrenceFrequency: RecurrenceFrequency.Weekly
        );

        _context.CashFlowEntries.Add(recurringEntry);
        await _context.SaveChangesAsync();

        ProcessingResult result = await _service.ProcessRecurringEntries();

        Assert.True(result.Success);
        Assert.Equal(1, result.CreatedEntriesCount);

        var createdEntry = await GetDefaultEntryFromToday();
        Assert.NotNull(createdEntry);
    }

    [Fact]
    public async Task ProcessRecurringEntries_WeeklyRecurrence_DoesNotCreateEntryBeforeOneWeek()
    {
        DateOnly startDateLessThanWeekAgo = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-6)); 
        CashFlowEntry recurringEntry = CreateCashFlowEntry(
            date: startDateLessThanWeekAgo,
            recurrenceFrequency: RecurrenceFrequency.Weekly
        );

        _context.CashFlowEntries.Add(recurringEntry);
        await _context.SaveChangesAsync();

        ProcessingResult result = await _service.ProcessRecurringEntries();

        Assert.True(result.Success);
        Assert.Equal(0, result.CreatedEntriesCount);

        var createdEntry = await GetDefaultEntryFromToday();
        Assert.Null(createdEntry);
    }

    [Fact]
    public async Task ProcessRecurringEntries_Every2WeeksRecurrence_CreatesEntryAfterTwoWeeks()
    {
        DateOnly startDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-14));
        CashFlowEntry recurringEntry = CreateCashFlowEntry(
            date: startDate,
            recurrenceFrequency: RecurrenceFrequency.Every2Weeks
        );

        _context.CashFlowEntries.Add(recurringEntry);
        await _context.SaveChangesAsync();

        ProcessingResult result = await _service.ProcessRecurringEntries();

        Assert.True(result.Success);
        Assert.Equal(1, result.CreatedEntriesCount);

        var createdEntry = await GetDefaultEntryFromToday();
        Assert.NotNull(createdEntry);
    }

    [Fact]
    public async Task ProcessRecurringEntries_Every2WeeksRecurrence_DoesNotCreateEntryAfterOneWeek()
    {
        DateOnly startDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-7));
        CashFlowEntry recurringEntry = CreateCashFlowEntry(
            date: startDate,
            recurrenceFrequency: RecurrenceFrequency.Every2Weeks
        );

        _context.CashFlowEntries.Add(recurringEntry);
        await _context.SaveChangesAsync();

        ProcessingResult result = await _service.ProcessRecurringEntries();

        Assert.True(result.Success);
        Assert.Equal(0, result.CreatedEntriesCount);

        var createdEntry = await GetDefaultEntryFromToday();
        Assert.Null(createdEntry);
    }

    [Fact]
    public async Task ProcessRecurringEntries_MonthlyRecurrence_CreatesEntryOnSameDayNextMonth()
    {
        DateOnly today = DateOnly.FromDateTime(DateTime.UtcNow);
        DateOnly lastMonth = today.AddMonths(-1);
        CashFlowEntry recurringEntry = CreateCashFlowEntry(
            date: lastMonth,
            recurrenceFrequency: RecurrenceFrequency.Monthly
        );

        _context.CashFlowEntries.Add(recurringEntry);
        await _context.SaveChangesAsync();

        ProcessingResult result = await _service.ProcessRecurringEntries();

        Assert.True(result.Success);
        Assert.Equal(1, result.CreatedEntriesCount);

        var createdEntry = await GetDefaultEntryFromToday();
        Assert.NotNull(createdEntry);
    }

    // [Fact]
    // public async Task ProcessRecurringEntries_MonthlyRecurrenceEndOfMonth_AdjustsForShorterMonth()
    // {
    //     int currentYear = DateTime.UtcNow.Year;
    //     DateOnly january31 = new DateOnly(currentYear, 1, 31);
    //     CashFlowEntry recurringEntry = CreateCashFlowEntry(
    //         date: january31,
    //         recurrenceFrequency: RecurrenceFrequency.Monthly
    //     );

    //     _context.CashFlowEntries.Add(recurringEntry);
    //     await _context.SaveChangesAsync();

    //     // We need to mock the current date to be in February
    //     // Since we can't easily mock DateTime.UtcNow, this test demonstrates the concept
    //     // In a real scenario, you might want to inject a date provider

    //     Assert.True(result.Success); // Placeholder assertion
    // }

    [Fact]
    public async Task ProcessRecurringEntries_ExpiredRecurrence_DoesNotCreateEntry()
    {
        DateOnly startDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-14));
        DateOnly endDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-1));
        CashFlowEntry recurringEntry = CreateCashFlowEntry(
            date: startDate,
            recurrenceFrequency: RecurrenceFrequency.Weekly,
            recurrenceEndDate: endDate
        );

        _context.CashFlowEntries.Add(recurringEntry);
        await _context.SaveChangesAsync();

        ProcessingResult result = await _service.ProcessRecurringEntries();

        Assert.True(result.Success);
        Assert.Equal(0, result.CreatedEntriesCount);

        var createdEntry = await GetDefaultEntryFromToday();
        Assert.Null(createdEntry);
    }

    [Fact]
    public async Task ProcessRecurringEntries_EntryAlreadyExistsForToday_DoesNotCreateDuplicate()
    {
        DateOnly startDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-7));
        DateOnly today = DateOnly.FromDateTime(DateTime.UtcNow);

        CashFlowEntry recurringEntry = CreateCashFlowEntry(
            date: startDate,
            recurrenceFrequency: RecurrenceFrequency.Weekly
        );

        CashFlowEntry existingEntry = CreateCashFlowEntry(
            date: today,
            recurrenceFrequency: null
        );

        _context.CashFlowEntries.AddRange(recurringEntry, existingEntry);
        await _context.SaveChangesAsync();

        ProcessingResult result = await _service.ProcessRecurringEntries();

        Assert.True(result.Success);
        Assert.Equal(0, result.CreatedEntriesCount);

        var createdEntry = await GetDefaultEntryFromToday();
        Assert.NotNull(createdEntry);
    }

    [Fact]
    public async Task ProcessRecurringEntries_MultipleUsersWithRecurringEntries_CreatesEntriesForEachUser()
    {
        DateOnly startDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-7));

        CashFlowEntry user1Entry = CreateCashFlowEntry(
            date: startDate,
            recurrenceFrequency: RecurrenceFrequency.Weekly,
            userId: "user1"
        );

        CashFlowEntry user2Entry = CreateCashFlowEntry(
            date: startDate,
            recurrenceFrequency: RecurrenceFrequency.Weekly,
            userId: "user2"
        );

        _context.CashFlowEntries.AddRange(user1Entry, user2Entry);
        await _context.SaveChangesAsync();

        ProcessingResult result = await _service.ProcessRecurringEntries();

        Assert.True(result.Success);
        Assert.Equal(2, result.CreatedEntriesCount);

        var createdEntries = await _context.CashFlowEntries
            .Where(e => e.Date == DateOnly.FromDateTime(DateTime.UtcNow))
            .ToListAsync();

        Assert.Equal(2, createdEntries.Count);
        Assert.Contains(createdEntries, e => e.UserId == "user1");
        Assert.Contains(createdEntries, e => e.UserId == "user2");
    }

    [Fact]
    public async Task ProcessRecurringEntries_FutureStartDate_DoesNotCreateEntry()
    {
        DateOnly futureDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(7));
        CashFlowEntry recurringEntry = CreateCashFlowEntry(
            date: futureDate,
            recurrenceFrequency: RecurrenceFrequency.Weekly
        );

        _context.CashFlowEntries.Add(recurringEntry);
        await _context.SaveChangesAsync();

        ProcessingResult result = await _service.ProcessRecurringEntries();

        Assert.True(result.Success);
        Assert.Equal(0, result.CreatedEntriesCount);
        
        var createdEntry = await GetDefaultEntryFromToday();
        Assert.Null(createdEntry);
    }

    [Theory]
    [InlineData(7, true)]
    [InlineData(14, true)]
    [InlineData(21, true)]
    [InlineData(6, false)]
    [InlineData(8, false)]
    public async Task ProcessRecurringEntries_WeeklyRecurrence_VariousDayDifferences(int daysAgo, bool shouldCreate)
    {
        DateOnly startDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-daysAgo));
        CashFlowEntry recurringEntry = CreateCashFlowEntry(
            date: startDate,
            recurrenceFrequency: RecurrenceFrequency.Weekly
        );

        _context.CashFlowEntries.Add(recurringEntry);
        await _context.SaveChangesAsync();

        ProcessingResult result = await _service.ProcessRecurringEntries();

        Assert.True(result.Success);
        Assert.Equal(shouldCreate ? 1 : 0, result.CreatedEntriesCount);
    }

    [Theory]
    [InlineData(14, true)]
    [InlineData(28, true)]
    [InlineData(13, false)]
    [InlineData(15, false)]
    public async Task ProcessRecurringEntries_Every2WeeksRecurrence_VariousDayDifferences(int daysAgo, bool shouldCreate)
    {
        DateOnly startDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-daysAgo));
        CashFlowEntry recurringEntry = CreateCashFlowEntry(
            date: startDate,
            recurrenceFrequency: RecurrenceFrequency.Every2Weeks
        );

        _context.CashFlowEntries.Add(recurringEntry);
        await _context.SaveChangesAsync();

        ProcessingResult result = await _service.ProcessRecurringEntries();

        Assert.True(result.Success);
        Assert.Equal(shouldCreate ? 1 : 0, result.CreatedEntriesCount);
    }

    [Fact]
    public async Task ProcessRecurringEntries_CreatedEntriesCopyAllProperties()
    {
        DateOnly startDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-7));
        CashFlowEntry recurringEntry = CreateCashFlowEntry(
            date: startDate,
            recurrenceFrequency: RecurrenceFrequency.Weekly
        );

        _context.CashFlowEntries.Add(recurringEntry);
        await _context.SaveChangesAsync();

        ProcessingResult result = await _service.ProcessRecurringEntries();

        Assert.True(result.Success);
        Assert.Equal(1, result.CreatedEntriesCount);

        var createdEntry = await GetDefaultEntryFromToday();

        Assert.NotNull(createdEntry);
        Assert.Equal(_defaultAmount, createdEntry.Amount);
        Assert.Equal(_defaultCashFlowType, createdEntry.EntryType);
        Assert.Equal(DefaultCategory.Id, createdEntry.CategoryId);
        Assert.Equal(_defaultDescription, createdEntry.Description);
        Assert.Equal(_defaultUserId, createdEntry.UserId);
        Assert.Equal(DateOnly.FromDateTime(DateTime.UtcNow), createdEntry.Date);
        Assert.Null(createdEntry.RecurrenceFrequency);
    }
}