using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace MyApp.Models
{
    public class Dietitian
    {
        [BsonId] // Maps to the MongoDB "_id" field
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("name")] // Name of the dietitian
        public string Name { get; set; }

        [BsonElement("email")] // Email of the dietitian
        public string Email { get; set; }

        [BsonElement("specialties")] // List of specialties
        public List<string> Specialties { get; set; } = new List<string>();

        [BsonElement("patients")] // List of patients (referencing User IDs)
        public List<Patient> Patients { get; set; } = new List<Patient>();

        [BsonElement("isAcceptingPatients")] // Whether they are open to new patients
        public bool IsAcceptingPatients { get; set; } = true;
    }

    public class Patient
    {
        [BsonElement("userId")] // ID of the user (patient)
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string UserId { get; set; }

        [BsonElement("categories")] // Categories the patient has shared
        public List<string> Categories { get; set; } = new List<string>();
    }
}
