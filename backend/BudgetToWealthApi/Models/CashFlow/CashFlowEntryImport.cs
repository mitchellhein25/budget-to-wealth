public class CashFlowEntryImport
{
    public required long AmountInCents { get; set; }
    public required DateOnly Date { get; set; }
    public required string CategoryName { get; set; }
    public required CashFlowType CategoryType { get; set; }
    public string? Description { get; set; }
    public RecurrenceFrequency? RecurrenceFrequency { get; set; }
} 