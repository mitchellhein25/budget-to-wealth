using System.ComponentModel.DataAnnotations;

public class Expense : BaseEntity
{
    public required decimal Amount { get; set; }
    public required Guid ExpenseCategoryId { get; set; }
    public required ExpenseCategory ExpenseCategory { get; set; }
    public required DateTime Date { get; set; }
    public string? Description { get; set; }
    public string UserId { get; set; }
    public bool IsRecurring { get; set; }
}