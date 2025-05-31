using Capstone.Models;
using Capstone.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

[Route("api/review")]
[ApiController]
public class ReviewController : ControllerBase
{
    private readonly ReviewService _reviewService;

    public ReviewController(ReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    // ✅ Add a review with user & product validation
    [HttpPost("add")]
    public async Task<IActionResult> AddReview([FromBody] ReviewRequest request)
    {
        try
        {
            var review = await _reviewService.AddReview(request.UserId, request.ProductId, request.Rating, request.Comment);
            return CreatedAtAction(nameof(GetReviews), new { productId = request.ProductId }, review);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // ✅ Get all reviews for a product, including user details
    [HttpGet("{productId}")]
    public async Task<IActionResult> GetReviews(int productId)
    {
        var reviews = await _reviewService.GetReviews(productId);
        return Ok(reviews);
    }

    // ✅ Get the average rating of a product
    [HttpGet("{productId}/average-rating")]
    public async Task<IActionResult> GetAverageRating(int productId)
    {
        var averageRating = await _reviewService.GetAverageRating(productId);
        return Ok(new { productId, averageRating });
    }
}

// ✅ Request DTO for adding reviews
public class ReviewRequest
{
    public int UserId { get; set; }
    public int ProductId { get; set; }
    public int Rating { get; set; }  // 1 to 5 stars
    public string? Comment { get; set; }
}