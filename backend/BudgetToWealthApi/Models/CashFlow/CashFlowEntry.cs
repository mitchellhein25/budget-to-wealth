public class CashFlowEntry : BaseEntity
{
    public required long Amount { get; set; }
    public required CashFlowType EntryType { get; set; }
    public required Guid CategoryId { get; set; }
    public CashFlowCategory Category { get; set; }
    public required DateOnly Date { get; set; }
    public string? Description { get; set; }
    public string UserId { get; set; }
    public bool IsRecurring { get; set; }
}