using Sepetza.Core.Entities;

using System.ComponentModel.DataAnnotations;
using Sepetza.Core.Constants;

namespace Sepetza.Core.DTOs;

public class AuthResult
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
    public UserDto? User { get; set; }
    public DateTime? ExpiresAt { get; set; }
}

public class RegisterRequest
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
    
    [Required(ErrorMessage = "Şifre gereklidir")]
    [MinLength(6, ErrorMessage = "Şifre en az 6 karakter olmalıdır")]
    [MaxLength(100, ErrorMessage = "Şifre en fazla 100 karakter olabilir")]
    public string Password { get; set; } = string.Empty;
    
    [Phone(ErrorMessage = "Geçerli bir telefon numarası giriniz")]
    [MaxLength(20, ErrorMessage = "Telefon numarası en fazla 20 karakter olabilir")]
    public string PhoneNumber { get; set; } = string.Empty;
}

public class LoginRequest
{
    [Required(ErrorMessage = "E-posta adresi gereklidir")]
    [EmailAddress(ErrorMessage = "Geçerli bir e-posta adresi giriniz")]
    public string Email { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Şifre gereklidir")]
    public string Password { get; set; } = string.Empty;
}

public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public UserDto User { get; set; } = null!;
    public DateTime ExpiresAt { get; set; }
    public bool Success { get; set; }
}

public class UserDto
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public UserRole Role { get; set; }
} 