public class Budget : BaseEntity
{
    public required long Amount { get; set; }
    public required Guid CategoryId { get; set; }
    public CashFlowCategory? Category { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string? UserId { get; set; }
}