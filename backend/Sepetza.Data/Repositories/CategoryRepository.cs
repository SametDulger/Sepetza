using Microsoft.EntityFrameworkCore;
using Sepetza.Core.Entities;
using Sepetza.Core.Interfaces;
using Sepetza.Data.Context;

namespace Sepetza.Data.Repositories;

public class CategoryRepository : GenericRepository<Category>, ICategoryRepository
{
    public CategoryRepository(SepetzaDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Category>> GetActiveCategoriesAsync()
    {
        return await _dbSet
            .Where(c => c.IsActive)
            .OrderBy(c => c.DisplayOrder)
            .ToListAsync();
    }

    public async Task<Category?> GetCategoryWithProductsAsync(int categoryId)
    {
        return await _dbSet
            .Include(c => c.Products.Where(p => p.IsActive))
            .ThenInclude(p => p.ProductImages)
            .FirstOrDefaultAsync(c => c.Id == categoryId);
    }

    public async Task<IEnumerable<Category>> GetCategoriesOrderedByDisplayOrderAsync()
    {
        return await _dbSet
            .OrderBy(c => c.DisplayOrder)
            .ToListAsync();
    }

    public async Task<IEnumerable<Category>> GetMainCategoriesWithSubCategoriesAsync()
    {
        return await _dbSet
            .Where(c => c.IsActive && c.ParentCategoryId == null)
            .Include(c => c.SubCategories.Where(sc => sc.IsActive))
            .OrderBy(c => c.DisplayOrder)
            .ToListAsync();
    }

    public async Task<IEnumerable<Category>> GetSubCategoriesByParentIdAsync(int parentId)
    {
        return await _dbSet
            .Where(c => c.IsActive && c.ParentCategoryId == parentId)
            .OrderBy(c => c.DisplayOrder)
            .ToListAsync();
    }

    public async Task<Category?> GetCategoryWithSubCategoriesAsync(int categoryId)
    {
        return await _dbSet
            .Include(c => c.SubCategories.Where(sc => sc.IsActive))
            .Include(c => c.Products.Where(p => p.IsActive))
            .ThenInclude(p => p.ProductImages)
            .FirstOrDefaultAsync(c => c.Id == categoryId);
    }
} 