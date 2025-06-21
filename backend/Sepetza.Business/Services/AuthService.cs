using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Concurrent;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using BCrypt.Net;
using Sepetza.Core.Entities;
using Sepetza.Core.Interfaces;
using Sepetza.Core.DTOs;
using Sepetza.Core.Constants;

namespace Sepetza.Business.Services;

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthService> _logger;
    private static readonly ConcurrentDictionary<string, (int attempts, DateTime lastAttempt)> _loginAttempts = new();

    public AuthService(IUnitOfWork unitOfWork, IConfiguration configuration, ILogger<AuthService> logger)
    {
        _unitOfWork = unitOfWork;
        _configuration = configuration;
        _logger = logger;
    }

    // Register new user
    public async Task<AuthResult> RegisterAsync(RegisterRequest request)
    {
        try
        {
            // Input validation
            if (string.IsNullOrWhiteSpace(request.Email) || 
                string.IsNullOrWhiteSpace(request.Password) ||
                string.IsNullOrWhiteSpace(request.FirstName) ||
                string.IsNullOrWhiteSpace(request.LastName))
            {
                return new AuthResult { Success = false, Message = "Tüm alanlar zorunludur." };
            }

            // Email format validation
            if (!IsValidEmail(request.Email))
            {
                return new AuthResult { Success = false, Message = "Geçerli bir e-posta adresi giriniz." };
            }

            // Password policy validation
            var passwordValidation = ValidatePassword(request.Password);
            if (!passwordValidation.IsValid)
            {
                return new AuthResult { Success = false, Message = passwordValidation.ErrorMessage };
            }

            // Check if user already exists
            if (await _unitOfWork.Users.EmailExistsAsync(request.Email))
            {
                return new AuthResult { Success = false, Message = "Bu e-posta adresi zaten kullanılıyor." };
            }

            // Create new user
            var user = new User
            {
                FirstName = request.FirstName.Trim(),
                LastName = request.LastName.Trim(),
                Email = request.Email.Trim().ToLowerInvariant(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, SecurityConstants.BCRYPT_WORK_FACTOR),
                PhoneNumber = request.PhoneNumber?.Trim() ?? "",
                Role = UserRole.Customer
            };

            await _unitOfWork.Users.AddAsync(user);
            await _unitOfWork.SaveChangesAsync();

            // Generate JWT token
            var token = GenerateJwtToken(user);

            _logger.LogInformation("User registered successfully with email: {Email}", request.Email);

            return new AuthResult
            {
                Success = true,
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    Role = user.Role
                },
                ExpiresAt = DateTime.UtcNow.AddMinutes(SecurityConstants.JWT_EXPIRATION_MINUTES),
                Message = "Kayıt başarılı."
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Registration error for email: {Email}", request.Email);
            return new AuthResult { Success = false, Message = "Kayıt işlemi sırasında bir hata oluştu." };
        }
    }

    // User login authentication
    public async Task<AuthResult> LoginAsync(LoginRequest request)
    {
        try
        {
            // Input validation
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                return new AuthResult { Success = false, Message = "E-posta ve şifre gereklidir." };
            }

            // Email format validation
            if (!IsValidEmail(request.Email))
            {
                return new AuthResult { Success = false, Message = "Geçerli bir e-posta adresi giriniz." };
            }

            var email = request.Email.Trim().ToLowerInvariant();
            
            // Account lockout kontrolü
            if (IsAccountLocked(email))
            {
                _logger.LogWarning("Account locked for email: {Email}", email);
                return new AuthResult { Success = false, Message = $"Hesap geçici olarak kilitlenmiştir. Lütfen {SecurityConstants.LOCKOUT_DURATION_MINUTES} dakika sonra tekrar deneyin." };
            }

            var user = await _unitOfWork.Users.GetByEmailAsync(email);
            
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                // Failed login attempt kaydı
                RecordFailedLoginAttempt(email);
                _logger.LogWarning("Failed login attempt for email: {Email}", email);
                
                // Same error message for both cases to prevent user enumeration
                return new AuthResult { Success = false, Message = "E-posta veya şifre hatalı." };
            }

            // Başarılı giriş - attempt'leri temizle
            ClearLoginAttempts(email);
            _logger.LogInformation("User logged in successfully with email: {Email}", email);
            
            var token = GenerateJwtToken(user);

            return new AuthResult
            {
                Success = true,
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    Role = user.Role
                },
                ExpiresAt = DateTime.UtcNow.AddMinutes(SecurityConstants.JWT_EXPIRATION_MINUTES),
                Message = "Giriş başarılı."
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Login error for email: {Email}", request.Email);
            return new AuthResult { Success = false, Message = "Giriş işlemi sırasında bir hata oluştu." };
        }
    }

    // Generate JWT token for user
    public string GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var key = Encoding.ASCII.GetBytes(jwtSettings["SecretKey"]!);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(SecurityConstants.JWT_EXPIRATION_MINUTES),
            Issuer = jwtSettings["Issuer"],
            Audience = jwtSettings["Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public bool IsValidEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return false;

        try
        {
            var emailRegex = new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", RegexOptions.IgnoreCase);
            return emailRegex.IsMatch(email);
        }
        catch
        {
            return false;
        }
    }

    public (bool IsValid, string ErrorMessage) ValidatePassword(string password)
    {
        if (string.IsNullOrWhiteSpace(password))
            return (false, "Şifre boş olamaz.");

        if (password.Length < SecurityConstants.MIN_PASSWORD_LENGTH)
            return (false, $"Şifre en az {SecurityConstants.MIN_PASSWORD_LENGTH} karakter olmalıdır.");

        if (password.Length > SecurityConstants.MAX_PASSWORD_LENGTH)
            return (false, $"Şifre en fazla {SecurityConstants.MAX_PASSWORD_LENGTH} karakter olabilir.");

        if (!password.Any(char.IsDigit))
            return (false, "Şifre en az bir rakam içermelidir.");

        if (!password.Any(char.IsLetter))
            return (false, "Şifre en az bir harf içermelidir.");

        // Check for common weak passwords
        var commonPasswords = new[] { "123456", "password", "123456789", "12345678", "12345", "1234567", "admin", "qwerty" };
        if (commonPasswords.Contains(password.ToLower()))
            return (false, "Lütfen daha güçlü bir şifre seçin.");

        return (true, "");
    }

    private bool IsAccountLocked(string email)
    {
        if (!_loginAttempts.TryGetValue(email, out var loginInfo))
            return false;

        var (attempts, lastAttempt) = loginInfo;
        
        if (attempts >= SecurityConstants.MAX_LOGIN_ATTEMPTS)
        {
            var timeSinceLastAttempt = DateTime.UtcNow - lastAttempt;
            if (timeSinceLastAttempt.TotalMinutes < SecurityConstants.LOCKOUT_DURATION_MINUTES)
            {
                return true;
            }
            else
            {
                // Süre dolmuş, attempt'leri temizle
                _loginAttempts.TryRemove(email, out _);
                return false;
            }
        }

        return false;
    }

    private void RecordFailedLoginAttempt(string email)
    {
        _loginAttempts.AddOrUpdate(email, 
            (1, DateTime.UtcNow),
            (key, value) => (value.attempts + 1, DateTime.UtcNow));
    }

    private void ClearLoginAttempts(string email)
    {
        _loginAttempts.TryRemove(email, out _);
    }
} 