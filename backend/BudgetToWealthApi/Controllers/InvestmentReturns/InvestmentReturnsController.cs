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
}