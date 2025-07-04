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
    
    [HttpPost("Import")]
    public async Task<IActionResult> Import([FromBody] List<HoldingCategoryImport> categories)
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

                var exists = await _context.HoldingCategories
                    .AnyAsync(c => EF.Functions.ILike(c.Name, categoryImport.Name) && (c.UserId == userId || c.UserId == null));
                
                if (exists)
                {
                    results.Add(new ImportResult 
                    { 
                        Success = false, 
                        Message = $"Category '{categoryImport.Name}' already exists.",
                        Row = categories.IndexOf(categoryImport) + 1
                    });
                    errorCount++;
                    continue;
                }

                var category = new HoldingCategory
                {
                    Name = categoryImport.Name,
                    UserId = userId
                };

                _context.HoldingCategories.Add(category);
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
