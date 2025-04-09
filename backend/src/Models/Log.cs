using MongoDB.Bson.Serialization.Attributes;
using System;

namespace MyApp.Models
{
    public class Log
    {
        [BsonElement("date")] // Maps to the "date" field in MongoDB
        public DateTime Date { get; set; }

        [BsonElement("diet")] // Maps to the "diet" field in MongoDB
        public string Diet { get; set; }

        [BsonElement("calories")] // Maps to the "calories" field in MongoDB
        public int Calories { get; set; }

        [BsonElement("exercise")] // Optional: Adds an "exercise" field
        public string Exercise { get; set; }

        [BsonElement("mood")] // Optional: Tracks the user's mood for the day
        public string Mood { get; set; }
    }
}
