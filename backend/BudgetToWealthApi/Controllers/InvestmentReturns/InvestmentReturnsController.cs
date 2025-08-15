using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Authorize]
[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
public class InvestmentReturnsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public InvestmentReturnsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] DateOnly? startDate, [FromQuery] DateOnly? endDate)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        IQueryable<InvestmentReturn> query = _context.InvestmentReturns
                                                     .Include(investmentReturn => investmentReturn.ManualInvestmentCategory)
                                                     .Include(investmentReturn => investmentReturn.StartHoldingSnapshot)
                                                     .Include(investmentReturn => investmentReturn.EndHoldingSnapshot)
                                                     .Where(investmentReturn => investmentReturn.UserId == userId);

        query = ApplyDateFilter(query, startDate, endDate);

        List<InvestmentReturn> investmentReturns = await query.ToListAsync();
        return Ok(investmentReturns);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] InvestmentReturn investmentReturn)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        IActionResult? validationResult = await ValidateInvestmentReturn(investmentReturn, userId);
        if (validationResult != null)
            return validationResult;

        investmentReturn.UserId = userId;
        _context.InvestmentReturns.Add(investmentReturn);
        await _context.SaveChangesAsync();

        return StatusCode(StatusCodes.Status201Created, investmentReturn);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] InvestmentReturn updatedInvestmentReturn)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        InvestmentReturn? existingInvestmentReturn = await _context.InvestmentReturns
            .FirstOrDefaultAsync(investmentReturn => investmentReturn.Id == id && investmentReturn.UserId == userId);

        if (existingInvestmentReturn == null)
            return NotFound();

        IActionResult? validationResult = await ValidateInvestmentReturn(updatedInvestmentReturn, userId);
        if (validationResult != null)
            return validationResult;
        
        existingInvestmentReturn.StartHoldingSnapshotId = updatedInvestmentReturn.StartHoldingSnapshotId;
        existingInvestmentReturn.EndHoldingSnapshotId = updatedInvestmentReturn.EndHoldingSnapshotId;

        existingInvestmentReturn.ManualInvestmentCategoryId = updatedInvestmentReturn.ManualInvestmentCategoryId;
        existingInvestmentReturn.ManualInvestmentRecurrenceFrequency = updatedInvestmentReturn.ManualInvestmentRecurrenceFrequency;
        existingInvestmentReturn.ManualInvestmentRecurrenceEndDate = updatedInvestmentReturn.ManualInvestmentRecurrenceEndDate;
        existingInvestmentReturn.ManualInvestmentPercentageReturn = updatedInvestmentReturn.ManualInvestmentPercentageReturn;
        existingInvestmentReturn.ManualInvestmentReturnDate = updatedInvestmentReturn.ManualInvestmentReturnDate;

        existingInvestmentReturn.TotalContributions = updatedInvestmentReturn.TotalContributions;
        existingInvestmentReturn.TotalWithdrawals = updatedInvestmentReturn.TotalWithdrawals;

        existingInvestmentReturn.UpdatedAt = DateTime.UtcNow;

        _context.InvestmentReturns.Update(existingInvestmentReturn);
        await _context.SaveChangesAsync();

        return Ok(existingInvestmentReturn);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        InvestmentReturn? investmentReturn = await _context.InvestmentReturns
            .FirstOrDefaultAsync(investmentReturn => investmentReturn.Id == id && investmentReturn.UserId == userId);

        if (investmentReturn == null)
            return NotFound();

        _context.InvestmentReturns.Remove(investmentReturn);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private async Task<IActionResult?> ValidateInvestmentReturn(InvestmentReturn investmentReturn, string userId)
    {
        if (investmentReturn.TotalContributions < 0)
            return BadRequest("TotalContributions must be positive.");

        if (investmentReturn.TotalWithdrawals < 0)
            return BadRequest("TotalWithdrawals must be positive.");

        if (investmentReturn.IsManualInvestment)
        {
            bool categoryExistsForUser = await _context.ManualInvestmentCategories
                .AnyAsync(category => category.Id == investmentReturn.ManualInvestmentCategoryId &&
                      (category.UserId == userId || category.UserId == null));
            if (!categoryExistsForUser)
                return BadRequest("Invalid or unauthorized ManualInvestmentCategoryId.");

            if (investmentReturn.ManualInvestmentPercentageReturn == null)
                return BadRequest("ManualInvestmentPercentageReturn is required for manual investment.");

            if (investmentReturn.ManualInvestmentReturnDate == null)
                return BadRequest("ManualInvestmentReturnDate is required for manual investment.");
        }
        else
        {
            HoldingSnapshot? startSnapshot = await _context.HoldingSnapshots
                .FirstOrDefaultAsync(snapshot => snapshot.Id == investmentReturn.StartHoldingSnapshotId &&
                      (snapshot.UserId == userId || snapshot.UserId == null));
            if (startSnapshot == null)
                return BadRequest("Invalid or unauthorized StartHoldingSnapshotId.");

            HoldingSnapshot? endSnapshot = await _context.HoldingSnapshots
                .FirstOrDefaultAsync(snapshot => snapshot.Id == investmentReturn.EndHoldingSnapshotId &&
                      (snapshot.UserId == userId || snapshot.UserId == null));
            if (endSnapshot == null)
                return BadRequest("Invalid or unauthorized EndSnapshotId.");

            if (startSnapshot.HoldingId != endSnapshot.HoldingId)
                return BadRequest("StartHoldingSnapshotId and EndHoldingSnapshotId must be for the same Holding.");

            if (startSnapshot.Date > endSnapshot.Date)
                return BadRequest("StartHoldingSnapshotId must be before EndHoldingSnapshotId.");
        }
    
        return null;
    }

    private static IQueryable<InvestmentReturn> ApplyDateFilter(IQueryable<InvestmentReturn> query, DateOnly? startDate, DateOnly? endDate)
    {
        if (startDate.HasValue)
            query = query.Where(investmentReturn => 
                (investmentReturn.ManualInvestmentCategoryId != null && investmentReturn.ManualInvestmentReturnDate != null && investmentReturn.ManualInvestmentReturnDate >= startDate) ||
                (investmentReturn.ManualInvestmentCategoryId == null && investmentReturn.StartHoldingSnapshot != null && investmentReturn.StartHoldingSnapshot.Date >= startDate));

        if (endDate.HasValue)
            query = query.Where(investmentReturn => 
                (investmentReturn.ManualInvestmentCategoryId != null && investmentReturn.ManualInvestmentReturnDate != null && investmentReturn.ManualInvestmentReturnDate <= endDate) ||
                (investmentReturn.ManualInvestmentCategoryId == null && investmentReturn.EndHoldingSnapshot != null && investmentReturn.EndHoldingSnapshot.Date <= endDate));

        return query;
    }
}