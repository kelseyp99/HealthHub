// backend\src\Controller\ActivityLogController.cs
using Microsoft.AspNetCore.Mvc;
using HealthHub.Services;
using HealthHub.Models;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace HealthHub.Controller
{
    [ApiController]
    [Route("api/[controller]")] //curl http://localhost:5155/api/activitylog
    public class ActivityLogController : ControllerBase
    {
        private readonly ActivityLogService _activityLogService;

        public ActivityLogController(ActivityLogService activityLogService)
        {
            if (activityLogService == null)
            {
                throw new ArgumentNullException(nameof(activityLogService), "ActivityLogService cannot be null.");
            }
            
            Console.WriteLine("Initializing ActivityLogController with ActivityLogService.");
            _activityLogService = activityLogService;
            Console.WriteLine("ActivityLogController initialized successfully.");
        }

        /// <summary>
        /// Retrieves all activity logs.
        /// </summary>
        /// <returns>A list of all activity logs.</returns>
        [HttpGet]
        public async Task<ActionResult<List<ActivityLog>>> GetAll()
        {
            var logs = await _activityLogService.GetAllLogsAsync();
            return Ok(logs);
        }

       [HttpPost]
        public async Task<IActionResult> Create()
        {
            Console.WriteLine("Attempting to create a new log.");
            try
            {
                using (var reader = new StreamReader(Request.Body))
                {
                    // Read the raw JSON payload
                    var rawJson = await reader.ReadToEndAsync();
                    Console.WriteLine($"Raw JSON received: {rawJson}");

                    // Deserialize the JSON into the ActivityLog object
                    var log = System.Text.Json.JsonSerializer.Deserialize<ActivityLog>(rawJson, new System.Text.Json.JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    if (log == null)
                    {
                        Console.WriteLine("Failed to deserialize JSON into ActivityLog.");
                        return BadRequest("Invalid JSON payload.");
                    }

                    Console.WriteLine($"Deserialized log: DiscussionId={log.DiscussionId}, Category={log.Category}, Description={log.Description}, Timestamp={log.Timestamp}, Cleared={log.Cleared}");

                    // Pass the log object to your service to create it
                    await _activityLogService.CreateAsync(log);

                    Console.WriteLine("Log created successfully.");
                    return Ok(new { message = "Log created successfully." });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in Create method: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}
