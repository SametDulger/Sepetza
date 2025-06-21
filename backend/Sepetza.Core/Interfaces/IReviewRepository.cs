using Sepetza.Core.Entities;

namespace Sepetza.Core.Interfaces;

public interface IReviewRepository : IGenericRepository<Review>
{
    Task<IEnumerable<Review>> GetReviewsByProductAsync(int productId);
    Task<IEnumerable<Review>> GetApprovedReviewsByProductAsync(int productId);
    Task<Review?> GetUserReviewForProductAsync(int userId, int productId);
    Task<double> GetAverageRatingForProductAsync(int productId);
    Task<IEnumerable<Review>> GetProductReviewsAsync(int productId, int page, int pageSize);
    Task<int> GetProductReviewCountAsync(int productId);
    Task<Review?> GetUserProductReviewAsync(int userId, int productId);
    Task<IEnumerable<Review>> GetUserReviewsAsync(int userId, int page, int pageSize);
    Task<int> GetUserReviewCountAsync(int userId);
} 