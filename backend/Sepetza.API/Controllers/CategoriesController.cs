using Microsoft.AspNetCore.Mvc;
using Sepetza.Core.Interfaces;
using Microsoft.Extensions.Logging;

namespace Sepetza.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : BaseController
{
    private readonly ICategoryService _categoryService;
    private readonly ILogger<CategoriesController> _logger;

    public CategoriesController(ICategoryService categoryService, ILogger<CategoriesController> logger)
    {
        _categoryService = categoryService;
        _logger = logger;
    }

    // Get all categories with subcategories
    [HttpGet]
    public async Task<IActionResult> GetCategories()
    {
        try
        {
            var categories = await _categoryService.GetMainCategoriesWithSubCategoriesAsync();
            return Ok(new { data = categories, success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting categories");
            return StatusCode(500, "Kategoriler getirilirken bir hata oluştu");
        }
    }

    // Get single category by ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetCategory(int id)
    {
        try
        {
            var category = await _categoryService.GetCategoryWithSubCategoriesAsync(id);
            if (category == null)
            {
                return NotFound(new { message = "Kategori bulunamadı.", success = false });
            }

            return Ok(new { data = category, success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting category with ID: {CategoryId}", id);
            return StatusCode(500, "Kategori getirilirken bir hata oluştu");
        }
    }

    // Get subcategories by parent ID
    [HttpGet("{parentId}/subcategories")]
    public async Task<IActionResult> GetSubCategories(int parentId)
    {
        try
        {
            var subCategories = await _categoryService.GetSubCategoriesByParentIdAsync(parentId);
            return Ok(new { data = subCategories, success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting subcategories for category: {CategoryId}", parentId);
            return StatusCode(500, "Alt kategoriler getirilirken bir hata oluştu");
        }
    }

    // Get main categories
    [HttpGet("main")]
    public async Task<IActionResult> GetMainCategories()
    {
        try
        {
            var mainCategories = await _categoryService.GetMainCategoriesWithSubCategoriesAsync();
            return Ok(new { data = mainCategories, success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting main categories");
            return StatusCode(500, "Ana kategoriler getirilirken bir hata oluştu");
        }
    }

    // Clear categories cache
    [HttpPost("clear-cache")]
    public IActionResult ClearCache()
    {
        try
        {
            _categoryService.ClearCache();
            return Ok(new { message = "Cache temizlendi", success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error clearing cache");
            return StatusCode(500, "Cache temizlenirken bir hata oluştu");
        }
    }
} 