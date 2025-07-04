public class BudgetImport
{
    public required long AmountInCents { get; set; }
    public required string CategoryName { get; set; }
    public required CashFlowType CategoryType { get; set; }
    public required DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
} 