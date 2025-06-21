using Microsoft.EntityFrameworkCore;
using Sepetza.Core.Entities;
using Sepetza.Core.Interfaces;
using Sepetza.Data.Context;

namespace Sepetza.Data.Repositories;

public class ProductRepository : GenericRepository<Product>, IProductRepository
{
    public ProductRepository(SepetzaDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Product>> GetProductsByCategoryAsync(int categoryId, int page = 1, int pageSize = 20)
    {
        return await _dbSet
            .Where(p => p.CategoryId == categoryId && p.IsActive && !p.IsDeleted)
            .Include(p => p.ProductImages)
            .Include(p => p.Category)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> GetProductsByMainCategoryAsync(int mainCategoryId)
    {
        // Ana kategorinin alt kategorilerini bul
        var subCategoryIds = await _context.Categories
            .Where(c => c.ParentCategoryId == mainCategoryId)
            .Select(c => c.Id)
            .ToListAsync();

        // Alt kategorilerdeki tüm ürünleri getir
        return await _dbSet
            .Where(p => subCategoryIds.Contains(p.CategoryId) && p.IsActive && !p.IsDeleted)
            .Include(p => p.ProductImages)
            .Include(p => p.Category)
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> GetFeaturedProductsAsync(int count = 10)
    {
        return await _dbSet
            .Where(p => p.IsFeatured && p.IsActive && !p.IsDeleted)
            .Include(p => p.ProductImages)
            .Include(p => p.Category)
            .Take(count)
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> SearchProductsAsync(string searchTerm, int page = 1, int pageSize = 20)
    {
        // Case-insensitive arama için ToLower() kullan
        var lowerSearchTerm = searchTerm.ToLower();
        
        return await _dbSet
            .Where(p => p.IsActive && !p.IsDeleted && 
                       (p.Name.ToLower().Contains(lowerSearchTerm) || 
                        p.Description.ToLower().Contains(lowerSearchTerm) || 
                        p.Brand.ToLower().Contains(lowerSearchTerm)))
            .Include(p => p.ProductImages)
            .Include(p => p.Category)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<Product?> GetProductWithImagesAsync(int productId)
    {
        return await _dbSet
            .Include(p => p.ProductImages)
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == productId && !p.IsDeleted);
    }

    public async Task<Product?> GetProductWithReviewsAsync(int productId)
    {
        return await _dbSet
            .Include(p => p.Reviews.Where(r => r.IsApproved))
            .ThenInclude(r => r.User)
            .Include(p => p.ProductImages)
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == productId);
    }

    public async Task<IEnumerable<Product>> GetProductsWithPaginationAsync(int pageNumber, int pageSize)
    {
        return await _dbSet
            .Where(p => p.IsActive && !p.IsDeleted)
            .Include(p => p.ProductImages)
            .Include(p => p.Category)
            .OrderBy(p => p.Name)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> GetProductsByCategoryWithPaginationAsync(int categoryId, int pageNumber, int pageSize)
    {
        return await _dbSet
            .Where(p => p.CategoryId == categoryId && p.IsActive && !p.IsDeleted)
            .Include(p => p.ProductImages)
            .Include(p => p.Category)
            .OrderBy(p => p.Name)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> GetProductsByCategoryIncludingSubcategoriesAsync(int categoryId, int pageNumber, int pageSize)
    {
        // Önce kategorinin alt kategorisi olup olmadığını kontrol et
        var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == categoryId);
        if (category == null)
        {
            return new List<Product>();
        }

        // Eğer ana kategori ise (ParentCategoryId == null), alt kategorilerindeki ürünleri de getir
        if (category.ParentCategoryId == null)
        {
            // Ana kategorinin alt kategorilerini bul
            var subCategoryIds = await _context.Categories
                .Where(c => c.ParentCategoryId == categoryId && c.IsActive)
                .Select(c => c.Id)
                .ToListAsync();

            // Ana kategoriye direkt bağlı ürünler + alt kategorilerdeki ürünler
            var categoryIds = new List<int> { categoryId };
            categoryIds.AddRange(subCategoryIds);

            return await _dbSet
                .Where(p => categoryIds.Contains(p.CategoryId) && p.IsActive && !p.IsDeleted)
                .Include(p => p.ProductImages)
                .Include(p => p.Category)
                .OrderBy(p => p.Name)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }
        else
        {
            // Alt kategori ise, sadece o kategorideki ürünleri getir
            return await GetProductsByCategoryWithPaginationAsync(categoryId, pageNumber, pageSize);
        }
    }

    public async Task<int> GetTotalCountAsync()
    {
        return await _dbSet
            .Where(p => p.IsActive && !p.IsDeleted)
            .CountAsync();
    }
} 