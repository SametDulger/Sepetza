using System.ComponentModel.DataAnnotations;

namespace Sepetza.Core.DTOs;

public class CreateReviewRequest
{
    [Required(ErrorMessage = "Ürün ID gereklidir")]
    [Range(1, int.MaxValue, ErrorMessage = "Geçerli bir ürün ID giriniz")]
    public int ProductId { get; set; }
    
    [Required(ErrorMessage = "Puan gereklidir")]
    [Range(1, 5, ErrorMessage = "Puan 1 ile 5 arasında olmalıdır")]
    public int Rating { get; set; }
    
    [Required(ErrorMessage = "Başlık gereklidir")]
    [MaxLength(200, ErrorMessage = "Başlık en fazla 200 karakter olabilir")]
    public string Title { get; set; } = string.Empty;
    
    [MaxLength(1000, ErrorMessage = "Yorum en fazla 1000 karakter olabilir")]
    public string Comment { get; set; } = string.Empty;
}

public class UpdateReviewRequest
{
    [Required(ErrorMessage = "Puan gereklidir")]
    [Range(1, 5, ErrorMessage = "Puan 1 ile 5 arasında olmalıdır")]
    public int Rating { get; set; }
    
    [Required(ErrorMessage = "Başlık gereklidir")]
    [MaxLength(200, ErrorMessage = "Başlık en fazla 200 karakter olabilir")]
    public string Title { get; set; } = string.Empty;
    
    [MaxLength(1000, ErrorMessage = "Yorum en fazla 1000 karakter olabilir")]
    public string Comment { get; set; } = string.Empty;
} 