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

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Budget newBudget)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        IActionResult? validationResult = await ValidateBudget(newBudget, userId);
        if (validationResult != null)
            return validationResult;

        Budget? activeExistingBudget = await _context.Budgets
            .FirstOrDefaultAsync(budget => budget.CategoryId == newBudget.CategoryId && budget.EndDate == null);
        if (activeExistingBudget != null)
        {
            activeExistingBudget.EndDate = DateOnly.FromDateTime(DateTime.Now);
            _context.Budgets.Update(activeExistingBudget);
        }

        if (newBudget.StartDate == DateOnly.MinValue)
            newBudget.StartDate = DateOnly.FromDateTime(DateTime.Now);

        newBudget.UserId = userId;
        _context.Budgets.Add(newBudget);
        await _context.SaveChangesAsync();

        return StatusCode(StatusCodes.Status201Created, newBudget);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] Budget updatedBudget)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        Budget? existingbudget = await _context.Budgets
            .FirstOrDefaultAsync(budget => budget.Id == id && budget.UserId == userId);

        if (existingbudget == null)
            return NotFound();

        IActionResult? validationResult = await ValidateBudget(updatedBudget, userId);
        if (validationResult != null)
            return validationResult;

        existingbudget.Amount = updatedBudget.Amount;
        existingbudget.CategoryId = updatedBudget.CategoryId;
        existingbudget.UpdatedAt = DateTime.UtcNow;
        existingbudget.EndDate = updatedBudget.EndDate;

        _context.Budgets.Update(existingbudget);
        await _context.SaveChangesAsync();

        return Ok(existingbudget);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        Budget? budget = await _context.Budgets
            .FirstOrDefaultAsync(budget => budget.Id == id && budget.UserId == userId);

        if (budget == null)
            return NotFound();

        _context.Budgets.Remove(budget);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private async Task<IActionResult?> ValidateBudget(Budget budget, string userId)
    {
        if (budget.Amount < 0)
            return BadRequest("Amount must be positive.");

        if (budget.CategoryId == Guid.Empty)
            return BadRequest("CategoryId is required.");

        bool categoryExistsForUser = await _context.CashFlowCategories
            .AnyAsync(category => category.Id == budget.CategoryId &&
                      (category.UserId == userId || category.UserId == null));
        if (!categoryExistsForUser)
            return BadRequest("Invalid or unauthorized CategoryId.");

        if (budget.Category?.CategoryType != CashFlowType.Expense)
            return BadRequest("Budgets can only be entered for Expense categories.");

        return null;
    }
}
