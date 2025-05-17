using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class IncomeStreamsController : ControllerBase
{
    private const string ConflictMessage = "Stream already exists.";
    private const string NameRequiredMessage = "Stream name cannot be empty.";
    private readonly ApplicationDbContext _context;

    public IncomeStreamsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        string? userId = User.GetUserId();
        if (userId == null) 
            return Unauthorized();

        List<IncomeStream> streams = await _context.IncomeStreams
            .Where(stream => stream.UserId == userId)
            .ToListAsync();

        return Ok(streams);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] IncomeStream stream)
    {
        string? userId = User.GetUserId();
        if (userId == null) 
            return Unauthorized();

        if (string.IsNullOrWhiteSpace(stream.Name)) 
            return BadRequest(NameRequiredMessage);

        var exists = await _context.IncomeStreams
            .AnyAsync(c => EF.Functions.ILike(c.Name, stream.Name) && c.UserId == userId);
        if (exists)
            return Conflict(ConflictMessage);

        stream.UserId = userId;
        _context.IncomeStreams.Add(stream);
        await _context.SaveChangesAsync();

        return Ok(stream);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] IncomeStream updatedCategory)
    {
        string? userId = User.GetUserId();
        if (userId == null) 
            return Unauthorized();

        if (string.IsNullOrWhiteSpace(updatedCategory.Name)) 
            return BadRequest(NameRequiredMessage);

        IncomeStream? stream = await _context.IncomeStreams
            .FirstOrDefaultAsync(stream => stream.Id == id && stream.UserId == userId);

        if (stream == null) 
            return NotFound();

        stream.Name = updatedCategory.Name;

        _context.IncomeStreams.Update(stream);

        await _context.SaveChangesAsync();
        return Ok(stream);
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        string? userId = User.GetUserId();
        if (userId == null) 
            return Unauthorized();

        IncomeStream? stream = await _context.IncomeStreams
            .FirstOrDefaultAsync(stream => stream.Id == id && stream.UserId == userId);

        if (stream == null) 
            return NotFound();

        _context.IncomeStreams.Remove(stream);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
