using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

public class RecurringManualInvestmentReturnsServiceTests : IDisposable
{
	private readonly string _user1Id = "auth0|user1";
	private const decimal _defaultPercentage = 0.1m;
	private ApplicationDbContext _context;
	private readonly IDbContextTransaction _transaction;
	private readonly RecurringManualInvestmentReturnsService _service;
	private readonly RecurrenceService _recurrenceService;
	private RecurringManualInvestmentReturnsServiceTestObjects _testObjects = null!;

	public RecurringManualInvestmentReturnsServiceTests()
	{
		_context = DatabaseSetup.GetDbContext();
		_transaction = DatabaseSetup.GetTransaction(_context);
		_recurrenceService = new RecurrenceService();
		_service = new RecurringManualInvestmentReturnsService(_context, _recurrenceService);
		SetupTestData();
	}

	private void SetupTestData()
	{
		_testObjects = new(_context);
		_context.ManualInvestmentReturns.Add(_testObjects.User1WeeklyRecurringInvestmentReturn);
		_context.ManualInvestmentReturns.Add(_testObjects.User1MonthlyRecurringInvestmentReturn);
		_context.ManualInvestmentReturns.Add(_testObjects.User2Every2WeeksRecurringInvestmentReturn);
		_context.ManualInvestmentReturns.Add(_testObjects.DefaultNonRecurringInvestmentReturn);
		_context.ManualInvestmentReturns.Add(_testObjects.User2ExpiredRecurringInvestmentReturn);
		_context.SaveChanges();
	}

	private async Task ClearExistingRecurringTemplates()
	{
		var existing = _context.ManualInvestmentReturns.Where(ir => ir.ManualInvestmentRecurrenceFrequency != null).ToList();
		if (existing.Any())
		{
			_context.ManualInvestmentReturns.RemoveRange(existing);
			await _context.SaveChangesAsync();
		}
	}

	private ManualInvestmentReturn CreateManualInvestmentReturn(
		ManualInvestmentCategory category,
		DateOnly returnDate,
		DateOnly? recurrenceEndDate,
		RecurrenceFrequency? recurrenceFrequency,
		decimal percentage = _defaultPercentage,
		string? userId = null)
	{
		return new ManualInvestmentReturn
		{
			ManualInvestmentCategoryId = category.Id,
            ManualInvestmentCategory = category,
            StartDate = returnDate.AddMonths(-1),
            EndDate = returnDate,
            ManualInvestmentRecurrenceFrequency= recurrenceFrequency,
            ManualInvestmentRecurrenceEndDate = recurrenceEndDate,
			ManualInvestmentPercentageReturn = percentage,
			UserId = userId
		};
	}

	private async Task<ManualInvestmentReturn?> GetManualInvestmentFromToday(Guid categoryId) =>
		await _context.ManualInvestmentReturns.FirstOrDefaultAsync(ir =>
			ir.ManualInvestmentCategoryId == categoryId &&
			ir.EndDate == DateOnly.FromDateTime(DateTime.UtcNow));

	public void Dispose()
	{
		_transaction.Rollback();
		_transaction.Dispose();
		_context.Dispose();
	}

	[Fact]
	public async Task ProcessRecurringManualInvestmentReturns_NoRecurringEntries_ReturnsSuccessWithZeroCreatedEntries()
	{
		_context.ManualInvestmentReturns.RemoveRange(_context.ManualInvestmentReturns.ToList());
		await _context.SaveChangesAsync();

		ProcessingResult result = await _service.ProcessRecurringManualInvestmentReturns();

		Assert.True(result.Success);
		Assert.Equal(0, result.CreatedEntriesCount);
		Assert.Equal(DateOnly.FromDateTime(DateTime.UtcNow), result.ProcessedDate);
		Assert.Null(result.ErrorMessage);
	}

	[Fact]
	public async Task ProcessRecurringManualInvestmentReturns_OnlyNonRecurringEntries_ReturnsSuccessWithZeroCreatedEntries()
	{
		ManualInvestmentReturn nonRecurring = CreateManualInvestmentReturn(
			_testObjects.DefaultManualCategory,
			DateOnly.FromDateTime(DateTime.UtcNow),
			null,
			null,
			_defaultPercentage,
			userId: _user1Id);
		_context.ManualInvestmentReturns.Add(nonRecurring);
		await _context.SaveChangesAsync();

		ProcessingResult result = await _service.ProcessRecurringManualInvestmentReturns();

		Assert.True(result.Success);
		Assert.Equal(0, result.CreatedEntriesCount);
	}

	[Fact]
	public async Task ProcessRecurringManualInvestmentReturns_OnlyExpiredRecurringEntries_ReturnsSuccessWithZeroCreatedEntries()
	{
		ManualInvestmentReturn expired = CreateManualInvestmentReturn(
			_testObjects.TestUser2ManualCategory,
			DateOnly.FromDateTime(DateTime.UtcNow),
			DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-1)),
			RecurrenceFrequency.Weekly,
			_defaultPercentage,
			userId: _testObjects.TestUser2ManualCategory.UserId!);
		_context.ManualInvestmentReturns.Add(expired);
		await _context.SaveChangesAsync();

		ProcessingResult result = await _service.ProcessRecurringManualInvestmentReturns();

		Assert.True(result.Success);
		Assert.Equal(0, result.CreatedEntriesCount);
	}

	[Fact]
	public async Task ProcessRecurringManualInvestmentReturns_WeeklyRecurrenceDue_CreatesNewManualInvestmentReturn()
	{
		ManualInvestmentReturn recurring = CreateManualInvestmentReturn(
			_testObjects.TestUser1ManualCategory,
			DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-7)),
			DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30)),
			RecurrenceFrequency.Weekly,
			_defaultPercentage,
			userId: _user1Id);
		_context.ManualInvestmentReturns.Add(recurring);
		await _context.SaveChangesAsync();

		ProcessingResult result = await _service.ProcessRecurringManualInvestmentReturns();

		Assert.True(result.Success);
		Assert.Equal(1, result.CreatedEntriesCount);

		ManualInvestmentReturn? created = await GetManualInvestmentFromToday(_testObjects.TestUser1ManualCategory.Id);
		Assert.NotNull(created);
		Assert.Equal(recurring.ManualInvestmentPercentageReturn, created.ManualInvestmentPercentageReturn);
	}

	[Fact]
	public async Task ProcessRecurringManualInvestmentReturns_MonthlyRecurrenceDue_CreatesNewManualInvestmentReturn()
	{
		ManualInvestmentReturn recurring = CreateManualInvestmentReturn(
			_testObjects.TestUser1ManualCategory,
			DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(-1)),
			DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30)),
			RecurrenceFrequency.Monthly,
			_defaultPercentage,
			userId: _user1Id);
		_context.ManualInvestmentReturns.Add(recurring);
		await _context.SaveChangesAsync();

		ProcessingResult result = await _service.ProcessRecurringManualInvestmentReturns();

		Assert.True(result.Success);
		Assert.Equal(1, result.CreatedEntriesCount);

		ManualInvestmentReturn? created = await GetManualInvestmentFromToday(_testObjects.TestUser1ManualCategory.Id);
		Assert.NotNull(created);
	}

	[Fact]
	public async Task ProcessRecurringManualInvestmentReturns_Every2WeeksRecurrenceDue_CreatesNewManualInvestmentReturn()
	{
		ManualInvestmentReturn recurring = CreateManualInvestmentReturn(
			_testObjects.TestUser2ManualCategory,
			DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-14)),
			DateOnly.FromDateTime(DateTime.UtcNow.AddDays(14)),
			RecurrenceFrequency.Every2Weeks,
			_defaultPercentage,
			userId: _testObjects.TestUser2ManualCategory.UserId!);
		_context.ManualInvestmentReturns.Add(recurring);
		await _context.SaveChangesAsync();

		ProcessingResult result = await _service.ProcessRecurringManualInvestmentReturns();

		Assert.True(result.Success);
		Assert.Equal(1, result.CreatedEntriesCount);

		ManualInvestmentReturn? created = await GetManualInvestmentFromToday(_testObjects.TestUser2ManualCategory.Id);
		Assert.NotNull(created);
	}

	[Fact]
	public async Task ProcessRecurringManualInvestmentReturns_RecurrenceNotDue_DoesNotCreateNewManualInvestmentReturn()
	{
		ManualInvestmentReturn recurring = CreateManualInvestmentReturn(
			_testObjects.TestUser1ManualCategory,
			DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-6)),
			DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30)),
			RecurrenceFrequency.Weekly,
			_defaultPercentage,
			userId: _user1Id);
		_context.ManualInvestmentReturns.Add(recurring);
		await _context.SaveChangesAsync();

		ProcessingResult result = await _service.ProcessRecurringManualInvestmentReturns();

		Assert.True(result.Success);
		Assert.Equal(0, result.CreatedEntriesCount);
	}

	[Fact]
	public async Task ProcessRecurringManualInvestmentReturns_RecurrenceAlreadyExistsForToday_DoesNotCreateDuplicate()
	{
		ManualInvestmentReturn recurring = CreateManualInvestmentReturn(
			_testObjects.TestUser1ManualCategory,
			DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-7)),
			DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30)),
			RecurrenceFrequency.Weekly,
			_defaultPercentage,
			userId: _user1Id);

		ManualInvestmentReturn existingToday = new()
		{
			ManualInvestmentCategoryId = _testObjects.TestUser1ManualCategory.Id,
			ManualInvestmentCategory = _testObjects.TestUser1ManualCategory,
			StartDate = DateOnly.FromDateTime(DateTime.UtcNow).AddMonths(-1),
			EndDate = DateOnly.FromDateTime(DateTime.UtcNow),
			ManualInvestmentRecurrenceEndDate = DateOnly.FromDateTime(DateTime.UtcNow).AddDays(30),
			ManualInvestmentPercentageReturn = _defaultPercentage,
			ManualInvestmentRecurrenceFrequency = RecurrenceFrequency.Weekly,
			UserId = _user1Id
		};

		_context.ManualInvestmentReturns.AddRange(recurring, existingToday);
		await _context.SaveChangesAsync();

		ProcessingResult result = await _service.ProcessRecurringManualInvestmentReturns();

		Assert.True(result.Success);
		Assert.Equal(0, result.CreatedEntriesCount);
	}

	[Fact]
	public async Task ProcessRecurringManualInvestmentReturns_MultipleRecurrencesDue_CreatesAllNewManualInvestmentReturns()
	{
		ManualInvestmentReturn user1Recurring = CreateManualInvestmentReturn(
			_testObjects.TestUser1ManualCategory,
			DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-7)),
			DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30)),
			RecurrenceFrequency.Weekly,
			_defaultPercentage,
			userId: _user1Id);
		ManualInvestmentReturn user2Recurring = CreateManualInvestmentReturn(
			_testObjects.TestUser2ManualCategory,
			DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-7)),
			DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30)),
			RecurrenceFrequency.Weekly,
			_defaultPercentage,
			userId: _testObjects.TestUser2ManualCategory.UserId!);

		_context.ManualInvestmentReturns.AddRange(user1Recurring, user2Recurring);
		await _context.SaveChangesAsync();

		ProcessingResult result = await _service.ProcessRecurringManualInvestmentReturns();

		Assert.True(result.Success);
		Assert.Equal(2, result.CreatedEntriesCount);

		DateOnly today = DateOnly.FromDateTime(DateTime.UtcNow);
		List<ManualInvestmentReturn> created = await _context.ManualInvestmentReturns
			.Where(ir => ir.EndDate == today)
			.ToListAsync();

		Assert.Equal(2, created.Count);
		Assert.Contains(created, ir => ir.ManualInvestmentCategoryId == _testObjects.TestUser1ManualCategory.Id);
		Assert.Contains(created, ir => ir.ManualInvestmentCategoryId == _testObjects.TestUser2ManualCategory.Id);
	}

	[Fact]
	public async Task ProcessRecurringManualInvestmentReturns_NewManualInvestmentReturnHasNoRecurrence()
	{
		ManualInvestmentReturn recurring = CreateManualInvestmentReturn(
			_testObjects.TestUser1ManualCategory,
			DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-7)),
			DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30)),
			RecurrenceFrequency.Weekly,
			_defaultPercentage,
			userId: _user1Id);
		_context.ManualInvestmentReturns.Add(recurring);
		await _context.SaveChangesAsync();

		await _service.ProcessRecurringManualInvestmentReturns();

		ManualInvestmentReturn? created = await GetManualInvestmentFromToday(_testObjects.TestUser1ManualCategory.Id);
		Assert.NotNull(created);
		Assert.Null(created.ManualInvestmentRecurrenceFrequency);
		Assert.Null(created.ManualInvestmentRecurrenceEndDate);
	}
}
