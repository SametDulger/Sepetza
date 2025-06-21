using Sepetza.Core.Entities;

namespace Sepetza.Core.Interfaces
{
    public interface IFavoriteRepository : IGenericRepository<Favorite>
    {
        Task<IEnumerable<Favorite>> GetUserFavoritesAsync(int userId);
        Task<Favorite?> GetUserProductFavoriteAsync(int userId, int productId);
        Task<bool> IsProductFavoriteAsync(int userId, int productId);
    }
} 