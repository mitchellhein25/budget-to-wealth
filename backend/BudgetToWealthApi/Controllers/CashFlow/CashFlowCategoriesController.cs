using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Authorize]
[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
public class CashFlowCategoriesController : ControllerBase
{
    private const string ConflictMessage = "Category already exists.";
    private const string NameRequiredMessage = "Category name cannot be empty.";
    private readonly ApplicationDbContext _context;

    public CashFlowCategoriesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] CashFlowType? cashFlowType = null)
    {
        string? userId = User.GetUserId();
        if (userId == null) 
            return Unauthorized();

        IQueryable<CashFlowCategory> query = _context.CashFlowCategories
            .Where(category => category.UserId == null || category.UserId == userId);

        if (cashFlowType != null)
            query = query.Where(category => category.CategoryType == cashFlowType);

        List<CashFlowCategory> categories = await query.ToListAsync();

        return Ok(categories);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CashFlowCategory category)
    {
        string? userId = User.GetUserId();
        if (userId == null) 
            return Unauthorized();

        if (string.IsNullOrWhiteSpace(category.Name)) 
            return BadRequest(NameRequiredMessage);

        var exists = await _context.CashFlowCategories
            .AnyAsync(c => EF.Functions.ILike(c.Name, category.Name) && 
                            (c.UserId == userId || c.UserId == null) &&
                            c.CategoryType == category.CategoryType);
        if (exists)
            return Conflict(ConflictMessage);

        category.UserId = userId;
        _context.CashFlowCategories.Add(category);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(Get), new { id = category.Id }, category);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] CashFlowCategory updatedCategory)
    {
        string? userId = User.GetUserId();
        if (userId == null) 
            return Unauthorized();

        if (string.IsNullOrWhiteSpace(updatedCategory.Name)) 
            return BadRequest(NameRequiredMessage);

        CashFlowCategory? category = await _context.CashFlowCategories
            .FirstOrDefaultAsync(category => category.Id == id && 
                                category.UserId == userId);

        if (category == null) 
            return NotFound();

        category.Name = updatedCategory.Name;
        category.CategoryType = updatedCategory.CategoryType;
        category.UpdatedAt = DateTime.UtcNow;
        
        _context.CashFlowCategories.Update(category);

        await _context.SaveChangesAsync();
        return Ok(category);
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        string? userId = User.GetUserId();
        if (userId == null) 
            return Unauthorized();

        CashFlowCategory? category = await _context.CashFlowCategories
            .FirstOrDefaultAsync(category => category.Id == id && category.UserId == userId);

        if (category == null) 
            return NotFound();

        _context.CashFlowCategories.Remove(category);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
