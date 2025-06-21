using Microsoft.EntityFrameworkCore;
using Sepetza.Core.Entities;
using Sepetza.Core.Interfaces;
using Sepetza.Data.Context;

namespace Sepetza.Data.Repositories;

public class CartRepository : GenericRepository<CartItem>, ICartRepository
{
    public CartRepository(SepetzaDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<CartItem>> GetUserCartItemsAsync(int userId)
    {
        return await _dbSet
            .Where(ci => ci.UserId == userId && !ci.IsDeleted)
            .Include(ci => ci.Product)
            .ThenInclude(p => p.ProductImages)
            .ToListAsync();
    }

    public async Task<CartItem?> GetUserProductCartItemAsync(int userId, int productId)
    {
        return await _dbSet
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.ProductId == productId);
    }

    public async Task ClearUserCartAsync(int userId)
    {
        var cartItems = await _dbSet
            .Where(ci => ci.UserId == userId && !ci.IsDeleted)
            .ToListAsync();

        foreach (var item in cartItems)
        {
            item.IsDeleted = true;
            item.UpdatedDate = DateTime.UtcNow;
        }

        _dbSet.UpdateRange(cartItems);
    }

    public async Task<decimal> GetUserCartTotalAsync(int userId)
    {
        return await _dbSet
            .Where(ci => ci.UserId == userId && !ci.IsDeleted)
            .SumAsync(ci => ci.UnitPrice * ci.Quantity);
    }

    public async Task<int> GetUserCartItemCountAsync(int userId)
    {
        return await _dbSet
            .Where(ci => ci.UserId == userId && !ci.IsDeleted)
            .SumAsync(ci => ci.Quantity);
    }
} 