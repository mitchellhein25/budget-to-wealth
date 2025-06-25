using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Authorize]
[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
public class NetWorthTrendGraphController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public NetWorthTrendGraphController(ApplicationDbContext context)
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

        List<HoldingSnapshot> allSnapshots = await _context.HoldingSnapshots
            .Include(snapshot => snapshot.Holding)
            .Where(snapshot => snapshot.UserId == userId)
            .ToListAsync();
        if (!allSnapshots.Any())
            return Ok(new NetWorthTrendGraph { Entries = new List<NetWorthTrendGraphEntry>() });

        DateOnly effectiveStartDate = startDate ?? allSnapshots.Min(s => s.Date);
        DateOnly effectiveEndDate = endDate ?? allSnapshots.Max(s => s.Date);

        Dictionary<Guid, long> holdingBalances = InitializeHoldingBalancesBeforeStartDate(allSnapshots, effectiveStartDate);

        NetWorthTrendGraph trendGraph = CreateNetWorthTrendGraph(allSnapshots, effectiveStartDate, effectiveEndDate, holdingBalances);

        if (interval == null)
            interval = CalculateInterval(trendGraph, interval);

        trendGraph.Entries = FilterEntriesByInterval(trendGraph.Entries, interval.Value);

        if (trendGraph.Entries.Count > 100)
            trendGraph.Entries = trendGraph.Entries.Take(100).ToList();

        return Ok(trendGraph);
    }

    private Dictionary<Guid, long> InitializeHoldingBalancesBeforeStartDate(List<HoldingSnapshot> allSnapshots, DateOnly startDate)
    {
        Dictionary<Guid, long> holdingBalances = new Dictionary<Guid, long>();

        IEnumerable<Guid> userHoldingIds = allSnapshots.Select(s => s.HoldingId).Distinct();
        foreach (Guid holdingId in userHoldingIds)
        {
            HoldingSnapshot? lastSnapshot = allSnapshots
                .Where(s => s.HoldingId == holdingId && s.Date < startDate)
                .OrderByDescending(s => s.Date)
                .FirstOrDefault();
            holdingBalances[holdingId] = lastSnapshot?.Balance ?? 0;
        }
        return holdingBalances;
    }

    private NetWorthTrendGraph CreateNetWorthTrendGraph(List<HoldingSnapshot> allSnapshots, DateOnly effectiveStartDate, DateOnly effectiveEndDate, Dictionary<Guid, long> holdingBalances)
    {
        NetWorthTrendGraph trendGraph = new NetWorthTrendGraph();

        for (DateOnly date = effectiveStartDate; date <= effectiveEndDate; date = date.AddDays(1))
        {
            NetWorthTrendGraphEntry entry = new NetWorthTrendGraphEntry();
            entry.Date = date;

            List<HoldingSnapshot> snapshotsForDate = allSnapshots.Where(s => s.Date == date).ToList();
            foreach (HoldingSnapshot? snapshot in snapshotsForDate)
                holdingBalances[snapshot.HoldingId] = snapshot.Balance;

            List<Holding> userHoldings = allSnapshots.Select(s => s.Holding!).Distinct().ToList();

            entry.AssetValueInCents = userHoldings
                .Where(h => h.Type == HoldingType.Asset)
                .Sum(h => holdingBalances.GetValueOrDefault(h.Id, 0));

            entry.DebtValueInCents = userHoldings
                .Where(h => h.Type == HoldingType.Debt)
                .Sum(h => holdingBalances.GetValueOrDefault(h.Id, 0));

            entry.NetWorthInCents = entry.AssetValueInCents - entry.DebtValueInCents;
            trendGraph.Entries.Add(entry);
        }
        return trendGraph;
    }

    private IntervalType CalculateInterval(NetWorthTrendGraph trendGraph, IntervalType? interval)
    {
        if (trendGraph.Entries.Count > 365 * 2)
            return IntervalType.Yearly;
        if (trendGraph.Entries.Count > 30 * 2)
            return IntervalType.Monthly;
        return IntervalType.Daily;
    }

    private List<NetWorthTrendGraphEntry> FilterEntriesByInterval(List<NetWorthTrendGraphEntry> entries, IntervalType interval)
    {
        return interval switch
        {
            IntervalType.Daily => entries,
            IntervalType.Monthly => entries.Where(e => e.Date.Day == 1).ToList(),
            IntervalType.Yearly => entries.Where(e => e.Date.Day == 1 && e.Date.Month == 1).ToList(),
            _ => entries
        };
    }
}