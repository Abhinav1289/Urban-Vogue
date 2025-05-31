using Capstone.Services;
using Microsoft.AspNetCore.Mvc;
using Capstone.Models;
using System.Threading.Tasks;

namespace Capstone.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WishlistController : ControllerBase
    {
        private readonly WishlistService _wishlistService;

        public WishlistController(WishlistService wishlistService)
        {
            _wishlistService = wishlistService;
        }

        // Get user's wishlist
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetWishlist(int userId)
        {
            var wishlist = await _wishlistService.GetWishlist(userId);
            return Ok(wishlist);
        }

        // Add product to wishlist using JSON body
        [HttpPost("add")]
        public async Task<IActionResult> AddToWishlist([FromBody] WishlistRequest request)
        {
            var result = await _wishlistService.AddToWishlist(request.UserId, request.ProductId);
            if (result)
            {
                return Ok(new { message = "Product added to wishlist" });
            }
            return BadRequest(new { message = "Failed to add product to wishlist" });
        }

        // Remove product from wishlist using JSON body
        [HttpDelete("remove")]
        public async Task<IActionResult> RemoveFromWishlist([FromBody] WishlistRequest request)
        {
            await _wishlistService.RemoveFromWishlist(request.UserId, request.ProductId);
            return Ok(new { message = "Product removed from wishlist" });
        }
    }

    // Request model for JSON data
    public class WishlistRequest
    {
        public int UserId { get; set; }
        public int ProductId { get; set; }
    }
}
