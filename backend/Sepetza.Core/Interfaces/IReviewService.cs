using Sepetza.Core.Entities;
using Sepetza.Core.DTOs;

namespace Sepetza.Core.Interfaces;

public interface IReviewService
{
    Task<IEnumerable<Review>> GetProductReviewsAsync(int productId, int page = 1, int pageSize = 10);
    Task<int> GetProductReviewCountAsync(int productId);
    Task<ServiceResult> CreateReviewAsync(int userId, int productId, int rating, string title, string comment);
    Task<ServiceResult> UpdateReviewAsync(int reviewId, int userId, int rating, string title, string comment);
    Task<ServiceResult> DeleteReviewAsync(int reviewId, int userId);
    Task<IEnumerable<Review>> GetUserReviewsAsync(int userId, int page = 1, int pageSize = 10);
    Task<Review?> GetUserProductReviewAsync(int userId, int productId);
    Task<double> GetAverageRatingForProductAsync(int productId);
} 