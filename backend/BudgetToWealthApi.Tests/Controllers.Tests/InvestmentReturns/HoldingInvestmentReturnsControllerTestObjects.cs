public class HoldingInvestmentReturnsControllerTestObjects
{
    private readonly string _user1Id = "auth0|user1";
    private readonly string _user2Id = "auth0|user2";

    public HoldingCategory DefaultHoldingCategory { get; }
    public HoldingCategory TestUser1HoldingCategory { get; }
    public HoldingCategory TestUser2HoldingCategory { get; }

    public Holding DefaultHolding { get; }
    public Holding TestUser1Holding { get; }
    public Holding TestUser2Holding { get; }
    public Holding TestUser1HoldingSecond { get; }

    public HoldingSnapshot DefaultStartSnapshot { get; }
    public HoldingSnapshot DefaultEndSnapshot { get; }
    public HoldingSnapshot TestUser1StartSnapshot { get; }
    public HoldingSnapshot TestUser1EndSnapshot { get; }
    public HoldingSnapshot TestUser2StartSnapshot { get; }
    public HoldingSnapshot TestUser2EndSnapshot { get; }
    public HoldingSnapshot TestUser1SecondStartSnapshot { get; }
    public HoldingSnapshot TestUser1SecondEndSnapshot { get; }

    public HoldingInvestmentReturnsControllerTestObjects(ApplicationDbContext context)
    {
        context.HoldingCategories.Add(
            new HoldingCategory
            {
                Name = "Test_Default_Holding",
                UserId = null
            });
        context.HoldingCategories.Add(
            new HoldingCategory
            {
                Name = "Test_Holding_Category_1",
                UserId = _user1Id
            });
        context.HoldingCategories.Add(
            new HoldingCategory
            {
                Name = "Test_Holding_Category_2",
                UserId = _user2Id
            });

        context.SaveChanges();

        DefaultHoldingCategory = context.HoldingCategories.First(c => c.Name == "Test_Default_Holding");
        TestUser1HoldingCategory = context.HoldingCategories.First(c => c.Name == "Test_Holding_Category_1");
        TestUser2HoldingCategory = context.HoldingCategories.First(c => c.Name == "Test_Holding_Category_2");

        context.Holdings.Add(
            new Holding
            {
                Name = "Test_Default_Holding",
                Type = HoldingType.Asset,
                HoldingCategoryId = DefaultHoldingCategory.Id,
                HoldingCategory = DefaultHoldingCategory,
                UserId = null
            });
        context.Holdings.Add(
            new Holding
            {
                Name = "Test_Holding_1",
                Type = HoldingType.Asset,
                HoldingCategoryId = TestUser1HoldingCategory.Id,
                HoldingCategory = TestUser1HoldingCategory,
                UserId = _user1Id
            });
        context.Holdings.Add(
            new Holding
            {
                Name = "Test_Holding_2",
                Type = HoldingType.Asset,
                HoldingCategoryId = TestUser2HoldingCategory.Id,
                HoldingCategory = TestUser2HoldingCategory,
                UserId = _user2Id
            });
        context.Holdings.Add(
            new Holding
            {
                Name = "Test_Holding_1_Second",
                Type = HoldingType.Asset,
                HoldingCategoryId = TestUser1HoldingCategory.Id,
                HoldingCategory = TestUser1HoldingCategory,
                UserId = _user1Id
            });

        context.SaveChanges();

        DefaultHolding = context.Holdings.First(h => h.Name == "Test_Default_Holding");
        TestUser1Holding = context.Holdings.First(h => h.Name == "Test_Holding_1");
        TestUser2Holding = context.Holdings.First(h => h.Name == "Test_Holding_2");
        TestUser1HoldingSecond = context.Holdings.First(h => h.Name == "Test_Holding_1_Second");

        context.HoldingSnapshots.Add(
            new HoldingSnapshot
            {
                HoldingId = DefaultHolding.Id,
                Holding = DefaultHolding,
                Date = DateOnly.Parse("2023-04-01"),
                Balance = 10000,
                UserId = null
            });
        context.HoldingSnapshots.Add(
            new HoldingSnapshot
            {
                HoldingId = DefaultHolding.Id,
                Holding = DefaultHolding,
                Date = DateOnly.Parse("2023-04-30"),
                Balance = 11000,
                UserId = null
            });
        context.HoldingSnapshots.Add(
            new HoldingSnapshot
            {
                HoldingId = TestUser1Holding.Id,
                Holding = TestUser1Holding,
                Date = DateOnly.Parse("2023-05-01"),
                Balance = 5000,
                UserId = _user1Id
            });
        context.HoldingSnapshots.Add(
            new HoldingSnapshot
            {
                HoldingId = TestUser1Holding.Id,
                Holding = TestUser1Holding,
                Date = DateOnly.Parse("2023-05-30"),
                Balance = 5500,
                UserId = _user1Id
            });
        context.HoldingSnapshots.Add(
            new HoldingSnapshot
            {
                HoldingId = TestUser2Holding.Id,
                Holding = TestUser2Holding,
                Date = DateOnly.Parse("2023-06-01"),
                Balance = 8000,
                UserId = _user2Id
            });
        context.HoldingSnapshots.Add(
            new HoldingSnapshot
            {
                HoldingId = TestUser2Holding.Id,
                Holding = TestUser2Holding,
                Date = DateOnly.Parse("2023-06-30"),
                Balance = 8800,
                UserId = _user2Id
            });
        context.HoldingSnapshots.Add(
            new HoldingSnapshot
            {
                HoldingId = TestUser1HoldingSecond.Id,
                Holding = TestUser1HoldingSecond,
                Date = DateOnly.Parse("2023-04-01"),
                Balance = 3000,
                UserId = _user1Id
            });
        context.HoldingSnapshots.Add(
            new HoldingSnapshot
            {
                HoldingId = TestUser1HoldingSecond.Id,
                Holding = TestUser1HoldingSecond,
                Date = DateOnly.Parse("2023-07-30"),
                Balance = 3300,
                UserId = _user1Id
            });

        context.SaveChanges();

        DefaultStartSnapshot = context.HoldingSnapshots.First(s => s.Date == DateOnly.Parse("2023-04-01") && s.HoldingId == DefaultHolding.Id);
        DefaultEndSnapshot = context.HoldingSnapshots.First(s => s.Date == DateOnly.Parse("2023-04-30") && s.HoldingId == DefaultHolding.Id);
        TestUser1StartSnapshot = context.HoldingSnapshots.First(s => s.Date == DateOnly.Parse("2023-05-01") && s.HoldingId == TestUser1Holding.Id);
        TestUser1EndSnapshot = context.HoldingSnapshots.First(s => s.Date == DateOnly.Parse("2023-05-30") && s.HoldingId == TestUser1Holding.Id);
        TestUser2StartSnapshot = context.HoldingSnapshots.First(s => s.Date == DateOnly.Parse("2023-06-01") && s.HoldingId == TestUser2Holding.Id);
        TestUser2EndSnapshot = context.HoldingSnapshots.First(s => s.Date == DateOnly.Parse("2023-06-30") && s.HoldingId == TestUser2Holding.Id);
        TestUser1SecondStartSnapshot = context.HoldingSnapshots.First(s => s.Date == DateOnly.Parse("2023-04-01") && s.HoldingId == TestUser1HoldingSecond.Id);
        TestUser1SecondEndSnapshot = context.HoldingSnapshots.First(s => s.Date == DateOnly.Parse("2023-07-30") && s.HoldingId == TestUser1HoldingSecond.Id);
    }

    public HoldingInvestmentReturn TestDefaultInvestmentReturn1 => new()
    {
        StartHoldingSnapshotId = DefaultStartSnapshot.Id,
        StartHoldingSnapshot = DefaultStartSnapshot,
        EndHoldingSnapshotId = DefaultEndSnapshot.Id,
        EndHoldingSnapshot = DefaultEndSnapshot,
        TotalContributions = 500,
        TotalWithdrawals = 0,
        UserId = _user1Id
    };

    public HoldingInvestmentReturn TestUser2InvestmentReturn2 => new()
    {
        StartHoldingSnapshotId = TestUser2StartSnapshot.Id,
        StartHoldingSnapshot = TestUser2StartSnapshot,
        EndHoldingSnapshotId = TestUser2EndSnapshot.Id,
        EndHoldingSnapshot = TestUser2EndSnapshot,
        TotalContributions = 200,
        TotalWithdrawals = 0,
        UserId = _user2Id
    };

    public HoldingInvestmentReturn TestUser1InvestmentReturn3 => new()
    {
        StartHoldingSnapshotId = TestUser1StartSnapshot.Id,
        StartHoldingSnapshot = TestUser1StartSnapshot,
        EndHoldingSnapshotId = TestUser1EndSnapshot.Id,
        EndHoldingSnapshot = TestUser1EndSnapshot,
        TotalContributions = 300,
        TotalWithdrawals = 100,
        UserId = _user1Id
    };

    public HoldingInvestmentReturn TestUser1SecondInvestmentReturn4 => new()
    {
        StartHoldingSnapshotId = TestUser1SecondStartSnapshot.Id,
        StartHoldingSnapshot = TestUser1SecondStartSnapshot,
        EndHoldingSnapshotId = TestUser1SecondEndSnapshot.Id,
        EndHoldingSnapshot = TestUser1SecondEndSnapshot,
        TotalContributions = 400,
        TotalWithdrawals = 50,
        UserId = _user1Id
    };
}
