using Sepetza.Core.Entities;
using Sepetza.Core.DTOs;

namespace Sepetza.Core.Interfaces;

public interface IFavoriteService
{
    Task<IEnumerable<Favorite>> GetUserFavoritesAsync(int userId);
    Task<ServiceResult> AddToFavoritesAsync(int userId, int productId);
    Task<ServiceResult> RemoveFromFavoritesAsync(int userId, int productId);
    Task<bool> IsFavoriteAsync(int userId, int productId);
} 