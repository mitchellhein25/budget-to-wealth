using System.ComponentModel.DataAnnotations;

public interface IDbEntity
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}