using System.ComponentModel.DataAnnotations;
using Sepetza.Core.Entities;

namespace Sepetza.Core.DTOs;

// Dashboard DTOs
public class AdminDashboardDto
{
    public int TotalUsers { get; set; }
    public int TotalProducts { get; set; }
    public int TotalCategories { get; set; }
    public int TotalOrders { get; set; }
    public decimal TotalRevenue { get; set; }
    public List<RecentOrderDto> RecentOrders { get; set; } = new();
    public List<TopProductDto> TopProducts { get; set; } = new();
}

public class RecentOrderDto
{
    public int Id { get; set; }
    public string UserName { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public OrderStatus Status { get; set; }
    public DateTime CreatedDate { get; set; }
}

public class TopProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int SalesCount { get; set; }
    public decimal Revenue { get; set; }
}

// Product Management DTOs
public class AdminProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public bool IsActive { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public List<ProductImageDto> Images { get; set; } = new();
}

public class CreateProductRequest
{
    [Required(ErrorMessage = "Ürün adı gereklidir")]
    [MaxLength(200, ErrorMessage = "Ürün adı en fazla 200 karakter olabilir")]
    public string Name { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Ürün açıklaması gereklidir")]
    [MaxLength(2000, ErrorMessage = "Açıklama en fazla 2000 karakter olabilir")]
    public string Description { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Fiyat gereklidir")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Fiyat 0'dan büyük olmalıdır")]
    public decimal Price { get; set; }
    
    [Required(ErrorMessage = "Stok miktarı gereklidir")]
    [Range(0, int.MaxValue, ErrorMessage = "Stok miktarı 0 veya pozitif olmalıdır")]
    public int StockQuantity { get; set; }
    
    [Required(ErrorMessage = "Kategori seçimi gereklidir")]
    public int CategoryId { get; set; }
    
    public bool IsActive { get; set; } = true;
}

public class UpdateProductRequest
{
    [Required(ErrorMessage = "Ürün adı gereklidir")]
    [MaxLength(200, ErrorMessage = "Ürün adı en fazla 200 karakter olabilir")]
    public string Name { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Ürün açıklaması gereklidir")]
    [MaxLength(2000, ErrorMessage = "Açıklama en fazla 2000 karakter olabilir")]
    public string Description { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Fiyat gereklidir")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Fiyat 0'dan büyük olmalıdır")]
    public decimal Price { get; set; }
    
    [Required(ErrorMessage = "Stok miktarı gereklidir")]
    [Range(0, int.MaxValue, ErrorMessage = "Stok miktarı 0 veya pozitif olmalıdır")]
    public int StockQuantity { get; set; }
    
    [Required(ErrorMessage = "Kategori seçimi gereklidir")]
    public int CategoryId { get; set; }
    
    public bool IsActive { get; set; }
}

// Category Management DTOs
public class AdminCategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int? ParentCategoryId { get; set; }
    public string? ParentCategoryName { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public int ProductCount { get; set; }
    public List<AdminCategoryDto> SubCategories { get; set; } = new();
}

public class CreateCategoryRequest
{
    [Required(ErrorMessage = "Kategori adı gereklidir")]
    [MaxLength(100, ErrorMessage = "Kategori adı en fazla 100 karakter olabilir")]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(500, ErrorMessage = "Açıklama en fazla 500 karakter olabilir")]
    public string Description { get; set; } = string.Empty;
    
    public int? ParentCategoryId { get; set; }
    
    [Range(0, int.MaxValue, ErrorMessage = "Sıralama 0 veya pozitif olmalıdır")]
    public int DisplayOrder { get; set; } = 0;
    
    public bool IsActive { get; set; } = true;
}

public class UpdateCategoryRequest
{
    [Required(ErrorMessage = "Kategori adı gereklidir")]
    [MaxLength(100, ErrorMessage = "Kategori adı en fazla 100 karakter olabilir")]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(500, ErrorMessage = "Açıklama en fazla 500 karakter olabilir")]
    public string Description { get; set; } = string.Empty;
    
    public int? ParentCategoryId { get; set; }
    
    [Range(0, int.MaxValue, ErrorMessage = "Sıralama 0 veya pozitif olmalıdır")]
    public int DisplayOrder { get; set; }
    
    public bool IsActive { get; set; }
}

// User Management DTOs
public class AdminUserDto
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public DateTime? DateOfBirth { get; set; }
    public UserRole Role { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsActive { get; set; }
    public bool IsDeleted { get; set; }
    public int OrderCount { get; set; }
    public decimal TotalSpent { get; set; }
}

public class UpdateUserRequest
{
    [Required(ErrorMessage = "Ad gereklidir")]
    [MaxLength(50, ErrorMessage = "Ad en fazla 50 karakter olabilir")]
    public string FirstName { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Soyad gereklidir")]
    [MaxLength(50, ErrorMessage = "Soyad en fazla 50 karakter olabilir")]
    public string LastName { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "E-posta adresi gereklidir")]
    [EmailAddress(ErrorMessage = "Geçerli bir e-posta adresi giriniz")]
    [MaxLength(100, ErrorMessage = "E-posta adresi en fazla 100 karakter olabilir")]
    public string Email { get; set; } = string.Empty;
    
    [Phone(ErrorMessage = "Geçerli bir telefon numarası giriniz")]
    [MaxLength(20, ErrorMessage = "Telefon numarası en fazla 20 karakter olabilir")]
    public string PhoneNumber { get; set; } = string.Empty;
    
    public DateTime? DateOfBirth { get; set; }
    
    [Required(ErrorMessage = "Rol seçimi gereklidir")]
    public UserRole Role { get; set; }
}

// Order Management DTOs
public class AdminOrderDto
{
    public int Id { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string UserEmail { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public OrderStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<OrderItemDto> Items { get; set; } = new();
    public AddressDto? ShippingAddress { get; set; }
}

public class OrderItemDto
{
    public int Id { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public decimal TotalPrice { get; set; }
}

public class AddressDto
{
    public string Title { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string AddressLine1 { get; set; } = string.Empty;
    public string AddressLine2 { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
}

public class UpdateOrderStatusRequest
{
    [Required(ErrorMessage = "Sipariş durumu gereklidir")]
    public OrderStatus Status { get; set; }
}

// Pagination and Response DTOs
public class AdminPagedResult<T>
{
    public List<T> Data { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasNextPage => Page < TotalPages;
    public bool HasPreviousPage => Page > 1;
}

public class ProductImageDto
{
    public int Id { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string AltText { get; set; } = string.Empty;
    public bool IsMain { get; set; }
    public int DisplayOrder { get; set; }
} 