using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Sepetza.API.Controllers;

public abstract class BaseController : ControllerBase
{
    // Get current user ID from JWT token
    protected int? GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
        {
            return userId;
        }
        return null;
    }

    // Get current user email from JWT token
    protected string? GetCurrentUserEmail()
    {
        return User.FindFirst(ClaimTypes.Email)?.Value;
    }

    // Get current user role from JWT token
    protected string? GetCurrentUserRole()
    {
        return User.FindFirst(ClaimTypes.Role)?.Value;
    }
} 