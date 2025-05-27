public class CashFlowEntry : BaseEntity
{
    public required long Amount { get; set; }
    public required CashFlowType EntryType { get; set; }
    public required Guid CategoryId { get; set; }
    public CashFlowCategory Category { get; set; }
    public required DateOnly Date { get; set; }
    public string? Description { get; set; }
    public string UserId { get; set; }
    public RecurrenceFrequency? RecurrenceFrequency { get; set; }
    public DateOnly? RecurrenceEndDate { get; set; }

    public bool IsSameRecurrence(CashFlowEntry other)
    {
        if (other == null) 
            return false;
        
        return Amount == other.Amount &&
               EntryType == other.EntryType &&
               CategoryId == other.CategoryId &&
               string.Equals(Description, other.Description, StringComparison.OrdinalIgnoreCase) &&
               UserId == other.UserId;
    }
}