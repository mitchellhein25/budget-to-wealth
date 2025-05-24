public class HoldingSnapshotsControllerTestObjects
{
  private readonly string _user1Id = "auth0|user1";
  private readonly string _user2Id = "auth0|user2";
  public HoldingCategory DefaultCategory { get; }
  public HoldingCategory TestUser1Category { get; }
  public HoldingCategory TestUser2Category { get; }
  public Holding TestUser1Holding1 { get; }
  public Holding TestUser2Holding1 { get; }
  public Holding TestUser1Holding2 { get; }
  public Holding TestUser2Holding2 { get; }

  public HoldingSnapshotsControllerTestObjects(ApplicationDbContext _context)
  {
    _context.HoldingCategories.Add(
        new HoldingCategory
        { 
          Name = "Test_Default", 
          UserId = null, 
        });
    _context.HoldingCategories.Add(
        new HoldingCategory 
        { 
          Name = "Test_Category_2", 
          UserId = _user2Id, 
        });
    _context.HoldingCategories.Add(
        new HoldingCategory 
        { 
          Name = "Test_Category_1", 
          UserId = _user1Id
        });
    _context.SaveChanges();
    
    DefaultCategory = _context.HoldingCategories.First(c => c.Name == "Test_Default");
    TestUser2Category = _context.HoldingCategories.First(c => c.Name == "Test_Category_2");
    TestUser1Category = _context.HoldingCategories.First(c => c.Name == "Test_Category_1");

    _context.Holdings.Add(
        new Holding
        { 
          Name = "TestUser1Holding1", 
          Type = HoldingType.Debt, 
          UserId = _user1Id, 
          HoldingCategoryId = DefaultCategory.Id
        });
    _context.Holdings.Add(
        new Holding 
        { 
          Name = "TestUser2Holding1", 
          Type = HoldingType.Debt, 
          UserId = _user2Id, 
          HoldingCategoryId = TestUser2Category.Id
        });
    _context.Holdings.Add(
        new Holding 
        { 
          Name = "TestUser1Holding2", 
          Type = HoldingType.Asset, 
          UserId = _user1Id,
          HoldingCategoryId = TestUser1Category.Id
        });
    _context.Holdings.Add(
        new Holding 
        { 
          Name = "TestUser2Holding2",
          Type = HoldingType.Asset, 
          UserId = _user2Id,
          HoldingCategoryId = TestUser2Category.Id
        });

    _context.SaveChanges();

    TestUser1Holding1 = _context.Holdings.First(c => c.Name == "TestUser1Holding1");
    TestUser2Holding1 = _context.Holdings.First(c => c.Name == "TestUser2Holding1");
    TestUser1Holding2 = _context.Holdings.First(c => c.Name == "TestUser1Holding2");
    TestUser2Holding2 = _context.Holdings.First(c => c.Name == "TestUser2Holding2");
  }

  public HoldingSnapshot  TestHoldingSnapshotHolding1User1A => new()
  {
    HoldingId = TestUser1Holding1.Id,
    Balance = 12345,
    Date = new DateOnly(2025, 5, 3),
    UserId = _user1Id
  };
  public HoldingSnapshot TestHoldingSnapshotHolding1User1B => new()
  {
    HoldingId = TestUser1Holding1.Id,
    Balance = 14345,
    Date = new DateOnly(2025, 4, 3),
    UserId = _user1Id
  };
  public HoldingSnapshot TestHoldingSnapshotHolding2User1 => new()
  {
    HoldingId = TestUser1Holding2.Id,
    Balance = 14345,
    Date = new DateOnly(2025, 3, 3),
    UserId = _user1Id
  };
  public HoldingSnapshot TestHoldingSnapshotHolding1User2A => new()
  {
    HoldingId = TestUser2Holding1.Id,
    Balance = 1654,
    Date = new DateOnly(2025, 11, 3),
    UserId = _user2Id
  };
  public HoldingSnapshot TestHoldingSnapshotHolding1User2B => new()
  {
    HoldingId = TestUser2Holding1.Id,
    Balance = 9843,
    Date = new DateOnly(2025, 1, 3),
    UserId = _user2Id
  };
  public HoldingSnapshot TestHoldingSnapshotHolding2User2 => new()
  {
    HoldingId = TestUser2Holding2.Id,
    Balance = 873483,
    Date = new DateOnly(2025, 2, 3),
    UserId = _user2Id
  };
}