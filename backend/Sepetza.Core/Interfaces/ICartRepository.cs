using Sepetza.Core.Entities;

namespace Sepetza.Core.Interfaces;

public interface ICartRepository : IGenericRepository<CartItem>
{
    Task<IEnumerable<CartItem>> GetUserCartItemsAsync(int userId);
    Task<CartItem?> GetUserProductCartItemAsync(int userId, int productId);
    Task ClearUserCartAsync(int userId);
    Task<decimal> GetUserCartTotalAsync(int userId);
    Task<int> GetUserCartItemCountAsync(int userId);
} 