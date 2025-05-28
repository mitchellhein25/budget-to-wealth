using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

public static class DatabaseSetup
{
    private static readonly string _connectionString = 
        "Host=localhost;Port=5432;Database=budget_to_wealth_testing;";
    
    private static readonly object _lock = new object();
    private static bool _databaseInitialized = false;
    
    public static ApplicationDbContext GetDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseNpgsql(_connectionString)
            .EnableSensitiveDataLogging()
            .Options;
            
        var context = new ApplicationDbContext(options);
        
        InitializeDatabase(context);
        
        return context;
    }
    
    private static void InitializeDatabase(ApplicationDbContext context)
    {
        lock (_lock)
        {
            if (!_databaseInitialized)
            {
                context.Database.EnsureDeleted();
                context.Database.EnsureCreated();
                _databaseInitialized = true;
            }
        }
    }
    
    public static IDbContextTransaction GetTransaction(ApplicationDbContext context)
    {
        return context.Database.BeginTransaction();
    }
}