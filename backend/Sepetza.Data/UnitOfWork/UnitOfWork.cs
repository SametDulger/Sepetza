using Microsoft.EntityFrameworkCore.Storage;
using Sepetza.Core.Interfaces;
using Sepetza.Data.Context;
using Sepetza.Data.Repositories;

namespace Sepetza.Data.UnitOfWork;

public class UnitOfWork : IUnitOfWork
{
    private readonly SepetzaDbContext _context;
    private IDbContextTransaction? _transaction;

    public UnitOfWork(SepetzaDbContext context)
    {
        _context = context;
        Users = new UserRepository(_context);
        Products = new ProductRepository(_context);
        ProductImages = new ProductImageRepository(_context);
        Categories = new CategoryRepository(_context);
        Orders = new OrderRepository(_context);
        OrderItems = new OrderItemRepository(_context);
        CartItems = new CartRepository(_context);
        Addresses = new AddressRepository(_context);
        Reviews = new ReviewRepository(_context);
        Favorites = new FavoriteRepository(_context);
    }

    public IUserRepository Users { get; private set; }
    public IProductRepository Products { get; private set; }
    public IProductImageRepository ProductImages { get; private set; }
    public ICategoryRepository Categories { get; private set; }
    public IOrderRepository Orders { get; private set; }
    public IOrderItemRepository OrderItems { get; private set; }
    public ICartRepository CartItems { get; private set; }
    public IAddressRepository Addresses { get; private set; }
    public IReviewRepository Reviews { get; private set; }
    public IFavoriteRepository Favorites { get; private set; }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public async Task BeginTransactionAsync()
    {
        _transaction = await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.CommitAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task RollbackTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        _context.Dispose();
    }
} 