public class User
{
    public int Id { get; set; }
    public required string Auth0UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}