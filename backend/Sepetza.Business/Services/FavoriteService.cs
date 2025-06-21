using Sepetza.Core.Entities;
using Sepetza.Core.Interfaces;
using Sepetza.Core.DTOs;
using Microsoft.Extensions.Logging;

namespace Sepetza.Business.Services;

public class FavoriteService : IFavoriteService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<FavoriteService> _logger;

    public FavoriteService(IUnitOfWork unitOfWork, ILogger<FavoriteService> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    // Get user favorite products
    public async Task<IEnumerable<Favorite>> GetUserFavoritesAsync(int userId)
    {
        return await _unitOfWork.Favorites.GetUserFavoritesAsync(userId);
    }

    // Check if product is favorite
    public async Task<bool> IsProductFavoriteAsync(int userId, int productId)
    {
        return await _unitOfWork.Favorites.IsProductFavoriteAsync(userId, productId);
    }

    // Add product to favorites
    public async Task<ServiceResult> AddToFavoritesAsync(int userId, int productId)
    {
        try
        {
            // Ürün kontrolü
            var product = await _unitOfWork.Products.GetByIdAsync(productId);
            if (product == null)
            {
                return ServiceResult.ErrorResult("Ürün bulunamadı");
            }

            // Zaten favorilerde mi kontrol et
            var existingFavorite = await _unitOfWork.Favorites.IsProductFavoriteAsync(userId, productId);
            if (existingFavorite)
            {
                return ServiceResult.ErrorResult("Ürün zaten favorilerinizde");
            }

            var favorite = new Favorite
            {
                UserId = userId,
                ProductId = productId,
                CreatedDate = DateTime.UtcNow
            };

            await _unitOfWork.Favorites.AddAsync(favorite);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Product added to favorites. UserId: {UserId}, ProductId: {ProductId}", userId, productId);

            return ServiceResult.SuccessResult("Ürün favorilerinize eklendi");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding product to favorites. UserId: {UserId}, ProductId: {ProductId}", userId, productId);
            return ServiceResult.ErrorResult("Ürün favorilere eklenirken bir hata oluştu");
        }
    }

    // Remove product from favorites
    public async Task<ServiceResult> RemoveFromFavoritesAsync(int userId, int productId)
    {
        try
        {
            var favorite = await _unitOfWork.Favorites.GetUserProductFavoriteAsync(userId, productId);
            if (favorite == null)
            {
                return ServiceResult.ErrorResult("Ürün favorilerinizde bulunamadı");
            }

            await _unitOfWork.Favorites.DeleteAsync(favorite);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Product removed from favorites. UserId: {UserId}, ProductId: {ProductId}", userId, productId);

            return ServiceResult.SuccessResult("Ürün favorilerinizden kaldırıldı");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing product from favorites. UserId: {UserId}, ProductId: {ProductId}", userId, productId);
            return ServiceResult.ErrorResult("Ürün favorilerden kaldırılırken bir hata oluştu");
        }
    }

    // Check if product is in favorites
    public async Task<bool> IsFavoriteAsync(int userId, int productId)
    {
        return await _unitOfWork.Favorites.IsProductFavoriteAsync(userId, productId);
    }
} 