using Sepetza.Core.Entities;
using Sepetza.Core.DTOs;

namespace Sepetza.Core.Interfaces;

public interface IAuthService
{
    Task<AuthResult> RegisterAsync(RegisterRequest request);
    Task<AuthResult> LoginAsync(LoginRequest request);
    string GenerateJwtToken(User user);
    bool IsValidEmail(string email);
    (bool IsValid, string ErrorMessage) ValidatePassword(string password);
} 