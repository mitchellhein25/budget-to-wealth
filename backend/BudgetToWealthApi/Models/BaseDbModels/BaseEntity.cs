
public abstract class BaseEntity : IDbEntity
{
  public DateTime CreatedAt { get; set; }
  public DateTime UpdatedAt { get; set; }
}