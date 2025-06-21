using System.ComponentModel.DataAnnotations;

namespace Sepetza.Core.Entities
{
    public class Favorite : BaseEntity
    {
        [Required]
        public int UserId { get; set; }
        
        [Required]
        public int ProductId { get; set; }
        
        // Navigation Properties
        public virtual User User { get; set; } = null!;
        public virtual Product Product { get; set; } = null!;
    }
} 