namespace Sepetza.Core.Entities;

// Category entity for product categorization
public class Category : BaseEntity
{
    // Category name
    public string Name { get; set; } = string.Empty;
    // Category description
    public string Description { get; set; } = string.Empty;
    // Category image URL
    public string ImageUrl { get; set; } = string.Empty;
    // Category active status
    public bool IsActive { get; set; } = true;
    // Display order for sorting
    public int DisplayOrder { get; set; }
    
    // Alt kategori özellikleri
    public int? ParentCategoryId { get; set; }
    public virtual Category? ParentCategory { get; set; }
    public virtual ICollection<Category> SubCategories { get; set; } = new List<Category>();
    
    // Navigation Properties
    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
} 