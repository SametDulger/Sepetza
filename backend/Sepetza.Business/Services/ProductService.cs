using Sepetza.Core.Entities;
using Sepetza.Core.Interfaces;
using Microsoft.Extensions.Logging;
using Sepetza.Core.Constants;

namespace Sepetza.Business.Services;

public class ProductService : IProductService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<ProductService> _logger;

    public ProductService(IUnitOfWork unitOfWork, ILogger<ProductService> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    // Get all products
    public async Task<IEnumerable<Product>> GetAllProductsAsync()
    {
        return await _unitOfWork.Products.GetAllAsync();
    }

    // Get product by ID
    public async Task<Product?> GetProductByIdAsync(int id)
    {
        return await _unitOfWork.Products.GetByIdAsync(id);
    }

    // Get featured products
    public async Task<IEnumerable<Product>> GetFeaturedProductsAsync(int count = 10)
    {
        return await _unitOfWork.Products.GetFeaturedProductsAsync(count);
    }

    // Get products by category
    public async Task<IEnumerable<Product>> GetProductsByCategoryAsync(int categoryId, int page = 1, int pageSize = 20)
    {
        return await _unitOfWork.Products.GetProductsByCategoryAsync(categoryId, page, pageSize);
    }

    // Search products by term
    public async Task<IEnumerable<Product>> SearchProductsAsync(string searchTerm, int page = 1, int pageSize = 20)
    {
        return await _unitOfWork.Products.SearchProductsAsync(searchTerm, page, pageSize);
    }

    // Get products with pagination
    public async Task<IEnumerable<Product>> GetProductsWithPaginationAsync(int pageNumber, int pageSize)
    {
        try
        {
            // Validate pagination parameters
            if (pageNumber < PaginationConstants.MIN_PAGE_SIZE) pageNumber = PaginationConstants.DEFAULT_PAGE_NUMBER;
            if (pageSize < PaginationConstants.MIN_PAGE_SIZE) pageSize = PaginationConstants.DEFAULT_PAGE_SIZE;
            if (pageSize > PaginationConstants.MAX_PAGE_SIZE) pageSize = PaginationConstants.MAX_PAGE_SIZE;

            // Use repository method that includes images to avoid N+1 problem
            return await _unitOfWork.Products.GetProductsWithPaginationAsync(pageNumber, pageSize);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting products with pagination. PageNumber: {PageNumber}, PageSize: {PageSize}", pageNumber, pageSize);
            return new List<Product>();
        }
    }

    // Get product with images
    public async Task<Product?> GetProductWithImagesAsync(int productId)
    {
        return await _unitOfWork.Products.GetProductWithImagesAsync(productId);
    }

    // Get product with reviews
    public async Task<Product?> GetProductWithReviewsAsync(int productId)
    {
        return await _unitOfWork.Products.GetProductWithReviewsAsync(productId);
    }

    // Get products by main category
    public async Task<IEnumerable<Product>> GetProductsByMainCategoryAsync(int mainCategoryId)
    {
        return await _unitOfWork.Products.GetProductsByMainCategoryAsync(mainCategoryId);
    }

    // Get products by category with pagination
    public async Task<IEnumerable<Product>> GetProductsByCategoryWithPaginationAsync(int categoryId, int pageNumber, int pageSize)
    {
        return await _unitOfWork.Products.GetProductsByCategoryWithPaginationAsync(categoryId, pageNumber, pageSize);
    }

    // Get products by category including subcategories
    public async Task<IEnumerable<Product>> GetProductsByCategoryIncludingSubcategoriesAsync(int categoryId, int pageNumber, int pageSize)
    {
        try
        {
            return await _unitOfWork.Products.GetProductsByCategoryIncludingSubcategoriesAsync(categoryId, pageNumber, pageSize);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting products by category including subcategories. CategoryId: {CategoryId}, PageNumber: {PageNumber}, PageSize: {PageSize}", categoryId, pageNumber, pageSize);
            return new List<Product>();
        }
    }
} 