using Microsoft.EntityFrameworkCore;

public class RecurringInvestmentReturnsService
{
    private readonly ApplicationDbContext _context;
    private readonly RecurrenceService _recurrenceService;
    private readonly DateOnly _today;

    public RecurringInvestmentReturnsService(ApplicationDbContext context, RecurrenceService recurrenceService)
    {
        _context = context;
        _recurrenceService = recurrenceService;
        _today = DateOnly.FromDateTime(DateTime.UtcNow);
    }

    public async Task<ProcessingResult> ProcessRecurringInvestmentReturns()
    {
        ProcessingResult result = new ProcessingResult
        {
            ProcessedDate = _today,
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
                investmentReturn.ManualInvestmentRecurrenceFrequency != null)
            .Include(investmentReturn => investmentReturn.ManualInvestmentCategory)
            .ToListAsync();
            
        return entries.Where(entry => _recurrenceService.IsRecurrenceActive(entry.ManualInvestmentRecurrenceEndDate)).ToList();
    }

    private async Task<List<InvestmentReturn>> GetRecurrencesNotAlreadyCreated(List<InvestmentReturn> allRecurringInvestmentReturns)
    {
        if (!allRecurringInvestmentReturns.Any())
            return new List<InvestmentReturn>();

        List<InvestmentReturn> existingInvestmentReturnsToday = await _context.InvestmentReturns
            .Where(ir => 
                ir.ManualInvestmentCategoryId != null &&
                ir.ManualInvestmentReturnDate == _today)
            .ToListAsync();

        List<InvestmentReturn> filteredInvestmentReturns = allRecurringInvestmentReturns
            .Where(recurringInvestmentReturn => !existingInvestmentReturnsToday.Any(existing => 
                existing.ManualInvestmentCategoryId == recurringInvestmentReturn.ManualInvestmentCategoryId &&
                existing.UserId == recurringInvestmentReturn.UserId &&
                existing.ManualInvestmentRecurrenceFrequency == recurringInvestmentReturn.ManualInvestmentRecurrenceFrequency))
            .ToList();

        return filteredInvestmentReturns;
    }

    private bool ShouldCreateInvestmentReturnForToday(InvestmentReturn recurrence)
    {
        if (recurrence.ManualInvestmentReturnDate == null)
            return false;

        return _recurrenceService.ShouldCreateRecurrenceForToday(
            recurrence.ManualInvestmentReturnDate.Value, 
            recurrence.ManualInvestmentRecurrenceFrequency!.Value);
    }

    private List<InvestmentReturn> CreateInvestmentReturnsFromTemplates(List<InvestmentReturn> templates)
    {
        return templates.Select(template => new InvestmentReturn
        {
            ManualInvestmentCategoryId = template.ManualInvestmentCategoryId,
            ManualInvestmentCategory = template.ManualInvestmentCategory,
            ManualInvestmentReturnDate = _today,
            ManualInvestmentPercentageReturn = template.ManualInvestmentPercentageReturn,
            TotalContributions = template.TotalContributions,
            TotalWithdrawals = template.TotalWithdrawals,
            UserId = template.UserId
        }).ToList();
    }
}
