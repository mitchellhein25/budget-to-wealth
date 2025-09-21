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

        IQueryable<Budget> query = _context.Budgets
                                           .Include(budget => budget.Category)
                                           .Where(budget => budget.UserId == userId);

        if (categoryId != null)
            query = query.Where(budget => budget.CategoryId == categoryId);

        if (startDate.HasValue)
            query = query.Where(budget => budget.EndDate == null || budget.EndDate >= startDate);

        if (endDate.HasValue)
            query = query.Where(budget => budget.StartDate <= endDate && 
                                          (budget.EndDate == null || budget.EndDate <= endDate));

        query = query.GroupBy(budget => budget.CategoryId)
                     .Select(group => group.OrderByDescending(budget => budget.StartDate)
                                           .ThenByDescending(budget => budget.EndDate)
                                           .ThenByDescending(budget => budget.UpdatedAt)
                                           .ThenByDescending(budget => budget.CreatedAt)
                                           .First());

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
            activeExistingBudget.EndDate = GetLastDayOfPreviousMonth();
            var firstDayOfLastMonth = new DateOnly(activeExistingBudget.EndDate.Value.Year, activeExistingBudget.EndDate.Value.Month, 1);
            if (activeExistingBudget.StartDate > firstDayOfLastMonth)
            {
                activeExistingBudget.StartDate = firstDayOfLastMonth;
            }
            _context.Budgets.Update(activeExistingBudget);
        }

        if (newBudget.StartDate == DateOnly.MinValue)
        {
            DateOnly firstDayOfThisMonth = new DateOnly(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
            newBudget.StartDate = firstDayOfThisMonth;
        }

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

        existingbudget.EndDate = GetLastDayOfPreviousMonth();
        var firstDayOfLastMonth = new DateOnly(existingbudget.EndDate.Value.Year, existingbudget.EndDate.Value.Month, 1);
        if (existingbudget.StartDate > firstDayOfLastMonth)
        {
            existingbudget.StartDate = firstDayOfLastMonth;
        }
        _context.Budgets.Update(existingbudget);
        
        DateOnly firstDayOfThisMonth = new DateOnly(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
        updatedBudget.StartDate = firstDayOfThisMonth;
        updatedBudget.UpdatedAt = DateTime.UtcNow;
        updatedBudget.UserId = userId;

        _context.Budgets.Add(updatedBudget);
        await _context.SaveChangesAsync();

        return Ok(updatedBudget);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id, [FromQuery] bool archive = false)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        Budget? budget = await _context.Budgets
            .FirstOrDefaultAsync(budget => budget.Id == id && budget.UserId == userId);

        if (budget == null)
            return NotFound();

        if (archive)
        {
            budget.EndDate = GetLastDayOfPreviousMonth();
            _context.Budgets.Update(budget);
        }
        else
        {
            _context.Budgets.Remove(budget);
        }
        
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("Import")]
    public async Task<IActionResult> Import([FromBody] List<BudgetImport> budgets)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        if (budgets == null || !budgets.Any())
            return BadRequest("No budgets provided for import.");

        const int maxRecords = 100;
        if (budgets.Count > maxRecords)
        {
            return BadRequest($"Cannot import more than {maxRecords} budgets at once. Please split your import into smaller batches.");
        }

        var results = new List<ImportResult>();
        var importedCount = 0;
        var errorCount = 0;

        foreach (var budgetImport in budgets)
        {
            try
            {
                if (budgetImport.AmountInCents < 0)
                {
                    results.Add(new ImportResult 
                    { 
                        Success = false, 
                        Message = "Amount must be positive.",
                        Row = budgets.IndexOf(budgetImport) + 1
                    });
                    errorCount++;
                    continue;
                }

                if (string.IsNullOrWhiteSpace(budgetImport.CategoryName))
                {
                    results.Add(new ImportResult 
                    { 
                        Success = false, 
                        Message = "Category name cannot be empty.",
                        Row = budgets.IndexOf(budgetImport) + 1
                    });
                    errorCount++;
                    continue;
                }

                var category = await _context.CashFlowCategories
                    .FirstOrDefaultAsync(c => EF.Functions.ILike(c.Name, budgetImport.CategoryName) &&
                                              c.CategoryType == CashFlowType.Expense &&
                                              (c.UserId == userId || c.UserId == null));
                
                if (category == null)
                {
                    results.Add(new ImportResult 
                    { 
                        Success = false, 
                        Message = $"Category '{budgetImport.CategoryName}' not found for Expense type.",
                        Row = budgets.IndexOf(budgetImport) + 1
                    });
                    errorCount++;
                    continue;
                }

                var activeExistingBudget = await _context.Budgets
                    .FirstOrDefaultAsync(b => b.CategoryId == category.Id && 
                                              b.UserId == userId && 
                                              b.EndDate == null);
                
                if (activeExistingBudget != null)
                {
                    activeExistingBudget.EndDate = GetLastDayOfPreviousMonth();
                    _context.Budgets.Update(activeExistingBudget);
                }

                var budget = new Budget
                {
                    Amount = budgetImport.AmountInCents,
                    CategoryId = category.Id,
                    StartDate = new DateOnly(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1),
                    EndDate = null,
                    UserId = userId
                };

                _context.Budgets.Add(budget);
                importedCount++;

                results.Add(new ImportResult 
                { 
                    Success = true, 
                    Message = $"Budget for category '{budgetImport.CategoryName}' imported successfully.",
                    Row = budgets.IndexOf(budgetImport) + 1
                });
            }
            catch (Exception ex)
            {
                results.Add(new ImportResult 
                { 
                    Success = false, 
                    Message = $"Error importing budget: {ex.Message}",
                    Row = budgets.IndexOf(budgetImport) + 1
                });
                errorCount++;
            }
        }

        if (importedCount > 0)
            await _context.SaveChangesAsync();

        var response = new ImportResponse
        {
            Success = errorCount == 0,
            Message = errorCount == 0 
                ? $"Successfully imported {importedCount} budgets"
                : $"Imported {importedCount} budgets with {errorCount} errors",
            ImportedCount = importedCount,
            ErrorCount = errorCount,
            Results = results
        };

        return Ok(response);
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

        if (budget.Category == null)
        {
            CashFlowCategory? category = await _context.CashFlowCategories
                .FirstOrDefaultAsync(category => category.Id == budget.CategoryId &&
                      (category.UserId == userId || category.UserId == null));
            if (category != null)
                budget.Category = category;
        }

        if (budget.Category?.CategoryType != CashFlowType.Expense)
            return BadRequest("Budgets can only be entered for Expense categories.");

        return null;
    }

    public static DateOnly GetLastDayOfPreviousMonth()
    {
        var now = DateTime.UtcNow;
        var previousMonth = now.AddMonths(-1);
        return new DateOnly(previousMonth.Year, previousMonth.Month, DateTime.DaysInMonth(previousMonth.Year, previousMonth.Month));
    }}
