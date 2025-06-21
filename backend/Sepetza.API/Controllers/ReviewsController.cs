using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sepetza.Core.Interfaces;
using Sepetza.Core.DTOs;
using System.Security.Claims;

namespace Sepetza.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController : BaseController
    {
        private readonly IReviewService _reviewService;
        private readonly ILogger<ReviewsController> _logger;

        public ReviewsController(IReviewService reviewService, ILogger<ReviewsController> logger)
        {
            _reviewService = reviewService;
            _logger = logger;
        }

        // Get product reviews with pagination
        [HttpGet("product/{productId}")]
        public async Task<IActionResult> GetProductReviews(int productId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var reviews = await _reviewService.GetProductReviewsAsync(productId, page, pageSize);
                var totalReviews = await _reviewService.GetProductReviewCountAsync(productId);

                var result = reviews.Select(r => new
                {
                    id = r.Id,
                    rating = r.Rating,
                    title = r.Title,
                    comment = r.Comment,
                    createdDate = r.CreatedDate,
                    userFirstName = r.User?.FirstName ?? "Anonim",
                    userLastName = r.User?.LastName ?? "Kullanıcı"
                });

                return Ok(new
                {
                    reviews = result,
                    totalReviews,
                    currentPage = page,
                    pageSize,
                    totalPages = (int)Math.Ceiling((double)totalReviews / pageSize)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ürün yorumları getirilirken hata: {ProductId}", productId);
                return StatusCode(500, new { message = "Yorumlar getirilirken bir hata oluştu" });
            }
        }

        // Create new review
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateReview([FromBody] CreateReviewRequest request)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized(new { message = "Kullanıcı bilgisi bulunamadı" });
            }

            var result = await _reviewService.CreateReviewAsync(userId.Value, request.ProductId, request.Rating, request.Title, request.Comment);
            
            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }

            return Ok(new { message = result.Message });
        }

        // Update existing review
        [HttpPut("{reviewId}")]
        [Authorize]
        public async Task<IActionResult> UpdateReview(int reviewId, [FromBody] UpdateReviewRequest request)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized(new { message = "Kullanıcı bilgisi bulunamadı" });
            }

            var result = await _reviewService.UpdateReviewAsync(reviewId, userId.Value, request.Rating, request.Title, request.Comment);
            
            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }

            return Ok(new { message = result.Message });
        }

        // Delete review
        [HttpDelete("{reviewId}")]
        [Authorize]
        public async Task<IActionResult> DeleteReview(int reviewId)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized(new { message = "Kullanıcı bilgisi bulunamadı" });
            }

            var result = await _reviewService.DeleteReviewAsync(reviewId, userId.Value);
            
            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }

            return Ok(new { message = result.Message });
        }

        // Get user reviews
        [HttpGet("user")]
        [Authorize]
        public async Task<IActionResult> GetUserReviews([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                {
                    return Unauthorized(new { message = "Kullanıcı bilgisi bulunamadı" });
                }

                var reviews = await _reviewService.GetUserReviewsAsync(userId.Value, page, pageSize);
                // Kullanıcı yorumlarının toplam sayısını hesapla
                var totalReviews = reviews.Count();

                var result = reviews.Select(r => new
                {
                    id = r.Id,
                    rating = r.Rating,
                    title = r.Title,
                    comment = r.Comment,
                    createdDate = r.CreatedDate,
                    productId = r.ProductId,
                    productName = r.Product?.Name ?? "Bilinmeyen Ürün"
                });

                return Ok(new
                {
                    reviews = result,
                    totalReviews,
                    currentPage = page,
                    pageSize,
                    totalPages = (int)Math.Ceiling((double)totalReviews / pageSize)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Kullanıcı yorumları getirilirken hata");
                return StatusCode(500, new { message = "Yorumlar getirilirken bir hata oluştu" });
            }
        }
    }
} 