using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<CashFlowCategory> CashFlowCategories { get; set; }
    public DbSet<CashFlowEntry> CashFlowEntries { get; set; }
    public DbSet<HoldingCategory> HoldingCategories { get; set; }
    public DbSet<Holding> Holdings { get; set; }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        foreach (var entityType in modelBuilder.Model.GetEntityTypes()
            .Where(e => typeof(IDbEntity).IsAssignableFrom(e.ClrType)))
        {
            SetDbEntityProperties(modelBuilder, entityType.ClrType);
        }

        SeedDefaultCashFlowCategories(modelBuilder);
    }

    private void SetDbEntityProperties(ModelBuilder modelBuilder, Type entityType)
    {
        modelBuilder.Entity(entityType)
            .Property("Id")
            .HasColumnType("uuid")
            .ValueGeneratedOnAdd()
            .HasDefaultValueSql("gen_random_uuid()");
            
        modelBuilder.Entity(entityType)
            .Property("CreatedAt")
            .HasColumnType("timestamp with time zone")
            .ValueGeneratedOnAdd()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        if (entityType.GetProperty("Amount") != null)
        {
            modelBuilder.Entity(entityType)
                .Property("Amount")
                .HasColumnType("BIGINT");
        }
    }

    private void SeedDefaultCashFlowCategories(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CashFlowCategory>().HasData(
            new CashFlowCategory 
            { 
                Id = new Guid("3f5c7b85-2b1e-4c3f-9e5a-f1d9b22f0cd8"), 
                Name = "Groceries", 
                CategoryType = CashFlowType.Expense, 
                UserId = null 
            },
            new CashFlowCategory 
            { 
                Id = new Guid("9c3b8b5e-83e2-4e30-bb25-6fba8e7c3c45"), 
                Name = "Utilities", 
                CategoryType = CashFlowType.Expense,
                UserId = null 
            },
            new CashFlowCategory 
            { 
                Id = new Guid("f2a91271-6a9a-45db-8f3c-e62cf6d972fa"), 
                Name = "Transportation",
                CategoryType = CashFlowType.Expense, 
                UserId = null 
            }
        );
    }
}
