public class CashFlowCategory : BaseEntity
{
    public required string Name { get; set; }
    public required CashFlowType CategoryType { get; set; }
    public string? UserId { get; set; }
    public bool IsDefault => UserId == null;
}