public class InvestmentReturn : BaseEntity
{
    public Guid? StartHoldingSnapshotId { get; set; }
    public HoldingSnapshot? StartHoldingSnapshot { get; set; }
    public Guid? EndHoldingSnapshotId { get; set; }
    public HoldingSnapshot? EndHoldingSnapshot { get; set; }

    public Guid? ManualInvestmentCategoryId { get; set; }
    public ManualInvestmentCategory? ManualInvestmentCategory { get; set; }
    public DateOnly? ManualInvestmentStartDate { get; set; }
    public DateOnly? ManualInvestmentEndDate { get; set; }
    public decimal? ManualInvestmentPercentageReturn { get; set; }

    public required long TotalContributions { get; set; }
    public required long TotalWithdrawals { get; set; }
    
    public RecurrenceFrequency? RecurrenceFrequency { get; set; }
    public DateOnly? RecurrenceEndDate { get; set; }

    public string? UserId { get; set; }

    public bool IsManualInvestment => ManualInvestmentCategoryId != null;

    public DateOnly? GetStartDate()
    {
        if (IsManualInvestment)
            return ManualInvestmentStartDate;
        return StartHoldingSnapshot?.Date;
    }

    public DateOnly? GetEndDate()
    {
        if (IsManualInvestment)
            return ManualInvestmentEndDate;
        return EndHoldingSnapshot?.Date;
    }

    public decimal? GetReturnPercentage()
    {
        if (IsManualInvestment)
            return ManualInvestmentPercentageReturn;

        if (StartHoldingSnapshot ==  null || EndHoldingSnapshot == null || StartHoldingSnapshot.Balance == 0)
            return null;
        
        return (decimal)(EndHoldingSnapshot.Balance - TotalContributions - StartHoldingSnapshot.Balance + TotalWithdrawals) / StartHoldingSnapshot.Balance;
    }
}