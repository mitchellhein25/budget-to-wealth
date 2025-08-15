using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

public class RecurringInvestmentReturnsServiceTests : IDisposable
{
	private readonly string _user1Id = "auth0|user1";
	private const long _defaultContributions = 1000;
	private const long _defaultWithdrawals = 0;
	private const decimal _defaultPercentage = 0.1m;
	private ApplicationDbContext _context;
	private readonly IDbContextTransaction _transaction;
	private readonly RecurringInvestmentReturnsService _service;
	private readonly RecurrenceService _recurrenceService;
	private RecurringInvestmentReturnsServiceTestObjects _testObjects = null!;

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
		_context.InvestmentReturns.Add(_testObjects.User1WeeklyRecurringInvestmentReturn);
		_context.InvestmentReturns.Add(_testObjects.User1MonthlyRecurringInvestmentReturn);
		_context.InvestmentReturns.Add(_testObjects.User2Every2WeeksRecurringInvestmentReturn);
		_context.InvestmentReturns.Add(_testObjects.DefaultNonRecurringInvestmentReturn);
		_context.InvestmentReturns.Add(_testObjects.User2ExpiredRecurringInvestmentReturn);
		_context.SaveChanges();
	}

	private async Task ClearExistingRecurringTemplates()
	{
		var existing = _context.InvestmentReturns.Where(ir => ir.ManualInvestmentRecurrenceFrequency != null).ToList();
		if (existing.Any())
		{
			_context.InvestmentReturns.RemoveRange(existing);
			await _context.SaveChangesAsync();
		}
	}

	private InvestmentReturn CreateInvestmentReturn(
		ManualInvestmentCategory category,
		DateOnly? returnDate,
		DateOnly? recurrenceEndDate,
		RecurrenceFrequency? recurrenceFrequency,
		long contributions = _defaultContributions,
		long withdrawals = _defaultWithdrawals,
		decimal percentage = _defaultPercentage,
		string? userId = null)
	{
		return new InvestmentReturn
		{
			ManualInvestmentCategoryId = category.Id,
            ManualInvestmentCategory = category,
            ManualInvestmentReturnDate = returnDate,
            ManualInvestmentRecurrenceFrequency= recurrenceFrequency,
            ManualInvestmentRecurrenceEndDate = recurrenceEndDate,
			ManualInvestmentPercentageReturn = percentage,
			TotalContributions = contributions,
			TotalWithdrawals = withdrawals,
			UserId = userId
		};
	}

	private async Task<InvestmentReturn?> GetManualInvestmentFromToday(Guid categoryId) =>
		await _context.InvestmentReturns.FirstOrDefaultAsync(ir =>
			ir.ManualInvestmentCategoryId == categoryId &&
			ir.ManualInvestmentReturnDate == DateOnly.FromDateTime(DateTime.UtcNow));

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
		InvestmentReturn nonRecurring = CreateInvestmentReturn(
			_testObjects.DefaultManualCategory,
			DateOnly.FromDateTime(DateTime.UtcNow),
			null,
			null,
			_defaultContributions,
			_defaultWithdrawals,
			_defaultPercentage,
			userId: _user1Id);
		_context.InvestmentReturns.Add(nonRecurring);
		await _context.SaveChangesAsync();

		ProcessingResult result = await _service.ProcessRecurringInvestmentReturns();

		Assert.True(result.Success);
		Assert.Equal(0, result.CreatedEntriesCount);
	}

	[Fact]
	public async Task ProcessRecurringInvestmentReturns_OnlyExpiredRecurringEntries_ReturnsSuccessWithZeroCreatedEntries()
	{
		InvestmentReturn expired = CreateInvestmentReturn(
			_testObjects.TestUser2ManualCategory,
			DateOnly.FromDateTime(DateTime.UtcNow),
			DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-1)),
			RecurrenceFrequency.Weekly,
			_defaultContributions,
			_defaultWithdrawals,
			_defaultPercentage,
			userId: _testObjects.TestUser2ManualCategory.UserId!);
		_context.InvestmentReturns.Add(expired);
		await _context.SaveChangesAsync();

		ProcessingResult result = await _service.ProcessRecurringInvestmentReturns();

		Assert.True(result.Success);
		Assert.Equal(0, result.CreatedEntriesCount);
	}

	[Fact]
	public async Task ProcessRecurringInvestmentReturns_WeeklyRecurrenceDue_CreatesNewInvestmentReturn()
	{
		InvestmentReturn recurring = CreateInvestmentReturn(
			_testObjects.TestUser1ManualCategory,
			DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-7)),
			DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30)),
			RecurrenceFrequency.Weekly,
			_defaultContributions,
			_defaultWithdrawals,
			_defaultPercentage,
			userId: _user1Id);
		_context.InvestmentReturns.Add(recurring);
		await _context.SaveChangesAsync();

		ProcessingResult result = await _service.ProcessRecurringInvestmentReturns();

		Assert.True(result.Success);
		Assert.Equal(1, result.CreatedEntriesCount);

		InvestmentReturn? created = await GetManualInvestmentFromToday(_testObjects.TestUser1ManualCategory.Id);
		Assert.NotNull(created);
		Assert.Equal(recurring.TotalContributions, created.TotalContributions);
		Assert.Equal(recurring.TotalWithdrawals, created.TotalWithdrawals);
		Assert.Equal(recurring.ManualInvestmentPercentageReturn, created.ManualInvestmentPercentageReturn);
	}

	[Fact]
	public async Task ProcessRecurringInvestmentReturns_MonthlyRecurrenceDue_CreatesNewInvestmentReturn()
	{
		InvestmentReturn recurring = CreateInvestmentReturn(
			_testObjects.TestUser1ManualCategory,
			DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(-1)),
			DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30)),
			RecurrenceFrequency.Monthly,
			_defaultContributions,
			_defaultWithdrawals,
			_defaultPercentage,
			userId: _user1Id);
		_context.InvestmentReturns.Add(recurring);
		await _context.SaveChangesAsync();

		ProcessingResult result = await _service.ProcessRecurringInvestmentReturns();

		Assert.True(result.Success);
		Assert.Equal(1, result.CreatedEntriesCount);

		InvestmentReturn? created = await GetManualInvestmentFromToday(_testObjects.TestUser1ManualCategory.Id);
		Assert.NotNull(created);
		Assert.Equal(recurring.TotalContributions, created.TotalContributions);
		Assert.Equal(recurring.TotalWithdrawals, created.TotalWithdrawals);
	}

	[Fact]
	public async Task ProcessRecurringInvestmentReturns_Every2WeeksRecurrenceDue_CreatesNewInvestmentReturn()
	{
		InvestmentReturn recurring = CreateInvestmentReturn(
			_testObjects.TestUser2ManualCategory,
			DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-14)),
			DateOnly.FromDateTime(DateTime.UtcNow.AddDays(14)),
			RecurrenceFrequency.Every2Weeks,
			_defaultContributions,
			_defaultWithdrawals,
			_defaultPercentage,
			userId: _testObjects.TestUser2ManualCategory.UserId!);
		_context.InvestmentReturns.Add(recurring);
		await _context.SaveChangesAsync();

		ProcessingResult result = await _service.ProcessRecurringInvestmentReturns();

		Assert.True(result.Success);
		Assert.Equal(1, result.CreatedEntriesCount);

		InvestmentReturn? created = await GetManualInvestmentFromToday(_testObjects.TestUser2ManualCategory.Id);
		Assert.NotNull(created);
		Assert.Equal(recurring.TotalContributions, created.TotalContributions);
	}

	[Fact]
	public async Task ProcessRecurringInvestmentReturns_RecurrenceNotDue_DoesNotCreateNewInvestmentReturn()
	{
		InvestmentReturn recurring = CreateInvestmentReturn(
			_testObjects.TestUser1ManualCategory,
			DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-6)),
			DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30)),
			RecurrenceFrequency.Weekly,
			_defaultContributions,
			_defaultWithdrawals,
			_defaultPercentage,
			userId: _user1Id);
		_context.InvestmentReturns.Add(recurring);
		await _context.SaveChangesAsync();

		ProcessingResult result = await _service.ProcessRecurringInvestmentReturns();

		Assert.True(result.Success);
		Assert.Equal(0, result.CreatedEntriesCount);
	}

	[Fact]
	public async Task ProcessRecurringInvestmentReturns_RecurrenceAlreadyExistsForToday_DoesNotCreateDuplicate()
	{
		InvestmentReturn recurring = CreateInvestmentReturn(
			_testObjects.TestUser1ManualCategory,
			DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-7)),
			DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30)),
			RecurrenceFrequency.Weekly,
			_defaultContributions,
			_defaultWithdrawals,
			_defaultPercentage,
			userId: _user1Id);

		InvestmentReturn existingToday = new()
		{
			ManualInvestmentCategoryId = _testObjects.TestUser1ManualCategory.Id,
			ManualInvestmentCategory = _testObjects.TestUser1ManualCategory,
			ManualInvestmentReturnDate = DateOnly.FromDateTime(DateTime.UtcNow),
			ManualInvestmentRecurrenceEndDate = DateOnly.FromDateTime(DateTime.UtcNow).AddDays(30),
			ManualInvestmentPercentageReturn = _defaultPercentage,
			TotalContributions = _defaultContributions,
			TotalWithdrawals = _defaultWithdrawals,
			ManualInvestmentRecurrenceFrequency = RecurrenceFrequency.Weekly,
			UserId = _user1Id
		};

		_context.InvestmentReturns.AddRange(recurring, existingToday);
		await _context.SaveChangesAsync();

		ProcessingResult result = await _service.ProcessRecurringInvestmentReturns();

		Assert.True(result.Success);
		Assert.Equal(0, result.CreatedEntriesCount);
	}

	[Fact]
	public async Task ProcessRecurringInvestmentReturns_MultipleRecurrencesDue_CreatesAllNewInvestmentReturns()
	{
		InvestmentReturn user1Recurring = CreateInvestmentReturn(
			_testObjects.TestUser1ManualCategory,
			DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-7)),
			DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30)),
			RecurrenceFrequency.Weekly,
			_defaultContributions,
			_defaultWithdrawals,
			_defaultPercentage,
			userId: _user1Id);
		InvestmentReturn user2Recurring = CreateInvestmentReturn(
			_testObjects.TestUser2ManualCategory,
			DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-7)),
			DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30)),
			RecurrenceFrequency.Weekly,
			_defaultContributions,
			_defaultWithdrawals,
			_defaultPercentage,
			userId: _testObjects.TestUser2ManualCategory.UserId!);

		_context.InvestmentReturns.AddRange(user1Recurring, user2Recurring);
		await _context.SaveChangesAsync();

		ProcessingResult result = await _service.ProcessRecurringInvestmentReturns();

		Assert.True(result.Success);
		Assert.Equal(2, result.CreatedEntriesCount);

		DateOnly today = DateOnly.FromDateTime(DateTime.UtcNow);
		List<InvestmentReturn> created = await _context.InvestmentReturns
			.Where(ir => ir.ManualInvestmentReturnDate == today)
			.ToListAsync();

		Assert.Equal(2, created.Count);
		Assert.Contains(created, ir => ir.ManualInvestmentCategoryId == _testObjects.TestUser1ManualCategory.Id);
		Assert.Contains(created, ir => ir.ManualInvestmentCategoryId == _testObjects.TestUser2ManualCategory.Id);
	}

	[Fact]
	public async Task ProcessRecurringInvestmentReturns_NewInvestmentReturnHasNoRecurrence()
	{
		InvestmentReturn recurring = CreateInvestmentReturn(
			_testObjects.TestUser1ManualCategory,
			DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-7)),
			DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30)),
			RecurrenceFrequency.Weekly,
			_defaultContributions,
			_defaultWithdrawals,
			_defaultPercentage,
			userId: _user1Id);
		_context.InvestmentReturns.Add(recurring);
		await _context.SaveChangesAsync();

		await _service.ProcessRecurringInvestmentReturns();

		InvestmentReturn? created = await GetManualInvestmentFromToday(_testObjects.TestUser1ManualCategory.Id);
		Assert.NotNull(created);
		Assert.Null(created.ManualInvestmentRecurrenceFrequency);
		Assert.Null(created.ManualInvestmentRecurrenceEndDate);
	}
}
