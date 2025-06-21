using Microsoft.EntityFrameworkCore;
using Sepetza.Core.Entities;
using Sepetza.Core.Interfaces;
using Sepetza.Data.Context;

namespace Sepetza.Data.Repositories;

public class ReviewRepository : GenericRepository<Review>, IReviewRepository
{
    public ReviewRepository(SepetzaDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Review>> GetReviewsByProductAsync(int productId)
    {
        return await _dbSet
            .Where(r => r.ProductId == productId)
            .Include(r => r.User)
            .OrderByDescending(r => r.CreatedDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Review>> GetApprovedReviewsByProductAsync(int productId)
    {
        return await _dbSet
            .Where(r => r.ProductId == productId && r.IsApproved)
            .Include(r => r.User)
            .OrderByDescending(r => r.CreatedDate)
            .ToListAsync();
    }

    public async Task<Review?> GetUserReviewForProductAsync(int userId, int productId)
    {
        return await _dbSet
            .FirstOrDefaultAsync(r => r.UserId == userId && r.ProductId == productId);
    }

    public async Task<double> GetAverageRatingForProductAsync(int productId)
    {
        var reviews = await _dbSet
            .Where(r => r.ProductId == productId && r.IsApproved)
            .ToListAsync();

        if (!reviews.Any())
            return 0;

        return reviews.Average(r => r.Rating);
    }

    public async Task<IEnumerable<Review>> GetProductReviewsAsync(int productId, int page, int pageSize)
    {
        return await _dbSet
            .Where(r => r.ProductId == productId && r.IsApproved)
            .Include(r => r.User)
            .OrderByDescending(r => r.CreatedDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<int> GetProductReviewCountAsync(int productId)
    {
        return await _dbSet
            .Where(r => r.ProductId == productId && r.IsApproved)
            .CountAsync();
    }

    public async Task<Review?> GetUserProductReviewAsync(int userId, int productId)
    {
        return await _dbSet
            .FirstOrDefaultAsync(r => r.UserId == userId && r.ProductId == productId);
    }

    public async Task<IEnumerable<Review>> GetUserReviewsAsync(int userId, int page, int pageSize)
    {
        return await _dbSet
            .Where(r => r.UserId == userId)
            .Include(r => r.Product)
            .OrderByDescending(r => r.CreatedDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<int> GetUserReviewCountAsync(int userId)
    {
        return await _dbSet
            .Where(r => r.UserId == userId)
            .CountAsync();
    }
} 