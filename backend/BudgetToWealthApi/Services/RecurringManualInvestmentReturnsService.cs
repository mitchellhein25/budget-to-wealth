using Microsoft.EntityFrameworkCore;

public class RecurringManualInvestmentReturnsService
{
    private readonly ApplicationDbContext _context;
    private readonly RecurrenceService _recurrenceService;
    private readonly DateOnly _today;

    public RecurringManualInvestmentReturnsService(ApplicationDbContext context, RecurrenceService recurrenceService)
    {
        _context = context;
        _recurrenceService = recurrenceService;
        _today = DateOnly.FromDateTime(DateTime.UtcNow);
    }

    public async Task<ProcessingResult> ProcessRecurringManualInvestmentReturns()
    {
        ProcessingResult result = new ProcessingResult
        {
            ProcessedDate = _today,
            Success = true
        };

        try
        {
            List<ManualInvestmentReturn> allRecurringInvestmentReturns = await GetActiveRecurringInvestmentReturns();
            List<ManualInvestmentReturn> recurringInvestmentReturnsNotAlreadyCreated = await GetRecurrencesNotAlreadyCreated(allRecurringInvestmentReturns);
            List<ManualInvestmentReturn> recurringInvestmentReturnsToCreateToday = recurringInvestmentReturnsNotAlreadyCreated
                .Where(ShouldCreateInvestmentReturnForToday)
                .ToList();

            if (!recurringInvestmentReturnsToCreateToday.Any())
                return result;

            List<ManualInvestmentReturn> newInvestmentReturns = CreateInvestmentReturnsFromTemplates(recurringInvestmentReturnsToCreateToday);

            _context.ManualInvestmentReturns.AddRange(newInvestmentReturns);
            await _context.SaveChangesAsync();

            result.CreatedEntriesCount = newInvestmentReturns.Count;
            result.Success = true;
        }
        catch (Exception ex)
        {
            result.Success = false;
            result.ErrorMessage = ex.Message;
        }

        return result;
    }

    private async Task<List<ManualInvestmentReturn>> GetActiveRecurringInvestmentReturns()
    {
        var entries = await _context.ManualInvestmentReturns
            .Where(investmentReturn => investmentReturn.ManualInvestmentRecurrenceFrequency != null)
            .Include(investmentReturn => investmentReturn.ManualInvestmentCategory)
            .ToListAsync();
            
        return entries.Where(entry => _recurrenceService.IsRecurrenceActive(entry.ManualInvestmentRecurrenceEndDate)).ToList();
    }

    private async Task<List<ManualInvestmentReturn>> GetRecurrencesNotAlreadyCreated(List<ManualInvestmentReturn> allRecurringInvestmentReturns)
    {
        if (!allRecurringInvestmentReturns.Any())
            return new List<ManualInvestmentReturn>();

        List<ManualInvestmentReturn> existingInvestmentReturnsToday = await _context.ManualInvestmentReturns
            .Where(ir => ir.ManualInvestmentReturnDate == _today)
            .ToListAsync();

        List<ManualInvestmentReturn> filteredInvestmentReturns = allRecurringInvestmentReturns
            .Where(recurringInvestmentReturn => !existingInvestmentReturnsToday.Any(existing => 
                existing.ManualInvestmentCategoryId == recurringInvestmentReturn.ManualInvestmentCategoryId &&
                existing.UserId == recurringInvestmentReturn.UserId &&
                existing.ManualInvestmentRecurrenceFrequency == recurringInvestmentReturn.ManualInvestmentRecurrenceFrequency))
            .ToList();

        return filteredInvestmentReturns;
    }

    private bool ShouldCreateInvestmentReturnForToday(ManualInvestmentReturn recurrence)
    {
        return _recurrenceService.ShouldCreateRecurrenceForToday(
            recurrence.ManualInvestmentReturnDate, 
            recurrence.ManualInvestmentRecurrenceFrequency!.Value);
    }

    private List<ManualInvestmentReturn> CreateInvestmentReturnsFromTemplates(List<ManualInvestmentReturn> templates)
    {
        return templates.Select(template => new ManualInvestmentReturn
        {
            ManualInvestmentCategoryId = template.ManualInvestmentCategoryId,
            ManualInvestmentCategory = template.ManualInvestmentCategory,
            ManualInvestmentReturnDate = _today,
            ManualInvestmentPercentageReturn = template.ManualInvestmentPercentageReturn,
            UserId = template.UserId
        }).ToList();
    }
}
