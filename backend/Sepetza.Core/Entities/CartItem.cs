namespace Sepetza.Core.Entities;

public class CartItem : BaseEntity
{
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    
    // Foreign Keys
    public int UserId { get; set; }
    public int ProductId { get; set; }
    
    // Navigation Properties
    public virtual User User { get; set; } = null!;
    public virtual Product Product { get; set; } = null!;
} 