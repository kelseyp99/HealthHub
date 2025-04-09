using Microsoft.AspNetCore.Mvc;

namespace HealthHub.Controllers
{
    [Route("api/[controller]")]  // Base route for this controller
    [ApiController]
    public class ProductController : ControllerBase
    {
        // GET: api/product
        [HttpGet]
        public IActionResult GetAllProducts()
        {
            // Return a list of products (for now, this can be hardcoded)
            var products = new[] { "Product1", "Product2", "Product3" };
            return Ok(products);
        }

        // GET: api/product/5
        [HttpGet("{id}")]
        public IActionResult GetProduct(int id)
        {
            // Return a product based on the ID (hardcoded for now)
            var product = $"Product{id}";
            return Ok(product);
        }

        // POST: api/product
        [HttpPost]
        public IActionResult CreateProduct([FromBody] string product)
        {
            // Here, you would save the product to the database, for now, we're just returning it
            return CreatedAtAction(nameof(GetProduct), new { id = 1 }, product);
        }

        // PUT: api/product/5
        [HttpPut("{id}")]
        public IActionResult UpdateProduct(int id, [FromBody] string product)
        {
            // Update the product (for now, just a placeholder response)
            return NoContent();
        }

        // DELETE: api/product/5
        [HttpDelete("{id}")]
        public IActionResult DeleteProduct(int id)
        {
            // Delete the product (placeholder response)
            return NoContent();
        }
    }
}
