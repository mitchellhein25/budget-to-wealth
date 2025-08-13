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

    public bool IsManualInvestment => ManualInvestmentCategory != null;

    public DateOnly? GetStartDate()
    {
        if (IsManualInvestment)
            return ManualInvestmentStartDate;
        return StartSnapshot?.Date;
    }

    public DateOnly? GetEndDate()
    {
        if (IsManualInvestment)
            return ManualInvestmentEndDate;
        return EndSnapshot?.Date;
    }

    public decimal? GetReturnPercentage()
    {
        if (IsManualInvestment)
            return ManualInvestmentPercentageReturn;

        if (StartSnapshot ==  null || EndSnapshot == null || StartSnapshot.Balance == 0)
            return null;
        
        return (decimal)(EndSnapshot.Balance - TotalContributions - StartSnapshot.Balance + TotalWithdrawals) / StartSnapshot.Balance;
    }
}