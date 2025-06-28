public class NetWorthTrendGraphControllerTestObjects
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

  public NetWorthTrendGraphControllerTestObjects(ApplicationDbContext _context)
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

  private HoldingSnapshot CreateHoldingSnapshot(Guid holdingId, long balance, DateOnly date, string userId)
  {
    return new HoldingSnapshot
    {
      HoldingId = holdingId,
      Balance = balance,
      Date = date,
      UserId = userId
    };
  }

  // User 1 Assets sorted by date
  public HoldingSnapshot TestHoldingSnapshotAsset4User1 => 
    CreateHoldingSnapshot(TestUser1Asset4.Id, 5000, new DateOnly(2020, 1, 1), _user1Id);
  public long TestUser1AssetTotal2020_01_01 => 5000;
  public HoldingSnapshot TestHoldingSnapshotAsset1User1 => 
    CreateHoldingSnapshot(TestUser1Asset.Id, 10000, new DateOnly(2025, 1, 5), _user1Id);
  public HoldingSnapshot TestHoldingSnapshotAsset2User1 => 
    CreateHoldingSnapshot(TestUser1Asset2.Id, 20000, new DateOnly(2025, 1, 10), _user1Id);
  public long TestUser1AssetTotal2025_02_01 => 5000 + 10000 + 20000;
  public HoldingSnapshot TestHoldingSnapshotAsset1User1_2 => 
    CreateHoldingSnapshot(TestUser1Asset.Id, 15000, new DateOnly(2025, 3, 15), _user1Id);
  public long TestUser1AssetTotal2025_04_01 => 15000 + 20000 + 5000;
  public HoldingSnapshot TestHoldingSnapshotAsset2User1_2 => 
    CreateHoldingSnapshot(TestUser1Asset2.Id, 30000, new DateOnly(2025, 4, 20), _user1Id);
  public long TestUser1AssetTotal2025_05_01 => 15000 + 30000 + 5000;
  public HoldingSnapshot TestHoldingSnapshotAsset3User1 => 
    CreateHoldingSnapshot(TestUser1Asset3.Id, 35000, new DateOnly(2025, 5, 2), _user1Id);
  public HoldingSnapshot TestHoldingSnapshotAsset1User1_3 => 
    CreateHoldingSnapshot(TestUser1Asset.Id, 15000, new DateOnly(2025, 5, 3), _user1Id);
  public HoldingSnapshot TestHoldingSnapshotAsset2User1_3 => 
    CreateHoldingSnapshot(TestUser1Asset2.Id, 25000, new DateOnly(2025, 5, 12), _user1Id);
  public HoldingSnapshot TestHoldingSnapshotAsset3User1_2 => 
    CreateHoldingSnapshot(TestUser1Asset3.Id, 35000, new DateOnly(2025, 5, 12), _user1Id);
  public long TestUser1AssetTotal2025_06_01 => 15000 + 25000 + 35000 + 5000;
  public HoldingSnapshot TestHoldingSnapshotAsset1User1_4 => 
    CreateHoldingSnapshot(TestUser1Asset.Id, 20000, new DateOnly(2025, 6, 15), _user1Id);
  public long TestUser1AssetTotal2025_07_01 => 20000 + 25000 + 35000 + 5000;

  // User 1 Debts sorted by date
  public HoldingSnapshot TestHoldingSnapshotDebt4User1 => 
    CreateHoldingSnapshot(TestUser1Debt4.Id, 10000, new DateOnly(2020, 1, 1), _user1Id);
  public long TestUser1DebtTotal2020_01_01 => 10000;
  public HoldingSnapshot TestHoldingSnapshotDebt1User1 => 
    CreateHoldingSnapshot(TestUser1Debt.Id, 30000, new DateOnly(2025, 1, 5), _user1Id);
  public HoldingSnapshot TestHoldingSnapshotDebt2User1 => 
    CreateHoldingSnapshot(TestUser1Debt2.Id, 20000, new DateOnly(2025, 1, 10), _user1Id);
  public long TestUser1DebtTotal2025_02_01 => 30000 + 20000 + 10000;
  public HoldingSnapshot TestHoldingSnapshotDebt1User1_2 => 
    CreateHoldingSnapshot(TestUser1Debt.Id, 25000, new DateOnly(2025, 3, 15), _user1Id);
  public long TestUser1DebtTotal2025_04_01 => 25000 + 20000 + 10000;
  public HoldingSnapshot TestHoldingSnapshotDebt2User1_2 => 
    CreateHoldingSnapshot(TestUser1Debt2.Id, 25000, new DateOnly(2025, 4, 20), _user1Id);
  public long TestUser1DebtTotal2025_05_01 => 25000 + 25000 + 10000;
  public HoldingSnapshot TestHoldingSnapshotDebt3User1 => 
    CreateHoldingSnapshot(TestUser1Debt3.Id, 12000, new DateOnly(2025, 5, 2), _user1Id);
  public HoldingSnapshot TestHoldingSnapshotDebt2User1_3 => 
    CreateHoldingSnapshot(TestUser1Debt2.Id, 10000, new DateOnly(2025, 5, 3), _user1Id);
  public HoldingSnapshot TestHoldingSnapshotDebt1User1_3 => 
    CreateHoldingSnapshot(TestUser1Debt.Id, 25000, new DateOnly(2025, 5, 12), _user1Id);
  public HoldingSnapshot TestHoldingSnapshotDebt3User1_2 => 
    CreateHoldingSnapshot(TestUser1Debt3.Id, 25000, new DateOnly(2025, 5, 12), _user1Id);
  public long TestUser1DebtTotal2025_06_01 => 25000 + 10000 + 25000 + 10000;
  public HoldingSnapshot TestHoldingSnapshotDebt1User1_4 => 
    CreateHoldingSnapshot(TestUser1Debt.Id, 20000, new DateOnly(2025, 6, 15), _user1Id);
  public long TestUser1DebtTotal2025_07_01 => 20000 + 10000 +25000 + 10000;

  // User 2 Snapshots
  public HoldingSnapshot TestHoldingSnapshotAssetUser2 => 
    CreateHoldingSnapshot(TestUser2Asset.Id, 5000, new DateOnly(2025, 3, 1), _user2Id);
  public HoldingSnapshot TestHoldingSnapshotDebtUser2 => 
    CreateHoldingSnapshot(TestUser2Debt.Id, 15000, new DateOnly(2025, 3, 1), _user2Id);
}