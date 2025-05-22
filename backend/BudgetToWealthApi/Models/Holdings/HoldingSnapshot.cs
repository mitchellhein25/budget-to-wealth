public class HoldingSnapshot : BaseEntity
{
    public required Guid HoldingId { get; set; }
    public Holding Holding { get; set; }
    public required DateOnly Date { get; set; }
    public required decimal Value { get; set; }
    public string UserId { get; set; }
}