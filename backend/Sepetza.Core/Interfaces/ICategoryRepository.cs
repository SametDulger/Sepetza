using Sepetza.Core.Entities;

namespace Sepetza.Core.Interfaces;

public interface ICategoryRepository : IGenericRepository<Category>
{
    Task<IEnumerable<Category>> GetActiveCategoriesAsync();
    Task<Category?> GetCategoryWithProductsAsync(int categoryId);
    Task<IEnumerable<Category>> GetCategoriesOrderedByDisplayOrderAsync();
    Task<IEnumerable<Category>> GetMainCategoriesWithSubCategoriesAsync();
    Task<IEnumerable<Category>> GetSubCategoriesByParentIdAsync(int parentId);
    Task<Category?> GetCategoryWithSubCategoriesAsync(int categoryId);
} 