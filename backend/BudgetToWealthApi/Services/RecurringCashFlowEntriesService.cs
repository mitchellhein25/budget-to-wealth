using Microsoft.EntityFrameworkCore;

public class RecurringCashFlowEntriesService
{
    private readonly ApplicationDbContext _context;
    private readonly RecurrenceService _recurrenceService;
    private readonly DateOnly _today;

    public RecurringCashFlowEntriesService(ApplicationDbContext context)
    {
        _context = context;
        _recurrenceService = new RecurrenceService();
        _today = DateOnly.FromDateTime(DateTime.UtcNow);
    }

    public async Task<ProcessingResult> ProcessRecurringEntries()
    {
        ProcessingResult result = new ProcessingResult
        {
            ProcessedDate = _today,
            Success = true
        };
        
        try
        {
            List<CashFlowEntry> allRecurringEntries = await GetActiveRecurringEntries();
            List<CashFlowEntry> recurringEntriesNotAlreadyCreated = await GetRecurrencesNotAlreadyCreated(allRecurringEntries);
            List<CashFlowEntry> recurringEntriesToCreateToday = recurringEntriesNotAlreadyCreated
                .Where(ShouldCreateEntryForToday)
                .ToList();

            if (!recurringEntriesToCreateToday.Any())
                return result;

            List<CashFlowEntry> newEntries = CreateEntriesFromEntries(recurringEntriesToCreateToday);

            _context.CashFlowEntries.AddRange(newEntries);
            await _context.SaveChangesAsync();

            result.CreatedEntriesCount = newEntries.Count;
            result.Success = true;
        }
        catch (Exception ex)
        {
            result.Success = false;
            result.ErrorMessage = ex.Message;
        }

        return result;
    }

    private async Task<List<CashFlowEntry>> GetActiveRecurringEntries()
    {
        var entries = await _context.CashFlowEntries
            .Where(entry => entry.RecurrenceFrequency != null)
            .ToListAsync();
            
        return entries.Where(entry => _recurrenceService.IsRecurrenceActive(entry.RecurrenceEndDate)).ToList();
    }

    private async Task<List<CashFlowEntry>> GetRecurrencesNotAlreadyCreated(List<CashFlowEntry> allRecurringEntries)
    {
        if (!allRecurringEntries.Any())
            return new List<CashFlowEntry>();

        List<string> userIds = allRecurringEntries.Select(entry => entry.UserId ?? "").Distinct().ToList();

        List<CashFlowEntry> existingEntriesToday = await _context.CashFlowEntries
            .Where(entry => entry.Date == _today && userIds.Contains(entry.UserId ?? ""))
            .ToListAsync();

        List<CashFlowEntry> filteredEntries = allRecurringEntries
            .Where(recurringEntry => !existingEntriesToday.Any(existing => existing.IsSameRecurrence(recurringEntry)))
            .ToList();

        return filteredEntries;
    }

    private bool ShouldCreateEntryForToday(CashFlowEntry recurrence)
    {
        return _recurrenceService.ShouldCreateRecurrenceForToday(recurrence.Date, recurrence.RecurrenceFrequency!.Value);
    }

    private List<CashFlowEntry> CreateEntriesFromEntries(List<CashFlowEntry> entries)
    {
        return entries.Select(template => new CashFlowEntry
        {
            Amount = template.Amount,
            EntryType = template.EntryType,
            CategoryId = template.CategoryId,
            Date = _today,
            Description = template.Description,
            UserId = template.UserId,
        }).ToList();
    }
}

public class ProcessingResult
{
    public bool Success { get; set; }
    public DateOnly ProcessedDate { get; set; }
    public int CreatedEntriesCount { get; set; }
    public string? ErrorMessage { get; set; }
}