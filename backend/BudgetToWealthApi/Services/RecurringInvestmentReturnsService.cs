using Microsoft.EntityFrameworkCore;

public class RecurringInvestmentReturnsService
{
    private readonly ApplicationDbContext _context;
    private readonly RecurrenceService _recurrenceService;

    public RecurringInvestmentReturnsService(ApplicationDbContext context, RecurrenceService recurrenceService)
    {
        _context = context;
        _recurrenceService = recurrenceService;
    }

    public async Task<ProcessingResult> ProcessRecurringInvestmentReturns()
    {
        ProcessingResult result = new ProcessingResult
        {
            ProcessedDate = _recurrenceService.GetProcessingDate(),
            Success = true
        };

        try
        {
            List<InvestmentReturn> allRecurringInvestmentReturns = await GetActiveRecurringInvestmentReturns();
            List<InvestmentReturn> recurringInvestmentReturnsNotAlreadyCreated = await GetRecurrencesNotAlreadyCreated(allRecurringInvestmentReturns);
            List<InvestmentReturn> recurringInvestmentReturnsToCreateToday = recurringInvestmentReturnsNotAlreadyCreated
                .Where(ShouldCreateInvestmentReturnForToday)
                .ToList();

            if (!recurringInvestmentReturnsToCreateToday.Any())
                return result;

            List<InvestmentReturn> newInvestmentReturns = CreateInvestmentReturnsFromTemplates(recurringInvestmentReturnsToCreateToday);

            _context.InvestmentReturns.AddRange(newInvestmentReturns);
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

    private async Task<List<InvestmentReturn>> GetActiveRecurringInvestmentReturns()
    {
        var entries = await _context.InvestmentReturns
            .Where(investmentReturn => 
                investmentReturn.ManualInvestmentCategoryId != null &&
                investmentReturn.RecurrenceFrequency != null)
            .Include(investmentReturn => investmentReturn.ManualInvestmentCategory)
            .ToListAsync();
            
        return entries.Where(entry => _recurrenceService.IsRecurrenceActive(entry.RecurrenceEndDate)).ToList();
    }

    private async Task<List<InvestmentReturn>> GetRecurrencesNotAlreadyCreated(List<InvestmentReturn> allRecurringInvestmentReturns)
    {
        if (!allRecurringInvestmentReturns.Any())
            return new List<InvestmentReturn>();

        DateOnly today = _recurrenceService.GetProcessingDate();

        List<InvestmentReturn> existingInvestmentReturnsToday = await _context.InvestmentReturns
            .Where(ir => 
                ir.ManualInvestmentCategoryId != null &&
                ir.ManualInvestmentStartDate == today)
            .ToListAsync();

        List<InvestmentReturn> filteredInvestmentReturns = allRecurringInvestmentReturns
            .Where(recurringInvestmentReturn => !existingInvestmentReturnsToday.Any(existing => 
                existing.ManualInvestmentCategoryId == recurringInvestmentReturn.ManualInvestmentCategoryId &&
                existing.UserId == recurringInvestmentReturn.UserId &&
                existing.RecurrenceFrequency == recurringInvestmentReturn.RecurrenceFrequency))
            .ToList();

        return filteredInvestmentReturns;
    }

    private bool ShouldCreateInvestmentReturnForToday(InvestmentReturn recurrence)
    {
        if (recurrence.ManualInvestmentStartDate == null)
            return false;

        return _recurrenceService.ShouldCreateRecurrenceForToday(
            recurrence.ManualInvestmentStartDate.Value, 
            recurrence.RecurrenceFrequency!.Value);
    }

    private List<InvestmentReturn> CreateInvestmentReturnsFromTemplates(List<InvestmentReturn> templates)
    {
        DateOnly today = _recurrenceService.GetProcessingDate();
        
        return templates.Select(template => new InvestmentReturn
        {
            ManualInvestmentCategoryId = template.ManualInvestmentCategoryId,
            ManualInvestmentCategory = template.ManualInvestmentCategory,
            ManualInvestmentStartDate = today,
            ManualInvestmentEndDate = CalculateEndDate(today, template.ManualInvestmentStartDate, template.ManualInvestmentEndDate),
            ManualInvestmentPercentageReturn = template.ManualInvestmentPercentageReturn,
            TotalContributions = template.TotalContributions,
            TotalWithdrawals = template.TotalWithdrawals,
            UserId = template.UserId
        }).ToList();
    }

    private DateOnly CalculateEndDate(DateOnly newStartDate, DateOnly? originalStartDate, DateOnly? originalEndDate)
    {
        if (originalStartDate == null || originalEndDate == null)
            return newStartDate;

        int daysDifference = originalEndDate.Value.DayNumber - originalStartDate.Value.DayNumber;
        return newStartDate.AddDays(daysDifference);
    }
}
