public class HoldingCategory : BaseEntity
{
    public required string Name { get; set; }
    public string? UserId { get; set; }
    public bool IsDefault => UserId == null;
}