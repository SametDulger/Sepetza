namespace Sepetza.Core.Entities;

// Product entity for e-commerce items
public class Product : BaseEntity
{
    // Product name
    public string Name { get; set; } = string.Empty;
    // Full product description
    public string Description { get; set; } = string.Empty;
    // Brief product description
    public string ShortDescription { get; set; } = string.Empty;
    // Product price
    public decimal Price { get; set; }
    // Discounted price (optional)
    public decimal? DiscountPrice { get; set; }
    // Stock keeping unit
    public string SKU { get; set; } = string.Empty;
    // Available stock quantity
    public int StockQuantity { get; set; }
    // Product active status
    public bool IsActive { get; set; } = true;
    // Featured product flag
    public bool IsFeatured { get; set; } = false;
    // Average rating
    public double Rating { get; set; } = 0;
    // Total review count
    public int ReviewCount { get; set; } = 0;
    // Product brand
    public string Brand { get; set; } = string.Empty;
    // Product weight
    public double Weight { get; set; }
    // Product dimensions
    public string Dimensions { get; set; } = string.Empty;
    
    // Foreign Keys
    public int CategoryId { get; set; }
    
    // Navigation Properties
    public virtual Category Category { get; set; } = null!;
    public virtual ICollection<ProductImage> ProductImages { get; set; } = new List<ProductImage>();
    public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
} 