using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Sepetza.Core.Interfaces;
using Microsoft.Extensions.Logging;
using Sepetza.Core.Constants;

namespace Sepetza.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[EnableRateLimiting("GeneralPolicy")]
public class ProductsController : BaseController
{
    private readonly IProductService _productService;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(IProductService productService, ILogger<ProductsController> logger)
    {
        _productService = productService;
        _logger = logger;
    }

    // Get products with pagination
    [HttpGet]
    public async Task<IActionResult> GetProducts([FromQuery] int page = PaginationConstants.DEFAULT_PAGE_NUMBER, [FromQuery] int pageSize = PaginationConstants.DEFAULT_PAGE_SIZE)
    {
        try
        {
            var products = await _productService.GetProductsWithPaginationAsync(page, pageSize);
            return Ok(new { data = products, success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting products");
            return StatusCode(500, "Ürünler getirilirken bir hata oluştu");
        }
    }

    // Get single product by ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetProduct(int id)
    {
        try
        {
            var product = await _productService.GetProductWithImagesAsync(id);
            if (product == null)
            {
                return NotFound(new { message = "Ürün bulunamadı.", success = false });
            }

            return Ok(new { data = product, success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting product with ID: {ProductId}", id);
            return StatusCode(500, "Ürün getirilirken bir hata oluştu");
        }
    }

    // Get featured products
    [HttpGet("featured")]
    public async Task<IActionResult> GetFeaturedProducts()
    {
        try
        {
            var products = await _productService.GetFeaturedProductsAsync();
            return Ok(new { data = products, success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting featured products");
            return StatusCode(500, "Öne çıkan ürünler getirilirken bir hata oluştu");
        }
    }

    // Get products by category
    [HttpGet("category/{categoryId}")]
    public async Task<IActionResult> GetProductsByCategory(int categoryId, [FromQuery] int page = 1, [FromQuery] int pageSize = 12)
    {
        try
        {
            // Kategorinin ana kategori mi alt kategori mi olduğunu kontrol et
            var products = await _productService.GetProductsByCategoryIncludingSubcategoriesAsync(categoryId, page, pageSize);
            return Ok(new { data = products, success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting products by category: {CategoryId}", categoryId);
            return StatusCode(500, "Kategori ürünleri getirilirken bir hata oluştu");
        }
    }

    // Search products
    [HttpGet("search")]
    public async Task<IActionResult> SearchProducts([FromQuery] string q)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(q))
            {
                return BadRequest(new { message = "Arama terimi boş olamaz.", success = false });
            }

            var products = await _productService.SearchProductsAsync(q);
            return Ok(new { data = products, success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching products with term: {SearchTerm}", q);
            return StatusCode(500, "Ürün arama sırasında bir hata oluştu");
        }
    }
} 