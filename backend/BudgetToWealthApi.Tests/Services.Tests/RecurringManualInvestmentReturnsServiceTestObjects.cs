using Microsoft.EntityFrameworkCore;

public class RecurringManualInvestmentReturnsServiceTestObjects
{
    private readonly string _user1Id = "auth0|user1";
    private readonly string _user2Id = "auth0|user2";

    public ManualInvestmentCategory DefaultManualCategory { get; }
    public ManualInvestmentCategory TestUser1ManualCategory { get; }
    public ManualInvestmentCategory TestUser2ManualCategory { get; }

    public ManualInvestmentReturn User1WeeklyRecurringInvestmentReturn { get; }
    public ManualInvestmentReturn User1MonthlyRecurringInvestmentReturn { get; }
    public ManualInvestmentReturn User2Every2WeeksRecurringInvestmentReturn { get; }
    public ManualInvestmentReturn DefaultNonRecurringInvestmentReturn { get; }
    public ManualInvestmentReturn User2ExpiredRecurringInvestmentReturn { get; }

    public RecurringManualInvestmentReturnsServiceTestObjects(ApplicationDbContext context)
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

        User1WeeklyRecurringInvestmentReturn = new ManualInvestmentReturn
        {
            ManualInvestmentCategoryId = TestUser1ManualCategory.Id,
            ManualInvestmentCategory = TestUser1ManualCategory,
            StartDate = DateOnly.Parse("2022-12-01"),
            EndDate = DateOnly.Parse("2023-01-01"),
            ManualInvestmentRecurrenceEndDate = DateOnly.Parse("2023-01-31"),
            ManualInvestmentRecurrenceFrequency = RecurrenceFrequency.Weekly,
            ManualInvestmentPercentageReturn = 0.10m,
            UserId = _user1Id
        };

        User1MonthlyRecurringInvestmentReturn = new ManualInvestmentReturn
        {
            ManualInvestmentCategoryId = TestUser1ManualCategory.Id,
            ManualInvestmentCategory = TestUser1ManualCategory,
            StartDate = DateOnly.Parse("2022-12-15"),
            EndDate = DateOnly.Parse("2023-01-15"),
            ManualInvestmentRecurrenceEndDate = DateOnly.Parse("2023-02-14"),
            ManualInvestmentRecurrenceFrequency = RecurrenceFrequency.Monthly,
            ManualInvestmentPercentageReturn = 0.15m,
            UserId = _user1Id
        };

        User2Every2WeeksRecurringInvestmentReturn = new ManualInvestmentReturn
        {
            ManualInvestmentCategoryId = TestUser2ManualCategory.Id,
            ManualInvestmentCategory = TestUser2ManualCategory,
            StartDate = DateOnly.Parse("2022-12-01"),
            EndDate = DateOnly.Parse("2023-01-01"),
            ManualInvestmentRecurrenceEndDate = DateOnly.Parse("2023-01-14"),
            ManualInvestmentRecurrenceFrequency = RecurrenceFrequency.Every2Weeks,
            ManualInvestmentPercentageReturn = 0.08m,
            UserId = _user2Id
        };

        DefaultNonRecurringInvestmentReturn = new ManualInvestmentReturn
        {
            ManualInvestmentCategoryId = DefaultManualCategory.Id,
            ManualInvestmentCategory = DefaultManualCategory,
            StartDate = DateOnly.Parse("2022-12-01"),
            EndDate = DateOnly.Parse("2023-01-01"),
            ManualInvestmentRecurrenceEndDate = DateOnly.Parse("2023-01-31"),
            ManualInvestmentRecurrenceFrequency = null,
            ManualInvestmentPercentageReturn = 0.12m,
            UserId = _user1Id
        };

        User2ExpiredRecurringInvestmentReturn = new ManualInvestmentReturn
        {
            ManualInvestmentCategoryId = TestUser2ManualCategory.Id,
            ManualInvestmentCategory = TestUser2ManualCategory,
            StartDate = DateOnly.Parse("2022-12-01"),
            EndDate = DateOnly.Parse("2023-01-01"),
            ManualInvestmentRecurrenceEndDate = DateOnly.Parse("2023-01-31"),
            ManualInvestmentRecurrenceFrequency = RecurrenceFrequency.Weekly,
            ManualInvestmentPercentageReturn = 0.10m,
            UserId = _user2Id
        };
    }
}
