using Sepetza.Core.Entities;

namespace Sepetza.Core.Interfaces;

public interface IProductImageRepository : IGenericRepository<ProductImage>
{
    Task<IEnumerable<ProductImage>> GetImagesByProductIdAsync(int productId);
    Task<ProductImage?> GetMainImageByProductIdAsync(int productId);
} 