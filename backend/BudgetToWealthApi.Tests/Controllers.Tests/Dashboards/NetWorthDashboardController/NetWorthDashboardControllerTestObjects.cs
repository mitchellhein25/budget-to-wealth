public class NetWorthDashboardControllerTestObjects
{
  private readonly string _user1Id = "auth0|user1";
  private readonly string _user2Id = "auth0|user2";
  public HoldingCategory TestUser1Category { get; }
  public HoldingCategory TestUser2Category { get; }
  public Holding TestUser1Asset { get; }
  public Holding TestUser1Asset2 { get; }
  public Holding TestUser1Asset3 { get; }
  public Holding TestUser1Asset4 { get; }
  public Holding TestUser1Debt { get; }
  public Holding TestUser1Debt2 { get; }
  public Holding TestUser1Debt3 { get; }
  public Holding TestUser1Debt4 { get; }
  public Holding TestUser2Asset { get; }
  public Holding TestUser2Debt { get; }

  public NetWorthDashboardControllerTestObjects(ApplicationDbContext _context)
  {
    _context.HoldingCategories.Add(
        new HoldingCategory
        {
          Name = "Test_Category_1",
          UserId = _user1Id
        });
    _context.HoldingCategories.Add(
        new HoldingCategory
        {
          Name = "Test_Category_2",
          UserId = _user2Id
        });
    _context.SaveChanges();

    TestUser1Category = _context.HoldingCategories.First(c => c.Name == "Test_Category_1");
    TestUser2Category = _context.HoldingCategories.First(c => c.Name == "Test_Category_2");

    _context.Holdings.Add(
        new Holding
        {
          Name = "TestUser1Asset",
          Type = HoldingType.Asset,
          UserId = _user1Id,
          HoldingCategoryId = TestUser1Category.Id
        });
    _context.Holdings.Add(
        new Holding
        {
          Name = "TestUser1Asset2",
          Type = HoldingType.Asset,
          UserId = _user1Id,
          HoldingCategoryId = TestUser1Category.Id
        });
    _context.Holdings.Add(
        new Holding
        {
          Name = "TestUser1Asset3",
          Type = HoldingType.Asset,
          UserId = _user1Id,
          HoldingCategoryId = TestUser1Category.Id
        });
    _context.Holdings.Add(
        new Holding
        {
          Name = "TestUser1Asset4",
          Type = HoldingType.Asset,
          UserId = _user1Id,
          HoldingCategoryId = TestUser1Category.Id
        });
    _context.Holdings.Add(
        new Holding
        {
          Name = "TestUser1Debt",
          Type = HoldingType.Debt,
          UserId = _user1Id,
          HoldingCategoryId = TestUser1Category.Id
        });
    _context.Holdings.Add(
        new Holding
        {
          Name = "TestUser1Debt2",
          Type = HoldingType.Debt,
          UserId = _user1Id,
          HoldingCategoryId = TestUser1Category.Id
        });
    _context.Holdings.Add(
        new Holding
        {
          Name = "TestUser1Debt3",
          Type = HoldingType.Debt,
          UserId = _user1Id,
          HoldingCategoryId = TestUser1Category.Id
        });
    _context.Holdings.Add(
        new Holding
        {
          Name = "TestUser1Debt4",
          Type = HoldingType.Debt,
          UserId = _user1Id,
          HoldingCategoryId = TestUser1Category.Id
        });
    _context.Holdings.Add(
        new Holding
        {
          Name = "TestUser2Asset",
          Type = HoldingType.Asset,
          UserId = _user2Id,
          HoldingCategoryId = TestUser2Category.Id
        });
    _context.Holdings.Add(
        new Holding
        {
          Name = "TestUser2Debt",
          Type = HoldingType.Debt,
          UserId = _user2Id,
          HoldingCategoryId = TestUser2Category.Id
        });

    _context.SaveChanges();

    TestUser1Asset = _context.Holdings.First(c => c.Name == "TestUser1Asset");
    TestUser1Asset2 = _context.Holdings.First(c => c.Name == "TestUser1Asset2");
    TestUser1Asset3 = _context.Holdings.First(c => c.Name == "TestUser1Asset3");
    TestUser1Asset4 = _context.Holdings.First(c => c.Name == "TestUser1Asset4");
    TestUser1Debt = _context.Holdings.First(c => c.Name == "TestUser1Debt");
    TestUser1Debt2 = _context.Holdings.First(c => c.Name == "TestUser1Debt2");
    TestUser1Debt3 = _context.Holdings.First(c => c.Name == "TestUser1Debt3");
    TestUser1Debt4 = _context.Holdings.First(c => c.Name == "TestUser1Debt4");
    TestUser2Asset = _context.Holdings.First(c => c.Name == "TestUser2Asset");
    TestUser2Debt = _context.Holdings.First(c => c.Name == "TestUser2Debt");
  }

  public HoldingSnapshot TestHoldingSnapshotAsset1User1 => new()
  {
    HoldingId = TestUser1Asset.Id,
    Balance = 15000,
    Date = new DateOnly(2025, 5, 3),
    UserId = _user1Id
  };
  public HoldingSnapshot TestHoldingSnapshotAsset2User1 => new()
  {
    HoldingId = TestUser1Asset2.Id,
    Balance = 25000,
    Date = new DateOnly(2025, 5, 12),
    UserId = _user1Id
  };
  public HoldingSnapshot TestHoldingSnapshotAsset3User1 => new()
  {
    HoldingId = TestUser1Asset3.Id,
    Balance = 35000,
    Date = new DateOnly(2025, 5, 12),
    UserId = _user1Id
  };
  public HoldingSnapshot TestHoldingSnapshotAsset4User1 => new()
  {
    HoldingId = TestUser1Asset4.Id,
    Balance = 45000,
    Date = new DateOnly(2025, 2, 12),
    UserId = _user1Id
  };
  public HoldingSnapshot TestHoldingSnapshotDebt1User1 => new()
  {
    HoldingId = TestUser1Debt.Id,
    Balance = 25000,
    Date = new DateOnly(2025, 5, 20),
    UserId = _user1Id
  };
  public HoldingSnapshot TestHoldingSnapshotDebt2User1 => new()
  {
    HoldingId = TestUser1Debt2.Id,
    Balance = 10000,
    Date = new DateOnly(2025, 5, 17),
    UserId = _user1Id
  };
  public HoldingSnapshot TestHoldingSnapshotDebt3User1 => new()
  {
    HoldingId = TestUser1Debt3.Id,
    Balance = 12000,
    Date = new DateOnly(2025, 5, 24),
    UserId = _user1Id
  };
  public HoldingSnapshot TestHoldingSnapshotDebt4User1 => new()
  {
    HoldingId = TestUser1Debt4.Id,
    Balance = 10000,
    Date = new DateOnly(2024, 5, 24),
    UserId = _user1Id
  };
  public HoldingSnapshot TestHoldingSnapshotAsset1User2 => new()
  {
    HoldingId = TestUser2Asset.Id,
    Balance = 35000,
    Date = new DateOnly(2025, 5, 12),
    UserId = _user2Id
  };
  public HoldingSnapshot TestHoldingSnapshotDebt1User2 => new()
  {
    HoldingId = TestUser2Debt.Id,
    Balance = 70000,
    Date = new DateOnly(2025, 5, 22),
    UserId = _user2Id
  };
}