public class ExpensesControllerTestObjects
{
  private readonly string _user1Id = "auth0|user1";
  private readonly string _user2Id = "auth0|user2";
  public ExpenseCategory DefaultCategory { get; }
  public ExpenseCategory TestUser1Category { get; }
  public ExpenseCategory TestUser2Category { get; }

  public ExpensesControllerTestObjects(ApplicationDbContext _context)
  {
    _context.ExpenseCategories.Add(
        new ExpenseCategory { Name = "Test_Default", UserId = null });
    _context.ExpenseCategories.Add(
        new ExpenseCategory { Name = "Test_Category_2", UserId = _user2Id });
    _context.ExpenseCategories.Add(
        new ExpenseCategory { Name = "Test_Category_1", UserId = _user1Id });

    _context.SaveChanges();

    DefaultCategory = _context.ExpenseCategories.First(c => c.Name == "Test_Default");
    TestUser2Category = _context.ExpenseCategories.First(c => c.Name == "Test_Category_2");
    TestUser1Category = _context.ExpenseCategories.First(c => c.Name == "Test_Category_1");
  }

  public Expense TestExpense1 => new()
  {
    Amount = 23.16m,
    ExpenseCategoryId = DefaultCategory.Id,
    ExpenseCategory = DefaultCategory,
    Date = DateOnly.Parse("2023-04-12"),
    Description = "Test description 1",
    IsRecurring = false,
    UserId = _user1Id
  };

  public Expense TestExpense2 => new()
  {
    Amount = 12312.32m,
    ExpenseCategoryId = TestUser2Category.Id,
    ExpenseCategory = TestUser2Category,
    Date = DateOnly.Parse("2023-02-01"),
    Description = "Test description 2",
    IsRecurring = false,
    UserId = _user2Id
  };

  public Expense TestExpense3 => new()
  {
    Amount = 87m,
    ExpenseCategoryId = TestUser1Category.Id,
    ExpenseCategory = TestUser1Category,
    Date = DateOnly.Parse("2023-05-15"),
    Description = "Test description 3",
    IsRecurring = false,
    UserId = _user1Id
  };

  public Expense TestExpense4 => new()
  {
    Amount = 654.89m,
    ExpenseCategoryId = TestUser2Category.Id,
    ExpenseCategory = TestUser2Category,
    Date = DateOnly.Parse("2023-05-15"),
    Description = "Test description 4",
    IsRecurring = false,
    UserId = _user2Id
  };
}