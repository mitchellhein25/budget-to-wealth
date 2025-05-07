using Xunit;
using Moq;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class ExpenseCategoriesControllerTests
{
    private ExpenseCategoriesController GetControllerWithContext(out ApplicationDbContext context, string? userId = "auth0|user123")
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        context = new ApplicationDbContext(options);

        var controller = new ExpenseCategoriesController(context);

        if (userId != null)
        {
            var claims = new List<Claim> { new Claim("sub", userId) };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = claimsPrincipal }
            };
        }

        return controller;
    }

    [Fact]
    public async Task Get_ReturnsDefaultAndUserCategories()
    {
        // Arrange
        var controller = GetControllerWithContext(out var context);
        context.ExpenseCategories.AddRange(
            new ExpenseCategory { Id = 1, Name = "Default", UserId = null },
            new ExpenseCategory { Id = 2, Name = "User's", UserId = "auth0|user123" },
            new ExpenseCategory { Id = 3, Name = "Another User's", UserId = "auth0|other" }
        );
        await context.SaveChangesAsync();

        // Act
        var result = await controller.Get() as OkObjectResult;
        var categories = Assert.IsAssignableFrom<IEnumerable<ExpenseCategory>>(result!.Value);

        // Assert
        Assert.Contains(categories, c => c.Name == "Default");
        Assert.Contains(categories, c => c.Name == "User's");
        Assert.DoesNotContain(categories, c => c.Name == "Another User's");
    }

    [Fact]
    public async Task Create_AddsCategoryForUser()
    {
        var controller = GetControllerWithContext(out var context);
        var newCategory = new ExpenseCategory { Name = "New Category" };

        var result = await controller.Create(newCategory) as OkObjectResult;

        Assert.NotNull(result);
        var saved = await context.ExpenseCategories.FirstOrDefaultAsync(c => c.Name == "New Category");
        Assert.Equal("auth0|user123", saved!.UserId);
    }

    [Fact]
    public async Task Delete_RemovesUserOrDefaultCategory()
    {
        var controller = GetControllerWithContext(out var context);
        context.ExpenseCategories.Add(new ExpenseCategory { Id = 1, Name = "ToDelete", UserId = "auth0|user123" });
        await context.SaveChangesAsync();

        var result = await controller.Delete(1);

        Assert.IsType<NoContentResult>(result);
        Assert.False(context.ExpenseCategories.Any(c => c.Id == 1));
    }

    [Fact]
    public async Task Delete_DoesNotAllowDeletingOthersCategories()
    {
        var controller = GetControllerWithContext(out var context);
        context.ExpenseCategories.Add(new ExpenseCategory { Id = 1, Name = "Other", UserId = "auth0|other" });
        await context.SaveChangesAsync();

        var result = await controller.Delete(1);

        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Update_ModifiesOwnedCategory()
    {
        var controller = GetControllerWithContext(out var context);
        context.ExpenseCategories.Add(new ExpenseCategory { Id = 1, Name = "Old", UserId = "auth0|user123" });
        await context.SaveChangesAsync();

        var result = await controller.Update(1, new ExpenseCategory { Name = "Updated" }) as OkObjectResult;

        var updated = await context.ExpenseCategories.FindAsync(1);
        Assert.Equal("Updated", updated!.Name);
    }

    [Fact]
    public async Task Update_DefaultCategoryCreatesCustomCopy()
    {
        var controller = GetControllerWithContext(out var context);
        context.ExpenseCategories.Add(new ExpenseCategory { Id = 1, Name = "Default", UserId = null });
        await context.SaveChangesAsync();

        var result = await controller.Update(1, new ExpenseCategory { Name = "Customized" }) as OkObjectResult;

        var all = await context.ExpenseCategories.ToListAsync();
        Assert.Contains(all, c => c.Name == "Default" && c.UserId == null);
        Assert.Contains(all, c => c.Name == "Customized" && c.UserId == "auth0|user123");
    }

    [Fact]
    public async Task UnauthorizedUser_ReturnsUnauthorized()
    {
        var controller = GetControllerWithContext(out var context, userId: null);

        var result = await controller.Get();

        Assert.IsType<UnauthorizedResult>(result);
    }
}
