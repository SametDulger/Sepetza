using Microsoft.EntityFrameworkCore;
using Sepetza.Core.Entities;
using Sepetza.Core.Interfaces;
using Sepetza.Data.Context;

namespace Sepetza.Data.Repositories;

public class ProductImageRepository : GenericRepository<ProductImage>, IProductImageRepository
{
    public ProductImageRepository(SepetzaDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<ProductImage>> GetImagesByProductIdAsync(int productId)
    {
        return await _dbSet
            .Where(pi => pi.ProductId == productId)
            .OrderBy(pi => pi.DisplayOrder)
            .ToListAsync();
    }

    public async Task<ProductImage?> GetMainImageByProductIdAsync(int productId)
    {
        return await _dbSet
            .FirstOrDefaultAsync(pi => pi.ProductId == productId && pi.IsMain);
    }
} 