using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<ExpenseCategory> ExpenseCategories { get; set; }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .Property(u => u.CreatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        modelBuilder.Entity<User>()
            .Property(u => u.UpdatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        
        modelBuilder.Entity<ExpenseCategory>().HasData(
            new ExpenseCategory { Id = 1, Name = "Groceries", UserId = null },
            new ExpenseCategory { Id = 2, Name = "Utilities", UserId = null },
            new ExpenseCategory { Id = 3, Name = "Transportation", UserId = null }
        );
    }
}
