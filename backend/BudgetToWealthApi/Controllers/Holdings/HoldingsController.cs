using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Authorize]
[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
public class HoldingController : ControllerBase
{
    private const string ConflictMessage = "Holding already exists.";
    private const string NameRequiredMessage = "Holding name cannot be empty.";
    private readonly ApplicationDbContext _context;

    public HoldingController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] HoldingType? type = null, [FromQuery] Guid? holdingCategoryId = null)
    {
        string? userId = User.GetUserId();
        if (userId == null) 
            return Unauthorized();

        IQueryable<Holding> query = _context.Holdings.Where(category => category.UserId == userId);

        if (type != null)
            query = query.Where(holding => holding.Type == type);

        if (holdingCategoryId != null)
            query = query.Where(holding => holding.HoldingCategoryId == holdingCategoryId);

        List<Holding> categories = await query.ToListAsync();

        return Ok(categories);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Holding newHolding)
    {
        string? userId = User.GetUserId();
        if (userId == null) 
            return Unauthorized();

        if (string.IsNullOrWhiteSpace(newHolding.Name)) 
            return BadRequest(NameRequiredMessage);

        var exists = await _context.Holdings.AnyAsync(c => c.UserId == userId && 
                                                           EF.Functions.ILike(c.Name, newHolding.Name) && 
                                                           c.Type == newHolding.Type && 
                                                           c.HoldingCategoryId == newHolding.HoldingCategoryId);
        if (exists)
            return Conflict(ConflictMessage);

        newHolding.UserId = userId;
        _context.Holdings.Add(newHolding);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(Get), new { id = newHolding.Id }, newHolding);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] Holding updatedHolding)
    {
        string? userId = User.GetUserId();
        if (userId == null) 
            return Unauthorized();

        if (string.IsNullOrWhiteSpace(updatedHolding.Name)) 
            return BadRequest(NameRequiredMessage);

        Holding? category = await _context.Holdings
            .FirstOrDefaultAsync(category => category.Id == id && category.UserId == userId);

        if (category == null) 
            return NotFound();

        category.Name = updatedHolding.Name;
        category.Type = updatedHolding.Type;
        category.HoldingCategoryId = updatedHolding.HoldingCategoryId;
        category.UpdatedAt = DateTime.UtcNow;
        
        _context.Holdings.Update(category);

        await _context.SaveChangesAsync();
        return Ok(category);
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        string? userId = User.GetUserId();
        if (userId == null) 
            return Unauthorized();

        Holding? category = await _context.Holdings
            .FirstOrDefaultAsync(category => category.Id == id && category.UserId == userId);

        if (category == null) 
            return NotFound();

        _context.Holdings.Remove(category);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
