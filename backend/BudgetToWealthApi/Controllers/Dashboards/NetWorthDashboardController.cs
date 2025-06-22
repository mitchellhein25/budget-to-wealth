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
    public async Task<IActionResult> Get([FromQuery] DateOnly? startDate = null, [FromQuery] DateOnly? endDate = null)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        IQueryable<HoldingSnapshot> query = _context.HoldingSnapshots
            .Where(snapshot => snapshot.UserId == userId);

        if (startDate.HasValue)
            query = query.Where(category => category.Date >= startDate);

        if (endDate.HasValue)
            query = query.Where(category => category.Date <= endDate);

        List<HoldingSnapshot> snapshots = await query.ToListAsync();

        NetWorthDashboard dashboard = new NetWorthDashboard();

        List<DateOnly> dates = snapshots.Select(snapshot => snapshot.Date).Distinct().ToList();
        foreach (DateOnly date in dates)
        {
            NetWorthDashboardEntry entry = new NetWorthDashboardEntry();
            entry.Date = date;
            entry.AssetValueInCents = snapshots.Where(snapshot => snapshot.Date == date && snapshot?.Holding?.Type == HoldingType.Asset)
                                               .Sum(snapshot => snapshot.Balance);
            entry.DebtValueInCents = snapshots.Where(snapshot => snapshot.Date == date && snapshot?.Holding?.Type == HoldingType.Debt)
                                              .Sum(snapshot => snapshot.Balance);
            entry.NetWorthInCents = entry.AssetValueInCents - entry.DebtValueInCents;
            dashboard.Entries.Add(entry);
        }

        return Ok(dashboard);
    }
}