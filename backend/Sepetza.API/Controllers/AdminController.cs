using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Sepetza.Core.DTOs;
using Sepetza.Core.Entities;
using Sepetza.Core.Interfaces;

namespace Sepetza.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
[EnableRateLimiting("GeneralPolicy")]
public class AdminController : BaseController
{
    private readonly IAdminService _adminService;
    private readonly ILogger<AdminController> _logger;

    public AdminController(IAdminService adminService, ILogger<AdminController> logger)
    {
        _adminService = adminService;
        _logger = logger;
    }

    // Get dashboard data
    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        try
        {
            var dashboard = await _adminService.GetDashboardDataAsync();
            return Ok(new { data = dashboard, success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting dashboard data");
            return StatusCode(500, new { message = "Dashboard verileri alınırken bir hata oluştu", success = false });
        }
    }

    // Get products list
    [HttpGet("products")]
    public async Task<IActionResult> GetProducts([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? search = null, [FromQuery] int? categoryId = null)
    {
        try
        {
            var products = await _adminService.GetProductsAsync(page, pageSize, search, categoryId);
            return Ok(new { data = products, success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting products");
            return StatusCode(500, new { message = "Ürünler alınırken bir hata oluştu", success = false });
        }
    }

    // Get single product
    [HttpGet("products/{id}")]
    public async Task<IActionResult> GetProduct(int id)
    {
        try
        {
            var product = await _adminService.GetProductByIdAsync(id);
            if (product == null)
            {
                return NotFound(new { message = "Ürün bulunamadı", success = false });
            }

            return Ok(new { data = product, success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting product: {ProductId}", id);
            return StatusCode(500, new { message = "Ürün alınırken bir hata oluştu", success = false });
        }
    }

    // Create product
    [HttpPost("products")]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Geçersiz veri", errors = ModelState, success = false });
            }

            var result = await _adminService.CreateProductAsync(request);
            if (!result.Success)
            {
                return BadRequest(new { message = result.Message, success = false });
            }

            return Ok(new { message = result.Message, success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating product");
            return StatusCode(500, new { message = "Ürün oluşturulurken bir hata oluştu", success = false });
        }
    }

    // Update product
    [HttpPut("products/{id}")]
    public async Task<IActionResult> UpdateProduct(int id, [FromBody] UpdateProductRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Geçersiz veri", errors = ModelState, success = false });
            }

            var result = await _adminService.UpdateProductAsync(id, request);
            if (!result.Success)
            {
                return BadRequest(new { message = result.Message, success = false });
            }

            return Ok(new { message = result.Message, success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating product: {ProductId}", id);
            return StatusCode(500, new { message = "Ürün güncellenirken bir hata oluştu", success = false });
        }
    }

    // Delete product
    [HttpDelete("products/{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        try
        {
            var result = await _adminService.DeleteProductAsync(id);
            if (!result.Success)
            {
                return BadRequest(new { message = result.Message, success = false });
            }

            return Ok(new { message = result.Message, success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting product: {ProductId}", id);
            return StatusCode(500, new { message = "Ürün silinirken bir hata oluştu", success = false });
        }
    }

    // Toggle product status
    [HttpPatch("products/{id}/toggle-status")]
    public async Task<IActionResult> ToggleProductStatus(int id)
    {
        try
        {
            var result = await _adminService.ToggleProductStatusAsync(id);
            if (!result.Success)
            {
                return BadRequest(new { message = result.Message, success = false });
            }

            return Ok(new { message = result.Message, success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error toggling product status: {ProductId}", id);
            return StatusCode(500, new { message = "Ürün durumu güncellenirken bir hata oluştu", success = false });
        }
    }

    // Upload product image
    [HttpPost("products/upload-image")]
    public async Task<IActionResult> UploadProductImage(IFormFile image)
    {
        try
        {
            if (image == null || image.Length == 0)
            {
                return BadRequest(new { message = "Resim dosyası seçilmedi", success = false });
            }

            // Dosya boyutu kontrolü (5MB)
            if (image.Length > 5 * 1024 * 1024)
            {
                return BadRequest(new { message = "Dosya boyutu 5MB'dan küçük olmalıdır", success = false });
            }

            // Dosya tipi kontrolü
            var allowedTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/gif" };
            if (!allowedTypes.Contains(image.ContentType.ToLower()))
            {
                return BadRequest(new { message = "Sadece JPG, PNG ve GIF dosyaları desteklenir", success = false });
            }

            // Dosya adı oluştur
            var fileName = $"product_{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
            var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "products");
            
            // Klasör yoksa oluştur
            if (!Directory.Exists(uploadsPath))
            {
                Directory.CreateDirectory(uploadsPath);
            }

            var filePath = Path.Combine(uploadsPath, fileName);

            // Dosyayı kaydet
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            var imageUrl = $"/uploads/products/{fileName}";

            return Ok(new { imageUrl, success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading product image");
            return StatusCode(500, new { message = "Resim yüklenirken bir hata oluştu", success = false });
        }
    }

    // Get categories list
    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? search = null)
    {
        try
        {
            var categories = await _adminService.GetCategoriesAsync(page, pageSize, search);
            return Ok(new { data = categories, success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting categories");
            return StatusCode(500, new { message = "Kategoriler alınırken bir hata oluştu", success = false });
        }
    }

    // Get categories hierarchy
    [HttpGet("categories/hierarchy")]
    public async Task<IActionResult> GetCategoriesHierarchy()
    {
        try
        {
            var categories = await _adminService.GetCategoriesHierarchyAsync();
            return Ok(new { data = categories, success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting categories hierarchy");
            return StatusCode(500, new { message = "Kategori hiyerarşisi alınırken bir hata oluştu", success = false });
        }
    }

    // Get single category
    [HttpGet("categories/{id}")]
    public async Task<IActionResult> GetCategory(int id)
    {
        try
        {
            var category = await _adminService.GetCategoryByIdAsync(id);
            if (category == null)
            {
                return NotFound(new { message = "Kategori bulunamadı", success = false });
            }

            return Ok(new { data = category, success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting category: {CategoryId}", id);
            return StatusCode(500, new { message = "Kategori alınırken bir hata oluştu", success = false });
        }
    }

    // Create category
    [HttpPost("categories")]
    public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Geçersiz veri", errors = ModelState, success = false });
            }

            var result = await _adminService.CreateCategoryAsync(request);
            if (!result.Success)
            {
                return BadRequest(new { message = result.Message, success = false });
            }

            return Ok(new { message = result.Message, success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating category");
            return StatusCode(500, new { message = "Kategori oluşturulurken bir hata oluştu", success = false });
        }
    }

    // Update category
    [HttpPut("categories/{id}")]
    public async Task<IActionResult> UpdateCategory(int id, [FromBody] UpdateCategoryRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Geçersiz veri", errors = ModelState, success = false });
            }

            var result = await _adminService.UpdateCategoryAsync(id, request);
            if (!result.Success)
            {
                return BadRequest(new { message = result.Message, success = false });
            }

            return Ok(new { message = result.Message, success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating category: {CategoryId}", id);
            return StatusCode(500, new { message = "Kategori güncellenirken bir hata oluştu", success = false });
        }
    }

    // Delete category
    [HttpDelete("categories/{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        try
        {
            var result = await _adminService.DeleteCategoryAsync(id);
            if (!result.Success)
            {
                return BadRequest(new { message = result.Message, success = false });
            }

            return Ok(new { message = result.Message, success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting category: {CategoryId}", id);
            return StatusCode(500, new { message = "Kategori silinirken bir hata oluştu", success = false });
        }
    }

    // Toggle category status
    [HttpPatch("categories/{id}/toggle-status")]
    public async Task<IActionResult> ToggleCategoryStatus(int id)
    {
        try
        {
            var result = await _adminService.ToggleCategoryStatusAsync(id);
            if (!result.Success)
            {
                return BadRequest(new { message = result.Message, success = false });
            }

            return Ok(new { message = result.Message, success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error toggling category status: {CategoryId}", id);
            return StatusCode(500, new { message = "Kategori durumu güncellenirken bir hata oluştu", success = false });
        }
    }

    // Get users list
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? search = null, [FromQuery] UserRole? role = null)
    {
        try
        {
            var users = await _adminService.GetUsersAsync(page, pageSize, search, role);
            return Ok(new { data = users, success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting users");
            return StatusCode(500, new { message = "Kullanıcılar alınırken bir hata oluştu", success = false });
        }
    }

    // Get single user
    [HttpGet("users/{id}")]
    public async Task<IActionResult> GetUser(int id)
    {
        try
        {
            var user = await _adminService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "Kullanıcı bulunamadı", success = false });
            }

            return Ok(new { data = user, success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user: {UserId}", id);
            return StatusCode(500, new { message = "Kullanıcı alınırken bir hata oluştu", success = false });
        }
    }

    // Update user
    [HttpPut("users/{id}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Geçersiz veri", errors = ModelState, success = false });
            }

            var result = await _adminService.UpdateUserAsync(id, request);
            if (!result.Success)
            {
                return BadRequest(new { message = result.Message, success = false });
            }

            return Ok(new { message = result.Message, success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user: {UserId}", id);
            return StatusCode(500, new { message = "Kullanıcı güncellenirken bir hata oluştu", success = false });
        }
    }

    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        try
        {
            var result = await _adminService.DeleteUserAsync(id);
            if (!result.Success)
            {
                return BadRequest(new { message = result.Message, success = false });
            }

            return Ok(new { message = result.Message, success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting user: {UserId}", id);
            return StatusCode(500, new { message = "Kullanıcı silinirken bir hata oluştu", success = false });
        }
    }

    [HttpPatch("users/{id}/toggle-status")]
    public async Task<IActionResult> ToggleUserStatus(int id)
    {
        try
        {
            var result = await _adminService.ToggleUserStatusAsync(id);
            if (!result.Success)
            {
                return BadRequest(new { message = result.Message, success = false });
            }

            return Ok(new { message = result.Message, success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error toggling user status: {UserId}", id);
            return StatusCode(500, new { message = "Kullanıcı durumu güncellenirken bir hata oluştu", success = false });
        }
    }

    // Order Management
    [HttpGet("orders")]
    public async Task<IActionResult> GetOrders([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? search = null, [FromQuery] OrderStatus? status = null)
    {
        try
        {
            var orders = await _adminService.GetOrdersAsync(page, pageSize, search, status);
            return Ok(new { data = orders, success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting orders");
            return StatusCode(500, new { message = "Siparişler alınırken bir hata oluştu", success = false });
        }
    }

    [HttpGet("orders/{id}")]
    public async Task<IActionResult> GetOrder(int id)
    {
        try
        {
            var order = await _adminService.GetOrderByIdAsync(id);
            if (order == null)
            {
                return NotFound(new { message = "Sipariş bulunamadı", success = false });
            }

            return Ok(new { data = order, success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting order: {OrderId}", id);
            return StatusCode(500, new { message = "Sipariş alınırken bir hata oluştu", success = false });
        }
    }

    [HttpPatch("orders/{id}/status")]
    public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Geçersiz veri", errors = ModelState, success = false });
            }

            var result = await _adminService.UpdateOrderStatusAsync(id, request);
            if (!result.Success)
            {
                return BadRequest(new { message = result.Message, success = false });
            }

            return Ok(new { message = result.Message, success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating order status: {OrderId}", id);
            return StatusCode(500, new { message = "Sipariş durumu güncellenirken bir hata oluştu", success = false });
        }
    }
} 