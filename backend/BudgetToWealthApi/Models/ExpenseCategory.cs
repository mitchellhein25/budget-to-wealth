public class ExpenseCategory : BaseEntity
{
    public required string Name { get; set; } = null!;
    public string? UserId { get; set; }
    public bool IsDefault => UserId == null;
}