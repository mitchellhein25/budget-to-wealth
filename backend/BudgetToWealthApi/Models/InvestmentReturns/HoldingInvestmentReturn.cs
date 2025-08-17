public class HoldingInvestmentReturn : BaseEntity
{
    public required Guid StartHoldingSnapshotId { get; set; }
    public HoldingSnapshot? StartHoldingSnapshot { get; set; }
    public required Guid EndHoldingSnapshotId { get; set; }
    public HoldingSnapshot? EndHoldingSnapshot { get; set; }
    public required long TotalContributions { get; set; }
    public required long TotalWithdrawals { get; set; }

    public string? UserId { get; set; }

    public decimal? ReturnPercentage
    {
        get
        {
            if (StartHoldingSnapshot == null || EndHoldingSnapshot == null || StartHoldingSnapshot.Balance == 0)
                return null;
            
            return (EndHoldingSnapshot.Balance - TotalContributions - StartHoldingSnapshot.Balance + TotalWithdrawals) / StartHoldingSnapshot.Balance;
        }
    }
}