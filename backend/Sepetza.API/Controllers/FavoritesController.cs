using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sepetza.Core.Interfaces;
using System.Security.Claims;

namespace Sepetza.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FavoritesController : BaseController
    {
        private readonly IFavoriteService _favoriteService;
        private readonly ILogger<FavoritesController> _logger;

        public FavoritesController(IFavoriteService favoriteService, ILogger<FavoritesController> logger)
        {
            _favoriteService = favoriteService;
            _logger = logger;
        }

        // Get user favorite products
        [HttpGet]
        public async Task<IActionResult> GetUserFavorites()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                {
                    return Unauthorized("Kullanıcı bilgisi bulunamadı");
                }

                var favorites = await _favoriteService.GetUserFavoritesAsync(userId.Value);
                
                var result = favorites.Select(f => new
                {
                    id = f.Id,
                    productId = f.ProductId,
                    name = f.Product.Name,
                    price = f.Product.Price,
                    discountPrice = f.Product.DiscountPrice,
                    image = f.Product.ProductImages?.FirstOrDefault()?.ImageUrl ?? 
                           "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop",
                    stockQuantity = f.Product.StockQuantity,
                    brand = f.Product.Brand,
                    category = f.Product.Category?.Name
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Favoriler getirilirken hata oluştu");
                return StatusCode(500, new { message = "Favoriler getirilirken bir hata oluştu" });
            }
        }

        // Add product to favorites
        [HttpPost("{productId}")]
        public async Task<IActionResult> AddToFavorites(int productId)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized("Kullanıcı bilgisi bulunamadı");
            }

            var result = await _favoriteService.AddToFavoritesAsync(userId.Value, productId);
            
            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }

            return Ok(new { message = result.Message });
        }

        // Remove product from favorites
        [HttpDelete("{productId}")]
        public async Task<IActionResult> RemoveFromFavorites(int productId)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized("Kullanıcı bilgisi bulunamadı");
            }

            var result = await _favoriteService.RemoveFromFavoritesAsync(userId.Value, productId);
            
            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }

            return Ok(new { message = result.Message });
        }

        // Check if product is favorite
        [HttpGet("check/{productId}")]
        public async Task<IActionResult> CheckIfFavorite(int productId)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                {
                    return Unauthorized("Kullanıcı bilgisi bulunamadı");
                }

                var isFavorite = await _favoriteService.IsFavoriteAsync(userId.Value, productId);
                return Ok(new { isFavorite });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Favori kontrolü sırasında hata: {ProductId}", productId);
                return StatusCode(500, new { message = "Favori kontrolü sırasında bir hata oluştu" });
            }
        }
    }
}