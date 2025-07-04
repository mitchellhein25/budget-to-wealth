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
    public async Task<IActionResult> Get([FromQuery] Guid? holdingId = null, [FromQuery] DateOnly? startDate = null, [FromQuery] DateOnly? endDate = null)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        IQueryable<HoldingSnapshot> query = _context.HoldingSnapshots
                                                    .Include(snapshot => snapshot.Holding)
                                                    .Include(snapshot => snapshot.Holding!.HoldingCategory)
                                                    .Where(snapshot => snapshot.UserId == userId);

        if (holdingId != null)
            query = query.Where(snapshot => snapshot.HoldingId == holdingId);

        if (startDate.HasValue)
            query = query.Where(snapshot => snapshot.Date >= startDate);

        if (endDate.HasValue)
            query = query.Where(snapshot => snapshot.Date <= endDate);

        List<HoldingSnapshot> snapshots = await query.ToListAsync();

        return Ok(snapshots);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] HoldingSnapshot newHoldingSnapshot)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        IActionResult? validationResult = await ValidateHoldingSnapshot(newHoldingSnapshot, userId);
        if (validationResult != null)
            return validationResult;

        var exists = await _context.HoldingSnapshots.AnyAsync(snapshot => snapshot.UserId == userId &&
                                                           snapshot.HoldingId == newHoldingSnapshot.HoldingId &&
                                                           snapshot.Date == newHoldingSnapshot.Date);
        if (exists)
            return Conflict(ConflictMessage);

        newHoldingSnapshot.UserId = userId;
        _context.HoldingSnapshots.Add(newHoldingSnapshot);
        await _context.SaveChangesAsync();

        return StatusCode(StatusCodes.Status201Created, newHoldingSnapshot);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] HoldingSnapshot updatedHoldingSnapshot)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        IActionResult? validationResult = await ValidateHoldingSnapshot(updatedHoldingSnapshot, userId);
        if (validationResult != null)
            return validationResult;

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

    [HttpPost("Import")]
    public async Task<IActionResult> Import([FromBody] List<HoldingSnapshotImport> snapshots)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        if (snapshots == null || !snapshots.Any())
            return BadRequest("No snapshots provided for import.");

        const int maxRecords = 100;
        if (snapshots.Count > maxRecords)
        {
            return BadRequest($"Cannot import more than {maxRecords} snapshots at once. Please split your import into smaller batches.");
        }

        var results = new List<ImportResult>();
        var importedCount = 0;
        var errorCount = 0;

        foreach (var snapshotImport in snapshots)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(snapshotImport.HoldingName))
                {
                    results.Add(new ImportResult 
                    { 
                        Success = false, 
                        Message = "Holding name cannot be empty.",
                        Row = snapshots.IndexOf(snapshotImport) + 1
                    });
                    errorCount++;
                    continue;
                }

                // Find the holding by name
                var holding = await _context.Holdings
                    .FirstOrDefaultAsync(h => EF.Functions.ILike(h.Name, snapshotImport.HoldingName) &&
                                              h.UserId == userId);
                
                if (holding == null)
                {
                    results.Add(new ImportResult 
                    { 
                        Success = false, 
                        Message = $"Holding '{snapshotImport.HoldingName}' not found.",
                        Row = snapshots.IndexOf(snapshotImport) + 1
                    });
                    errorCount++;
                    continue;
                }

                // Check if snapshot already exists for this holding and date
                var exists = await _context.HoldingSnapshots
                    .AnyAsync(s => s.UserId == userId &&
                                   s.HoldingId == holding.Id &&
                                   s.Date == snapshotImport.Date);
                
                if (exists)
                {
                    results.Add(new ImportResult 
                    { 
                        Success = false, 
                        Message = $"Snapshot for holding '{snapshotImport.HoldingName}' on date {snapshotImport.Date} already exists.",
                        Row = snapshots.IndexOf(snapshotImport) + 1
                    });
                    errorCount++;
                    continue;
                }

                var snapshot = new HoldingSnapshot
                {
                    HoldingId = holding.Id,
                    Date = snapshotImport.Date,
                    Balance = snapshotImport.BalanceInCents,
                    UserId = userId
                };

                _context.HoldingSnapshots.Add(snapshot);
                importedCount++;

                results.Add(new ImportResult 
                { 
                    Success = true, 
                    Message = $"Snapshot for holding '{snapshotImport.HoldingName}' imported successfully.",
                    Row = snapshots.IndexOf(snapshotImport) + 1
                });
            }
            catch (Exception ex)
            {
                results.Add(new ImportResult 
                { 
                    Success = false, 
                    Message = $"Error importing snapshot: {ex.Message}",
                    Row = snapshots.IndexOf(snapshotImport) + 1
                });
                errorCount++;
            }
        }

        if (importedCount > 0)
            await _context.SaveChangesAsync();

        var response = new ImportResponse
        {
            Success = errorCount == 0,
            Message = errorCount == 0 
                ? $"Successfully imported {importedCount} snapshots"
                : $"Imported {importedCount} snapshots with {errorCount} errors",
            ImportedCount = importedCount,
            ErrorCount = errorCount,
            Results = results
        };

        return Ok(response);
    }

    private async Task<IActionResult?> ValidateHoldingSnapshot(HoldingSnapshot holdingSnapshot, string userId)
    {
        if (holdingSnapshot.HoldingId == Guid.Empty)
            return BadRequest("HoldingId is required.");

        bool categoryExistsForUser = await _context.Holdings
            .AnyAsync(snapshot => snapshot.Id == holdingSnapshot.HoldingId &&
                      (snapshot.UserId == userId || snapshot.UserId == null));
        if (!categoryExistsForUser)
            return BadRequest("Invalid or unauthorized HoldingId.");

        return null;
    }
}
