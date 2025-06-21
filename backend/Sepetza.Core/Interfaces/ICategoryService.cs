using Sepetza.Core.Entities;

namespace Sepetza.Core.Interfaces;

public interface ICategoryService
{
    Task<IEnumerable<Category>> GetAllCategoriesAsync();
    Task<IEnumerable<Category>> GetActiveCategoriesAsync();
    Task<IEnumerable<Category>> GetMainCategoriesWithSubCategoriesAsync();
    Task<Category?> GetCategoryByIdAsync(int categoryId);
    Task<Category?> GetCategoryWithProductsAsync(int categoryId);
    Task<Category?> GetCategoryWithSubCategoriesAsync(int categoryId);
    Task<IEnumerable<Category>> GetSubCategoriesByParentIdAsync(int parentId);
    void ClearCache();
} 