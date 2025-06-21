using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System.Security.Claims;
using Sepetza.Core.Interfaces;
using Sepetza.Core.DTOs;
using Microsoft.Extensions.Logging;

namespace Sepetza.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
[EnableRateLimiting("CartPolicy")]
public class CartController : BaseController
{
    private readonly ICartService _cartService;
    private readonly ILogger<CartController> _logger;

    public CartController(ICartService cartService, ILogger<CartController> logger)
    {
        _cartService = cartService;
        _logger = logger;
    }

    // Get user cart items
    [HttpGet]
    public async Task<IActionResult> GetCartItems()
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized();

            var cartItems = await _cartService.GetUserCartItemsAsync(userId.Value);
            return Ok(new { data = cartItems, success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting cart items for user");
            return StatusCode(500, "Sepet öğeleri getirilirken bir hata oluştu");
        }
    }

    // Add product to cart
    [HttpPost("add")]
    public async Task<IActionResult> AddToCart([FromBody] AddToCartRequest request)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized(new { message = "Kullanıcı kimlik doğrulaması gerekli.", success = false });

        var result = await _cartService.AddToCartAsync(userId.Value, request.ProductId, request.Quantity);
        
        if (!result.Success)
        {
            return BadRequest(new { message = result.Message, success = false });
        }

        return Ok(new { message = result.Message, success = true });
    }

    // Update cart item quantity
    [HttpPut("update")]
    public async Task<IActionResult> UpdateCartItem([FromBody] UpdateCartRequest request)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        var result = await _cartService.UpdateCartItemAsync(userId.Value, request.ProductId, request.Quantity);
        
        if (!result.Success)
        {
            return BadRequest(new { message = result.Message, success = false });
        }

        return Ok(new { message = result.Message, success = true });
    }

    // Remove product from cart
    [HttpDelete("remove/{productId}")]
    public async Task<IActionResult> RemoveFromCart(int productId)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        var result = await _cartService.RemoveFromCartAsync(userId.Value, productId);
        
        if (!result.Success)
        {
            return BadRequest(new { message = result.Message, success = false });
        }

        return Ok(new { message = result.Message, success = true });
    }

    // Clear entire cart
    [HttpDelete("clear")]
    public async Task<IActionResult> ClearCart()
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        var result = await _cartService.ClearCartAsync(userId.Value);
        
        if (!result.Success)
        {
            return BadRequest(new { message = result.Message, success = false });
        }

        return Ok(new { message = result.Message, success = true });
    }

    // Get cart total amount
    [HttpGet("total")]
    public async Task<IActionResult> GetCartTotal()
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized();

            var total = await _cartService.GetCartTotalAsync(userId.Value);
            return Ok(new { data = total, success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting cart total for user");
            return StatusCode(500, "Sepet toplamı hesaplanırken bir hata oluştu");
        }
    }


} 