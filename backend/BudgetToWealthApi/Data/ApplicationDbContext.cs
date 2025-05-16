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
            new ExpenseCategory { Id = new Guid("3f5c7b85-2b1e-4c3f-9e5a-f1d9b22f0cd8"), Name = "Groceries", UserId = null },
            new ExpenseCategory { Id = new Guid("9c3b8b5e-83e2-4e30-bb25-6fba8e7c3c45"), Name = "Utilities", UserId = null },
            new ExpenseCategory { Id = new Guid("f2a91271-6a9a-45db-8f3c-e62cf6d972fa"), Name = "Transportation", UserId = null }
        );
    }
}
