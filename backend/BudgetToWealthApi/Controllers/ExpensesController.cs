using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ExpensesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ExpensesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] DateOnly? startDate = null, [FromQuery] DateOnly? endDate = null)
    {
        string? userId = User.GetUserId();
        if (userId == null) 
            return Unauthorized();

        IQueryable<Expense> query = _context.Expenses.Where(expense => expense.UserId == userId);

        if (startDate.HasValue)
            query = query.Where(expense => expense.Date >= startDate);

        if (endDate.HasValue)
            query = query.Where(expense => expense.Date <= endDate);

        List<Expense> expenses = await query.ToListAsync();

        return Ok(expenses);
    }

    // [HttpPost]
    // public async Task<IActionResult> Create([FromBody] ExpenseCategory category)
    // {
    //     string? userId = User.GetUserId();
    //     if (userId == null) 
    //         return Unauthorized();

    //     if (string.IsNullOrWhiteSpace(category.Name)) 
    //         return BadRequest(NameRequiredMessage);

    //     var exists = await _context.ExpenseCategories
    //         .AnyAsync(c => EF.Functions.ILike(c.Name, category.Name) && (c.UserId == userId || c.UserId == null));
    //     if (exists)
    //         return Conflict(ConflictMessage);

    //     category.UserId = userId;
    //     _context.ExpenseCategories.Add(category);
    //     await _context.SaveChangesAsync();

    //     return Ok(category);
    // }

    // [HttpPut("{id}")]
    // public async Task<IActionResult> Update(Guid id, [FromBody] ExpenseCategory updatedCategory)
    // {
    //     string? userId = User.GetUserId();
    //     if (userId == null) 
    //         return Unauthorized();

    //     if (string.IsNullOrWhiteSpace(updatedCategory.Name)) 
    //         return BadRequest(NameRequiredMessage);

    //     ExpenseCategory? category = await _context.ExpenseCategories
    //         .FirstOrDefaultAsync(category => category.Id == id && (category.UserId == userId));

    //     if (category == null) 
    //         return NotFound();

    //     category.Name = updatedCategory.Name;
    //     category.UpdatedAt = DateTime.UtcNow;
        
    //     _context.ExpenseCategories.Update(category);

    //     await _context.SaveChangesAsync();
    //     return Ok(category);
    // }


    // [HttpDelete("{id}")]
    // public async Task<IActionResult> Delete(Guid id)
    // {
    //     string? userId = User.GetUserId();
    //     if (userId == null) 
    //         return Unauthorized();

    //     ExpenseCategory? category = await _context.ExpenseCategories
    //         .FirstOrDefaultAsync(category => category.Id == id && (category.UserId == userId || category.UserId == null));

    //     if (category == null) 
    //         return NotFound();

    //     _context.ExpenseCategories.Remove(category);
    //     await _context.SaveChangesAsync();

    //     return NoContent();
    // }
}
