public class ExpenseCategory
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public string? UserId { get; set; }

    public bool IsDefault => UserId == null;
}