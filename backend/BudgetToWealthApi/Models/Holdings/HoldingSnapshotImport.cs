public class HoldingSnapshotImport
{
    public required string HoldingName { get; set; }
    public required DateOnly Date { get; set; }
    public required long BalanceInCents { get; set; }
    public required string HoldingCategoryName { get; set; }
    public required HoldingType HoldingType { get; set; }
} 