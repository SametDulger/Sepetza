using Sepetza.Core.Entities;

namespace Sepetza.Core.Interfaces;

public interface IProductRepository : IGenericRepository<Product>
{
    Task<IEnumerable<Product>> GetProductsByCategoryAsync(int categoryId, int page = 1, int pageSize = 20);
    Task<IEnumerable<Product>> GetProductsByMainCategoryAsync(int mainCategoryId);
    Task<IEnumerable<Product>> GetFeaturedProductsAsync(int count = 10);
    Task<IEnumerable<Product>> SearchProductsAsync(string searchTerm, int page = 1, int pageSize = 20);
    Task<Product?> GetProductWithImagesAsync(int productId);
    Task<Product?> GetProductWithReviewsAsync(int productId);
    Task<IEnumerable<Product>> GetProductsWithPaginationAsync(int pageNumber, int pageSize);
    Task<IEnumerable<Product>> GetProductsByCategoryWithPaginationAsync(int categoryId, int pageNumber, int pageSize);
    Task<IEnumerable<Product>> GetProductsByCategoryIncludingSubcategoriesAsync(int categoryId, int pageNumber, int pageSize);
    Task<int> GetTotalCountAsync();
} 