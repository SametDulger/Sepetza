namespace Sepetza.Core.Entities;

public class Address : BaseEntity
{
    public string Title { get; set; } = string.Empty; // Ev, İş, vb.
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string AddressLine1 { get; set; } = string.Empty;
    public string AddressLine2 { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public bool IsDefault { get; set; } = false;
    
    // Foreign Keys
    public int UserId { get; set; }
    
    // Navigation Properties
    public virtual User User { get; set; } = null!;
} 