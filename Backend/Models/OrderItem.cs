using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Capstone.Models
{
    public class OrderItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Order")]
        public int OrderId { get; set; }  // Links to the Order

        [Required]
        [ForeignKey("Product")]
        public int ProductId { get; set; }  // Links to the Product

        [Required]
        public int Quantity { get; set; }  // Quantity of this product in the order

        [Required]
        public decimal Price { get; set; }  // Store price at the time of order

        // Navigation Properties
        public Order Order { get; set; }
        public Product Product { get; set; }
    }
}
