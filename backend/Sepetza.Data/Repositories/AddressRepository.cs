using Microsoft.EntityFrameworkCore;
using Sepetza.Core.Entities;
using Sepetza.Core.Interfaces;
using Sepetza.Data.Context;

namespace Sepetza.Data.Repositories;

public class AddressRepository : GenericRepository<Address>, IAddressRepository
{
    public AddressRepository(SepetzaDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Address>> GetAddressesByUserAsync(int userId)
    {
        return await _dbSet
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.IsDefault)
            .ThenBy(a => a.Title)
            .ToListAsync();
    }

    public async Task<Address?> GetDefaultAddressAsync(int userId)
    {
        return await _dbSet
            .FirstOrDefaultAsync(a => a.UserId == userId && a.IsDefault);
    }

    public async Task SetDefaultAddressAsync(int userId, int addressId)
    {
        var userAddresses = await _dbSet
            .Where(a => a.UserId == userId)
            .ToListAsync();

        foreach (var address in userAddresses)
        {
            address.IsDefault = address.Id == addressId;
            address.UpdatedDate = DateTime.UtcNow;
        }

        _dbSet.UpdateRange(userAddresses);
    }
} 