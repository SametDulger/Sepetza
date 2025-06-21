namespace Sepetza.Core.Entities;

public class ProductImage : BaseEntity
{
    public string ImageUrl { get; set; } = string.Empty;
    public string AltText { get; set; } = string.Empty;
    public bool IsMain { get; set; } = false;
    public int DisplayOrder { get; set; }
    
    // Foreign Keys
    public int ProductId { get; set; }
    
    // Navigation Properties
    public virtual Product Product { get; set; } = null!;
} 