using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Authorize]
[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
public class HoldingsController : ControllerBase
{
    private const string ConflictMessage = "Holding already exists.";
    private const string NameRequiredMessage = "Holding name cannot be empty.";
    private readonly ApplicationDbContext _context;

    public HoldingsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] HoldingType? type = null, [FromQuery] Guid? holdingCategoryId = null)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        IQueryable<Holding> query = _context.Holdings
                                            .Include(holding => holding.HoldingCategory)
                                            .Where(holding => holding.UserId == userId);

        if (type != null)
            query = query.Where(holding => holding.Type == type);

        if (holdingCategoryId != null)
            query = query.Where(holding => holding.HoldingCategoryId == holdingCategoryId);

        List<Holding> holdings = await query.ToListAsync();

        return Ok(holdings);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Holding newHolding)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        IActionResult? validationResult = await ValidateHolding(newHolding, userId);
        if (validationResult != null)
            return validationResult;

        var exists = await _context.Holdings.AnyAsync(holding => holding.UserId == userId &&
                                                           EF.Functions.ILike(holding.Name, newHolding.Name) &&
                                                           holding.Type == newHolding.Type &&
                                                           holding.HoldingCategoryId == newHolding.HoldingCategoryId);
        if (exists)
            return Conflict(ConflictMessage);

        newHolding.UserId = userId;
        _context.Holdings.Add(newHolding);
        await _context.SaveChangesAsync();

        return StatusCode(StatusCodes.Status201Created, newHolding);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] Holding updatedHolding)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        IActionResult? validationResult = await ValidateHolding(updatedHolding, userId);
        if (validationResult != null)
            return validationResult;

        Holding? holding = await _context.Holdings
            .FirstOrDefaultAsync(holding => holding.Id == id && holding.UserId == userId);
        if (holding == null)
            return NotFound();

        holding.Name = updatedHolding.Name;
        holding.Type = updatedHolding.Type;
        holding.HoldingCategoryId = updatedHolding.HoldingCategoryId;
        holding.UpdatedAt = DateTime.UtcNow;

        _context.Holdings.Update(holding);

        await _context.SaveChangesAsync();
        return Ok(holding);
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        Holding? holding = await _context.Holdings
            .FirstOrDefaultAsync(holding => holding.Id == id && holding.UserId == userId);

        if (holding == null)
            return NotFound();

        _context.Holdings.Remove(holding);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("Import")]
    public async Task<IActionResult> Import([FromBody] List<HoldingImport> holdings)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        if (holdings == null || !holdings.Any())
            return BadRequest("No holdings provided for import.");

        const int maxRecords = 100;
        if (holdings.Count > maxRecords)
        {
            return BadRequest($"Cannot import more than {maxRecords} holdings at once. Please split your import into smaller batches.");
        }

        var results = new List<ImportResult>();
        var importedCount = 0;
        var errorCount = 0;

        foreach (var holdingImport in holdings)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(holdingImport.Name))
                {
                    results.Add(new ImportResult 
                    { 
                        Success = false, 
                        Message = "Holding name cannot be empty.",
                        Row = holdings.IndexOf(holdingImport) + 1
                    });
                    errorCount++;
                    continue;
                }

                if (string.IsNullOrWhiteSpace(holdingImport.HoldingCategoryName))
                {
                    results.Add(new ImportResult 
                    { 
                        Success = false, 
                        Message = "Holding category name cannot be empty.",
                        Row = holdings.IndexOf(holdingImport) + 1
                    });
                    errorCount++;
                    continue;
                }

                if (!Enum.IsDefined(typeof(HoldingType), holdingImport.Type))
                {
                    results.Add(new ImportResult 
                    { 
                        Success = false, 
                        Message = $"Invalid holding type '{holdingImport.Type}'. Valid types are: {string.Join(", ", Enum.GetNames(typeof(HoldingType)))}.",
                        Row = holdings.IndexOf(holdingImport) + 1
                    });
                    errorCount++;
                    continue;
                }

                var category = await _context.HoldingCategories
                    .FirstOrDefaultAsync(c => EF.Functions.ILike(c.Name, holdingImport.HoldingCategoryName) && (c.UserId == userId || c.UserId == null));
                
                if (category == null)
                {
                    results.Add(new ImportResult 
                    { 
                        Success = false, 
                        Message = $"Holding category '{holdingImport.HoldingCategoryName}' not found.",
                        Row = holdings.IndexOf(holdingImport) + 1
                    });
                    errorCount++;
                    continue;
                }

                var exists = await _context.Holdings
                    .AnyAsync(h => h.UserId == userId &&
                                   EF.Functions.ILike(h.Name, holdingImport.Name) &&
                                   h.Type == holdingImport.Type &&
                                   h.HoldingCategoryId == category.Id);
                
                if (exists)
                {
                    results.Add(new ImportResult 
                    { 
                        Success = false, 
                        Message = $"Holding '{holdingImport.Name}' already exists in category '{holdingImport.HoldingCategoryName}'.",
                        Row = holdings.IndexOf(holdingImport) + 1
                    });
                    errorCount++;
                    continue;
                }

                var holding = new Holding
                {
                    Name = holdingImport.Name,
                    Type = holdingImport.Type,
                    HoldingCategoryId = category.Id,
                    UserId = userId
                };

                _context.Holdings.Add(holding);
                importedCount++;

                results.Add(new ImportResult 
                { 
                    Success = true, 
                    Message = $"Holding '{holdingImport.Name}' imported successfully.",
                    Row = holdings.IndexOf(holdingImport) + 1
                });
            }
            catch (Exception ex)
            {
                results.Add(new ImportResult 
                { 
                    Success = false, 
                    Message = $"Error importing holding: {ex.Message}",
                    Row = holdings.IndexOf(holdingImport) + 1
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
                ? $"Successfully imported {importedCount} holdings"
                : $"Imported {importedCount} holdings with {errorCount} errors",
            ImportedCount = importedCount,
            ErrorCount = errorCount,
            Results = results
        };

        return Ok(response);
    }

    private async Task<IActionResult?> ValidateHolding(Holding newHolding, string userId)
    {
        if (string.IsNullOrWhiteSpace(newHolding.Name))
            return BadRequest(NameRequiredMessage);

        if (newHolding.HoldingCategoryId == Guid.Empty)
            return BadRequest("HoldingCategoryId is required.");

        bool categoryExistsForUser = await _context.HoldingCategories
            .AnyAsync(holding => holding.Id == newHolding.HoldingCategoryId &&
                      (holding.UserId == userId || holding.UserId == null));
        if (!categoryExistsForUser)
            return BadRequest("Invalid or unauthorized HoldingCategoryId.");

        return null;
    }
}
