using Sepetza.Core.Entities;
using Sepetza.Core.Interfaces;
using Sepetza.Core.DTOs;
using Microsoft.Extensions.Logging;

namespace Sepetza.Business.Services;

public class CartService : ICartService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CartService> _logger;

    public CartService(IUnitOfWork unitOfWork, ILogger<CartService> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    // Get user cart items
    public async Task<IEnumerable<CartItem>> GetUserCartItemsAsync(int userId)
    {
        return await _unitOfWork.CartItems.GetUserCartItemsAsync(userId);
    }

    // Add product to cart
    public async Task<ServiceResult> AddToCartAsync(int userId, int productId, int quantity)
    {
        try
        {
            _logger.LogDebug("Adding to cart - UserId: {UserId}, ProductId: {ProductId}, Quantity: {Quantity}", userId, productId, quantity);

            // Ürün kontrolü
            var product = await _unitOfWork.Products.GetByIdAsync(productId);
            _logger.LogDebug("Product found: {ProductExists} - Name: {ProductName}", product != null, product?.Name);

            if (product == null)
            {
                return ServiceResult.ErrorResult("Ürün bulunamadı");
            }

            if (quantity <= 0)
            {
                return ServiceResult.ErrorResult("Miktar 0'dan büyük olmalıdır");
            }

            _logger.LogDebug("Checking for existing cart item - UserId: {UserId}, ProductId: {ProductId}", userId, productId);

            // Mevcut sepet öğesi kontrolü
            var existingCartItem = await _unitOfWork.CartItems.GetUserProductCartItemAsync(userId, productId);
            _logger.LogDebug("Existing cart item found: {Exists}, IsDeleted: {IsDeleted}", existingCartItem != null, existingCartItem?.IsDeleted);

            if (existingCartItem != null)
            {
                if (existingCartItem.IsDeleted)
                {
                    // Silinmiş öğeyi yeniden aktifleştir
                    existingCartItem.Quantity = quantity;
                    existingCartItem.UnitPrice = product.DiscountPrice ?? product.Price;
                    existingCartItem.IsDeleted = false;
                    existingCartItem.UpdatedDate = DateTime.UtcNow;

                    await _unitOfWork.CartItems.UpdateAsync(existingCartItem);
                }
                else
                {
                    // Miktarı artır
                    existingCartItem.Quantity += quantity;
                    existingCartItem.UpdatedDate = DateTime.UtcNow;

                    await _unitOfWork.CartItems.UpdateAsync(existingCartItem);
                }
            }
            else
            {
                // Yeni sepet öğesi oluştur
                var cartItem = new CartItem
                {
                    UserId = userId,
                    ProductId = productId,
                    Quantity = quantity,
                    UnitPrice = product.DiscountPrice ?? product.Price,
                    CreatedDate = DateTime.UtcNow
                };

                await _unitOfWork.CartItems.AddAsync(cartItem);
            }

            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Product added to cart successfully. UserId: {UserId}, ProductId: {ProductId}, Quantity: {Quantity}", userId, productId, quantity);

            return ServiceResult.SuccessResult("Ürün sepete eklendi");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding product to cart. UserId: {UserId}, ProductId: {ProductId}, Quantity: {Quantity}", userId, productId, quantity);
            
            if (ex.InnerException != null)
            {
                _logger.LogError("Inner Exception: {InnerException}", ex.InnerException.Message);
            }

            return ServiceResult.ErrorResult("Ürün sepete eklenirken bir hata oluştu");
        }
    }

    // Update cart item quantity
    public async Task<ServiceResult> UpdateCartItemAsync(int userId, int productId, int quantity)
    {
        try
        {
            if (quantity <= 0)
            {
                return ServiceResult.ErrorResult("Miktar 0'dan büyük olmalıdır");
            }

            var cartItem = await _unitOfWork.CartItems.GetUserProductCartItemAsync(userId, productId);
            if (cartItem == null || cartItem.IsDeleted)
            {
                return ServiceResult.ErrorResult("Sepet öğesi bulunamadı");
            }

            cartItem.Quantity = quantity;
            cartItem.UpdatedDate = DateTime.UtcNow;

            await _unitOfWork.CartItems.UpdateAsync(cartItem);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Cart item updated successfully. UserId: {UserId}, ProductId: {ProductId}, NewQuantity: {Quantity}", userId, productId, quantity);

            return ServiceResult.SuccessResult("Sepet güncellendi");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating cart item. UserId: {UserId}, ProductId: {ProductId}, Quantity: {Quantity}", userId, productId, quantity);
            return ServiceResult.ErrorResult("Sepet güncellenirken bir hata oluştu");
        }
    }

    // Remove product from cart
    public async Task<ServiceResult> RemoveFromCartAsync(int userId, int productId)
    {
        try
        {
            var cartItem = await _unitOfWork.CartItems.GetUserProductCartItemAsync(userId, productId);
            if (cartItem == null || cartItem.IsDeleted)
            {
                return ServiceResult.ErrorResult("Sepet öğesi bulunamadı");
            }

            await _unitOfWork.CartItems.DeleteAsync(cartItem);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Product removed from cart successfully. UserId: {UserId}, ProductId: {ProductId}", userId, productId);

            return ServiceResult.SuccessResult("Ürün sepetten kaldırıldı");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing product from cart. UserId: {UserId}, ProductId: {ProductId}", userId, productId);
            return ServiceResult.ErrorResult("Ürün sepetten kaldırılırken bir hata oluştu");
        }
    }

    // Clear entire cart
    public async Task<ServiceResult> ClearCartAsync(int userId)
    {
        try
        {
            await _unitOfWork.CartItems.ClearUserCartAsync(userId);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Cart cleared successfully for user: {UserId}", userId);

            return ServiceResult.SuccessResult("Sepet temizlendi");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error clearing cart for user: {UserId}", userId);
            return ServiceResult.ErrorResult("Sepet temizlenirken bir hata oluştu");
        }
    }

    // Get cart total amount
    public async Task<decimal> GetCartTotalAsync(int userId)
    {
        return await _unitOfWork.CartItems.GetUserCartTotalAsync(userId);
    }

    // Get cart item count
    public async Task<int> GetCartItemCountAsync(int userId)
    {
        return await _unitOfWork.CartItems.GetUserCartItemCountAsync(userId);
    }
} 