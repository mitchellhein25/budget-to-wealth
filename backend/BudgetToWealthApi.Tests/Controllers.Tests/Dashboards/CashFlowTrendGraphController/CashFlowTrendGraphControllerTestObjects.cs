public class CashFlowTrendGraphControllerTestObjects
{
  private readonly string _user1Id = "auth0|user1";
  private readonly string _user2Id = "auth0|user2";
  public CashFlowCategory TestUser1IncomeCategory1 { get; }
  public CashFlowCategory TestUser1IncomeCategory2 { get; }
  public CashFlowCategory TestUser1IncomeCategory3 { get; }
  public CashFlowCategory TestUser1ExpenseCategory1 { get; }
  public CashFlowCategory TestUser1ExpenseCategory2 { get; }
  public CashFlowCategory TestUser1ExpenseCategory3 { get; }
  public CashFlowCategory TestUser2ExpenseCategory { get; }
  public CashFlowCategory TestUser2IncomeCategory { get; }

  public CashFlowTrendGraphControllerTestObjects(ApplicationDbContext _context)
  {
    _context.CashFlowCategories.Add(
        new CashFlowCategory
        {
          Name = "TestUser1IncomeCategory1",
          CategoryType = CashFlowType.Income,
          UserId = _user1Id
        });
    _context.CashFlowCategories.Add(
        new CashFlowCategory
        {
          Name = "TestUser1IncomeCategory2",
          CategoryType = CashFlowType.Income,
          UserId = _user1Id,
        });
    _context.CashFlowCategories.Add(
        new CashFlowCategory
        {
          Name = "TestUser1IncomeCategory3",
          CategoryType = CashFlowType.Income,
          UserId = _user1Id,
        });
    _context.CashFlowCategories.Add(
        new CashFlowCategory
        {
          Name = "TestUser1ExpenseCategory1",
          CategoryType = CashFlowType.Expense,
          UserId = _user1Id,
        });
    _context.CashFlowCategories.Add(
        new CashFlowCategory
        {
          Name = "TestUser1ExpenseCategory2",
          CategoryType = CashFlowType.Expense,
          UserId = _user1Id,
        });
    _context.CashFlowCategories.Add(
        new CashFlowCategory
        {
          Name = "TestUser1ExpenseCategory3",
          CategoryType = CashFlowType.Expense,
          UserId = _user1Id,
        });
    _context.CashFlowCategories.Add(
        new CashFlowCategory
        {
          Name = "TestUser2ExpenseCategory",
          CategoryType = CashFlowType.Expense,
          UserId = _user1Id,
        });
    _context.CashFlowCategories.Add(
        new CashFlowCategory
        {
          Name = "TestUser2IncomeCategory",
          CategoryType = CashFlowType.Income,
          UserId = _user1Id,
        });

    _context.SaveChanges();

    TestUser1IncomeCategory1 = _context.CashFlowCategories.First(c => c.Name == "TestUser1IncomeCategory1");
    TestUser1IncomeCategory2 = _context.CashFlowCategories.First(c => c.Name == "TestUser1IncomeCategory2");
    TestUser1IncomeCategory3 = _context.CashFlowCategories.First(c => c.Name == "TestUser1IncomeCategory3");
    TestUser1ExpenseCategory1 = _context.CashFlowCategories.First(c => c.Name == "TestUser1ExpenseCategory1");
    TestUser1ExpenseCategory2 = _context.CashFlowCategories.First(c => c.Name == "TestUser1ExpenseCategory2");
    TestUser1ExpenseCategory3 = _context.CashFlowCategories.First(c => c.Name == "TestUser1ExpenseCategory3");
    TestUser2ExpenseCategory = _context.CashFlowCategories.First(c => c.Name == "TestUser2ExpenseCategory");
    TestUser2IncomeCategory = _context.CashFlowCategories.First(c => c.Name == "TestUser2IncomeCategory");
  }

  private CashFlowEntry CreateCashFlowEntry(Guid cashFlowCategoryId, long amount, DateOnly date, string userId)
  {
    return new CashFlowEntry
    {
      CategoryId = cashFlowCategoryId,
      Amount = amount,
      EntryType = CashFlowType.Income,
      Date = date,
      UserId = userId
    };
  }

  // User 1 Income sorted by date
  public CashFlowEntry TestCashFlowEntryIncomeCategory1User1_2025_01_01 => 
    CreateCashFlowEntry(TestUser1IncomeCategory1.Id, 5000, new DateOnly(2025, 1, 1), _user1Id);
  public CashFlowEntry TestCashFlowEntryIncomeCategory1User1_2025_01_05 => 
    CreateCashFlowEntry(TestUser1IncomeCategory1.Id, 10000, new DateOnly(2025, 1, 5), _user1Id);
  public CashFlowEntry TestCashFlowEntryIncomeCategory1User1_2025_01_10 => 
    CreateCashFlowEntry(TestUser1IncomeCategory1.Id, 75000, new DateOnly(2025, 1, 10), _user1Id);
  public long TestUser1IncomeTotal2025_01 => 5000 + 10000 + 75000;
  public long TestUser1IncomeTotal2025_02 => 0;
  public CashFlowEntry TestCashFlowEntryIncomeCategory1User1_2025_03_12 => 
    CreateCashFlowEntry(TestUser1IncomeCategory1.Id, 12000, new DateOnly(2025, 3, 12), _user1Id);
  public CashFlowEntry TestCashFlowEntryIncomeCategory1User1_2025_03_30 => 
    CreateCashFlowEntry(TestUser1IncomeCategory1.Id, 250000, new DateOnly(2025, 3, 30), _user1Id);
  public long TestUser1IncomeTotal2025_03 => 12000 + 250000;
  public CashFlowEntry TestCashFlowEntryIncomeCategory1User1_2025_04_01 => 
    CreateCashFlowEntry(TestUser1IncomeCategory1.Id, 10000, new DateOnly(2025, 4, 1), _user1Id);
  public CashFlowEntry TestCashFlowEntryIncomeCategory1User1_2025_04_05 => 
    CreateCashFlowEntry(TestUser1IncomeCategory1.Id, 20000, new DateOnly(2025, 4, 5), _user1Id);
  public CashFlowEntry TestCashFlowEntryIncomeCategory1User1_2025_04_10 => 
    CreateCashFlowEntry(TestUser1IncomeCategory1.Id, 15000, new DateOnly(2025, 4, 10), _user1Id);
  public long TestUser1IncomeTotal2025_04 => 10000 + 20000 + 15000;

   // User 1 Expenses sorted by date
  public CashFlowEntry TestCashFlowEntryExpenseCategory1User1_2025_01_01 => 
    CreateCashFlowEntry(TestUser1ExpenseCategory1.Id, 2000, new DateOnly(2025, 1, 1), _user1Id);
  public CashFlowEntry TestCashFlowEntryExpenseCategory1User1_2025_01_05 => 
    CreateCashFlowEntry(TestUser1ExpenseCategory1.Id, 12000, new DateOnly(2025, 1, 5), _user1Id);
  public CashFlowEntry TestCashFlowEntryExpenseCategory1User1_2025_01_10 => 
    CreateCashFlowEntry(TestUser1ExpenseCategory1.Id, 90000, new DateOnly(2025, 1, 10), _user1Id);
  public long TestUser1ExpenseTotal2025_01 => 2000 + 12000 + 90000;
  public long TestUser1ExpenseTotal2025_02 => 0;
  public CashFlowEntry TestCashFlowEntryExpenseCategory1User1_2025_03_12 => 
    CreateCashFlowEntry(TestUser1ExpenseCategory1.Id, 22000, new DateOnly(2025, 3, 12), _user1Id);
  public CashFlowEntry TestCashFlowEntryExpenseCategory1User1_2025_03_30 => 
    CreateCashFlowEntry(TestUser1ExpenseCategory1.Id, 220000, new DateOnly(2025, 3, 30), _user1Id);
  public long TestUser1ExpenseTotal2025_03 => 22000 + 220000;
  public CashFlowEntry TestCashFlowEntryExpenseCategory1User1_2025_04_01 => 
    CreateCashFlowEntry(TestUser1ExpenseCategory1.Id, 11000, new DateOnly(2025, 4, 1), _user1Id);
  public CashFlowEntry TestCashFlowEntryExpenseCategory1User1_2025_04_05 => 
    CreateCashFlowEntry(TestUser1ExpenseCategory1.Id, 5000, new DateOnly(2025, 4, 5), _user1Id);
  public CashFlowEntry TestCashFlowEntryExpenseCategory1User1_2025_04_10 => 
    CreateCashFlowEntry(TestUser1ExpenseCategory1.Id, 15000, new DateOnly(2025, 4, 10), _user1Id);
  public long TestUser1ExpenseTotal2025_04 => 11000 + 5000 + 15000;

  // User 2 Entries
  public CashFlowEntry TestCashFlowEntryExpenseCategory2User2_2025_01_01 => 
    CreateCashFlowEntry(TestUser2ExpenseCategory.Id, 2000, new DateOnly(2025, 1, 1), _user2Id);
  public CashFlowEntry TestCashFlowEntryIncomeCategory2User2_2025_01_10 => 
    CreateCashFlowEntry(TestUser2IncomeCategory.Id, 90000, new DateOnly(2025, 1, 10), _user2Id);
}