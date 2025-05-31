using System.ComponentModel.DataAnnotations;

namespace Capstone.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public required string Name { get; set; } = string.Empty; // ✅ Fix
        public required string Email { get; set; } = string.Empty; // ✅ Fix
        public required string Password { get; set; } = string.Empty; // Note: In production, hash passwords


        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
