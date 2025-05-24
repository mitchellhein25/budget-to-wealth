public class HoldingsControllerTestObjects
{
  private readonly string _user1Id = "auth0|user1";
  private readonly string _user2Id = "auth0|user2";
  public HoldingCategory DefaultCategory { get; }
  public HoldingCategory TestUser1Category { get; }
  public HoldingCategory TestUser2Category { get; }

  public HoldingsControllerTestObjects(ApplicationDbContext _context)
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
  }

  public Holding TestHoldingAssetDefaultUser1 => new()
  {
    HoldingCategory = DefaultCategory,
    HoldingCategoryId = DefaultCategory.Id,
    Name = "Test Holding 1",
    Type = HoldingType.Asset,
    UserId = _user1Id
  };

  public Holding TestHoldingAssetCat2User2 => new()
  {
    HoldingCategory = TestUser2Category,
    HoldingCategoryId = TestUser2Category.Id,
    Name = "Test Holding 2",
    Type = HoldingType.Asset,
    UserId = _user2Id
  };

  public Holding TestHoldingAssetCat1User1 => new()
  {
    HoldingCategory = TestUser1Category,
    HoldingCategoryId = TestUser1Category.Id,
    Name = "Test Holding 3",
    Type = HoldingType.Asset,
    UserId = _user1Id
  };

  public Holding TestHoldingAsset2Cat2User2 => new()
  {
    HoldingCategory = TestUser2Category,
    HoldingCategoryId = TestUser2Category.Id,
    Name = "Test Holding 4",
    Type = HoldingType.Asset,
    UserId = _user2Id
  };
  public Holding TestHoldingDebtDefCatUser1 => new()
  {
    HoldingCategory = DefaultCategory,
    HoldingCategoryId = DefaultCategory.Id,
    Name = "Test Holding 5",
    Type = HoldingType.Debt,
    UserId = _user1Id
  };

  public Holding TestHoldingDebtCat2User2 => new()
  {
    HoldingCategory = TestUser2Category,
    HoldingCategoryId = TestUser2Category.Id,
    Name = "Test Holding 6",
    Type = HoldingType.Debt,
    UserId = _user2Id
  };

  public Holding TestHoldingDebtCat1User1 => new()
  {
    HoldingCategory = TestUser1Category,
    HoldingCategoryId = TestUser1Category.Id,
    Name = "Test Holding 7",
    Type = HoldingType.Debt,
    UserId = _user1Id
  };

  public Holding TestHoldingDebt2Cat2User2 => new()
  {
    HoldingCategory = TestUser2Category,
    HoldingCategoryId = TestUser2Category.Id,
    Name = "Test Holding 8",
    Type = HoldingType.Debt,
    UserId = _user2Id
  };
}