using Sepetza.Core.Entities;
using Sepetza.Core.DTOs;

namespace Sepetza.Core.Interfaces;

public interface ICartService
{
    Task<IEnumerable<CartItem>> GetUserCartItemsAsync(int userId);
    Task<ServiceResult> AddToCartAsync(int userId, int productId, int quantity);
    Task<ServiceResult> UpdateCartItemAsync(int userId, int productId, int quantity);
    Task<ServiceResult> RemoveFromCartAsync(int userId, int productId);
    Task<ServiceResult> ClearCartAsync(int userId);
    Task<decimal> GetCartTotalAsync(int userId);
    Task<int> GetCartItemCountAsync(int userId);
} 