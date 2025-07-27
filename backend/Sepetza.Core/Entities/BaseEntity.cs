using System;

namespace Sepetza.Core.Entities;

// Base entity for all database models
public abstract class BaseEntity
{
    // Primary key
    public int Id { get; set; }
    
    // Creation timestamp
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    
    // Last update timestamp
    public DateTime? UpdatedDate { get; set; }
    
    // Soft delete flag
    public bool IsDeleted { get; set; } = false;
} 