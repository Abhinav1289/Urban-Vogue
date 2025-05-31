using Capstone.Models;
using Capstone.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[Route("api/cart")]
[ApiController]
public class CartController : ControllerBase
{
    private readonly CartService _cartService;

    public CartController(CartService cartService)
    {
        _cartService = cartService;
    }

    // Add product to cart or update quantity
    [HttpPost("add")]
    public async Task<IActionResult> AddToCart([FromBody] CartRequest request)
    {
        var cartItem = await _cartService.AddToCart(request.UserId, request.ProductId, 1);
        return Ok(cartItem);
    }

    // Remove product from cart
    [HttpDelete("remove")]
    public async Task<IActionResult> RemoveFromCart([FromBody] CartRequest request)
    {
        await _cartService.RemoveFromCart(request.UserId, request.ProductId);
        return Ok(new { message = "Product removed from cart" });
    }

    // Get all items in cart
    [HttpGet("{userId}")]
    public async Task<IActionResult> GetCart(int userId)
    {
        var cartItems = await _cartService.GetCartItems(userId);
        return Ok(cartItems);
    }
}

// JSON request model
public class CartRequest
{
    public int UserId { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }
}
