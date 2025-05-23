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

    public CashFlowEntriesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] CashFlowType? entryType = null, [FromQuery] DateOnly? startDate = null, [FromQuery] DateOnly? endDate = null)
    {
        string? userId = User.GetUserId();
        if (userId == null) 
            return Unauthorized();

        IQueryable<CashFlowEntry> query = _context.CashFlowEntries.Where(cashFlowEntry => cashFlowEntry.UserId == userId);

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

        return CreatedAtAction(nameof(Get), new { id = cashFlowEntry.Id }, cashFlowEntry);
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
