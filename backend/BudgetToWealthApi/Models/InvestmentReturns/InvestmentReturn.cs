public class InvestmentReturn : BaseEntity
{
    public Guid? StartSnapshotId { get; set; }
    public HoldingSnapshot? StartSnapshot { get; set; }
    public Guid? EndSnapshotId { get; set; }
    public HoldingSnapshot? EndSnapshot { get; set; }

    public Guid? ManualInvestmentCategoryId { get; set; }
    public ManualInvestmentCategory? ManualInvestmentCategory { get; set; }
    public DateOnly? ManualInvestmentStartDate { get; set; }
    public DateOnly? ManualInvestmentEndDate { get; set; }
    public decimal? ManualInvestmentPercentageReturn { get; set; }

    public required long TotalContributions { get; set; }
    public required long TotalWithdrawals { get; set; }
    public string? UserId { get; set; }

    public decimal? GetReturnPercentage()
    {
        if (StartSnapshot != null && EndSnapshot != null)
        {
            if (StartSnapshot.Balance == 0)
                return null;
            
            return (decimal)(EndSnapshot.Balance - TotalContributions - StartSnapshot.Balance + TotalWithdrawals) / StartSnapshot.Balance;
        }
        else if (ManualInvestmentCategory != null)
        {
            return ManualInvestmentPercentageReturn;
        }
        return null;
    }
}