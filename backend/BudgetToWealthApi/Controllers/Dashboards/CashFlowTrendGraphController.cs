using Asp.Versioning;
using BudgetToWealthApi.Services;
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
        [FromQuery] DateOnly? endDate = null,
        [FromQuery] IntervalType? interval = null)
    {
        string? userId = User.GetUserId();
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        List<CashFlowEntry> allCashFlowEntries = await _context.CashFlowEntries
            .Include(cashFlow => cashFlow.Category)
            .Where(cashFlow => cashFlow.UserId == userId)
            .ToListAsync();
        if (!allCashFlowEntries.Any())
            return Ok(new TrendGraph { Entries = new List<TrendGraphEntry>() });

        TrendsService<CashFlowEntry> trendsService = new TrendsService<CashFlowEntry>();
        TrendGraph trendGraph = trendsService.GenerateTrendsGraph(
            allCashFlowEntries,
            cashFlow => cashFlow.Date,
            cashFlow => cashFlow.CategoryId,
            cashFlow => cashFlow?.Amount,
            cashFlow => cashFlow?.Category?.CategoryType == CashFlowType.Income,
            cashFlow => cashFlow?.Category?.CategoryType == CashFlowType.Expense,
            startDate,
            endDate,
            interval);

        return Ok(trendGraph);
    }
}