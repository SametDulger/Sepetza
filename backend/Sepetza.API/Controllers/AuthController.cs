using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Sepetza.Core.Interfaces;
using Sepetza.Core.DTOs;

namespace Sepetza.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : BaseController
{
    private readonly IAuthService _authService;
    private readonly IUnitOfWork _unitOfWork;

    public AuthController(IAuthService authService, IUnitOfWork unitOfWork)
    {
        _authService = authService;
        _unitOfWork = unitOfWork;
    }

    // User registration
    [HttpPost("register")]
    [EnableRateLimiting("AuthPolicy")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var result = await _authService.RegisterAsync(request);
        
        if (!result.Success)
        {
            return BadRequest(new { message = result.Message, success = false });
        }

        return Ok(new 
        {
            success = true,
            data = new AuthResponse
            {
                Token = result.Token,
                User = result.User!,
                ExpiresAt = result.ExpiresAt!.Value,
                Success = true
            }
        });
    }

    // User login
    [HttpPost("login")]
    [EnableRateLimiting("AuthPolicy")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _authService.LoginAsync(request);
        
        if (!result.Success)
        {
            return BadRequest(new { message = result.Message, success = false });
        }

        return Ok(new 
        {
            success = true,
            data = new AuthResponse
            {
                Token = result.Token,
                User = result.User!,
                ExpiresAt = result.ExpiresAt!.Value,
                Success = true
            }
        });
    }

    // Get current user info
    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Geçersiz token", success = false });
            }

            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            
            if (user == null)
            {
                return NotFound(new { message = "Kullanıcı bulunamadı", success = false });
            }

            var userDto = new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Role = user.Role
            };

            return Ok(new { data = userDto, success = true });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Sunucu hatası", success = false });
        }
    }
} 