public class ManualInvestmentReturnsControllerTestObjects
{
    private readonly string _user1Id = "auth0|user1";
    private readonly string _user2Id = "auth0|user2";

    public ManualInvestmentCategory DefaultManualCategory { get; }
    public ManualInvestmentCategory TestUser1ManualCategory { get; }
    public ManualInvestmentCategory TestUser2ManualCategory { get; }

    public ManualInvestmentReturnsControllerTestObjects(ApplicationDbContext context)
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
        context.SaveChanges();

        context.SaveChanges();
    }

    public ManualInvestmentReturn TestDefaultManualInvestmentReturn1 => new()
    {
        ManualInvestmentCategoryId = DefaultManualCategory.Id,
        ManualInvestmentCategory = DefaultManualCategory,
        ManualInvestmentReturnDate = DateOnly.Parse("2023-04-01"),
        ManualInvestmentRecurrenceEndDate = DateOnly.Parse("2023-04-30"),
        ManualInvestmentRecurrenceFrequency = null,
        ManualInvestmentPercentageReturn = 0.10m,
        UserId = _user1Id
    };

    public ManualInvestmentReturn TestUser1ManualInvestmentReturn2 => new()
    {
        ManualInvestmentCategoryId = TestUser1ManualCategory.Id,
        ManualInvestmentCategory = TestUser1ManualCategory,
        ManualInvestmentReturnDate = DateOnly.Parse("2023-05-01"),
        ManualInvestmentRecurrenceEndDate = DateOnly.Parse("2023-05-31"),
        ManualInvestmentRecurrenceFrequency = RecurrenceFrequency.Weekly,
        ManualInvestmentPercentageReturn = 0.15m,
        UserId = _user1Id
    };

    public ManualInvestmentReturn TestUser2ManualInvestmentReturn3 => new()
    {
        ManualInvestmentCategoryId = TestUser2ManualCategory.Id,
        ManualInvestmentCategory = TestUser2ManualCategory,
        ManualInvestmentReturnDate = DateOnly.Parse("2023-06-01"),
        ManualInvestmentRecurrenceEndDate = DateOnly.Parse("2023-06-30"),
        ManualInvestmentRecurrenceFrequency = RecurrenceFrequency.Weekly,
        ManualInvestmentPercentageReturn = 0.08m,
        UserId = _user2Id
    };

    public ManualInvestmentReturn TestDefaultManualInvestmentReturn4 => new()
    {
        ManualInvestmentCategoryId = DefaultManualCategory.Id,
        ManualInvestmentCategory = DefaultManualCategory,
        ManualInvestmentReturnDate = DateOnly.Parse("2023-07-01"),
        ManualInvestmentRecurrenceEndDate = DateOnly.Parse("2023-07-31"),
        ManualInvestmentRecurrenceFrequency = RecurrenceFrequency.Weekly,
        ManualInvestmentPercentageReturn = 0.12m,
        UserId = _user2Id
    };
}
