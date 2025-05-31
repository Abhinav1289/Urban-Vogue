using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Capstone.Models
{
    public class WishlistItem
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }  // Foreign key to User
        public User User { get; set; }   // Navigation property

        [ForeignKey("Product")]
        public int ProductId { get; set; }  // Foreign key to Product
        public Product Product { get; set; } // Navigation property
    }
}
