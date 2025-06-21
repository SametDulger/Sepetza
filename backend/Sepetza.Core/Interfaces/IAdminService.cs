using Sepetza.Core.DTOs;
using Sepetza.Core.Entities;

namespace Sepetza.Core.Interfaces;

public interface IAdminService
{
    // Dashboard
    Task<AdminDashboardDto> GetDashboardDataAsync();
    
    // Product Management
    Task<AdminPagedResult<AdminProductDto>> GetProductsAsync(int page = 1, int pageSize = 20, string? search = null, int? categoryId = null);
    Task<AdminProductDto?> GetProductByIdAsync(int id);
    Task<(bool Success, string Message)> CreateProductAsync(CreateProductRequest request);
    Task<(bool Success, string Message)> UpdateProductAsync(int id, UpdateProductRequest request);
    Task<(bool Success, string Message)> DeleteProductAsync(int id);
    Task<(bool Success, string Message)> ToggleProductStatusAsync(int id);
    
    // Category Management
    Task<AdminPagedResult<AdminCategoryDto>> GetCategoriesAsync(int page = 1, int pageSize = 20, string? search = null);
    Task<List<AdminCategoryDto>> GetCategoriesHierarchyAsync();
    Task<AdminCategoryDto?> GetCategoryByIdAsync(int id);
    Task<(bool Success, string Message)> CreateCategoryAsync(CreateCategoryRequest request);
    Task<(bool Success, string Message)> UpdateCategoryAsync(int id, UpdateCategoryRequest request);
    Task<(bool Success, string Message)> DeleteCategoryAsync(int id);
    Task<(bool Success, string Message)> ToggleCategoryStatusAsync(int id);
    
    // User Management
    Task<AdminPagedResult<AdminUserDto>> GetUsersAsync(int page = 1, int pageSize = 20, string? search = null, UserRole? role = null);
    Task<AdminUserDto?> GetUserByIdAsync(int id);
    Task<(bool Success, string Message)> UpdateUserAsync(int id, UpdateUserRequest request);
    Task<(bool Success, string Message)> DeleteUserAsync(int id);
    Task<(bool Success, string Message)> ToggleUserStatusAsync(int id);
    
    // Order Management
    Task<AdminPagedResult<AdminOrderDto>> GetOrdersAsync(int page = 1, int pageSize = 20, string? search = null, OrderStatus? status = null);
    Task<AdminOrderDto?> GetOrderByIdAsync(int id);
    Task<(bool Success, string Message)> UpdateOrderStatusAsync(int id, UpdateOrderStatusRequest request);
} 