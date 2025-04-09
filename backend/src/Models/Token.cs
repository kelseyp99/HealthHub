using MongoDB.Bson.Serialization.Attributes;
using System;

namespace MyApp.Models
{
    public class Token
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("userId")] // ID of the user (who issued the token)
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string UserId { get; set; }

        [BsonElement("dietitianId")] // ID of the dietitian (who uses the token)
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string DietitianId { get; set; }

        [BsonElement("categories")] // Categories the token grants access to
        public List<string> Categories { get; set; } = new List<string>();

        [BsonElement("expiry")] // Expiration date for the token
        public DateTime Expiry { get; set; }
    }
}
