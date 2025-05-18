using Microsoft.EntityFrameworkCore;

public static class DatabaseSetup
{
  public static ApplicationDbContext GetDbContext()
  {
    DbContextOptions<ApplicationDbContext> options = new DbContextOptionsBuilder<ApplicationDbContext>()
        .UseNpgsql("Host=localhost;Port=5432;Database=budget_to_wealth_development;")
        .Options;

    return new ApplicationDbContext(options);
  }
}