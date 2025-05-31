using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Capstone.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(18,2)")] // Avoid truncation issues
        public decimal Price { get; set; }

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public string Category { get; set; } = string.Empty;

        [Required]
        public string Image { get; set; } = string.Empty;

        public double Rating { get; set; }  // Flattened rating (optional)
        public int RatingCount { get; set; } // Number of reviews

        public List<Review> Reviews { get; set; } = new List<Review>();
    }
}