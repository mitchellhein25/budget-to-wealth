using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Authorize]
[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
public class ManualInvestmentCategoriesController : ControllerBase
{
    private const string ConflictMessage = "Category already exists.";
    private const string NameRequiredMessage = "Category name cannot be empty.";
    private readonly ApplicationDbContext _context;

    public ManualInvestmentCategoriesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        IQueryable<ManualInvestmentCategory> query = _context.ManualInvestmentCategories
            .Where(category => category.UserId == null || category.UserId == userId);

        List<ManualInvestmentCategory> categories = await query.ToListAsync();

        return Ok(categories);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ManualInvestmentCategory category)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        if (string.IsNullOrWhiteSpace(category.Name))
            return BadRequest(NameRequiredMessage);

        var exists = await _context.ManualInvestmentCategories
            .AnyAsync(c => EF.Functions.ILike(c.Name, category.Name) && (c.UserId == userId || c.UserId == null));
        if (exists)
            return Conflict(ConflictMessage);

        category.UserId = userId;
        _context.ManualInvestmentCategories.Add(category);
        await _context.SaveChangesAsync();

        return StatusCode(StatusCodes.Status201Created, category);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] ManualInvestmentCategory updatedCategory)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        if (string.IsNullOrWhiteSpace(updatedCategory.Name))
            return BadRequest(NameRequiredMessage);

        ManualInvestmentCategory? category = await _context.ManualInvestmentCategories
            .FirstOrDefaultAsync(category => category.Id == id && category.UserId == userId);

        if (category == null)
            return NotFound();

        category.Name = updatedCategory.Name;
        category.UpdatedAt = DateTime.UtcNow;

        _context.ManualInvestmentCategories.Update(category);

        await _context.SaveChangesAsync();
        return Ok(category);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        ManualInvestmentCategory? category = await _context.ManualInvestmentCategories
            .FirstOrDefaultAsync(category => category.Id == id && category.UserId == userId);

        if (category == null)
            return NotFound();

        _context.ManualInvestmentCategories.Remove(category);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
