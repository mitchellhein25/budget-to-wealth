using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Authorize]
[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
public class ManualInvestmentReturnsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ManualInvestmentReturnsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] DateOnly? startDate, [FromQuery] DateOnly? endDate)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        IQueryable<ManualInvestmentReturn> query = _context.ManualInvestmentReturns
                                                     .Where(investmentReturn => investmentReturn.UserId == userId);

        query = ApplyDateFilter(query, startDate, endDate);

        query = query.Include(investmentReturn => investmentReturn.ManualInvestmentCategory);

        List<ManualInvestmentReturn> investmentReturns = await query.ToListAsync();
        return Ok(investmentReturns);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ManualInvestmentReturn investmentReturn)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        IActionResult? validationResult = await ValidateManualInvestmentReturn(investmentReturn, userId);
        if (validationResult != null)
            return validationResult;

        investmentReturn.UserId = userId;
        _context.ManualInvestmentReturns.Add(investmentReturn);
        await _context.SaveChangesAsync();

        return StatusCode(StatusCodes.Status201Created, investmentReturn);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] ManualInvestmentReturn updatedInvestmentReturn)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        ManualInvestmentReturn? existingInvestmentReturn = await _context.ManualInvestmentReturns
            .FirstOrDefaultAsync(investmentReturn => investmentReturn.Id == id && investmentReturn.UserId == userId);

        if (existingInvestmentReturn == null)
            return NotFound();

        IActionResult? validationResult = await ValidateManualInvestmentReturn(updatedInvestmentReturn, userId);
        if (validationResult != null)
            return validationResult;

        existingInvestmentReturn.ManualInvestmentCategoryId = updatedInvestmentReturn.ManualInvestmentCategoryId;
        existingInvestmentReturn.ManualInvestmentRecurrenceFrequency = updatedInvestmentReturn.ManualInvestmentRecurrenceFrequency;
        existingInvestmentReturn.ManualInvestmentRecurrenceEndDate = updatedInvestmentReturn.ManualInvestmentRecurrenceEndDate;
        existingInvestmentReturn.ManualInvestmentPercentageReturn = updatedInvestmentReturn.ManualInvestmentPercentageReturn;
        existingInvestmentReturn.StartDate = updatedInvestmentReturn.StartDate;
        existingInvestmentReturn.EndDate = updatedInvestmentReturn.EndDate;

        existingInvestmentReturn.UpdatedAt = DateTime.UtcNow;

        _context.ManualInvestmentReturns.Update(existingInvestmentReturn);
        await _context.SaveChangesAsync();

        return Ok(existingInvestmentReturn);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        string? userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        ManualInvestmentReturn? investmentReturn = await _context.ManualInvestmentReturns
            .FirstOrDefaultAsync(investmentReturn => investmentReturn.Id == id && investmentReturn.UserId == userId);

        if (investmentReturn == null)
            return NotFound();

        _context.ManualInvestmentReturns.Remove(investmentReturn);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private async Task<IActionResult?> ValidateManualInvestmentReturn(ManualInvestmentReturn investmentReturn, string userId)
    {
        bool categoryExistsForUser = await _context.ManualInvestmentCategories
            .AnyAsync(category => category.Id == investmentReturn.ManualInvestmentCategoryId &&
                    (category.UserId == userId || category.UserId == null));
        if (!categoryExistsForUser)
            return BadRequest("Invalid or unauthorized ManualInvestmentCategoryId.");

        return null;
    }

    private static IQueryable<ManualInvestmentReturn> ApplyDateFilter(IQueryable<ManualInvestmentReturn> query, DateOnly? startDate, DateOnly? endDate)
    {
        if (startDate.HasValue)
            query = query.Where(investmentReturn => investmentReturn.EndDate >= startDate);

        if (endDate.HasValue)
            query = query.Where(investmentReturn => investmentReturn.EndDate <= endDate);

        return query;
    }
}
