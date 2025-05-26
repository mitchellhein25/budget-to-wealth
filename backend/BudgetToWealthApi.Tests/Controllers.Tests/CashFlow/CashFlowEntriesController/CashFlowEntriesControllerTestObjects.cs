public class CashFlowEntryControllerTestObjects
{
  private readonly string _user1Id = "auth0|user1";
  private readonly string _user2Id = "auth0|user2";
  public CashFlowCategory DefaultCategoryExpense { get; }
  public CashFlowCategory TestUser1CategoryExpense { get; }
  public CashFlowCategory TestUser2CategoryExpense { get; }
  public CashFlowCategory DefaultCategoryIncome { get; }
  public CashFlowCategory TestUser1CategoryIncome { get; }
  public CashFlowCategory TestUser2CategoryIncome { get; }

  public CashFlowEntryControllerTestObjects(ApplicationDbContext _context)
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
          Name = "Test_Default",
          UserId = null,
          CategoryType = CashFlowType.Income
        });
    _context.CashFlowCategories.Add(
        new CashFlowCategory
        {
          Name = "Test_Category_2",
          UserId = _user2Id,
          CategoryType = CashFlowType.Income
        });
    _context.CashFlowCategories.Add(
        new CashFlowCategory
        {
          Name = "Test_Category_1",
          UserId = _user1Id,
          CategoryType = CashFlowType.Income
        });

    _context.SaveChanges();

    DefaultCategoryExpense = _context.CashFlowCategories.First(c => c.Name == "Test_Default" && c.CategoryType == CashFlowType.Expense);
    TestUser2CategoryExpense = _context.CashFlowCategories.First(c => c.Name == "Test_Category_2" && c.CategoryType == CashFlowType.Expense);
    TestUser1CategoryExpense = _context.CashFlowCategories.First(c => c.Name == "Test_Category_1" && c.CategoryType == CashFlowType.Expense);
    DefaultCategoryIncome = _context.CashFlowCategories.First(c => c.Name == "Test_Default" && c.CategoryType == CashFlowType.Income);
    TestUser2CategoryIncome = _context.CashFlowCategories.First(c => c.Name == "Test_Category_2" && c.CategoryType == CashFlowType.Income);
    TestUser1CategoryIncome = _context.CashFlowCategories.First(c => c.Name == "Test_Category_1" && c.CategoryType == CashFlowType.Income);
  }

  public CashFlowEntry TestCashFlowEntry1 => new()
  {
    Amount = 2316,
    EntryType = CashFlowType.Expense,
    CategoryId = DefaultCategoryExpense.Id,
    Category = DefaultCategoryExpense,
    Date = DateOnly.Parse("2023-04-12"),
    Description = "Test description 1",
    IsRecurring = false,
    UserId = _user1Id
  };

  public CashFlowEntry TestCashFlowEntry2 => new()
  {
    Amount = 1231232,
    EntryType = CashFlowType.Expense,
    CategoryId = TestUser2CategoryExpense.Id,
    Category = TestUser2CategoryExpense,
    Date = DateOnly.Parse("2023-02-01"),
    Description = "Test description 2",
    IsRecurring = false,
    UserId = _user2Id
  };

  public CashFlowEntry TestCashFlowEntry3 => new()
  {
    Amount = 8700,
    EntryType = CashFlowType.Expense,
    CategoryId = TestUser1CategoryExpense.Id,
    Category = TestUser1CategoryExpense,
    Date = DateOnly.Parse("2023-05-15"),
    Description = "Test description 3",
    IsRecurring = false,
    UserId = _user1Id
  };

  public CashFlowEntry TestCashFlowEntry4 => new()
  {
    Amount = 65489,
    EntryType = CashFlowType.Expense,
    CategoryId = TestUser2CategoryExpense.Id,
    Category = TestUser2CategoryExpense,
    Date = DateOnly.Parse("2023-05-15"),
    Description = "Test description 4",
    IsRecurring = false,
    UserId = _user2Id
  };
  public CashFlowEntry TestCashFlowEntry5 => new()
  {
    Amount = 2316,
    EntryType = CashFlowType.Income,
    CategoryId = DefaultCategoryIncome.Id,
    Category = DefaultCategoryIncome,
    Date = DateOnly.Parse("2023-04-12"),
    Description = "Test description 1",
    IsRecurring = false,
    UserId = _user1Id
  };

  public CashFlowEntry TestCashFlowEntry6 => new()
  {
    Amount = 1231232,
    EntryType = CashFlowType.Income,
    CategoryId = TestUser2CategoryIncome.Id,
    Category = TestUser2CategoryIncome,
    Date = DateOnly.Parse("2023-02-01"),
    Description = "Test description 2",
    IsRecurring = false,
    UserId = _user2Id
  };

  public CashFlowEntry TestCashFlowEntry7 => new()
  {
    Amount = 8700,
    EntryType = CashFlowType.Income,
    CategoryId = TestUser1CategoryIncome.Id,
    Category = TestUser1CategoryIncome,
    Date = DateOnly.Parse("2023-05-15"),
    Description = "Test description 3",
    IsRecurring = false,
    UserId = _user1Id
  };

  public CashFlowEntry TestCashFlowEntry8 => new()
  {
    Amount = 65489,
    EntryType = CashFlowType.Income,
    CategoryId = TestUser2CategoryIncome.Id,
    Category = TestUser2CategoryIncome,
    Date = DateOnly.Parse("2023-05-15"),
    Description = "Test description 4",
    IsRecurring = false,
    UserId = _user2Id
  };
}