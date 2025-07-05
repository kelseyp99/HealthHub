using HealthHub.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace HealthHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FirestoreTestController : ControllerBase
    {
        private readonly DiscussionService _discussionService;
        private readonly ILogger<FirestoreTestController> _logger;

        public FirestoreTestController(DiscussionService discussionService, ILogger<FirestoreTestController> logger)
        {
            _discussionService = discussionService;
            _logger = logger;
        }

        [HttpGet("test-connection")]
        public async Task<IActionResult> TestConnection()
        {
            _logger.LogInformation("TestConnection endpoint hit!");
            try
            {
                var result = await _discussionService.TestFirestoreConnectionAsync();
                _logger.LogInformation($"Firestore connection result: {result}");
                return Ok(new { connected = result, message = "Firestore connection successful" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Firestore connection error");
                return StatusCode(500, new { error = ex.Message, details = ex.ToString() });
            }
        }

        // List all root collections in Firestore
        [HttpGet("collections")]
        public async Task<IActionResult> ListCollections()
        {
            try
            {
                var collections = await _discussionService.ListRootCollectionsAsync();
                return Ok(collections);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error listing Firestore collections");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("ping")]
        public IActionResult Ping()
        {
            _logger.LogInformation("Ping endpoint hit!");
            return Ok(new { message = "pong" });
        }

        // Get all discussions for a user as raw Firestore data
        [HttpGet("user/{userId}/discussions/raw")]
        public async Task<IActionResult> GetUserDiscussionsRaw(string userId)
        {
            try
            {
                var discussions = await _discussionService.GetUserDiscussionsRawAsync(userId);
                return Ok(discussions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting raw discussions for user {userId}");
                return StatusCode(500, new { error = ex.Message });
            }
        }
        // List all discussions for a given user ID
        [HttpGet("user/{userId}/discussions")]
        public async Task<IActionResult> GetUserDiscussions(string userId)
        {
            try
            {
                var discussions = await _discussionService.GetUserDiscussionsAsync(userId);
                return Ok(discussions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting discussions for user {userId}");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // Get all activity logs for a user as raw Firestore data
        [HttpGet("user/{userId}/activitylog/raw")]
        public async Task<IActionResult> GetUserActivityLogRaw(string userId)
        {
            try
            {
                var logs = await _discussionService.GetUserActivityLogRawAsync(userId);
                return Ok(logs);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting raw activity logs for user {userId}");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // Get all categories for a user as raw Firestore data
        [HttpGet("user/{userId}/category/raw")]
        public async Task<IActionResult> GetUserCategoryRaw(string userId)
        {
            try
            {
                var categories = await _discussionService.GetUserCategoryRawAsync(userId);
                return Ok(categories);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting raw categories for user {userId}");
                return StatusCode(500, new { error = ex.Message });
            }
        }
        // Get all summer data for a user as raw Firestore data
        [HttpGet("user/{userId}/summer/raw")]
        public async Task<IActionResult> GetUserSummerRaw(string userId)
        {
            try
            {
                var summer = await _discussionService.GetUserSummerRawAsync(userId);
                return Ok(summer);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting raw summer data for user {userId}");
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
