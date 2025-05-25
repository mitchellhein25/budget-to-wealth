using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Authorize]
[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
public class BudgetsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BudgetsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] Guid? categoryId = null, [FromQuery] DateOnly? startDate = null, [FromQuery] DateOnly? endDate = null)
    {
        string? userId = User.GetUserId();
        if (userId == null) 
            return Unauthorized();

        IQueryable<Budget> query = _context.Budgets.Where(budget => budget.UserId == userId);

        if (categoryId != null)
            query = query.Where(budget => budget.CategoryId == categoryId);

        if (startDate.HasValue)
          query = query.Where(budget => budget.StartDate >= startDate || 
                                       (budget.StartDate <= startDate && 
                                       (budget.EndDate == null || budget.EndDate >= startDate)));

        if (endDate.HasValue)
          query = query.Where(budget => budget.StartDate <= endDate);

        List<Budget> budgets = await query.ToListAsync();

        return Ok(budgets);
    }

    // [HttpPost]
    // public async Task<IActionResult> Create([FromBody] budget budget)
    // {
    //     string? userId = User.GetUserId();
    //     if (userId == null) 
    //         return Unauthorized();

    //     IActionResult? validationResult = await Validatebudget(budget, userId);
    //     if (validationResult != null)
    //         return validationResult;
    
    //     budget.UserId = userId;
    //     _context.Budgets.Add(budget);
    //     await _context.SaveChangesAsync();

    //     return CreatedAtAction(nameof(Get), new { id = budget.Id }, budget);
    // }

    // [HttpPut("{id}")]
    // public async Task<IActionResult> Update(Guid id, [FromBody] budget updatedbudget)
    // {
    //     string? userId = User.GetUserId();
    //     if (userId == null) 
    //         return Unauthorized();

    //     budget? existingbudget = await _context.Budgets
    //         .FirstOrDefaultAsync(budget => budget.Id == id && budget.UserId == userId);

    //     if (existingbudget == null) 
    //         return NotFound();

    //     IActionResult? validationResult = await Validatebudget(updatedbudget, userId);
    //     if (validationResult != null)
    //         return validationResult;

    //     existingbudget.Amount = updatedbudget.Amount;
    //     existingbudget.Description = updatedbudget.Description;
    //     existingbudget.Date = updatedbudget.Date;
    //     existingbudget.CategoryId = updatedbudget.CategoryId;
    //     existingbudget.UpdatedAt = DateTime.UtcNow;

    //     _context.Budgets.Update(existingbudget);
    //     await _context.SaveChangesAsync();

    //     return Ok(existingbudget);
    // }

    // [HttpDelete("{id}")]
    // public async Task<IActionResult> Delete(Guid id)
    // {
    //     string? userId = User.GetUserId();
    //     if (userId == null) 
    //         return Unauthorized();

    //     budget? budget = await _context.Budgets
    //         .FirstOrDefaultAsync(budget => budget.Id == id && budget.UserId == userId);

    //     if (budget == null) 
    //         return NotFound();

    //     _context.Budgets.Remove(budget);
    //     await _context.SaveChangesAsync();

    //     return NoContent();
    // }

    // private async Task<IActionResult?> Validatebudget(budget budget, string userId)
    // {
    //    ONLY ALLOW EXPENSE TYPES
    //     if (budget.Amount < 0)
    //         return BadRequest("Amount must be positive.");

    //     if (budget.CategoryId == Guid.Empty)
    //         return BadRequest("CategoryId is required.");

    //     if (budget.Date == default)
    //         return BadRequest("Date is required.");

    //     bool categoryExistsForUser = await _context.CashFlowCategories
    //         .AnyAsync(category => category.Id == budget.CategoryId && 
    //                   (category.UserId == userId || category.UserId == null));
    //     if (!categoryExistsForUser)
    //         return BadRequest("Invalid or unauthorized CategoryId.");

    //     return null;
    // }
}
