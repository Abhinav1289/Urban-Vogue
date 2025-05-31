using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Capstone.Models
{
    public class Review
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ProductId { get; set; } // ✅ Foreign key for Product

        [ForeignKey("ProductId")]
        [InverseProperty("Reviews")] // Helps EF Core track the relationship properly
        public Product Product { get; set; } = null!; // ✅ Non-nullable for better integrity

        [Required]
        public int UserId { get; set; } // ✅ Foreign key for User

        [ForeignKey("UserId")]
        [InverseProperty("Reviews")] // Helps EF Core track the relationship properly
        public User User { get; set; } = null!; // ✅ Non-nullable for better integrity

        [Required]
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5.")]
        public int Rating { get; set; } // ✅ Ensuring valid range

        [Required]
        [StringLength(500, ErrorMessage = "Comment cannot exceed 500 characters.")]
        public string Comment { get; set; } = string.Empty; // ✅ Max length

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // ✅ Ensure default time is always set
    }
}
