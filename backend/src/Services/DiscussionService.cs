using HealthHub.Models;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HealthHub.Services
{
    public class DiscussionService
    {
        private readonly IMongoCollection<Discussion> _discussionCollection;
   
        public DiscussionService(string mongoConnectionString, string databaseName)
        {
            Console.WriteLine($"Attempting to connect to {mongoConnectionString}");
            Console.WriteLine($"Attempting to connect to database {databaseName}");
            // Create a new Mongo client
            var mongoClient = new MongoClient(mongoConnectionString);

            // Get the database
            var database = mongoClient.GetDatabase(databaseName);

            Console.WriteLine($"Connected to database {databaseName}");
            Console.WriteLine("Attempting to get collection Discussion");
            // Get the "Discussion" collection (matching the class name)
            _discussionCollection = database.GetCollection<Discussion>("Discussion");

            Console.WriteLine("Connected to collection Discussion");
        }


        

        // Add a new discussion
        public async Task AddDiscussionAsync(Discussion discussion)
        {
            Console.WriteLine("Starting to add a new discussion.");
            try
            {
                discussion.CreatedAt = DateTime.UtcNow;
                discussion.UpdatedAt = DateTime.UtcNow;
                discussion.Synced = false; // Initially not synced
                await _discussionCollection.InsertOneAsync(discussion);
                Console.WriteLine("Successfully added discussion to the database.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding discussion: {ex.Message}");
                throw;
            }
        }

        // Update an existing discussion
        public async Task<bool> UpdateDiscussionAsync(Discussion discussion)
        {
            discussion.UpdatedAt = DateTime.UtcNow;

            var result = await _discussionCollection.ReplaceOneAsync(
                d => d.Id == discussion.Id,
                discussion
            );

            return result.ModifiedCount > 0;
        }

        // Update an existing discussion
        public async Task<bool> DeleteDiscussionAsync(string id)
        {
            var result = await _discussionCollection.DeleteOneAsync(
                d => d.Id == id
            );
            return result.DeletedCount > 0;
        }

        // Mark a discussion as synced
        public async Task<bool> MarkDiscussionAsSyncedAsync(string id)
        {
            var update = Builders<Discussion>.Update
                .Set(d => d.Synced, true)
                .Set(d => d.SyncTimestamp, DateTime.UtcNow);

            var result = await _discussionCollection.UpdateOneAsync(
                d => d.Id == id,
                update
            );

            return result.ModifiedCount > 0;
        }

        public async Task<List<Discussion>> GetAllDiscussionsAsync()
{
    Console.WriteLine("Attempting to retrieve all discussions from the Discussion collection...");

    try
    {
        // Check if the collection is properly initialized
        if (_discussionCollection == null)
        {
            Console.WriteLine("Error: _discussionCollection is null. Database connection might not be initialized.");
            throw new InvalidOperationException("Database connection is not initialized.");
        }

        // Perform the query to retrieve all discussions
        var discussions = await _discussionCollection.Find(_ => true).ToListAsync();
        Console.WriteLine($"Successfully retrieved {discussions.Count} discussions from the Discussion collection.");
        return discussions;
    }
    catch (Exception ex)
    {
        // Log the exception and rethrow it for higher-level handling
        Console.WriteLine($"Error retrieving discussions: {ex.Message}");
        throw new ApplicationException("An error occurred while retrieving discussions.", ex);
    }
}

        // Get a discussion by ID
        public async Task<Discussion> GetDiscussionByIdAsync(string id)
        {
            return await _discussionCollection.Find(d => d.Id == id).FirstOrDefaultAsync();
        }

        // Get unsynced discussions
        public async Task<List<Discussion>> GetUnsyncedDiscussionsAsync()
        {
            return await _discussionCollection.Find(d => !d.Synced).ToListAsync();
        }
        
        /// <summary>
        /// Retrieves all activity logs from the database.
        /// </summary>
        /// <returns>A list of all activity logs.</returns>
        public async Task<List<Discussion>> GetAllDescussionAsync()
        {
            Console.WriteLine("Attempting to get all logs from Descussion collection");
            var logs = await _discussionCollection.Find(_ => true).ToListAsync();
            Console.WriteLine("Successfully retrieved all logs from Descussion collection");
            return logs;
        }
    }
}
