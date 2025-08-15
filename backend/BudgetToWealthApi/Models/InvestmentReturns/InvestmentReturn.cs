public class InvestmentReturn : BaseEntity
{
    public Guid? StartHoldingSnapshotId { get; set; }
    public HoldingSnapshot? StartHoldingSnapshot { get; set; }
    public Guid? EndHoldingSnapshotId { get; set; }
    public HoldingSnapshot? EndHoldingSnapshot { get; set; }

    public Guid? ManualInvestmentCategoryId { get; set; }
    public ManualInvestmentCategory? ManualInvestmentCategory { get; set; }
    public DateOnly? ManualInvestmentReturnDate { get; set; }
    public decimal? ManualInvestmentPercentageReturn { get; set; }
    public RecurrenceFrequency? ManualInvestmentRecurrenceFrequency { get; set; }
    public DateOnly? ManualInvestmentRecurrenceEndDate { get; set; }

    public required long TotalContributions { get; set; }
    public required long TotalWithdrawals { get; set; }

    public string? UserId { get; set; }

    public bool IsManualInvestment => ManualInvestmentCategoryId != null;

    public decimal? GetReturnPercentage()
    {
        if (IsManualInvestment)
            return ManualInvestmentPercentageReturn;

        if (StartHoldingSnapshot ==  null || EndHoldingSnapshot == null || StartHoldingSnapshot.Balance == 0)
            return null;
        
        return (decimal)(EndHoldingSnapshot.Balance - TotalContributions - StartHoldingSnapshot.Balance + TotalWithdrawals) / StartHoldingSnapshot.Balance;
    }
}