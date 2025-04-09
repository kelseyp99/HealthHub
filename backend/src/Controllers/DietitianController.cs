//https://chatgpt.com/share/678e9b2d-fa98-8001-96ea-b0d8e158f993
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using HealthHub.Services;
namespace HealthHub.Controllers
{
    [ApiController]
    [Route("api/dietitian")]
    public class DietitianController : ControllerBase
    {
        private readonly IDietitianService _dietitianService;

        public DietitianController(IDietitianService dietitianService)
        {
            _dietitianService = dietitianService;
        }

        [HttpPost("pick")]
        public async Task<IActionResult> PickDietitian([FromBody] PickDietitianRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.UserId) || string.IsNullOrWhiteSpace(request.DietitianId))
            {
                return BadRequest("Invalid input.");
            }

            // Generate the JWT
            var jwt = _dietitianService.GenerateJwt(request.UserId, request.DietitianId);

            // Store JWT in the dietitian's cookie
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7) // Expire in 7 days
            };

            Response.Cookies.Append("DietitianJWT", jwt, cookieOptions);

            return Ok(new { message = "Dietitian selected and JWT stored successfully." });
        }
    }

    public class PickDietitianRequest
    {
        public string UserId { get; set; }
        public string DietitianId { get; set; }
    }
}
