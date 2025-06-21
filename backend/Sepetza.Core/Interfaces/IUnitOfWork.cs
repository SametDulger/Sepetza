namespace Sepetza.Core.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IUserRepository Users { get; }
    IProductRepository Products { get; }
    IProductImageRepository ProductImages { get; }
    ICategoryRepository Categories { get; }
    IOrderRepository Orders { get; }
    IOrderItemRepository OrderItems { get; }
    ICartRepository CartItems { get; }
    IAddressRepository Addresses { get; }
    IReviewRepository Reviews { get; }
    IFavoriteRepository Favorites { get; }
    
    Task<int> SaveChangesAsync();
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
} 