using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace HealthHub.Models
{
    public class Discussion
    {
        [BsonId] // Maps to MongoDB's _id field
        [BsonRepresentation(BsonType.ObjectId)] // Converts ObjectId to string in C#
        public string Id { get; set; }

        public string DiscussionId { get; set; } // Unique identifier for the discussion
        public string UserId { get; set; } // Unique identifier for the discussion

        public string Description { get; set; } // Description of the discussion

        public string TypeSay { get; set; } // Type or category of the discussion
        
        public string Operation { get; set; } // Type or Operation of the discussion

        public bool Synced { get; set; } // Indicates whether the discussion is synced with the cloud

        public DateTime SyncTimestamp { get; set; } // The last time the discussion was synced

        public DateTime CreatedAt { get; set; } // Timestamp for when the discussion was created

        public DateTime UpdatedAt { get; set; } // Timestamp for when the discussion was last updated
    }
}
