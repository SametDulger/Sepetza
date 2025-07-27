using System;

namespace Sepetza.Core.Entities;

// User entity for authentication and profile
public class User : BaseEntity
{
    // User first name
    public string FirstName { get; set; } = string.Empty;
    // User last name
    public string LastName { get; set; } = string.Empty;
    // User email address
    public string Email { get; set; } = string.Empty;
    // Hashed password
    public string PasswordHash { get; set; } = string.Empty;
    // User phone number
    public string PhoneNumber { get; set; } = string.Empty;
    // User birth date
    public DateTime? DateOfBirth { get; set; }
    // User role (Customer/Admin)
    public UserRole Role { get; set; } = UserRole.Customer;
    
    // Navigation Properties
    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
    public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    public virtual ICollection<Address> Addresses { get; set; } = new List<Address>();
}

// User roles enum
public enum UserRole
{
    Customer = 0,
    Admin = 1
} 