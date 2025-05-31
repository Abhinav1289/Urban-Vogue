using Capstone.Data;
using Capstone.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Capstone.Services
{
    public class ProductService
    {
        private readonly ApplicationDbContext _context;

        public ProductService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Product>> GetAllProducts()
        {
            return await _context.Products.ToListAsync();
        }


        public async Task AddProduct(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
        }

        public async Task<Product?> GetProductById(int id)
        {
            return await _context.Products.FindAsync(id);
        }

        public async Task<List<ProductDto>> GetTrendingProducts()
        {
            return await _context.Products
                .Include(p => p.Reviews)
                .Where(p => p.Reviews.Any()) // Only products with reviews
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description,
                    Image = p.Image,
                    Price = p.Price,
                    AverageRating = p.Reviews.Average(r => r.Rating)
                })
                .OrderByDescending(p => p.AverageRating)
                .Take(3)
                .ToListAsync();
        }
    }

    public class ProductDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public decimal Price { get; set; }
        public double AverageRating { get; set; }
    }
}
