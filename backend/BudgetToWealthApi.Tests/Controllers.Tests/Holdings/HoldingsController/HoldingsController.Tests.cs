using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage;

public class HoldingsControllerTests : IDisposable
{
    private readonly string _user1Id = "auth0|user1";
    private readonly string _user2Id = "auth0|user2";
    private HoldingsControllerTestObjects _testObjects;
    private ApplicationDbContext _context;
    private HoldingsController _controller;
    private readonly IDbContextTransaction _transaction;
    public HoldingsControllerTests()
    {
        _context = DatabaseSetup.GetDbContext();
        _transaction = DatabaseSetup.GetTransaction(_context);
        _controller = new HoldingsController(_context);
        SetupTestData();
        SetupUserContext(_user1Id);
    }

    private void SetupTestData()
    {
        _testObjects = new(_context);
        _context.Holdings.Add(_testObjects.TestHoldingAssetDefaultUser1);
        _context.Holdings.Add(_testObjects.TestHoldingAssetCat1User1);
        _context.Holdings.Add(_testObjects.TestHoldingAssetCat2User2);
        _context.Holdings.Add(_testObjects.TestHoldingAsset2Cat2User2);
        _context.Holdings.Add(_testObjects.TestHoldingDebtDefCatUser1);
        _context.Holdings.Add(_testObjects.TestHoldingDebtCat1User1);
        _context.Holdings.Add(_testObjects.TestHoldingDebtCat2User2);
        _context.Holdings.Add(_testObjects.TestHoldingDebt2Cat2User2);
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

    private async Task<Holding> CreateTestHoldings(Holding holding)
    {
        _context.Holdings.Add(holding);
        await _context.SaveChangesAsync();
        return holding;
    }

    public void Dispose()
    {
        _transaction.Rollback();
        _transaction.Dispose();
        _context.Dispose();
    }

    [Fact]
    public async Task Get_QueryWithoutTypeOrCategoryReturnsAllUserHoldings()
    {
        OkObjectResult? result = await _controller.Get() as OkObjectResult;
        IEnumerable<Holding> holdings = Assert.IsAssignableFrom<IEnumerable<Holding>>(result!.Value);

        Assert.Contains(holdings, exp => exp.Name == _testObjects.TestHoldingAssetDefaultUser1.Name);
        Assert.Equal(4, holdings.Count());
    }
    
    [Theory]
    [InlineData(HoldingType.Asset)]
    [InlineData(HoldingType.Debt)]
    public async Task Get_FilterByType(HoldingType holdingType)
    {
        OkObjectResult? result = await _controller.Get(type: holdingType) as OkObjectResult;
        IEnumerable<Holding> holdings = Assert.IsAssignableFrom<IEnumerable<Holding>>(result!.Value);

        if (holdingType == HoldingType.Asset)
        {
            Assert.Contains(holdings, holding => holding.Name == _testObjects.TestHoldingAssetCat1User1.Name);
            Assert.Equal(2, holdings.Count());
        }
        if (holdingType == HoldingType.Debt)
        {
            Assert.Contains(holdings, holding => holding.Name == _testObjects.TestHoldingDebtCat1User1.Name);
            Assert.Equal(2, holdings.Count());
        }
    }
    
    [Fact]
    public async Task Get_FilterByCategoryId()
    {
        OkObjectResult? result = await _controller.Get(holdingCategoryId: _testObjects.TestUser1Category.Id) as OkObjectResult;
        IEnumerable<Holding> holdings = Assert.IsAssignableFrom<IEnumerable<Holding>>(result!.Value);
        Assert.Contains(holdings, hold => hold.HoldingCategoryId == _testObjects.TestUser1Category.Id);
        Assert.Equal(2, holdings.Count());
    }

    [Theory]
    [InlineData("")]
    [InlineData("  ")]
    public async Task Create_ReturnsBadRequest_EmptyName(string newName)
    {
        Holding newHolding = new()
        {   
            Name = newName,
            Type = HoldingType.Asset,
            HoldingCategoryId = _testObjects.TestUser1Category.Id
        };

        var result = await _controller.Create(newHolding);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Holding name cannot be empty.", badRequestResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenHoldingCategoryIdIsEmpty()
    {
        Holding newHolding = new()
        {   
            Name = "Test new",
            Type = HoldingType.Asset,
            HoldingCategoryId = Guid.Empty
        };

        var result = await _controller.Create(newHolding);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("HoldingCategoryId is required.", badRequestResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenCategoryDoesNotExistForUser()
    {
        Holding newHolding = new()
        {   
            Name = "Test new",
            Type = HoldingType.Asset,
            HoldingCategoryId = _testObjects.TestUser2Category.Id
        };

        var result = await _controller.Create(newHolding);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Invalid or unauthorized HoldingCategoryId.", badRequestResult.Value);
    }

    [Fact]
    public async Task Create_ReturnsCreatedAtAction_WhenHoldingsIsValid()
    {
        Holding newHolding = new()
        {   
            Name = "Test new",
            Type = HoldingType.Asset,
            HoldingCategoryId = _testObjects.TestUser1Category.Id
        };

        var result = await _controller.Create(newHolding);

        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal(nameof(HoldingsController.Get), createdAtActionResult.ActionName);
        Assert.Equal(newHolding, createdAtActionResult.Value);
    }

    [Fact]
    public async Task Update_ReturnsNotFound_WhenHoldingDoesNotExist()
    {
        Holding updatedHolding = new()
        {   
            Name = "Test new",
            Type = HoldingType.Asset,
            HoldingCategoryId = _testObjects.TestUser1Category.Id
        };
        var result = await _controller.Update(Guid.NewGuid(), updatedHolding);
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Update_ReturnsBadRequest_WhenValidationFails()
    {
        Holding updatedHolding = new()
        {   
            Name = "Test new",
            Type = HoldingType.Asset,
            HoldingCategoryId = Guid.Empty
        };
        Holding? holdingToUpdate = _context.Holdings.FirstOrDefault(exp => exp.UserId == _user1Id);
        var result = await _controller.Update(holdingToUpdate!.Id, updatedHolding);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("HoldingCategoryId is required.", badRequestResult.Value);
    }

    [Fact]
    public async Task Update_ReturnsOk_WhenHoldingIsUpdatedSuccessfully()
    {
        Holding updatedHolding = new()
        {   
            Name = "Test new",
            Type = HoldingType.Debt,
            HoldingCategoryId = _testObjects.TestUser1Category.Id
        };
        Holding? holdingToUpdate = _context.Holdings.FirstOrDefault(exp => exp.UserId == _user1Id);
        var result = await _controller.Update(holdingToUpdate!.Id, updatedHolding);

        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedHolding = Assert.IsType<Holding>(okResult.Value);

        Assert.Equal(updatedHolding.Name, returnedHolding.Name);
        Assert.Equal(updatedHolding.Type, returnedHolding.Type);
        Assert.Equal(updatedHolding.HoldingCategoryId, returnedHolding.HoldingCategoryId);
    }

    [Fact]
    public async Task Delete_ReturnsNotFound_WhenHoldingsDoesNotExist()
    {
        var holdingId = Guid.NewGuid();
        var result = await _controller.Delete(holdingId);
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Delete_ReturnsNoContent_WhenHoldingsIsDeletedSuccessfully()
    {
        Holding newHoldingToDelete = new()
        {   
            UserId = _user1Id,
            Name = "Test new",
            Type = HoldingType.Debt,
            HoldingCategoryId = _testObjects.TestUser1Category.Id
        };
        _context.Holdings.Add(newHoldingToDelete);
        await _context.SaveChangesAsync();
        var result = await _controller.Delete(newHoldingToDelete.Id);
        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task Delete_DoesNotAllowDeletingOthersHoldings()
    {
        Holding? otherUserHolding = _context.Holdings.FirstOrDefault(hold => hold.UserId == _user2Id);
        IActionResult result = await _controller.Delete(otherUserHolding!.Id);
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
        Holding? userHolding = _context.Holdings.FirstOrDefault(exp => exp.UserId == _user1Id);
        IActionResult result = action switch
        {
            "Get" => await _controller.Get(),
            "Create" => await _controller.Create(userHolding!),
            "Update" => await _controller.Update(userHolding!.Id, userHolding),
            "Delete" => await _controller.Delete(userHolding!.Id),
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
        Holding updatedHolding = new()
        {   
            Name = "Test new",
            Type = HoldingType.Debt,
            HoldingCategoryId = _testObjects.TestUser1Category.Id
        };
        Holding? userHoldings = _context.Holdings.FirstOrDefault(holding => holding.UserId == _user1Id);
        IActionResult result = action switch
        {
            "Create" => await _controller.Create(updatedHolding),
            "Update" => await _controller.Update(userHoldings!.Id, updatedHolding),
        };
        if (action == "Create")
        {
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
            Holding? holding = createdAtActionResult.Value as Holding;
            Assert.NotEqual(DateTime.MinValue, holding?.CreatedAt);
            Assert.Equal(DateTime.MinValue, holding?.UpdatedAt);
        }
        if (action == "Update")
        {
            var okResult = Assert.IsType<OkObjectResult>(result);
            Holding? holding = Assert.IsType<Holding>(okResult.Value);
            Assert.NotEqual(DateTime.MinValue, holding.CreatedAt);
            Assert.NotEqual(DateTime.MinValue, holding.UpdatedAt);
            Assert.True(holding.UpdatedAt > holding.CreatedAt);
            Assert.True(holding.UpdatedAt > DateTime.UtcNow.AddMinutes(-1));
        }
    }
}
