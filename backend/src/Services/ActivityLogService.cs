using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Driver;
using HealthHub.Models;
using System;

namespace HealthHub.Services
{
    public class ActivityLogService
    {
        private readonly IMongoCollection<ActivityLog> _activityLogCollection;
   
        public ActivityLogService(string mongoConnectionString, string databaseName)
        {
            Console.WriteLine($"Attempting to connect to {mongoConnectionString}");
            Console.WriteLine($"Attempting to connect to database {databaseName}");
            // Create a new Mongo client
            var mongoClient = new MongoClient(mongoConnectionString);

            // Get the database
            var database = mongoClient.GetDatabase(databaseName);

            Console.WriteLine($"Connected to database {databaseName}");
            Console.WriteLine("Attempting to get collection ActivityLog");
            // Get the "ActivityLog" collection (matching the class name)
            _activityLogCollection = database.GetCollection<ActivityLog>("ActivityLog");

            Console.WriteLine("Connected to collection ActivityLog");
        }

        // Example: Get all logs
        public async Task<List<ActivityLog>> GetAllAsync()
        {
            return await _activityLogCollection.Find(_ => true).ToListAsync();
        }

        // Example: Insert a log
        public async Task CreateAsync(ActivityLog log)
        {
            await _activityLogCollection.InsertOneAsync(log);
        }

        // Example: Get a single log by Id
        public async Task<ActivityLog> GetByIdAsync(string id)
        {
            return await _activityLogCollection.Find(x => x.Id == id).FirstOrDefaultAsync();
        }

        // Example: Update a log
        public async Task UpdateAsync(string id, ActivityLog updatedLog)
        {
            await _activityLogCollection.ReplaceOneAsync(x => x.Id == id, updatedLog);
        }

        // Example: Delete a log
        public async Task DeleteAsync(string id)
        {
            await _activityLogCollection.DeleteOneAsync(x => x.Id == id);
        }

        /// <summary>
        /// Retrieves all activity logs from the database.
        /// </summary>
        /// <returns>A list of all activity logs.</returns>
        public async Task<List<ActivityLog>> GetAllLogsAsync()
        {
            Console.WriteLine("Attempting to get all logs from ActivityLog collection");
            var logs = await _activityLogCollection.Find(_ => true).ToListAsync();
            Console.WriteLine("Successfully retrieved all logs from ActivityLog collection");
            return logs;
        }
    }
}
