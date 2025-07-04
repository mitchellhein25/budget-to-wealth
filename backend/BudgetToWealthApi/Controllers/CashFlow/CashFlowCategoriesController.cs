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
    public async Task<IActionResult> Create(CashFlowCategory category)
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

        return StatusCode(StatusCodes.Status201Created, category);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, CashFlowCategory updatedCategory)
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

    [HttpPost("Import")]
    public async Task<IActionResult> Import([FromBody] List<CashFlowCategoryImport> categories)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        if (categories == null || !categories.Any())
            return BadRequest("No categories provided for import.");

        const int maxRecords = 100;
        if (categories.Count > maxRecords)
        {
            return BadRequest($"Cannot import more than {maxRecords} categories at once. Please split your import into smaller batches.");
        }

        var results = new List<ImportResult>();
        var importedCount = 0;
        var errorCount = 0;

        foreach (var categoryImport in categories)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(categoryImport.Name))
                {
                    results.Add(new ImportResult 
                    { 
                        Success = false, 
                        Message = "Category name cannot be empty.",
                        Row = categories.IndexOf(categoryImport) + 1
                    });
                    errorCount++;
                    continue;
                }

                var exists = await _context.CashFlowCategories
                    .AnyAsync(c => EF.Functions.ILike(c.Name, categoryImport.Name) &&
                                    (c.UserId == userId || c.UserId == null) &&
                                    c.CategoryType == categoryImport.CategoryType);
                
                if (exists)
                {
                    results.Add(new ImportResult 
                    { 
                        Success = false, 
                        Message = $"Category '{categoryImport.Name}' already exists for type {categoryImport.CategoryType}.",
                        Row = categories.IndexOf(categoryImport) + 1
                    });
                    errorCount++;
                    continue;
                }

                var category = new CashFlowCategory
                {
                    Name = categoryImport.Name,
                    CategoryType = categoryImport.CategoryType,
                    UserId = userId
                };

                _context.CashFlowCategories.Add(category);
                importedCount++;

                results.Add(new ImportResult 
                { 
                    Success = true, 
                    Message = $"Category '{categoryImport.Name}' imported successfully.",
                    Row = categories.IndexOf(categoryImport) + 1
                });
            }
            catch (Exception ex)
            {
                results.Add(new ImportResult 
                { 
                    Success = false, 
                    Message = $"Error importing category: {ex.Message}",
                    Row = categories.IndexOf(categoryImport) + 1
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
                ? $"Successfully imported {importedCount} categories"
                : $"Imported {importedCount} categories with {errorCount} errors",
            ImportedCount = importedCount,
            ErrorCount = errorCount,
            Results = results
        };

        return Ok(response);
    }
}
