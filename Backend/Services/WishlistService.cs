using Capstone.Models;
using Capstone.Data;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

public class WishlistService
{
    private readonly ApplicationDbContext _context;

    public WishlistService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<WishlistItem>> GetWishlist(int userId)
    {
        return await _context.WishlistItems
            .Where(w => w.UserId == userId)
            .ToListAsync();
    }

    public async Task<bool> AddToWishlist(int userId, int productId)
    {
        var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
        if (!userExists) throw new Exception("User does not exist.");

        var productExists = await _context.Products.AnyAsync(p => p.Id == productId);
        if (!productExists) throw new Exception("Product does not exist.");

        var existingItem = await _context.WishlistItems
            .FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId);
        if (existingItem != null) throw new Exception("Product is already in the wishlist.");

        _context.WishlistItems.Add(new WishlistItem { UserId = userId, ProductId = productId });
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task RemoveFromWishlist(int userId, int productId)
    {
        var wishlistItem = await _context.WishlistItems
            .FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId);

        if (wishlistItem != null)
        {
            _context.WishlistItems.Remove(wishlistItem);
            await _context.SaveChangesAsync();
        }
    }
}
