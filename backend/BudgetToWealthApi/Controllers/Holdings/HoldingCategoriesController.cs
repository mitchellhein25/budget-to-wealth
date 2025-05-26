using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Authorize]
[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
public class HoldingCategoriesController : ControllerBase
{
    private const string ConflictMessage = "Category already exists.";
    private const string NameRequiredMessage = "Category name cannot be empty.";
    private readonly ApplicationDbContext _context;

    public HoldingCategoriesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        IQueryable<HoldingCategory> query = _context.HoldingCategories
            .Where(category => category.UserId == null || category.UserId == userId);

        List<HoldingCategory> categories = await query.ToListAsync();

        return Ok(categories);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] HoldingCategory category)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        if (string.IsNullOrWhiteSpace(category.Name))
            return BadRequest(NameRequiredMessage);

        var exists = await _context.HoldingCategories
            .AnyAsync(c => EF.Functions.ILike(c.Name, category.Name) && (c.UserId == userId || c.UserId == null));
        if (exists)
            return Conflict(ConflictMessage);

        category.UserId = userId;
        _context.HoldingCategories.Add(category);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(Get), new { id = category.Id }, category);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] HoldingCategory updatedCategory)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        if (string.IsNullOrWhiteSpace(updatedCategory.Name))
            return BadRequest(NameRequiredMessage);

        HoldingCategory? category = await _context.HoldingCategories
            .FirstOrDefaultAsync(category => category.Id == id && category.UserId == userId);

        if (category == null)
            return NotFound();

        category.Name = updatedCategory.Name;
        category.UpdatedAt = DateTime.UtcNow;

        _context.HoldingCategories.Update(category);

        await _context.SaveChangesAsync();
        return Ok(category);
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        HoldingCategory? category = await _context.HoldingCategories
            .FirstOrDefaultAsync(category => category.Id == id && category.UserId == userId);

        if (category == null)
            return NotFound();

        _context.HoldingCategories.Remove(category);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
