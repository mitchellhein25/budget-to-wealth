public class ManualInvestmentReturn : BaseEntity
{
    public required Guid ManualInvestmentCategoryId { get; set; }
    public ManualInvestmentCategory? ManualInvestmentCategory { get; set; }
    public required DateOnly StartDate { get; set; }
    public required DateOnly EndDate { get; set; }
    public required decimal ManualInvestmentPercentageReturn { get; set; }
    public RecurrenceFrequency? ManualInvestmentRecurrenceFrequency { get; set; }
    public DateOnly? ManualInvestmentRecurrenceEndDate { get; set; }
    public string? UserId { get; set; }
}
