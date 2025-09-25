using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

public class ManualInvestmentReturnsControllerTests : IDisposable
{
    private readonly string _user1Id = "auth0|user1";
    private readonly string _user2Id = "auth0|user2";
    private ManualInvestmentReturnsControllerTestObjects _testObjects = null!;
    private ApplicationDbContext _context;
    private ManualInvestmentReturnsController _controller;
    private readonly IDbContextTransaction _transaction;

    public ManualInvestmentReturnsControllerTests()
    {
        _context = DatabaseSetup.GetDbContext();
        _transaction = DatabaseSetup.GetTransaction(_context);
        _controller = new ManualInvestmentReturnsController(_context);
        SetupTestData();
        SetupUserContext(_user1Id);
    }

    private void SetupTestData()
    {
        _testObjects = new(_context);
        _context.ManualInvestmentReturns.Add(_testObjects.TestDefaultManualInvestmentReturn1);
        _context.ManualInvestmentReturns.Add(_testObjects.TestUser1ManualInvestmentReturn2);
        _context.ManualInvestmentReturns.Add(_testObjects.TestUser2ManualInvestmentReturn3);
        _context.ManualInvestmentReturns.Add(_testObjects.TestDefaultManualInvestmentReturn4);
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

    public void Dispose()
    {
        _transaction.Rollback();
        _transaction.Dispose();
        _context.Dispose();
    }

    [Fact]
    public async Task Get_QueryWithoutDateReturnsAllUserInvestmentReturns()
    {
        OkObjectResult? result = await _controller.Get(null, null) as OkObjectResult;
        IEnumerable<ManualInvestmentReturn> investmentReturns = Assert.IsAssignableFrom<IEnumerable<ManualInvestmentReturn>>(result!.Value);

        Assert.Contains(investmentReturns, ir => ir.ManualInvestmentCategoryId == _testObjects.DefaultManualCategory.Id);
        Assert.Contains(investmentReturns, ir => ir.ManualInvestmentCategoryId == _testObjects.TestUser1ManualCategory.Id);
        Assert.Equal(2, investmentReturns.Count());
    }

    [Fact]
    public async Task Get_FilterByStartDate_ReturnsCorrectResults()
    {
        OkObjectResult? result = await _controller.Get(startDate: DateOnly.Parse("2023-04-01"), endDate: null) as OkObjectResult;
        IEnumerable<ManualInvestmentReturn> investmentReturns = Assert.IsAssignableFrom<IEnumerable<ManualInvestmentReturn>>(result!.Value);

        Assert.Contains(investmentReturns, ir => ir.ManualInvestmentCategoryId == _testObjects.TestUser1ManualCategory.Id);
        Assert.Single(investmentReturns);
    }

    [Fact]
    public async Task Get_FilterByEndDate_ReturnsCorrectResults()
    {
        OkObjectResult? result = await _controller.Get(startDate: null, endDate: DateOnly.Parse("2023-04-30")) as OkObjectResult;
        IEnumerable<ManualInvestmentReturn> investmentReturns = Assert.IsAssignableFrom<IEnumerable<ManualInvestmentReturn>>(result!.Value);

        Assert.Contains(investmentReturns, ir => ir.ManualInvestmentCategoryId == _testObjects.DefaultManualCategory.Id);
        Assert.Contains(investmentReturns, ir => ir.ManualInvestmentCategoryId == _testObjects.TestUser1ManualCategory.Id);
        Assert.Equal(2, investmentReturns.Count());
    }

    [Fact]
    public async Task Get_FilterByStartAndEndDate_ReturnsCorrectResults()
    {
        OkObjectResult? result = await _controller.Get(startDate: DateOnly.Parse("2023-04-01"), endDate: DateOnly.Parse("2023-05-30")) as OkObjectResult;
        IEnumerable<ManualInvestmentReturn> investmentReturns = Assert.IsAssignableFrom<IEnumerable<ManualInvestmentReturn>>(result!.Value);

        Assert.Contains(investmentReturns, ir => ir.ManualInvestmentCategoryId == _testObjects.TestUser1ManualCategory.Id);
        Assert.Single(investmentReturns);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenManualInvestmentCategoryDoesNotExist()
    {
        ManualInvestmentReturn newInvestmentReturn = new()
        {
            ManualInvestmentCategoryId = Guid.NewGuid(),
            StartDate = DateOnly.Parse("2023-07-01"),
            EndDate = DateOnly.Parse("2023-08-01"),
            ManualInvestmentRecurrenceEndDate = DateOnly.Parse("2023-08-31"),
            ManualInvestmentPercentageReturn = 0.10m
        };

        var result = await _controller.Create(newInvestmentReturn);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Invalid or unauthorized ManualInvestmentCategoryId.", badRequestResult.Value);
    }     

    [Fact]
    public async Task Create_ReturnsCreatedAtAction_WhenManualInvestmentIsValid()
    {
        ManualInvestmentReturn newInvestmentReturn = new()
        {
            ManualInvestmentCategoryId = _testObjects.TestUser1ManualCategory.Id,
            StartDate = DateOnly.Parse("2023-07-01"),
            EndDate = DateOnly.Parse("2023-08-01"),
            ManualInvestmentRecurrenceEndDate = DateOnly.Parse("2023-08-31"),
            ManualInvestmentPercentageReturn = 0.10m
        };

        var result = await _controller.Create(newInvestmentReturn);

        var createdAtActionResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(StatusCodes.Status201Created, createdAtActionResult.StatusCode);
        Assert.Equal(newInvestmentReturn, createdAtActionResult.Value);
    }

    [Fact]
    public async Task Update_ReturnsNotFound_WhenManualInvestmentReturnDoesNotExist()
    {
        ManualInvestmentReturn updatedInvestmentReturn = new()
        {
            ManualInvestmentCategoryId = _testObjects.TestUser1ManualCategory.Id,
            StartDate = DateOnly.Parse("2023-07-01"),
            EndDate = DateOnly.Parse("2023-08-01"),
            ManualInvestmentRecurrenceEndDate = DateOnly.Parse("2023-08-31"),
            ManualInvestmentPercentageReturn = 0.10m
        };

        var result = await _controller.Update(Guid.NewGuid(), updatedInvestmentReturn);
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Update_ReturnsOk_WhenInvestmentReturnIsUpdatedSuccessfully()
    {
        ManualInvestmentReturn updatedInvestmentReturn = new()
        {
            ManualInvestmentCategoryId = _testObjects.TestUser1ManualCategory.Id,
            StartDate = DateOnly.Parse("2023-08-01"),
            EndDate = DateOnly.Parse("2023-09-01"),
            ManualInvestmentRecurrenceEndDate = DateOnly.Parse("2023-09-30"),
            ManualInvestmentPercentageReturn = 0.15m,
            ManualInvestmentRecurrenceFrequency = RecurrenceFrequency.Monthly,
        };

        ManualInvestmentReturn? investmentReturnToUpdate = _context.ManualInvestmentReturns.FirstOrDefault(ir => ir.UserId == _user1Id);
        var result = await _controller.Update(investmentReturnToUpdate!.Id, updatedInvestmentReturn);

        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedInvestmentReturn = Assert.IsType<ManualInvestmentReturn>(okResult.Value);

        Assert.Equal(updatedInvestmentReturn.ManualInvestmentCategoryId, returnedInvestmentReturn.ManualInvestmentCategoryId);
        Assert.Equal(updatedInvestmentReturn.StartDate, returnedInvestmentReturn.StartDate);
        Assert.Equal(updatedInvestmentReturn.EndDate, returnedInvestmentReturn.EndDate);
        Assert.Equal(updatedInvestmentReturn.ManualInvestmentRecurrenceEndDate, returnedInvestmentReturn.ManualInvestmentRecurrenceEndDate);
        Assert.Equal(updatedInvestmentReturn.ManualInvestmentPercentageReturn, returnedInvestmentReturn.ManualInvestmentPercentageReturn);
        Assert.Equal(updatedInvestmentReturn.ManualInvestmentRecurrenceFrequency, returnedInvestmentReturn.ManualInvestmentRecurrenceFrequency);
    }

    [Fact]
    public async Task Delete_ReturnsNotFound_WhenInvestmentReturnDoesNotExist()
    {
        var investmentReturnId = Guid.NewGuid();
        var result = await _controller.Delete(investmentReturnId);
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Delete_ReturnsNoContent_WhenInvestmentReturnIsDeletedSuccessfully()
    {
        ManualInvestmentReturn newInvestmentReturnToDelete = new()
        {
            ManualInvestmentCategoryId = _testObjects.TestUser1ManualCategory.Id,
            StartDate = DateOnly.Parse("2023-07-01"),
            EndDate = DateOnly.Parse("2023-08-01"),
            ManualInvestmentRecurrenceEndDate = DateOnly.Parse("2023-08-31"),
            ManualInvestmentPercentageReturn = 0.10m,
            UserId = _user1Id
        };

        _context.ManualInvestmentReturns.Add(newInvestmentReturnToDelete);
        await _context.SaveChangesAsync();
        var result = await _controller.Delete(newInvestmentReturnToDelete.Id);
        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task Delete_DoesNotAllowDeletingOthersInvestmentReturns()
    {
        ManualInvestmentReturn? otherUserInvestmentReturn = _context.ManualInvestmentReturns.FirstOrDefault(ir => ir.UserId == _user2Id);
        IActionResult result = await _controller.Delete(otherUserInvestmentReturn!.Id);
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
        ManualInvestmentReturn? userInvestmentReturn = _context.ManualInvestmentReturns.FirstOrDefault(ir => ir.UserId == _user1Id);
        IActionResult result = action switch
        {
            "Get" => await _controller.Get(null, null),
            "Create" => await _controller.Create(userInvestmentReturn!),
            "Update" => await _controller.Update(userInvestmentReturn!.Id, userInvestmentReturn),
            "Delete" => await _controller.Delete(userInvestmentReturn!.Id),
            _ => throw new ArgumentOutOfRangeException(nameof(action), action, "Unsupported action")
        };
        Assert.IsType<UnauthorizedResult>(result);
        SetupUserContext(_user1Id);
    }

    [Theory]
    [InlineData("Create")]
    [InlineData("Update")]
    public async Task CreateAndUpdateDates(string action)
    {
        ManualInvestmentReturn updatedInvestmentReturn = new()
        {
            ManualInvestmentCategoryId = _testObjects.TestUser1ManualCategory.Id,
            StartDate = DateOnly.Parse("2023-07-01"),
            EndDate = DateOnly.Parse("2023-08-01"),
            ManualInvestmentRecurrenceEndDate = DateOnly.Parse("2023-08-31"),
            ManualInvestmentPercentageReturn = 0.10m
        };

        ManualInvestmentReturn? userInvestmentReturn = _context.ManualInvestmentReturns.FirstOrDefault(ir => ir.UserId == _user1Id);
        IActionResult result = action switch
        {
            "Create" => await _controller.Create(updatedInvestmentReturn),
            "Update" => await _controller.Update(userInvestmentReturn!.Id, updatedInvestmentReturn),
            _ => throw new ArgumentOutOfRangeException(nameof(action), action, "Unsupported action")
        };

        if (action == "Create")
        {
            var createdAtActionResult = Assert.IsType<ObjectResult>(result);
            ManualInvestmentReturn? investmentReturn = Assert.IsType<ManualInvestmentReturn>(createdAtActionResult.Value);
            Assert.NotEqual(DateTime.MinValue, investmentReturn?.CreatedAt);
            Assert.Equal(DateTime.MinValue, investmentReturn?.UpdatedAt);
        }
        if (action == "Update")
        {
            var okResult = Assert.IsType<OkObjectResult>(result);
            ManualInvestmentReturn? investmentReturn = Assert.IsType<ManualInvestmentReturn>(okResult.Value);
            Assert.NotEqual(DateTime.MinValue, investmentReturn.CreatedAt);
            Assert.NotEqual(DateTime.MinValue, investmentReturn.UpdatedAt);
            Assert.True(investmentReturn.UpdatedAt > investmentReturn.CreatedAt);
            Assert.True(investmentReturn.UpdatedAt > DateTime.UtcNow.AddMinutes(-1));
        }
    }
}
