using Microsoft.EntityFrameworkCore;
using Sepetza.Core.Entities;
using Sepetza.Core.Interfaces;
using Sepetza.Data.Context;

namespace Sepetza.Data.Repositories;

public class OrderItemRepository : GenericRepository<OrderItem>, IOrderItemRepository
{
    public OrderItemRepository(SepetzaDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<OrderItem>> GetByOrderIdAsync(int orderId)
    {
        return await _dbSet
            .Include(oi => oi.Product)
            .Where(oi => oi.OrderId == orderId)
            .ToListAsync();
    }
} 