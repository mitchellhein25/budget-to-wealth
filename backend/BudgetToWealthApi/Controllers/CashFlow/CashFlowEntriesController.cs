using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Authorize]
[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
public class CashFlowEntriesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<CashFlowEntriesController> _logger;

    public CashFlowEntriesController(ApplicationDbContext context, ILogger<CashFlowEntriesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet("Recurring")]
    public async Task<IActionResult> GetRecurringEntries([FromQuery] bool activeOnly = true)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        var query = _context.CashFlowEntries
            .Where(entry => entry.UserId == userId && entry.RecurrenceFrequency != null);

        if (activeOnly)
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            query = query.Where(entry => entry.RecurrenceEndDate == null || entry.RecurrenceEndDate >= today);
        }

        var recurringEntries = await query
            .Include(e => e.Category)
            .ToListAsync();
        
        return Ok(recurringEntries);
    }

    [HttpGet("AvailableDateRange")]
    public async Task<IActionResult> GetAvailableDateRange()
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        var allEntries = _context.CashFlowEntries.Where(entry => entry.UserId == userId);
        var minDate = await allEntries.MinAsync(entry => (DateOnly?)entry.Date);
        var maxDate = await allEntries.MaxAsync(entry => (DateOnly?)entry.Date);
        return Ok(new { StartDate = minDate, EndDate = maxDate });
    }

    [HttpGet]
    public async Task<IActionResult> Get(
        [FromQuery] CashFlowType? entryType = null, 
        [FromQuery] DateOnly? startDate = null, 
        [FromQuery] DateOnly? endDate = null)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        IQueryable<CashFlowEntry> query = _context.CashFlowEntries
                                          .Where(cashFlowEntry => cashFlowEntry.UserId == userId)
                                          .Include(e => e.Category);

        if (entryType != null)
            query = query.Where(cashFlowEntry => cashFlowEntry.EntryType == entryType);

        if (startDate.HasValue)
            query = query.Where(cashFlowEntry => cashFlowEntry.Date >= startDate);

        if (endDate.HasValue)
            query = query.Where(cashFlowEntry => cashFlowEntry.Date <= endDate);

        List<CashFlowEntry> cashFlowEntrys = await query.ToListAsync();

        return Ok(cashFlowEntrys);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CashFlowEntry cashFlowEntry)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        IActionResult? validationResult = await ValidateCashFlowEntry(cashFlowEntry, userId);
        if (validationResult != null)
            return validationResult;

        cashFlowEntry.UserId = userId;
        _context.CashFlowEntries.Add(cashFlowEntry);
        await _context.SaveChangesAsync();

        return StatusCode(StatusCodes.Status201Created, cashFlowEntry);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] CashFlowEntry updatedCashFlowEntry)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        CashFlowEntry? existingCashFlowEntry = await _context.CashFlowEntries
            .FirstOrDefaultAsync(cashFlowEntry => cashFlowEntry.Id == id && cashFlowEntry.UserId == userId);

        if (existingCashFlowEntry == null)
            return NotFound();

        IActionResult? validationResult = await ValidateCashFlowEntry(updatedCashFlowEntry, userId);
        if (validationResult != null)
            return validationResult;

        existingCashFlowEntry.Amount = updatedCashFlowEntry.Amount;
        existingCashFlowEntry.Description = updatedCashFlowEntry.Description;
        existingCashFlowEntry.Date = updatedCashFlowEntry.Date;
        existingCashFlowEntry.CategoryId = updatedCashFlowEntry.CategoryId;
        existingCashFlowEntry.RecurrenceFrequency = updatedCashFlowEntry.RecurrenceFrequency;
        existingCashFlowEntry.RecurrenceEndDate = updatedCashFlowEntry.RecurrenceEndDate;
        existingCashFlowEntry.UpdatedAt = DateTime.UtcNow;

        _context.CashFlowEntries.Update(existingCashFlowEntry);
        await _context.SaveChangesAsync();

        return Ok(existingCashFlowEntry);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        CashFlowEntry? cashFlowEntry = await _context.CashFlowEntries
            .FirstOrDefaultAsync(cashFlowEntry => cashFlowEntry.Id == id && cashFlowEntry.UserId == userId);

        if (cashFlowEntry == null)
            return NotFound();

        _context.CashFlowEntries.Remove(cashFlowEntry);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("Import")]
    public async Task<IActionResult> Import([FromBody] List<CashFlowEntryImport> entries)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        if (entries == null || !entries.Any())
            return BadRequest("No entries provided for import.");

        const int maxRecords = 100;
        if (entries.Count > maxRecords)
        {
            return BadRequest($"Cannot import more than {maxRecords} entries at once. Please split your import into smaller batches.");
        }

        var results = new List<ImportResult>();
        var importedCount = 0;
        var errorCount = 0;

        foreach (var entryImport in entries)
        {
            try
            {
                if (entryImport.AmountInCents < 0)
                {
                    results.Add(new ImportResult 
                    { 
                        Success = false, 
                        Message = "Amount must be positive.",
                        Row = entries.IndexOf(entryImport) + 1
                    });
                    errorCount++;
                    continue;
                }

                if (string.IsNullOrWhiteSpace(entryImport.CategoryName))
                {
                    results.Add(new ImportResult 
                    { 
                        Success = false, 
                        Message = "Category name cannot be empty.",
                        Row = entries.IndexOf(entryImport) + 1
                    });
                    errorCount++;
                    continue;
                }

                if (entryImport.Date == default)
                {
                    results.Add(new ImportResult 
                    { 
                        Success = false, 
                        Message = "Date is required.",
                        Row = entries.IndexOf(entryImport) + 1
                    });
                    errorCount++;
                    continue;
                }

                if (entryImport.RecurrenceFrequency.HasValue && 
                    !Enum.IsDefined(typeof(RecurrenceFrequency), entryImport.RecurrenceFrequency.Value))
                {
                    results.Add(new ImportResult 
                    { 
                        Success = false, 
                        Message = "Invalid recurrence frequency.",
                        Row = entries.IndexOf(entryImport) + 1
                    });
                    errorCount++;
                    continue;
                }

                if (!Enum.IsDefined(typeof(CashFlowType), entryImport.CategoryType))
                {
                    results.Add(new ImportResult 
                    { 
                        Success = false, 
                        Message = "Invalid category type.",
                        Row = entries.IndexOf(entryImport) + 1
                    });
                    errorCount++;
                    continue;
                }

                var category = await _context.CashFlowCategories
                    .FirstOrDefaultAsync(c => EF.Functions.ILike(c.Name, entryImport.CategoryName) &&
                                              c.CategoryType == entryImport.CategoryType &&
                                              (c.UserId == userId || c.UserId == null));
                
                if (category == null)
                {
                    results.Add(new ImportResult 
                    { 
                        Success = false, 
                        Message = $"Category '{entryImport.CategoryName}' not found for type {entryImport.CategoryType}.",
                        Row = entries.IndexOf(entryImport) + 1
                    });
                    errorCount++;
                    continue;
                }

                var entry = new CashFlowEntry
                {
                    Amount = entryImport.AmountInCents,
                    Date = entryImport.Date,
                    Description = entryImport.Description,
                    CategoryId = category.Id,
                    EntryType = entryImport.CategoryType,
                    RecurrenceFrequency = entryImport.RecurrenceFrequency,
                    UserId = userId
                };

                _context.CashFlowEntries.Add(entry);
                importedCount++;

                results.Add(new ImportResult 
                { 
                    Success = true, 
                    Message = $"Entry for category '{entryImport.CategoryName}' imported successfully.",
                    Row = entries.IndexOf(entryImport) + 1
                });
            }
            catch (Exception ex)
            {
                results.Add(new ImportResult 
                { 
                    Success = false, 
                    Message = $"Error importing entry: {ex.Message}",
                    Row = entries.IndexOf(entryImport) + 1
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
                ? $"Successfully imported {importedCount} entries"
                : $"Imported {importedCount} entries with {errorCount} errors",
            ImportedCount = importedCount,
            ErrorCount = errorCount,
            Results = results
        };

        return Ok(response);
    }

    private async Task<IActionResult?> ValidateCashFlowEntry(CashFlowEntry cashFlowEntry, string userId)
    {
        if (cashFlowEntry.Amount < 0)
            return BadRequest("Amount must be positive.");

        if (cashFlowEntry.CategoryId == Guid.Empty)
            return BadRequest("CategoryId is required.");

        if (cashFlowEntry.Date == default)
            return BadRequest("Date is required.");

        bool categoryExistsForUser = await _context.CashFlowCategories
            .AnyAsync(category => category.Id == cashFlowEntry.CategoryId &&
                      (category.UserId == userId || category.UserId == null));
        if (!categoryExistsForUser)
            return BadRequest("Invalid or unauthorized CategoryId.");

        return null;
    }
}
