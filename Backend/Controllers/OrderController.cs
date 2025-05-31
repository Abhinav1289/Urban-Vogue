using Capstone.Models;
using Capstone.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Capstone.Controllers
{
    [Route("api/orders")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly OrderService _orderService;

        public OrderController(OrderService orderService)
        {
            _orderService = orderService;
        }

        // ✅ GET: api/orders - Get all orders
        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _orderService.GetAllOrdersAsync();
            return Ok(orders);
        }

        // ✅ GET: api/orders/user/{userId} - Get all orders for a specific user
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetOrdersByUserId(int userId)
        {
            var orders = await _orderService.GetOrdersByUserIdAsync(userId);

            if (orders == null || !orders.Any())
                return NotFound(new { message = "No orders found for this user." });

            return Ok(orders);
        }

        // ✅ POST: api/orders - Create a new order with multiple items
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (request.OrderItems == null || request.OrderItems.Count == 0)
                return BadRequest(new { message = "Order must contain at least one item." });

            try
            {
                var newOrder = await _orderService.CreateOrderAsync(request);
                return CreatedAtAction(nameof(GetOrdersByUserId), new { userId = newOrder.UserId }, newOrder);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ✅ DELETE: api/orders/{id} - Delete an order by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var success = await _orderService.DeleteOrderAsync(id);
            if (!success) return NotFound(new { message = "Order not found." });

            return NoContent();
        }
    }

    // ✅ DTO for creating orders with multiple items
    public class CreateOrderRequest
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Total amount must be greater than 0.")]
        public decimal TotalAmount { get; set; }

        [Required]
        [StringLength(255, ErrorMessage = "Delivery address must not exceed 255 characters.")]
        public string DeliveryAddress { get; set; } = string.Empty;

        [Required]
        public List<OrderItemDto> OrderItems { get; set; }
    }

    public class OrderItemDto
    {
        [Required]
        public int ProductId { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1.")]
        public int Quantity { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0.")]
        public decimal Price { get; set; }
    }
}
