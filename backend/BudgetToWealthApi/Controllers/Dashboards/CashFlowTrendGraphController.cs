using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Authorize]
[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
public class CashFlowTrendGraphController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CashFlowTrendGraphController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get(
        [FromQuery] DateOnly? startDate = null,
        [FromQuery] DateOnly? endDate = null)
    {
        string? userId = User.GetUserId();
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        List<CashFlowEntry> allCashFlowEntries = await _context.CashFlowEntries
            .Include(entry => entry.Category)
            .Where(entry => entry.UserId == userId)
            .ToListAsync();
        if (!allCashFlowEntries.Any())
            return Ok(new CashFlowTrendGraph { Entries = new List<CashFlowTrendGraphEntry>() });

        DateOnly effectiveStartDate = startDate ?? allCashFlowEntries.Min(s => s.Date);
        DateOnly effectiveEndDate = endDate ?? allCashFlowEntries.Max(s => s.Date);

        CashFlowTrendGraph dashboard = CreateCashFlowTrendGraph(allCashFlowEntries, effectiveStartDate, effectiveEndDate);

        if (dashboard.Entries.Count > 100)
            dashboard.Entries = dashboard.Entries.Take(100).ToList();

        return Ok(dashboard);
    }

    private CashFlowTrendGraph CreateCashFlowTrendGraph(List<CashFlowEntry> allCashFlowEntries, DateOnly effectiveStartDate, DateOnly effectiveEndDate)
    {
        CashFlowTrendGraph dashboard = new CashFlowTrendGraph();

        List<DateOnly> monthDates = GetAllUniqueMonthDates(effectiveStartDate, effectiveEndDate);

        foreach (DateOnly monthDate in monthDates)
        {
            CashFlowTrendGraphEntry entry = new CashFlowTrendGraphEntry();
            entry.Date = monthDate;

            List<CashFlowEntry> entriesForMonth = allCashFlowEntries.Where(s => s.Date.Year == monthDate.Year && s.Date.Month == monthDate.Month).ToList();

            entry.IncomeInCents = entriesForMonth
                .Where(c => c.Category?.CategoryType == CashFlowType.Income)
                .Sum(c => c.Amount);

            entry.ExpensesInCents = entriesForMonth
                .Where(c => c.Category?.CategoryType == CashFlowType.Expense)
                .Sum(c => c.Amount);

            entry.NetCashFlowInCents = entry.IncomeInCents - entry.ExpensesInCents;
            dashboard.Entries.Add(entry);
        }
        return dashboard;
    }

    private List<DateOnly> GetAllUniqueMonthDates(DateOnly startDate, DateOnly endDate)
    {
        List<DateOnly> monthDates = new List<DateOnly>();
        for (DateOnly date = startDate; date <= endDate; date = date.AddDays(1))
        {
            if (monthDates.Any(m => m.Year == date.Year && m.Month == date.Month))
                continue;
            monthDates.Add(date);
        }
        return monthDates;
    }
}