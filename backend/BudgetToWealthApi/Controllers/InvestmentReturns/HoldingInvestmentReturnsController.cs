using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Authorize]
[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
public class HoldingInvestmentReturnsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public HoldingInvestmentReturnsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] DateOnly? startDate, [FromQuery] DateOnly? endDate)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        IQueryable<HoldingInvestmentReturn> query = _context.HoldingInvestmentReturns
                                                     .Where(investmentReturn => investmentReturn.UserId == userId);

        if (startDate.HasValue && endDate.HasValue)
        {
            query = query.Where(investmentReturn =>
                investmentReturn.StartHoldingSnapshot != null &&
                investmentReturn.EndHoldingSnapshot != null &&
                investmentReturn.StartHoldingSnapshot.Date >= startDate &&
                investmentReturn.EndHoldingSnapshot.Date <= endDate);
        }
        else if (startDate.HasValue)
        {
            query = query.Where(investmentReturn =>
                investmentReturn.EndHoldingSnapshot != null &&
                investmentReturn.EndHoldingSnapshot.Date >= startDate);
        }
        else if (endDate.HasValue)
        {
            query = query.Where(investmentReturn =>
                investmentReturn.StartHoldingSnapshot != null &&
                investmentReturn.StartHoldingSnapshot.Date <= endDate);
        }

        query = query.Include(investmentReturn => investmentReturn.StartHoldingSnapshot)
                     .ThenInclude(snapshot => snapshot.Holding)
                     .ThenInclude(holding => holding.HoldingCategory)
                     .Include(investmentReturn => investmentReturn.EndHoldingSnapshot)
                     .ThenInclude(snapshot => snapshot.Holding)
                     .ThenInclude(holding => holding.HoldingCategory);

        List<HoldingInvestmentReturn> investmentReturns = await query.ToListAsync();
        return Ok(investmentReturns);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] HoldingInvestmentReturn investmentReturn)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        IActionResult? validationResult = await ValidateInvestmentReturn(investmentReturn, userId);
        if (validationResult != null)
            return validationResult;

        investmentReturn.UserId = userId;
        _context.HoldingInvestmentReturns.Add(investmentReturn);
        await _context.SaveChangesAsync();

        return StatusCode(StatusCodes.Status201Created, investmentReturn);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] HoldingInvestmentReturn updatedInvestmentReturn)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        HoldingInvestmentReturn? existingInvestmentReturn = await _context.HoldingInvestmentReturns
            .FirstOrDefaultAsync(investmentReturn => investmentReturn.Id == id && investmentReturn.UserId == userId);

        if (existingInvestmentReturn == null)
            return NotFound();

        IActionResult? validationResult = await ValidateInvestmentReturn(updatedInvestmentReturn, userId);
        if (validationResult != null)
            return validationResult;
        
        existingInvestmentReturn.StartHoldingSnapshotId = updatedInvestmentReturn.StartHoldingSnapshotId;
        existingInvestmentReturn.EndHoldingSnapshotId = updatedInvestmentReturn.EndHoldingSnapshotId;

        existingInvestmentReturn.TotalContributions = updatedInvestmentReturn.TotalContributions;
        existingInvestmentReturn.TotalWithdrawals = updatedInvestmentReturn.TotalWithdrawals;

        existingInvestmentReturn.UpdatedAt = DateTime.UtcNow;

        _context.HoldingInvestmentReturns.Update(existingInvestmentReturn);
        await _context.SaveChangesAsync();

        return Ok(existingInvestmentReturn);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        HoldingInvestmentReturn? investmentReturn = await _context.HoldingInvestmentReturns
            .FirstOrDefaultAsync(investmentReturn => investmentReturn.Id == id && investmentReturn.UserId == userId);

        if (investmentReturn == null)
            return NotFound();

        _context.HoldingInvestmentReturns.Remove(investmentReturn);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private async Task<IActionResult?> ValidateInvestmentReturn(HoldingInvestmentReturn investmentReturn, string userId)
    {
        if (investmentReturn.TotalContributions < 0)
            return BadRequest("TotalContributions must be positive.");

        if (investmentReturn.TotalWithdrawals < 0)
            return BadRequest("TotalWithdrawals must be positive.");

        HoldingSnapshot? startSnapshot = await _context.HoldingSnapshots
            .FirstOrDefaultAsync(snapshot => snapshot.Id == investmentReturn.StartHoldingSnapshotId &&
                    (snapshot.UserId == userId || snapshot.UserId == null));
        if (startSnapshot == null)
            return BadRequest("Invalid or unauthorized StartHoldingSnapshotId.");

        HoldingSnapshot? endSnapshot = await _context.HoldingSnapshots
            .FirstOrDefaultAsync(snapshot => snapshot.Id == investmentReturn.EndHoldingSnapshotId &&
                    (snapshot.UserId == userId || snapshot.UserId == null));
        if (endSnapshot == null)
            return BadRequest("Invalid or unauthorized EndSnapshotId.");

        if (startSnapshot.HoldingId != endSnapshot.HoldingId)
            return BadRequest("StartHoldingId and EndHoldingId must be for the same Holding.");

        if (startSnapshot.Date > endSnapshot.Date)
            return BadRequest("StartHoldingSnapshotId date must be before EndHoldingSnapshotId.");

        return null;    
    }
}