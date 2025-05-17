public class User : BaseEntity
{
    public int Id { get; set; }
    public required string Auth0UserId { get; set; }
}