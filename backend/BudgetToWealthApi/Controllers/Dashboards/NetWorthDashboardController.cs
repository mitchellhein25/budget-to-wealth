using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Authorize]
[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
public class NetWorthDashboardController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public NetWorthDashboardController(ApplicationDbContext context)
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
            return Ok(new NetWorthDashboard { Entries = new List<NetWorthDashboardEntry>() });

        DateOnly effectiveStartDate = startDate ?? allSnapshots.Min(s => s.Date);
        DateOnly effectiveEndDate = endDate ?? allSnapshots.Max(s => s.Date);

        Dictionary<Guid, long> holdingBalances = InitializeHoldingBalancesBeforeStartDate(allSnapshots, effectiveStartDate);

        NetWorthDashboard dashboard = CreateNetWorthDashboard(allSnapshots, effectiveStartDate, effectiveEndDate, holdingBalances);

        if (interval == null)
            interval = CalculateInterval(dashboard, interval);

        dashboard.Entries = dashboard.Entries
            .Where(e => e.Date.DayNumber % (int)interval == 0)
            .ToList();

        if (dashboard.Entries.Count > 100)
            dashboard.Entries = dashboard.Entries.Take(100).ToList();

        return Ok(dashboard);
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

    private NetWorthDashboard CreateNetWorthDashboard(List<HoldingSnapshot> allSnapshots, DateOnly effectiveStartDate, DateOnly effectiveEndDate, Dictionary<Guid, long> holdingBalances)
    {
        NetWorthDashboard dashboard = new NetWorthDashboard();

        for (DateOnly date = effectiveStartDate; date <= effectiveEndDate; date = date.AddDays(1))
        {
            NetWorthDashboardEntry entry = new NetWorthDashboardEntry();
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
            dashboard.Entries.Add(entry);
        }
        return dashboard;
    }

    private IntervalType CalculateInterval(NetWorthDashboard dashboard, IntervalType? interval)
    {
        if (dashboard.Entries.Count > 365 * 2)
            return IntervalType.Yearly;
        if (dashboard.Entries.Count > 30 * 2)
            return IntervalType.Monthly;
        return IntervalType.Daily;
    }
}