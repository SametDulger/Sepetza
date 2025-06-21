using Sepetza.Core.Entities;

namespace Sepetza.Core.Interfaces;

public interface IUserRepository : IGenericRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
    Task<bool> EmailExistsAsync(string email);
    Task<User?> GetUserWithOrdersAsync(int userId);
    Task<User?> GetUserWithAddressesAsync(int userId);
} 