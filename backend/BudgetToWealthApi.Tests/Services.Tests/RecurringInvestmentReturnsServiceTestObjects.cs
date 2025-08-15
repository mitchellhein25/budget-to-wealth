using Microsoft.EntityFrameworkCore;

public class RecurringInvestmentReturnsServiceTestObjects
{
    private readonly string _user1Id = "auth0|user1";
    private readonly string _user2Id = "auth0|user2";

    public ManualInvestmentCategory DefaultManualCategory { get; }
    public ManualInvestmentCategory TestUser1ManualCategory { get; }
    public ManualInvestmentCategory TestUser2ManualCategory { get; }

    public InvestmentReturn User1WeeklyRecurringInvestmentReturn { get; }
    public InvestmentReturn User1MonthlyRecurringInvestmentReturn { get; }
    public InvestmentReturn User2Every2WeeksRecurringInvestmentReturn { get; }
    public InvestmentReturn DefaultNonRecurringInvestmentReturn { get; }
    public InvestmentReturn User2ExpiredRecurringInvestmentReturn { get; }

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

        User1WeeklyRecurringInvestmentReturn = new InvestmentReturn
        {
            ManualInvestmentCategoryId = TestUser1ManualCategory.Id,
            ManualInvestmentCategory = TestUser1ManualCategory,
            ManualInvestmentReturnDate = DateOnly.Parse("2023-01-01"),
            ManualInvestmentRecurrenceEndDate = DateOnly.Parse("2023-01-31"),
            ManualInvestmentRecurrenceFrequency = RecurrenceFrequency.Weekly,
            ManualInvestmentPercentageReturn = 0.10m,
            TotalContributions = 1000,
            TotalWithdrawals = 0,
            UserId = _user1Id
        };

        User1MonthlyRecurringInvestmentReturn = new InvestmentReturn
        {
            ManualInvestmentCategoryId = TestUser1ManualCategory.Id,
            ManualInvestmentCategory = TestUser1ManualCategory,
            ManualInvestmentReturnDate = DateOnly.Parse("2023-01-15"),
            ManualInvestmentRecurrenceEndDate = DateOnly.Parse("2023-02-14"),
            ManualInvestmentRecurrenceFrequency = RecurrenceFrequency.Monthly,
            ManualInvestmentPercentageReturn = 0.15m,
            TotalContributions = 2000,
            TotalWithdrawals = 100,
            UserId = _user1Id
        };

        User2Every2WeeksRecurringInvestmentReturn = new InvestmentReturn
        {
            ManualInvestmentCategoryId = TestUser2ManualCategory.Id,
            ManualInvestmentCategory = TestUser2ManualCategory,
            ManualInvestmentReturnDate = DateOnly.Parse("2023-01-01"),
            ManualInvestmentRecurrenceEndDate = DateOnly.Parse("2023-01-14"),
            ManualInvestmentRecurrenceFrequency = RecurrenceFrequency.Every2Weeks,
            ManualInvestmentPercentageReturn = 0.08m,
            TotalContributions = 1500,
            TotalWithdrawals = 200,
            UserId = _user2Id
        };

        DefaultNonRecurringInvestmentReturn = new InvestmentReturn
        {
            ManualInvestmentCategoryId = DefaultManualCategory.Id,
            ManualInvestmentCategory = DefaultManualCategory,
            ManualInvestmentReturnDate = DateOnly.Parse("2023-01-01"),
            ManualInvestmentRecurrenceEndDate = DateOnly.Parse("2023-01-31"),
            ManualInvestmentRecurrenceFrequency = null,
            ManualInvestmentPercentageReturn = 0.12m,
            TotalContributions = 3000,
            TotalWithdrawals = 150,
            UserId = _user1Id
        };

        User2ExpiredRecurringInvestmentReturn = new InvestmentReturn
        {
            ManualInvestmentCategoryId = TestUser2ManualCategory.Id,
            ManualInvestmentCategory = TestUser2ManualCategory,
            ManualInvestmentReturnDate = DateOnly.Parse("2023-01-01"),
            ManualInvestmentRecurrenceEndDate = DateOnly.Parse("2023-01-31"),
            ManualInvestmentRecurrenceFrequency = RecurrenceFrequency.Weekly,
            ManualInvestmentPercentageReturn = 0.10m,
            TotalContributions = 1000,
            TotalWithdrawals = 0,
            UserId = _user2Id
        };
    }
}
