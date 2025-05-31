using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Capstone.Data;
using Capstone.Models;  // Ensure you have correct namespaces


public class CartService
{
    private readonly ApplicationDbContext _context;

    public CartService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CartItem> AddToCart(int userId, int productId, int quantity)
    {
        var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
        var productExists = await _context.Products.AnyAsync(p => p.Id == productId);

        if (!userExists || !productExists)
        {
            throw new Exception("Invalid UserId or ProductId"); // Explicit error message
        }

        var cartItem = await _context.CartItems
            .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == productId);

        if (cartItem != null)
        {
            cartItem.Quantity += quantity;
        }
        else
        {
            cartItem = new CartItem
            {
                UserId = userId,
                ProductId = productId,
                Quantity = quantity
            };
            _context.CartItems.Add(cartItem);
        }

        await _context.SaveChangesAsync();
        return cartItem;
    }



    public async Task<List<CartItem>> GetCartItems(int userId)
    {
        return await _context.CartItems
            .Include(c => c.Product)
            .Where(c => c.UserId == userId)
            .ToListAsync();
    }

    public async Task<CartItem> UpdateCartQuantity(int userId, int productId, int change)
    {
        var cartItem = await _context.CartItems.FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == productId);

        if (cartItem == null)
        {
            throw new Exception("Product not found in cart.");
        }

        cartItem.Quantity += change;

        // If quantity becomes zero or negative, remove item from cart
        if (cartItem.Quantity <= 0)
        {
            _context.CartItems.Remove(cartItem);
        }

        await _context.SaveChangesAsync();
        return cartItem;
    }

    public async Task RemoveFromCart(int userId, int productId)
    {
        var cartItem = await _context.CartItems.FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == productId);

        if (cartItem != null)
        {
            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();
        }
    }

}