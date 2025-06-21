using Sepetza.Core.Entities;
using Sepetza.Core.Interfaces;
using Sepetza.Core.DTOs;
using Microsoft.Extensions.Logging;

namespace Sepetza.Business.Services;

public class ReviewService : IReviewService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<ReviewService> _logger;

    public ReviewService(IUnitOfWork unitOfWork, ILogger<ReviewService> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<IEnumerable<Review>> GetProductReviewsAsync(int productId, int page = 1, int pageSize = 10)
    {
        return await _unitOfWork.Reviews.GetProductReviewsAsync(productId, page, pageSize);
    }

    public async Task<int> GetProductReviewCountAsync(int productId)
    {
        return await _unitOfWork.Reviews.GetProductReviewCountAsync(productId);
    }

    public async Task<ServiceResult> CreateReviewAsync(int userId, int productId, int rating, string title, string comment)
    {
        try
        {
            // Ürün kontrolü
            var product = await _unitOfWork.Products.GetByIdAsync(productId);
            if (product == null)
            {
                return ServiceResult.ErrorResult("Ürün bulunamadı");
            }

            // Kullanıcının bu ürün için daha önce yorum yapıp yapmadığını kontrol et
            var existingReview = await _unitOfWork.Reviews.GetUserProductReviewAsync(userId, productId);
            if (existingReview != null)
            {
                return ServiceResult.ErrorResult("Bu ürün için zaten bir değerlendirme yapmışsınız");
            }

            // Validation
            if (rating < 1 || rating > 5)
            {
                return ServiceResult.ErrorResult("Puan 1-5 arasında olmalıdır");
            }

            if (string.IsNullOrWhiteSpace(title) || title.Length > 200)
            {
                return ServiceResult.ErrorResult("Başlık 1-200 karakter arasında olmalıdır");
            }

            if (string.IsNullOrWhiteSpace(comment) || comment.Length > 2000)
            {
                return ServiceResult.ErrorResult("Yorum 1-2000 karakter arasında olmalıdır");
            }

            var review = new Review
            {
                UserId = userId,
                ProductId = productId,
                Rating = rating,
                Title = title.Trim(),
                Comment = comment.Trim(),
                IsApproved = true, // Otomatik onaylı
                CreatedDate = DateTime.UtcNow
            };

            await _unitOfWork.Reviews.AddAsync(review);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Review created successfully for user {UserId} and product {ProductId}", userId, productId);

            return ServiceResult.SuccessResult("Değerlendirmeniz başarıyla kaydedildi");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating review for user {UserId} and product {ProductId}", userId, productId);
            return ServiceResult.ErrorResult("Değerlendirme kaydedilirken bir hata oluştu");
        }
    }

    public async Task<ServiceResult> UpdateReviewAsync(int reviewId, int userId, int rating, string title, string comment)
    {
        try
        {
            var review = await _unitOfWork.Reviews.GetByIdAsync(reviewId);
            if (review == null)
            {
                return ServiceResult.ErrorResult("Değerlendirme bulunamadı");
            }

            if (review.UserId != userId)
            {
                return ServiceResult.ErrorResult("Bu değerlendirmeyi düzenleme yetkiniz yok");
            }

            // Validation
            if (rating < 1 || rating > 5)
            {
                return ServiceResult.ErrorResult("Puan 1-5 arasında olmalıdır");
            }

            if (string.IsNullOrWhiteSpace(title) || title.Length > 200)
            {
                return ServiceResult.ErrorResult("Başlık 1-200 karakter arasında olmalıdır");
            }

            if (string.IsNullOrWhiteSpace(comment) || comment.Length > 2000)
            {
                return ServiceResult.ErrorResult("Yorum 1-2000 karakter arasında olmalıdır");
            }

            review.Rating = rating;
            review.Title = title.Trim();
            review.Comment = comment.Trim();
            review.UpdatedDate = DateTime.UtcNow;

            await _unitOfWork.Reviews.UpdateAsync(review);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Review updated successfully. ReviewId: {ReviewId}, UserId: {UserId}", reviewId, userId);

            return ServiceResult.SuccessResult("Değerlendirmeniz başarıyla güncellendi");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating review {ReviewId} for user {UserId}", reviewId, userId);
            return ServiceResult.ErrorResult("Değerlendirme güncellenirken bir hata oluştu");
        }
    }

    public async Task<ServiceResult> DeleteReviewAsync(int reviewId, int userId)
    {
        try
        {
            var review = await _unitOfWork.Reviews.GetByIdAsync(reviewId);
            if (review == null)
            {
                return ServiceResult.ErrorResult("Değerlendirme bulunamadı");
            }

            if (review.UserId != userId)
            {
                return ServiceResult.ErrorResult("Bu değerlendirmeyi silme yetkiniz yok");
            }

            await _unitOfWork.Reviews.DeleteAsync(review);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Review deleted successfully. ReviewId: {ReviewId}, UserId: {UserId}", reviewId, userId);

            return ServiceResult.SuccessResult("Değerlendirmeniz başarıyla silindi");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting review {ReviewId} for user {UserId}", reviewId, userId);
            return ServiceResult.ErrorResult("Değerlendirme silinirken bir hata oluştu");
        }
    }

    public async Task<IEnumerable<Review>> GetUserReviewsAsync(int userId, int page = 1, int pageSize = 10)
    {
        return await _unitOfWork.Reviews.GetUserReviewsAsync(userId, page, pageSize);
    }

    public async Task<Review?> GetUserProductReviewAsync(int userId, int productId)
    {
        return await _unitOfWork.Reviews.GetUserProductReviewAsync(userId, productId);
    }

    public async Task<double> GetAverageRatingForProductAsync(int productId)
    {
        return await _unitOfWork.Reviews.GetAverageRatingForProductAsync(productId);
    }
} 