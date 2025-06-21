using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Sepetza.Core.DTOs;
using Sepetza.Core.Entities;
using Sepetza.Core.Interfaces;
using Sepetza.Data.Context;

namespace Sepetza.Business.Services;

public class AdminService : IAdminService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly SepetzaDbContext _context;
    private readonly ILogger<AdminService> _logger;

    public AdminService(IUnitOfWork unitOfWork, SepetzaDbContext context, ILogger<AdminService> logger)
    {
        _unitOfWork = unitOfWork;
        _context = context;
        _logger = logger;
    }

    public async Task<AdminDashboardDto> GetDashboardDataAsync()
    {
        try
        {
            var totalUsers = await _context.Users.CountAsync();
            var totalProducts = await _context.Products.CountAsync();
            var totalCategories = await _context.Categories.CountAsync();
            var totalOrders = await _context.Orders.CountAsync();
            
            var totalRevenue = await _context.Orders
                .Where(o => o.Status == OrderStatus.Delivered)
                .SumAsync(o => o.TotalAmount);

            var recentOrders = await _context.Orders
                .Include(o => o.User)
                .OrderByDescending(o => o.CreatedDate)
                .Take(10)
                .Select(o => new RecentOrderDto
                {
                    Id = o.Id,
                    UserName = $"{o.User.FirstName} {o.User.LastName}",
                    TotalAmount = o.TotalAmount,
                    Status = o.Status,
                    CreatedDate = o.CreatedDate
                })
                .ToListAsync();

            return new AdminDashboardDto
            {
                TotalUsers = totalUsers,
                TotalProducts = totalProducts,
                TotalCategories = totalCategories,
                TotalOrders = totalOrders,
                TotalRevenue = totalRevenue,
                RecentOrders = recentOrders,
                TopProducts = new List<TopProductDto>()
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting dashboard data");
            throw;
        }
    }

    public async Task<AdminPagedResult<AdminProductDto>> GetProductsAsync(int page = 1, int pageSize = 20, string? search = null, int? categoryId = null)
    {
        try
        {
            var query = _context.Products
                .Include(p => p.Category)
                .Include(p => p.ProductImages)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(p => p.Name.Contains(search));
            }

            if (categoryId.HasValue)
            {
                query = query.Where(p => p.CategoryId == categoryId.Value);
            }

            var totalCount = await query.CountAsync();
            var products = await query
                .OrderByDescending(p => p.CreatedDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new AdminProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.StockQuantity,
                    IsActive = p.IsActive,
                    CategoryName = p.Category.Name,
                    CategoryId = p.CategoryId,
                    CreatedAt = p.CreatedDate,
                    UpdatedAt = p.UpdatedDate,
                    ImageUrl = p.ProductImages.FirstOrDefault(pi => pi.IsMain) != null 
                        ? p.ProductImages.FirstOrDefault(pi => pi.IsMain)!.ImageUrl 
                        : p.ProductImages.FirstOrDefault() != null 
                            ? p.ProductImages.FirstOrDefault()!.ImageUrl 
                            : string.Empty
                })
                .ToListAsync();

            return new AdminPagedResult<AdminProductDto>
            {
                Data = products,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting products");
            throw;
        }
    }

    public async Task<AdminProductDto?> GetProductByIdAsync(int id)
    {
        try
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.ProductImages)
                .Where(p => p.Id == id)
                .Select(p => new AdminProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.StockQuantity,
                    IsActive = p.IsActive,
                    CategoryName = p.Category.Name,
                    CategoryId = p.CategoryId,
                    CreatedAt = p.CreatedDate,
                    UpdatedAt = p.UpdatedDate,
                    ImageUrl = p.ProductImages.FirstOrDefault(pi => pi.IsMain) != null 
                        ? p.ProductImages.FirstOrDefault(pi => pi.IsMain)!.ImageUrl 
                        : p.ProductImages.FirstOrDefault() != null 
                            ? p.ProductImages.FirstOrDefault()!.ImageUrl 
                            : string.Empty
                })
                .FirstOrDefaultAsync();

            return product;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting product by id: {ProductId}", id);
            throw;
        }
    }

    public async Task<(bool Success, string Message)> CreateProductAsync(CreateProductRequest request)
    {
        try
        {
            var product = new Product
            {
                Name = request.Name.Trim(),
                Description = request.Description.Trim(),
                Price = request.Price,
                StockQuantity = request.StockQuantity,
                CategoryId = request.CategoryId,
                IsActive = request.IsActive
            };

            await _unitOfWork.Products.AddAsync(product);
            await _unitOfWork.SaveChangesAsync();

            return (true, "Ürün başarıyla oluşturuldu.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating product");
            return (false, "Ürün oluşturulurken bir hata oluştu.");
        }
    }

    public async Task<(bool Success, string Message)> UpdateProductAsync(int id, UpdateProductRequest request)
    {
        try
        {
            var product = await _unitOfWork.Products.GetByIdAsync(id);
            if (product == null)
            {
                return (false, "Ürün bulunamadı.");
            }

            product.Name = request.Name.Trim();
            product.Description = request.Description.Trim();
            product.Price = request.Price;
            product.StockQuantity = request.StockQuantity;
            product.CategoryId = request.CategoryId;
            product.IsActive = request.IsActive;
            product.UpdatedDate = DateTime.UtcNow;

            await _unitOfWork.Products.UpdateAsync(product);
            await _unitOfWork.SaveChangesAsync();

            return (true, "Ürün başarıyla güncellendi.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating product: {ProductId}", id);
            return (false, "Ürün güncellenirken bir hata oluştu.");
        }
    }

    public async Task<(bool Success, string Message)> DeleteProductAsync(int id)
    {
        try
        {
            var product = await _unitOfWork.Products.GetByIdAsync(id);
            if (product == null)
            {
                return (false, "Ürün bulunamadı.");
            }

            product.IsDeleted = true;
            product.UpdatedDate = DateTime.UtcNow;

            await _unitOfWork.Products.UpdateAsync(product);
            await _unitOfWork.SaveChangesAsync();

            return (true, "Ürün başarıyla silindi.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting product: {ProductId}", id);
            return (false, "Ürün silinirken bir hata oluştu.");
        }
    }

    public async Task<(bool Success, string Message)> ToggleProductStatusAsync(int id)
    {
        try
        {
            var product = await _unitOfWork.Products.GetByIdAsync(id);
            if (product == null)
            {
                return (false, "Ürün bulunamadı.");
            }

            product.IsActive = !product.IsActive;
            product.UpdatedDate = DateTime.UtcNow;

            await _unitOfWork.Products.UpdateAsync(product);
            await _unitOfWork.SaveChangesAsync();

            return (true, "Ürün durumu güncellendi.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error toggling product status: {ProductId}", id);
            return (false, "Ürün durumu güncellenirken bir hata oluştu.");
        }
    }

    // Basit kategori implementasyonları
    public async Task<AdminPagedResult<AdminCategoryDto>> GetCategoriesAsync(int page = 1, int pageSize = 20, string? search = null)
    {
        try
        {
            var query = _context.Categories
                .Include(c => c.ParentCategory)
                .Include(c => c.Products)
                .Where(c => !c.IsDeleted)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(c => c.Name.Contains(search));
            }

            var totalCount = await query.CountAsync();
            var categories = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(c => new AdminCategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    IsActive = c.IsActive,
                    CreatedAt = c.CreatedDate,
                    ParentCategoryName = c.ParentCategory != null ? c.ParentCategory.Name : null,
                    ProductCount = c.Products.Count(p => !p.IsDeleted)
                })
                .ToListAsync();

            return new AdminPagedResult<AdminCategoryDto>
            {
                Data = categories,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting categories");
            throw;
        }
    }

    public async Task<List<AdminCategoryDto>> GetCategoriesHierarchyAsync()
    {
        try
        {
            var mainCategories = await _context.Categories
                .Where(c => c.ParentCategoryId == null && !c.IsDeleted)
                .Include(c => c.SubCategories.Where(sc => !sc.IsDeleted))
                .Select(c => new AdminCategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    IsActive = c.IsActive,
                    CreatedAt = c.CreatedDate,
                    SubCategories = c.SubCategories.Select(sc => new AdminCategoryDto
                    {
                        Id = sc.Id,
                        Name = sc.Name,
                        Description = sc.Description,
                        IsActive = sc.IsActive,
                        CreatedAt = sc.CreatedDate,
                        ParentCategoryId = sc.ParentCategoryId
                    }).ToList()
                })
                .ToListAsync();

            return mainCategories;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting categories hierarchy");
            throw;
        }
    }

    public async Task<AdminCategoryDto?> GetCategoryByIdAsync(int id)
    {
        try
        {
            var category = await _context.Categories
                .Where(c => c.Id == id)
                .Select(c => new AdminCategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    IsActive = c.IsActive,
                    CreatedAt = c.CreatedDate,
                    ParentCategoryId = c.ParentCategoryId
                })
                .FirstOrDefaultAsync();

            return category;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting category by id: {CategoryId}", id);
            throw;
        }
    }

    public async Task<(bool Success, string Message)> CreateCategoryAsync(CreateCategoryRequest request)
    {
        try
        {
            var category = new Category
            {
                Name = request.Name.Trim(),
                Description = request.Description.Trim(),
                ParentCategoryId = request.ParentCategoryId,
                DisplayOrder = request.DisplayOrder,
                IsActive = request.IsActive
            };

            await _unitOfWork.Categories.AddAsync(category);
            await _unitOfWork.SaveChangesAsync();

            return (true, "Kategori başarıyla oluşturuldu.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating category");
            return (false, "Kategori oluşturulurken bir hata oluştu.");
        }
    }

    public async Task<(bool Success, string Message)> UpdateCategoryAsync(int id, UpdateCategoryRequest request)
    {
        try
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            if (category == null)
            {
                return (false, "Kategori bulunamadı.");
            }

            category.Name = request.Name.Trim();
            category.Description = request.Description.Trim();
            category.ParentCategoryId = request.ParentCategoryId;
            category.DisplayOrder = request.DisplayOrder;
            category.IsActive = request.IsActive;
            category.UpdatedDate = DateTime.UtcNow;

            await _unitOfWork.Categories.UpdateAsync(category);
            await _unitOfWork.SaveChangesAsync();

            return (true, "Kategori başarıyla güncellendi.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating category: {CategoryId}", id);
            return (false, "Kategori güncellenirken bir hata oluştu.");
        }
    }

    public async Task<(bool Success, string Message)> DeleteCategoryAsync(int id)
    {
        try
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            if (category == null)
            {
                return (false, "Kategori bulunamadı.");
            }

            category.IsDeleted = true;
            category.UpdatedDate = DateTime.UtcNow;

            await _unitOfWork.Categories.UpdateAsync(category);
            await _unitOfWork.SaveChangesAsync();

            return (true, "Kategori başarıyla silindi.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting category: {CategoryId}", id);
            return (false, "Kategori silinirken bir hata oluştu.");
        }
    }

    public async Task<(bool Success, string Message)> ToggleCategoryStatusAsync(int id)
    {
        try
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            if (category == null)
            {
                return (false, "Kategori bulunamadı.");
            }

            category.IsActive = !category.IsActive;
            category.UpdatedDate = DateTime.UtcNow;

            await _unitOfWork.Categories.UpdateAsync(category);
            await _unitOfWork.SaveChangesAsync();

            return (true, "Kategori durumu güncellendi.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error toggling category status: {CategoryId}", id);
            return (false, "Kategori durumu güncellenirken bir hata oluştu.");
        }
    }

    // Basit kullanıcı implementasyonları
    public async Task<AdminPagedResult<AdminUserDto>> GetUsersAsync(int page = 1, int pageSize = 20, string? search = null, UserRole? role = null)
    {
        try
        {
            var query = _context.Users.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(u => u.FirstName.Contains(search) || u.LastName.Contains(search) || u.Email.Contains(search));
            }

            if (role.HasValue)
            {
                query = query.Where(u => u.Role == role.Value);
            }

            var totalCount = await query.CountAsync();
            var users = await query
                .OrderByDescending(u => u.CreatedDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new AdminUserDto
                {
                    Id = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email,
                    PhoneNumber = u.PhoneNumber,
                    DateOfBirth = u.DateOfBirth,
                    Role = u.Role,
                    CreatedAt = u.CreatedDate,
                    UpdatedAt = u.UpdatedDate,
                    IsActive = !u.IsDeleted,
                    IsDeleted = u.IsDeleted
                })
                .ToListAsync();

            return new AdminPagedResult<AdminUserDto>
            {
                Data = users,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting users");
            throw;
        }
    }

    public async Task<AdminUserDto?> GetUserByIdAsync(int id)
    {
        try
        {
            var user = await _context.Users
                .Where(u => u.Id == id)
                .Select(u => new AdminUserDto
                {
                    Id = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email,
                    PhoneNumber = u.PhoneNumber,
                    DateOfBirth = u.DateOfBirth,
                    Role = u.Role,
                    CreatedAt = u.CreatedDate,
                    UpdatedAt = u.UpdatedDate,
                    IsActive = !u.IsDeleted,
                    IsDeleted = u.IsDeleted
                })
                .FirstOrDefaultAsync();

            return user;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user by id: {UserId}", id);
            throw;
        }
    }

    public async Task<(bool Success, string Message)> UpdateUserAsync(int id, UpdateUserRequest request)
    {
        try
        {
            var user = await _unitOfWork.Users.GetByIdAsync(id);
            if (user == null)
            {
                return (false, "Kullanıcı bulunamadı.");
            }

            user.FirstName = request.FirstName.Trim();
            user.LastName = request.LastName.Trim();
            user.Email = request.Email.Trim().ToLowerInvariant();
            user.PhoneNumber = request.PhoneNumber.Trim();
            user.DateOfBirth = request.DateOfBirth;
            user.Role = request.Role;
            user.UpdatedDate = DateTime.UtcNow;

            await _unitOfWork.Users.UpdateAsync(user);
            await _unitOfWork.SaveChangesAsync();

            return (true, "Kullanıcı başarıyla güncellendi.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user: {UserId}", id);
            return (false, "Kullanıcı güncellenirken bir hata oluştu.");
        }
    }

    public async Task<(bool Success, string Message)> DeleteUserAsync(int id)
    {
        try
        {
            var user = await _unitOfWork.Users.GetByIdAsync(id);
            if (user == null)
            {
                return (false, "Kullanıcı bulunamadı.");
            }

            user.IsDeleted = true;
            user.UpdatedDate = DateTime.UtcNow;

            await _unitOfWork.Users.UpdateAsync(user);
            await _unitOfWork.SaveChangesAsync();

            return (true, "Kullanıcı başarıyla silindi.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting user: {UserId}", id);
            return (false, "Kullanıcı silinirken bir hata oluştu.");
        }
    }

    public async Task<(bool Success, string Message)> ToggleUserStatusAsync(int id)
    {
        try
        {
            var user = await _unitOfWork.Users.GetByIdAsync(id);
            if (user == null)
            {
                return (false, "Kullanıcı bulunamadı.");
            }

            user.IsDeleted = !user.IsDeleted;
            user.UpdatedDate = DateTime.UtcNow;

            await _unitOfWork.Users.UpdateAsync(user);
            await _unitOfWork.SaveChangesAsync();

            return (true, "Kullanıcı durumu güncellendi.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error toggling user status: {UserId}", id);
            return (false, "Kullanıcı durumu güncellenirken bir hata oluştu.");
        }
    }

    // Basit sipariş implementasyonları
    public async Task<AdminPagedResult<AdminOrderDto>> GetOrdersAsync(int page = 1, int pageSize = 20, string? search = null, OrderStatus? status = null)
    {
        try
        {
            var query = _context.Orders
                .Include(o => o.User)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(o => o.User.FirstName.Contains(search) || o.User.LastName.Contains(search));
            }

            if (status.HasValue)
            {
                query = query.Where(o => o.Status == status.Value);
            }

            var totalCount = await query.CountAsync();
            var orders = await query
                .OrderByDescending(o => o.CreatedDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(o => new AdminOrderDto
                {
                    Id = o.Id,
                    UserName = $"{o.User.FirstName} {o.User.LastName}",
                    UserEmail = o.User.Email,
                    TotalAmount = o.TotalAmount,
                    Status = o.Status,
                    CreatedAt = o.CreatedDate,
                    UpdatedAt = o.UpdatedDate
                })
                .ToListAsync();

            return new AdminPagedResult<AdminOrderDto>
            {
                Data = orders,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting orders");
            throw;
        }
    }

    public async Task<AdminOrderDto?> GetOrderByIdAsync(int id)
    {
        try
        {
            var order = await _context.Orders
                .Include(o => o.User)
                .Where(o => o.Id == id)
                .Select(o => new AdminOrderDto
                {
                    Id = o.Id,
                    UserName = $"{o.User.FirstName} {o.User.LastName}",
                    UserEmail = o.User.Email,
                    TotalAmount = o.TotalAmount,
                    Status = o.Status,
                    CreatedAt = o.CreatedDate,
                    UpdatedAt = o.UpdatedDate
                })
                .FirstOrDefaultAsync();

            return order;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting order by id: {OrderId}", id);
            throw;
        }
    }

    public async Task<(bool Success, string Message)> UpdateOrderStatusAsync(int id, UpdateOrderStatusRequest request)
    {
        try
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);
            if (order == null)
            {
                return (false, "Sipariş bulunamadı.");
            }

            order.Status = request.Status;
            order.UpdatedDate = DateTime.UtcNow;

            await _unitOfWork.Orders.UpdateAsync(order);
            await _unitOfWork.SaveChangesAsync();

            return (true, "Sipariş durumu başarıyla güncellendi.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating order status: {OrderId}", id);
            return (false, "Sipariş durumu güncellenirken bir hata oluştu.");
        }
    }
} 