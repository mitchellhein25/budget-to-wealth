using Microsoft.EntityFrameworkCore;

public class RecurringInvestmentReturnsServiceTestObjects
{
    private readonly string _user1Id = "auth0|user1";
    private readonly string _user2Id = "auth0|user2";

    public ManualInvestmentCategory DefaultManualCategory { get; }
    public ManualInvestmentCategory TestUser1ManualCategory { get; }
    public ManualInvestmentCategory TestUser2ManualCategory { get; }

    public InvestmentReturn WeeklyRecurringInvestmentReturn { get; }
    public InvestmentReturn MonthlyRecurringInvestmentReturn { get; }
    public InvestmentReturn Every2WeeksRecurringInvestmentReturn { get; }
    public InvestmentReturn NonRecurringInvestmentReturn { get; }
    public InvestmentReturn ExpiredRecurringInvestmentReturn { get; }

    public RecurringInvestmentReturnsServiceTestObjects(ApplicationDbContext context)
    {
        context.ManualInvestmentCategories.Add(
            new ManualInvestmentCategory
            {
                Name = "Test_Default_Manual",
                UserId = null
            });
        context.ManualInvestmentCategories.Add(
            new ManualInvestmentCategory
            {
                Name = "Test_Manual_Category_1",
                UserId = _user1Id
            });
        context.ManualInvestmentCategories.Add(
            new ManualInvestmentCategory
            {
                Name = "Test_Manual_Category_2",
                UserId = _user2Id
            });

        context.SaveChanges();

        DefaultManualCategory = context.ManualInvestmentCategories.First(c => c.Name == "Test_Default_Manual");
        TestUser1ManualCategory = context.ManualInvestmentCategories.First(c => c.Name == "Test_Manual_Category_1");
        TestUser2ManualCategory = context.ManualInvestmentCategories.First(c => c.Name == "Test_Manual_Category_2");

        WeeklyRecurringInvestmentReturn = new InvestmentReturn
        {
            ManualInvestmentCategoryId = TestUser1ManualCategory.Id,
            ManualInvestmentCategory = TestUser1ManualCategory,
            ManualInvestmentStartDate = DateOnly.Parse("2023-01-01"),
            ManualInvestmentEndDate = DateOnly.Parse("2023-01-31"),
            ManualInvestmentPercentageReturn = 0.10m,
            TotalContributions = 1000,
            TotalWithdrawals = 0,
            RecurrenceFrequency = RecurrenceFrequency.Weekly,
            RecurrenceEndDate = DateOnly.Parse("2024-12-31"),
            UserId = _user1Id
        };

        MonthlyRecurringInvestmentReturn = new InvestmentReturn
        {
            ManualInvestmentCategoryId = TestUser1ManualCategory.Id,
            ManualInvestmentCategory = TestUser1ManualCategory,
            ManualInvestmentStartDate = DateOnly.Parse("2023-01-15"),
            ManualInvestmentEndDate = DateOnly.Parse("2023-02-14"),
            ManualInvestmentPercentageReturn = 0.15m,
            TotalContributions = 2000,
            TotalWithdrawals = 100,
            RecurrenceFrequency = RecurrenceFrequency.Monthly,
            RecurrenceEndDate = DateOnly.Parse("2024-12-31"),
            UserId = _user1Id
        };

        Every2WeeksRecurringInvestmentReturn = new InvestmentReturn
        {
            ManualInvestmentCategoryId = TestUser2ManualCategory.Id,
            ManualInvestmentCategory = TestUser2ManualCategory,
            ManualInvestmentStartDate = DateOnly.Parse("2023-01-01"),
            ManualInvestmentEndDate = DateOnly.Parse("2023-01-14"),
            ManualInvestmentPercentageReturn = 0.08m,
            TotalContributions = 1500,
            TotalWithdrawals = 200,
            RecurrenceFrequency = RecurrenceFrequency.Every2Weeks,
            RecurrenceEndDate = DateOnly.Parse("2024-12-31"),
            UserId = _user2Id
        };

        NonRecurringInvestmentReturn = new InvestmentReturn
        {
            ManualInvestmentCategoryId = DefaultManualCategory.Id,
            ManualInvestmentCategory = DefaultManualCategory,
            ManualInvestmentStartDate = DateOnly.Parse("2023-01-01"),
            ManualInvestmentEndDate = DateOnly.Parse("2023-01-31"),
            ManualInvestmentPercentageReturn = 0.12m,
            TotalContributions = 3000,
            TotalWithdrawals = 150,
            RecurrenceFrequency = null,
            RecurrenceEndDate = null,
            UserId = _user1Id
        };

        ExpiredRecurringInvestmentReturn = new InvestmentReturn
        {
            ManualInvestmentCategoryId = TestUser2ManualCategory.Id,
            ManualInvestmentCategory = TestUser2ManualCategory,
            ManualInvestmentStartDate = DateOnly.Parse("2023-01-01"),
            ManualInvestmentEndDate = DateOnly.Parse("2023-01-31"),
            ManualInvestmentPercentageReturn = 0.10m,
            TotalContributions = 1000,
            TotalWithdrawals = 0,
            RecurrenceFrequency = RecurrenceFrequency.Weekly,
            RecurrenceEndDate = DateOnly.Parse("2023-06-30"),
            UserId = _user2Id
        };
    }
}
