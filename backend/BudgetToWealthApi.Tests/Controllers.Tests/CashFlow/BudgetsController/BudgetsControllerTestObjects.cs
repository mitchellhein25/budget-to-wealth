public class BudgetsControllerTestObjects
{
  private readonly string _user1Id = "auth0|user1";
  private readonly string _user2Id = "auth0|user2";
  public CashFlowCategory DefaultCategoryExpense { get; }
  public CashFlowCategory TestUser1CategoryExpense { get; }
  public CashFlowCategory TestUser2CategoryExpense { get; }
  public CashFlowCategory TestUser1Category2Expense { get; }
  public CashFlowCategory TestUser1CategoryIncome { get; }
  public CashFlowCategory TestUser1Category3Expense{ get; }

  public BudgetsControllerTestObjects(ApplicationDbContext _context)
  {
    _context.CashFlowCategories.Add(
        new CashFlowCategory
        {
          Name = "Test_Default",
          UserId = null,
          CategoryType = CashFlowType.Expense
        });
    _context.CashFlowCategories.Add(
        new CashFlowCategory
        {
          Name = "Test_Category_2",
          UserId = _user2Id,
          CategoryType = CashFlowType.Expense
        });
    _context.CashFlowCategories.Add(
        new CashFlowCategory
        {
          Name = "Test_Category_1",
          UserId = _user1Id,
          CategoryType = CashFlowType.Expense
          });
      _context.CashFlowCategories.Add(
          new CashFlowCategory
          {
            Name = "Test_Category_User1_2",
            UserId = _user1Id,
            CategoryType = CashFlowType.Expense
          });
    _context.CashFlowCategories.Add(
        new CashFlowCategory
        {
          Name = "Test_Category_Income",
          UserId = _user1Id,
          CategoryType = CashFlowType.Income
        });
    _context.CashFlowCategories.Add(
        new CashFlowCategory
        {
          Name = "Test_Category_User1_3",
          UserId = _user1Id,
          CategoryType = CashFlowType.Expense
        });

    _context.SaveChanges();

    DefaultCategoryExpense = _context.CashFlowCategories.First(c => c.Name == "Test_Default" && c.CategoryType == CashFlowType.Expense);
    TestUser2CategoryExpense = _context.CashFlowCategories.First(c => c.Name == "Test_Category_2" && c.CategoryType == CashFlowType.Expense);
    TestUser1CategoryExpense = _context.CashFlowCategories.First(c => c.Name == "Test_Category_1" && c.CategoryType == CashFlowType.Expense);
    TestUser1Category2Expense = _context.CashFlowCategories.First(c => c.Name == "Test_Category_User1_2" && c.CategoryType == CashFlowType.Expense);
    TestUser1CategoryIncome = _context.CashFlowCategories.First(c => c.Name == "Test_Category_Income" && c.CategoryType == CashFlowType.Income);
    TestUser1Category3Expense = _context.CashFlowCategories.First(c => c.Name == "Test_Category_User1_3" && c.CategoryType == CashFlowType.Expense);
  }

  public Budget TestBudget1 => new()
  {
    Amount = 1000,
    CategoryId = DefaultCategoryExpense.Id,
    Category = DefaultCategoryExpense,
    StartDate = new DateOnly(2024, 10, 1),
    EndDate = new DateOnly(2024, 10, 31),
    UserId = _user1Id
  };

  public Budget TestBudget2 => new()
  {
    Amount = 2000,
    CategoryId = DefaultCategoryExpense.Id,
    Category = DefaultCategoryExpense,
    StartDate = new DateOnly(2024, 11, 1),
    EndDate = new DateOnly(2024, 11, 30),
    UserId = _user1Id
  };

  public Budget TestBudget3 => new()
  {
    Amount = 3000,
    CategoryId = DefaultCategoryExpense.Id,
    Category = DefaultCategoryExpense,
    StartDate = new DateOnly(2024, 12, 1),
    EndDate = null,
    UserId = _user1Id
  };

  public Budget TestBudget4 => new()
  {
    Amount = 4000,
    CategoryId = TestUser1CategoryExpense.Id,
    Category = TestUser1CategoryExpense,
    StartDate = new DateOnly(2025, 1, 1),
    EndDate = new DateOnly(2025, 1, 31),
    UserId = _user1Id
  };

  public Budget TestBudget5 => new()
  {
    Amount = 5000,
    CategoryId = TestUser1CategoryExpense.Id,
    Category = TestUser1CategoryExpense,
    StartDate = new DateOnly(2025, 2, 1),
    EndDate = new DateOnly(2025, 2, 28),
    UserId = _user1Id
  };

  public Budget TestBudget6 => new()
  {
    Amount = 6000,
    CategoryId = TestUser1CategoryExpense.Id,
    Category = TestUser1CategoryExpense,
    StartDate = new DateOnly(2025, 3, 1),
    EndDate = null,
    UserId = _user1Id
  };

  public Budget TestBudget7 => new()
  {
    Amount = 7000,
    CategoryId = TestUser1Category2Expense.Id,
    Category = TestUser1Category2Expense,
    StartDate = new DateOnly(2025, 4, 1),
    EndDate = new DateOnly(2025, 4, 30),
    UserId = _user1Id
  };

  public Budget TestBudget8 => new()
  {
    Amount = 8000,
    CategoryId = TestUser2CategoryExpense.Id,
    Category = TestUser2CategoryExpense,
    StartDate = new DateOnly(2025, 5, 1),
    EndDate = null,
    UserId = _user2Id
  };
}