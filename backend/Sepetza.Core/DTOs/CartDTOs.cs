using System.ComponentModel.DataAnnotations;

namespace Sepetza.Core.DTOs;

public class AddToCartRequest
{
    [Required(ErrorMessage = "Ürün ID gereklidir")]
    [Range(1, int.MaxValue, ErrorMessage = "Geçerli bir ürün ID giriniz")]
    public int ProductId { get; set; }
    
    [Required(ErrorMessage = "Miktar gereklidir")]
    [Range(1, 100, ErrorMessage = "Miktar 1 ile 100 arasında olmalıdır")]
    public int Quantity { get; set; } = 1;
}

public class UpdateCartRequest
{
    [Required(ErrorMessage = "Ürün ID gereklidir")]
    [Range(1, int.MaxValue, ErrorMessage = "Geçerli bir ürün ID giriniz")]
    public int ProductId { get; set; }
    
    [Required(ErrorMessage = "Miktar gereklidir")]
    [Range(1, 100, ErrorMessage = "Miktar 1 ile 100 arasında olmalıdır")]
    public int Quantity { get; set; }
} 