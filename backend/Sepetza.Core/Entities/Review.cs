namespace Sepetza.Core.Entities;

public class Review : BaseEntity
{
    public int Rating { get; set; } // 1-5 arası
    public string Title { get; set; } = string.Empty;
    public string Comment { get; set; } = string.Empty;
    public bool IsApproved { get; set; } = false;
    
    // Foreign Keys
    public int UserId { get; set; }
    public int ProductId { get; set; }
    
    // Navigation Properties
    public virtual User User { get; set; } = null!;
    public virtual Product Product { get; set; } = null!;
} 