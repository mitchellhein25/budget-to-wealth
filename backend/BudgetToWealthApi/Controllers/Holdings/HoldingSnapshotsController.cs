using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Authorize]
[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
public class HoldingSnapshotsController : ControllerBase
{
    private const string ConflictMessage = "Holding snapshot already exists.";
    private readonly ApplicationDbContext _context;

    public HoldingSnapshotsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] Guid? holdingId = null)
    {
        string? userId = User.GetUserId();
        if (userId == null) 
            return Unauthorized();

        IQueryable<HoldingSnapshot> query = _context.HoldingSnapshots.Where(snapshot => snapshot.UserId == userId);

        if (holdingId != null)
            query = query.Where(snapshot => snapshot.HoldingId == holdingId);

        List<HoldingSnapshot> snapshots = await query.ToListAsync();

        return Ok(snapshots);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] HoldingSnapshot newHoldingSnapshot)
    {
        string? userId = User.GetUserId();
        if (userId == null) 
            return Unauthorized();

        var exists = await _context.HoldingSnapshots.AnyAsync(snapshot => snapshot.UserId == userId && 
                                                           snapshot.HoldingId == newHoldingSnapshot.HoldingId && 
                                                           snapshot.Date == newHoldingSnapshot.Date);
        if (exists)
            return Conflict(ConflictMessage);

        newHoldingSnapshot.UserId = userId;
        _context.HoldingSnapshots.Add(newHoldingSnapshot);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(Get), new { id = newHoldingSnapshot.Id }, newHoldingSnapshot);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] HoldingSnapshot updatedHoldingSnapshot)
    {
        string? userId = User.GetUserId();
        if (userId == null) 
            return Unauthorized();

        HoldingSnapshot? snapshot = await _context.HoldingSnapshots
            .FirstOrDefaultAsync(snapshot => snapshot.Id == id && snapshot.UserId == userId);

        if (snapshot == null) 
            return NotFound();

        snapshot.HoldingId = updatedHoldingSnapshot.HoldingId;
        snapshot.Date = updatedHoldingSnapshot.Date;
        snapshot.Balance = updatedHoldingSnapshot.Balance;
        snapshot.UpdatedAt = DateTime.UtcNow;
        
        _context.HoldingSnapshots.Update(snapshot);

        await _context.SaveChangesAsync();
        return Ok(snapshot);
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        string? userId = User.GetUserId();
        if (userId == null) 
            return Unauthorized();

        HoldingSnapshot? snapshot = await _context.HoldingSnapshots
            .FirstOrDefaultAsync(snapshot => snapshot.Id == id && snapshot.UserId == userId);

        if (snapshot == null) 
            return NotFound();

        _context.HoldingSnapshots.Remove(snapshot);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
