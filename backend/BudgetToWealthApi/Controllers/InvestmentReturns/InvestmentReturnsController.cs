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
                                                     .Include(investmentReturn => investmentReturn.StartSnapshot)
                                                     .Include(investmentReturn => investmentReturn.EndSnapshot)
                                                     .Where(investmentReturn => investmentReturn.UserId == userId);

        if (startDate.HasValue)
            query = query.Where(investmentReturn => investmentReturn.GetStartDate() >= startDate);

        if (endDate.HasValue)
            query = query.Where(investmentReturn => investmentReturn.GetEndDate() <= endDate);

        List<InvestmentReturn> investmentReturns = await query.ToListAsync();

        return Ok(investmentReturns);
    }
}