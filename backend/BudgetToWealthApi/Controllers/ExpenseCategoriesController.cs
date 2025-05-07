using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ExpenseCategoriesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ExpenseCategoriesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        string? userId = User.GetUserId();
        if (userId == null) 
            return Unauthorized();

        List<ExpenseCategory> categories = await _context.ExpenseCategories
            .Where(category => category.IsDefault || category.UserId == userId)
            .ToListAsync();

        return Ok(categories);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ExpenseCategory category)
    {
        string? userId = User.GetUserId();
        if (userId == null) 
            return Unauthorized();

        category.UserId = userId;

        _context.ExpenseCategories.Add(category);
        await _context.SaveChangesAsync();

        return Ok(category);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] ExpenseCategory updatedCategory)
    {
        string? userId = User.GetUserId();
        if (userId == null) 
            return Unauthorized();

        ExpenseCategory? category = await _context.ExpenseCategories
            .FirstOrDefaultAsync(category => IsCategoryMatch(category, userId, id));

        if (category == null) 
            return NotFound();

        category.Name = updatedCategory.Name;

        _context.ExpenseCategories.Update(category);

        await _context.SaveChangesAsync();
        return Ok(category);
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        string? userId = User.GetUserId();
        if (userId == null) 
            return Unauthorized();

        ExpenseCategory? category = await _context.ExpenseCategories
            .FirstOrDefaultAsync(category => IsCategoryMatch(category, userId, id));

        if (category == null) 
            return NotFound();

        _context.ExpenseCategories.Remove(category);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool IsCategoryMatch(ExpenseCategory category, string? userId, int newCategoryId) =>
        category.Id == newCategoryId && (category.UserId == userId || category.IsDefault);
}
