using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Authorize]
[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
public class HoldingsController : ControllerBase
{
    private const string ConflictMessage = "Holding already exists.";
    private const string NameRequiredMessage = "Holding name cannot be empty.";
    private readonly ApplicationDbContext _context;

    public HoldingsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] HoldingType? type = null, [FromQuery] Guid? holdingCategoryId = null)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        IQueryable<Holding> query = _context.Holdings
                                            .Include(holding => holding.HoldingCategory)
                                            .Where(holding => holding.UserId == userId);

        if (type != null)
            query = query.Where(holding => holding.Type == type);

        if (holdingCategoryId != null)
            query = query.Where(holding => holding.HoldingCategoryId == holdingCategoryId);

        List<Holding> holdings = await query.ToListAsync();

        return Ok(holdings);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Holding newHolding)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        IActionResult? validationResult = await ValidateHolding(newHolding, userId);
        if (validationResult != null)
            return validationResult;

        var exists = await _context.Holdings.AnyAsync(holding => holding.UserId == userId &&
                                                           EF.Functions.ILike(holding.Name, newHolding.Name) &&
                                                           holding.Type == newHolding.Type &&
                                                           holding.HoldingCategoryId == newHolding.HoldingCategoryId);
        if (exists)
            return Conflict(ConflictMessage);

        newHolding.UserId = userId;
        _context.Holdings.Add(newHolding);
        await _context.SaveChangesAsync();

        return StatusCode(StatusCodes.Status201Created, newHolding);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] Holding updatedHolding)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        IActionResult? validationResult = await ValidateHolding(updatedHolding, userId);
        if (validationResult != null)
            return validationResult;

        Holding? holding = await _context.Holdings
            .FirstOrDefaultAsync(holding => holding.Id == id && holding.UserId == userId);
        if (holding == null)
            return NotFound();

        holding.Name = updatedHolding.Name;
        holding.Type = updatedHolding.Type;
        holding.HoldingCategoryId = updatedHolding.HoldingCategoryId;
        holding.UpdatedAt = DateTime.UtcNow;

        _context.Holdings.Update(holding);

        await _context.SaveChangesAsync();
        return Ok(holding);
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        Holding? holding = await _context.Holdings
            .FirstOrDefaultAsync(holding => holding.Id == id && holding.UserId == userId);

        if (holding == null)
            return NotFound();

        _context.Holdings.Remove(holding);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private async Task<IActionResult?> ValidateHolding(Holding newHolding, string userId)
    {
        if (string.IsNullOrWhiteSpace(newHolding.Name))
            return BadRequest(NameRequiredMessage);

        if (newHolding.HoldingCategoryId == Guid.Empty)
            return BadRequest("HoldingCategoryId is required.");

        bool categoryExistsForUser = await _context.HoldingCategories
            .AnyAsync(holding => holding.Id == newHolding.HoldingCategoryId &&
                      (holding.UserId == userId || holding.UserId == null));
        if (!categoryExistsForUser)
            return BadRequest("Invalid or unauthorized HoldingCategoryId.");

        return null;
    }
}
