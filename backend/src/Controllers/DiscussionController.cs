using HealthHub.Models;
using HealthHub.Services;
using Microsoft.AspNetCore.JsonPatch.Operations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.FileProviders.Embedded;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HealthHub.Controllers
{
[ApiController]
[Route("api/[controller]")]//curl http://localhost:5155/api/discuss
public class DiscussionController : ControllerBase
{
    private readonly DiscussionService _discussionService;

    public DiscussionController(DiscussionService discussionService)
    {
        Console.WriteLine("Initializing DiscussionController");
        _discussionService = discussionService;
        Console.WriteLine("Initialized DiscussionController");
    }

        // Get all discussions
        [HttpGet("all")]
        public async Task<ActionResult<List<Discussion>>> GetAllDiscussions()
        {
            Console.WriteLine("Getting all discussions");
            var discussions = await _discussionService.GetAllDiscussionsAsync();
            return Ok(discussions);
        }
        // Add a new discussion
        [HttpPost]
        //public async Task<IActionResult> AddDiscussion([FromBody] Discussion discussion)
         public async Task<IActionResult> Create(){
            Console.WriteLine("Attempting to add discussion to Discussion collection");
            try
            {
                using (var reader = new StreamReader(Request.Body))
                {
                    // Read the raw JSON payload
                    var rawJson = await reader.ReadToEndAsync();
                    Console.WriteLine($"Raw JSON received: {rawJson}");

                    // Deserialize the JSON into the ActivityLog object
                    var log = System.Text.Json.JsonSerializer.Deserialize<Discussion>(rawJson, new System.Text.Json.JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    if (log == null)
                    {
                        Console.WriteLine("Failed to deserialize JSON into ActivityLog.");
                        return BadRequest("Invalid JSON payload.");
                    }
                await _discussionService.AddDiscussionAsync(log);
                Console.WriteLine("Successfully added discussion to Discussion collection");
                return Ok(new { message = "Discussion added successfully." });
            }}
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding discussion: {ex.Message}");
                Console.WriteLine("Error adding discussion to Discussion collection");
                return StatusCode(500, "Internal server error");
            }
        }
        // Update a discussion
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDiscussion(string id, [FromBody] Discussion updatedDiscussion)
        {
            if (id != updatedDiscussion.Id)
            {
                return BadRequest(new { message = "Discussion ID mismatch." });
            }
    
            try
            {
                var success = await _discussionService.UpdateDiscussionAsync(updatedDiscussion);
                if (!success)
                {
                    return NotFound(new { message = "Discussion not found." });
                }
    
                return Ok(new { message = "Discussion updated successfully." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating discussion: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
        // Delete a discussion
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDiscussion(string id)
        {
            try
            {
                var success = await _discussionService.DeleteDiscussionAsync(id);
                if (!success)
                {
                    return NotFound(new { message = "Discussion not found." });
                }

                return Ok(new { message = "Discussion deleted successfully." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting discussion: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Mark a discussion as synced
        [HttpPut("{id}/sync")]
        public async Task<IActionResult> MarkDiscussionAsSynced(string id)
        {
            try
            {
                var success = await _discussionService.MarkDiscussionAsSyncedAsync(id);
                if (!success)
                {
                    return NotFound(new { message = "Discussion not found for syncing." });
                }

                return Ok(new { message = "Discussion marked as synced." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error marking discussion as synced: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Get unsynced discussions
        [HttpGet("unsynced")]
        public async Task<ActionResult<List<Discussion>>> GetUnsyncedDiscussions()
        {
            try
            {
                var unsyncedDiscussions = await _discussionService.GetUnsyncedDiscussionsAsync();
                return Ok(unsyncedDiscussions);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching unsynced discussions: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
