using Sepetza.Core.Entities;

namespace Sepetza.Core.Interfaces;

public interface IAddressRepository : IGenericRepository<Address>
{
    Task<IEnumerable<Address>> GetAddressesByUserAsync(int userId);
    Task<Address?> GetDefaultAddressAsync(int userId);
    Task SetDefaultAddressAsync(int userId, int addressId);
} 