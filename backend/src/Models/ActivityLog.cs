// backend\src\Models\ActivityLog.cs
using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace HealthHub.Models
{
    public class ActivityLog
    {
        [BsonId] // Maps to MongoDB's _id field
        [BsonRepresentation(BsonType.ObjectId)] // Converts ObjectId to string in C#
        public string Id { get; set; }
        public int ActivityLogId { get; set; }

        public int DiscussionId { get; set; }
        public string UserId { get; set; } // Unique identifier for the user

        public string Category { get; set; }

        public string Description { get; set; }

        public DateTime Timestamp { get; set; }

        public bool Cleared { get; set; }
        public bool Synced { get; set; } // Indicates if the discussion is synced to the cloud

    }
}
