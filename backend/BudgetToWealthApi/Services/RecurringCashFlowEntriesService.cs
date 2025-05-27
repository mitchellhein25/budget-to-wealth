using Microsoft.EntityFrameworkCore;

class RecurringCashFlowEntriesService
{
    private readonly ApplicationDbContext _context;
    private DateOnly _today;

    public RecurringCashFlowEntriesService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ProcessingResult> ProcessRecurringEntries()
    {
        _today = DateOnly.FromDateTime(DateTime.UtcNow);
        ProcessingResult result = new ProcessingResult { ProcessedDate = _today };
        try
        {
            List<CashFlowEntry> allRecurringEntries = await GetActiveRecurringEntries();
            List<CashFlowEntry> recurringEntriesNotAlreadyCreated = await GetRecurrencesNotAlreadyCreated(allRecurringEntries);
            List<CashFlowEntry> recurringEntriesToCreateToday = recurringEntriesNotAlreadyCreated.Where(ShouldCreateEntryForToday)
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
        return await _context.CashFlowEntries
            .Where(entry => entry.RecurrenceFrequency != null && 
                       (entry.RecurrenceEndDate == null || entry.RecurrenceEndDate >= _today) &&
                        entry.Date <= _today)
            .ToListAsync();
    }

    private async Task<List<CashFlowEntry>> GetRecurrencesNotAlreadyCreated(List<CashFlowEntry> allRecurringEntries)
    {
        if (!allRecurringEntries.Any())
            return new List<CashFlowEntry>();

        List<string> userIds = allRecurringEntries.Select(e => e.UserId).Distinct().ToList();

        List<CashFlowEntry> existingEntriesToday = await _context.CashFlowEntries
            .Where(e => e.Date == _today && userIds.Contains(e.UserId))
            .ToListAsync();

        List<CashFlowEntry> filteredEntries = allRecurringEntries
            .Where(recurringEntry => !existingEntriesToday.Any(existing => existing.IsSameRecurrence(recurringEntry)))
            .ToList();

        return filteredEntries;
    }

    private bool ShouldCreateEntryForToday(CashFlowEntry recurrence)
    {
        return recurrence.RecurrenceFrequency 
        switch
        {
            RecurrenceFrequency.Weekly => IsWeeklyRecurrenceDate(recurrence.Date),
            RecurrenceFrequency.Every2Weeks => IsEvery2WeeksRecurrenceDate(recurrence.Date),
            RecurrenceFrequency.Monthly => IsMonthlyRecurrenceDate(recurrence.Date),
            _ => false
        };
    }

    private bool IsWeeklyRecurrenceDate(DateOnly recurrenceDate)
    {
        int daysDifference = _today.DayNumber - recurrenceDate.DayNumber;
        return daysDifference % 7 == 0 && daysDifference >= 7;
    }

    private bool IsEvery2WeeksRecurrenceDate(DateOnly recurrenceDate)
    {
        int daysDifference = _today.DayNumber - recurrenceDate.DayNumber;
        return daysDifference % 14 == 0 && daysDifference >= 14;
    }

    private bool IsMonthlyRecurrenceDate(DateOnly recurrenceDate)
    {
        int expectedDay = CalculateMonthlyRecurrenceDay(recurrenceDate);
        DateOnly expectedDate = new DateOnly(_today.Year, _today.Month, expectedDay);
        
        return _today == expectedDate && 
               ((_today.Year > recurrenceDate.Year) || 
                (_today.Year == recurrenceDate.Year && _today.Month > recurrenceDate.Month));
    }

    private int CalculateMonthlyRecurrenceDay(DateOnly recurrenceDate)
    {
        int daysInCurrentMonth = DateTime.DaysInMonth(_today.Year, _today.Month);
        int daysInRecurrenceMonth = DateTime.DaysInMonth(recurrenceDate.Year, recurrenceDate.Month);
        
        if (recurrenceDate.Day == daysInRecurrenceMonth)
            return daysInCurrentMonth;
        
        return Math.Min(recurrenceDate.Day, daysInCurrentMonth);
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