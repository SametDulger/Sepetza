using Sepetza.Core.Entities;
using Sepetza.Core.Interfaces;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Caching.Memory;
using Sepetza.Core.Constants;

namespace Sepetza.Business.Services;

public class CategoryService : ICategoryService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CategoryService> _logger;
    private readonly IMemoryCache _cache;

    public CategoryService(IUnitOfWork unitOfWork, ILogger<CategoryService> logger, IMemoryCache cache)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
        _cache = cache;
    }

    // Get all categories
    public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
    {
        return await _unitOfWork.Categories.GetAllAsync();
    }

    // Get active categories only
    public async Task<IEnumerable<Category>> GetActiveCategoriesAsync()
    {
        return await _unitOfWork.Categories.GetActiveCategoriesAsync();
    }

    // Get main categories with subcategories (cached)
    public async Task<IEnumerable<Category>> GetMainCategoriesWithSubCategoriesAsync()
    {
        return await _cache.GetOrCreateAsync(CacheConstants.CATEGORIES_CACHE_KEY, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(CacheConstants.CATEGORIES_CACHE_MINUTES);
            _logger.LogInformation("Loading categories from database");
            return await _unitOfWork.Categories.GetMainCategoriesWithSubCategoriesAsync();
        }) ?? new List<Category>();
    }

    // Get category by ID
    public async Task<Category?> GetCategoryByIdAsync(int categoryId)
    {
        return await _unitOfWork.Categories.GetByIdAsync(categoryId);
    }

    // Get category with products
    public async Task<Category?> GetCategoryWithProductsAsync(int categoryId)
    {
        return await _unitOfWork.Categories.GetCategoryWithProductsAsync(categoryId);
    }

    // Get category with subcategories
    public async Task<Category?> GetCategoryWithSubCategoriesAsync(int categoryId)
    {
        return await _unitOfWork.Categories.GetCategoryWithSubCategoriesAsync(categoryId);
    }

    // Get subcategories by parent ID
    public async Task<IEnumerable<Category>> GetSubCategoriesByParentIdAsync(int parentId)
    {
        return await _unitOfWork.Categories.GetSubCategoriesByParentIdAsync(parentId);
    }

    // Clear categories cache
    public void ClearCache()
    {
        _cache.Remove(CacheConstants.CATEGORIES_CACHE_KEY);
        _logger.LogInformation("Categories cache cleared");
    }
} 