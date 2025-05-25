public class BudgetsControllerTestObjects
{
  private readonly string _user1Id = "auth0|user1";
  private readonly string _user2Id = "auth0|user2";
  public CashFlowCategory DefaultCategoryExpense { get; }
  public CashFlowCategory TestUser1CategoryExpense { get; }
  public CashFlowCategory TestUser2CategoryExpense { get; }
  public CashFlowCategory DefaultCategoryIncome { get; }
  public CashFlowCategory TestUser1CategoryIncome { get; }
  public CashFlowCategory TestUser2CategoryIncome { get; }

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

    _context.SaveChanges();

    DefaultCategoryExpense = _context.CashFlowCategories.First(c => c.Name == "Test_Default" && c.CategoryType == CashFlowType.Expense);
    TestUser2CategoryExpense = _context.CashFlowCategories.First(c => c.Name == "Test_Category_2" && c.CategoryType == CashFlowType.Expense);
    TestUser1CategoryExpense = _context.CashFlowCategories.First(c => c.Name == "Test_Category_1" && c.CategoryType == CashFlowType.Expense);
  }

  public Budget TestBudget1 => new()
  {
    Amount = 2316,
    CategoryId = DefaultCategoryExpense.Id,
    Category = DefaultCategoryExpense,
    StartDate = new DateOnly(2025, 1, 2),
    EndDate = null,
    UserId = _user1Id
  };

  public Budget TestBudget2 => new()
  {
    Amount = 8700,
    CategoryId = TestUser1CategoryExpense.Id,
    Category = TestUser1CategoryExpense,
    StartDate = new DateOnly(2024, 12, 2),
    EndDate = new DateOnly(2025, 12, 22),
    UserId = _user1Id
  };

  public Budget TestBudget3 => new()
  {
    Amount = 8700,
    CategoryId = DefaultCategoryExpense.Id,
    Category = DefaultCategoryExpense,
    StartDate = new DateOnly(2024, 12, 2),
    EndDate = new DateOnly(2025, 1, 2),
    UserId = _user1Id
  };

  public Budget TestBudget4 => new()
  {
    Amount = 1231232,
    CategoryId = TestUser2CategoryExpense.Id,
    Category = TestUser2CategoryExpense,
    StartDate = new DateOnly(2025, 3, 12),
    EndDate = null,
    UserId = _user2Id
  };

  public Budget TestBudget5 => new()
  {
    Amount = 65489,
    CategoryId = TestUser2CategoryExpense.Id,
    Category = TestUser2CategoryExpense,
    StartDate = new DateOnly(2024, 1, 2),
    EndDate = new DateOnly(2025, 1, 2),
    UserId = _user2Id
  };

  public Budget TestBudget6 => new()
  {
    Amount = 65489,
    CategoryId = TestUser2CategoryExpense.Id,
    Category = TestUser2CategoryExpense,
    StartDate = new DateOnly(2023, 10, 5),
    EndDate = new DateOnly(2024, 1, 2),
    UserId = _user2Id
  };
}