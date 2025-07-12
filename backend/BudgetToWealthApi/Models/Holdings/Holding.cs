public class Holding : BaseEntity
{
    public required string Name { get; set; }
    public required HoldingType Type { get; set; }
    public required Guid HoldingCategoryId { get; set; }
    public HoldingCategory? HoldingCategory { get; set; }
    public string? Institution { get; set; }
    public string? UserId { get; set; }
}