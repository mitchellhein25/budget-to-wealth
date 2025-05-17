public class IncomeStream : BaseEntity
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public string? UserId { get; set; }
}