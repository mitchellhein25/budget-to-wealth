public class ManualInvestmentReturn : BaseEntity
{
    public Guid? ManualInvestmentCategoryId { get; set; }
    public ManualInvestmentCategory? ManualInvestmentCategory { get; set; }
    public DateOnly? ManualInvestmentReturnDate { get; set; }
    public decimal? ManualInvestmentPercentageReturn { get; set; }
    public RecurrenceFrequency? ManualInvestmentRecurrenceFrequency { get; set; }
    public DateOnly? ManualInvestmentRecurrenceEndDate { get; set; }
    public string? UserId { get; set; }
}