using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace MyApp.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("name")]
        public string Name { get; set; }

        [BsonElement("email")]
        public string Email { get; set; }

        [BsonElement("logs")] // Embedded logs
        public List<Log> Logs { get; set; } = new List<Log>();

        [BsonElement("permissions")] // Permissions granted to dietitians
        public List<DietitianPermission> Permissions { get; set; } = new List<DietitianPermission>();
    }

    public class DietitianPermission
    {
        [BsonElement("dietitianId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string DietitianId { get; set; }

        [BsonElement("categories")] // Categories shared with the dietitian
        public List<string> Categories { get; set; } = new List<string>();
    }
}
