using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage;

public class IncomeStreamsControllerTests : IDisposable
{
    private const string ConflictMessage = "Stream already exists.";
    private const string NameRequiredMessage = "Stream name cannot be empty.";
    private const string _testPrefix = "Test_";
    private readonly string _userStreamName = $"{_testPrefix}User's";
    private readonly string _otherUserStreamName = $"{_testPrefix}Another User's";
    private readonly string _newStreamName = $"{_testPrefix}New Stream";
    private readonly string _oldStreamName = $"{_testPrefix}Old";
    private readonly string _updatedStreamName = $"{_testPrefix}Updated";
    private readonly string _testOtherUserStream = $"{_testPrefix}OtherUser";
    private readonly string _toDeleteStream = $"{_testPrefix}ToDelete";
    private readonly string _user1Id = "auth0|user1";
    private readonly string _user2Id = "auth0|user2";
    private ApplicationDbContext _context;
    private IncomeStreamsController _controller;
    private readonly IDbContextTransaction _transaction;
    public IncomeStreamsControllerTests()
    {
        _context = DatabaseSetup.GetDbContext();
        _transaction = DatabaseSetup.GetTransaction(_context);
        _controller = new IncomeStreamsController(_context);
        SetupTestData().Wait();
        SetupUserContext(_user1Id);
    }

    private async Task SetupTestData()
    {
        await CreateTestStream(_userStreamName, _user1Id);
        await CreateTestStream(_otherUserStreamName, _user2Id);
        _context.SaveChanges();
    }

    private void SetupUserContext(string userId)
    {
        List<Claim> claims = new() { new Claim(ClaimTypes.NameIdentifier, userId) };
        ClaimsIdentity identity = new(claims, "TestAuthType");
        ClaimsPrincipal claimsPrincipal = new(identity);

        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = claimsPrincipal }
        };
    }

    private void SetUserUnauthorized()
    {
        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal() }
        };
    }
    private async Task<IncomeStream> CreateTestStream(string name, string userId)
    {
        IncomeStream stream = new() { Name = name, UserId = userId };
        _context.IncomeStreams.Add(stream);
        await _context.SaveChangesAsync();
        return stream;
    }

    public void Dispose()
    {
        _transaction.Rollback();
        _transaction.Dispose();
        _context.Dispose();
    }

    [Fact]
    public async Task Get_ReturnsUserStreams()
    {
        OkObjectResult? result = await _controller.Get() as OkObjectResult;
        IEnumerable<IncomeStream> streams = Assert.IsAssignableFrom<IEnumerable<IncomeStream>>(result!.Value);

        Assert.Contains(streams, c => c.Name == _userStreamName);
        Assert.DoesNotContain(streams, c => c.Name == _otherUserStreamName);
    }

    [Fact]
    public async Task Create_AddsNewStreamForUser()
    {
        IncomeStream newStream = new() { Name = _newStreamName };
        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(await _controller.Create(newStream));
        Assert.Equal(nameof(IncomeStreamsController.Get), createdAtActionResult.ActionName);
        Assert.Equal(_newStreamName, (createdAtActionResult.Value as IncomeStream)?.Name);
    }

    [Fact]
    public async Task Create_DoesNotAllowNewStreamWithSameNameAsExistingUserStream()
    {
        IncomeStream newStream = new() { Name = _userStreamName };

        IActionResult result = await _controller.Create(newStream);

        ConflictObjectResult conflictResult = Assert.IsType<ConflictObjectResult>(result);    
        Assert.Equal(ConflictMessage, conflictResult.Value);
    }

    [Fact]
    public async Task Create_DoesNotAllowStreamWithSameNameDifferentCasing()
    {
        IncomeStream newStream = new() { Name = _userStreamName.ToLower() };

        IActionResult result = await _controller.Create(newStream);

        ConflictObjectResult conflictResult = Assert.IsType<ConflictObjectResult>(result);
        Assert.Equal(ConflictMessage, conflictResult.Value);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData(" ")]
    public async Task Create_InvalidNameReturnsBadRequest(string? invalidName)
    {
        IActionResult result = await _controller.Create(new IncomeStream { Name = invalidName });

        BadRequestObjectResult badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(NameRequiredMessage, badRequest.Value);
    }

    [Fact]
    public async Task Update_ModifiesOwnedStream()
    {
        IncomeStream oldStreamStream = await CreateTestStream(_oldStreamName, _user1Id);

        string newName = _updatedStreamName;
        OkObjectResult? result = await _controller.Update(oldStreamStream.Id, new IncomeStream { Name = newName }) as OkObjectResult;

        IncomeStream? updated = await _context.IncomeStreams.FindAsync(oldStreamStream.Id);
        Assert.NotNull(result);
        Assert.Equal(newName, updated?.Name);
    }

    [Fact]
    public async Task Update_DoesNotAllowModifyingOtherUsersStream()
    {
        IncomeStream otherUserStream = await CreateTestStream(_testOtherUserStream, _user2Id);
        IActionResult result = await _controller.Update(otherUserStream.Id, new IncomeStream { Name = _updatedStreamName });
        Assert.IsType<NotFoundResult>(result);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData(" ")]
    public async Task Update_InvalidNameReturnsBadRequest(string? invalidName)
    {
        IncomeStream? userStream = _context.IncomeStreams.FirstOrDefault(c => c.Name == _userStreamName);
        IActionResult result = await _controller.Update(userStream!.Id, new IncomeStream { Name = invalidName });

        BadRequestObjectResult badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(NameRequiredMessage, badRequest.Value);
    }

    [Fact]
    public async Task Delete_RemovesUserStream()
    {
        IncomeStream toDeleteStream = await CreateTestStream(_toDeleteStream, _user1Id);
        IActionResult result = await _controller.Delete(toDeleteStream.Id);

        Assert.IsType<NoContentResult>(result);
        Assert.False(_context.IncomeStreams.Any(c => c.Name == _toDeleteStream && c.UserId == _user1Id));
    }

    [Fact]
    public async Task Delete_DoesNotAllowDeletingOthersStreams()
    {
        IncomeStream? otherUserStream = _context.IncomeStreams.FirstOrDefault(c => c.Name == _otherUserStreamName);
        IActionResult result = await _controller.Delete(otherUserStream!.Id);
        Assert.IsType<NotFoundResult>(result);
    }

    [Theory]
    [InlineData("Get")]
    [InlineData("Create")]
    [InlineData("Update")]
    [InlineData("Delete")]
    public async Task UnauthorizedUser_CannotAccessEndpoints(string action)
    {
        SetUserUnauthorized();
        IncomeStream? userStream = _context.IncomeStreams.FirstOrDefault(c => c.Name == _userStreamName);
        IActionResult result = action switch
        {
            "Get" => await _controller.Get(),
            "Create" => await _controller.Create(new IncomeStream { Name = _newStreamName }),
            "Update" => await _controller.Update(userStream!.Id, new IncomeStream { Name = _newStreamName }),
            "Delete" => await _controller.Delete(userStream!.Id),
            _ => throw new ArgumentOutOfRangeException()
        };
        Assert.IsType<UnauthorizedResult>(result);
        SetupUserContext(_user1Id);
    }

    [Theory]
    [InlineData("Create")]
    [InlineData("Update")]
    public async Task CreateAndUpdateDates(string action)
    {
        IncomeStream? userStream = _context.IncomeStreams.FirstOrDefault(c => c.Name == _userStreamName);
        IActionResult result = action switch
        {
            "Create" => await _controller.Create(new IncomeStream { Name = _newStreamName }),
            "Update" => await _controller.Update(userStream!.Id, new IncomeStream { Name = _newStreamName }),
        };
        if (action == "Create")
        {
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
            IncomeStream? stream = createdAtActionResult.Value as IncomeStream;
            Assert.NotEqual(DateTime.MinValue, stream?.CreatedAt);
            Assert.Equal(DateTime.MinValue, stream?.UpdatedAt);
        }
        if (action == "Update")
        {
            OkObjectResult? okResult = result as OkObjectResult;
            IncomeStream? stream = Assert.IsType<IncomeStream>(okResult!.Value);
            Assert.NotEqual(DateTime.MinValue, stream.CreatedAt);
            Assert.NotEqual(DateTime.MinValue, stream.UpdatedAt);
            Assert.True(stream.UpdatedAt > stream.CreatedAt);
            Assert.True(stream.UpdatedAt > DateTime.UtcNow.AddMinutes(-1));
        }
    }
}
