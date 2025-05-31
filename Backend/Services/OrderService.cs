using Capstone.Controllers;
using Capstone.Data;
using Capstone.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Capstone.Services
{
    public class OrderService
    {
        private readonly ApplicationDbContext _context;

        public OrderService(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ Get all orders
        public async Task<IEnumerable<Order>> GetAllOrdersAsync()
        {
            return await _context.Orders
                .Include(o => o.OrderItems) // Include OrderItems when fetching orders
                .ToListAsync();
        }

        // ✅ Get orders by user ID
        public async Task<IEnumerable<Order>> GetOrdersByUserIdAsync(int userId)
        {
            return await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.OrderItems) // Include order items
                .ToListAsync();
        }

        // ✅ Create an order with multiple items
        public async Task<Order> CreateOrderAsync(CreateOrderRequest request)
        {
            // Ensure user exists
            var userExists = await _context.Users.AnyAsync(u => u.Id == request.UserId);
            if (!userExists) throw new Exception("Invalid user ID.");

            // Ensure all products exist
            var productIds = request.OrderItems.Select(i => i.ProductId).ToList();
            var existingProducts = await _context.Products
                .Where(p => productIds.Contains(p.Id))
                .Select(p => p.Id)
                .ToListAsync();

            if (existingProducts.Count != productIds.Count)
                throw new Exception("One or more product IDs are invalid.");

            // Create the order
            var order = new Order
            {
                UserId = request.UserId,
                TotalAmount = request.TotalAmount,
                DeliveryAddress = request.DeliveryAddress,
                OrderDate = DateTime.UtcNow,
                OrderItems = request.OrderItems.Select(item => new OrderItem
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    Price = item.Price
                }).ToList()
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return order;
        }

        // ✅ Delete an order by ID
        public async Task<bool> DeleteOrderAsync(int orderId)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems) // Include related items to delete them too
                .FirstOrDefaultAsync(o => o.Id == orderId);
            
            if (order == null) return false;

            _context.OrderItems.RemoveRange(order.OrderItems); // Delete associated items first
            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}