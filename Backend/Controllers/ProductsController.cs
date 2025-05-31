using Microsoft.AspNetCore.Mvc;
using Capstone.Models;
using Capstone.Services;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Capstone.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ProductService _productService;

        public ProductsController(ProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            var products = await _productService.GetAllProducts();
            return Ok(products);
        }

        // POST: api/products
        [HttpPost]
        public async Task<IActionResult> PostProduct([FromBody] Product product)
        {
            if (product == null)
                return BadRequest("Invalid product data.");

            await _productService.AddProduct(product); // ✅ Use ProductService
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }

        // GET: api/products/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduct(int id)
        {
            var product = await _productService.GetProductById(id); // ✅ Use ProductService
            if (product == null)
                return NotFound();

            return Ok(product);
        }

        // GET: api/products/trending
        [HttpGet("trending")]
        public async Task<IActionResult> GetTrendingProducts()
        {
            var trendingProducts = await _productService.GetTrendingProducts(); // ✅ Use ProductService
            return Ok(trendingProducts);
        }
    }
}