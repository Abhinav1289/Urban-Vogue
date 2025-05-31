using Capstone.Data;
using Capstone.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Capstone.Services
{
    public class ReviewService
    {
        private readonly ApplicationDbContext _context;

        public ReviewService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Add a review with validation
        public async Task<Review> AddReview(int userId, int productId, int rating, string comment)
        {
            // Check if the user exists
            var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
            if (!userExists)
            {
                throw new Exception("User does not exist.");
            }

            // Check if the product exists
            var productExists = await _context.Products.AnyAsync(p => p.Id == productId);
            if (!productExists)
            {
                throw new Exception("Product does not exist.");
            }

            // Add review if both exist
            var review = new Review
            {
                UserId = userId,
                ProductId = productId,
                Rating = rating,
                Comment = comment,
                CreatedAt = DateTime.UtcNow
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return review;
        }

        // Get reviews for a specific product
        public async Task<List<dynamic>> GetReviews(int productId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.ProductId == productId)
                .Select(r => new
                {
                    r.Id,
                    r.ProductId,
                    r.Rating,
                    r.Comment,
                    r.CreatedAt,
                    UserName = r.User.Name // Ensure User navigation property exists
                })
                .ToListAsync();

            return reviews.Cast<dynamic>().ToList(); // ✅ Explicitly cast to dynamic
        }





        public async Task<double> GetAverageRating(int productId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.ProductId == productId)
                .ToListAsync();

            if (!reviews.Any()) return 0; // No reviews, return 0

            return reviews.Average(r => r.Rating);
        }
    }
}