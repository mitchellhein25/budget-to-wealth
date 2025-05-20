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

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Expense expense)
    {
        string? userId = User.GetUserId();
        if (userId == null) 
            return Unauthorized();

        IActionResult? validationResult = await ValidateExpense(expense, userId);
        if (validationResult != null)
            return validationResult;
    
        expense.UserId = userId;
        _context.Expenses.Add(expense);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(Get), new { id = expense.Id }, expense);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] Expense updatedExpense)
    {
        string? userId = User.GetUserId();
        if (userId == null) 
            return Unauthorized();

        Expense? existingExpense = await _context.Expenses
            .FirstOrDefaultAsync(expense => expense.Id == id && expense.UserId == userId);

        if (existingExpense == null) 
            return NotFound();

        IActionResult? validationResult = await ValidateExpense(updatedExpense, userId);
        if (validationResult != null)
            return validationResult;

        existingExpense.Amount = updatedExpense.Amount;
        existingExpense.Description = updatedExpense.Description;
        existingExpense.Date = updatedExpense.Date;
        existingExpense.ExpenseCategoryId = updatedExpense.ExpenseCategoryId;
        existingExpense.UpdatedAt = DateTime.UtcNow;

        _context.Expenses.Update(existingExpense);
        await _context.SaveChangesAsync();

        return Ok(existingExpense);
    }

    private async Task<IActionResult?> ValidateExpense(Expense expense, string userId)
    {
        if (expense.Amount < 0)
            return BadRequest("Amount must be positive.");

        if (expense.ExpenseCategoryId == Guid.Empty)
            return BadRequest("ExpenseCategoryId is required.");

        if (expense.Date == default)
            return BadRequest("Date is required.");

        bool categoryExistsForUser = await _context.ExpenseCategories
            .AnyAsync(category => category.Id == expense.ExpenseCategoryId && 
                      (category.UserId == userId || category.UserId == null));
        if (!categoryExistsForUser)
            return BadRequest("Invalid or unauthorized ExpenseCategoryId.");

        return null;
    }


    // [HttpDelete("{id}")]
    // public async Task<IActionResult> Delete(Guid id)
    // {
    //     string? userId = User.GetUserId();
    //     if (userId == null) 
    //         return Unauthorized();

    //     Expense? expense = await _context.Expenses
    //         .FirstOrDefaultAsync(expense => expense.Id == id && (expense.UserId == userId || expense.UserId == null));

    //     if (expense == null) 
    //         return NotFound();

    //     _context.Expenses.Remove(expense);
    //     await _context.SaveChangesAsync();

    //     return NoContent();
    // }
}
