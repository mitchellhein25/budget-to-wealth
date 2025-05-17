
using System.ComponentModel.DataAnnotations;

public abstract class BaseEntity : IDbEntity
{
  [Key]
  public Guid Id { get; set; }
  public DateTime CreatedAt { get; set; }
  public DateTime UpdatedAt { get; set; }
}