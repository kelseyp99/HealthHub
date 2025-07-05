using Google.Cloud.Firestore;
using System;

namespace HealthHub.Models
{
    [FirestoreData]
    public class Discussion
    {
        [FirestoreProperty]
        public string? Id { get; set; }
        [FirestoreProperty]
        public string? Title { get; set; }
        [FirestoreProperty]
        public string? Content { get; set; }
        [FirestoreProperty]
        public string? Category { get; set; }
        [FirestoreProperty]
        public string? UserId { get; set; }
        [FirestoreProperty]
        public DateTime CreatedAt { get; set; }
        [FirestoreProperty]
        public DateTime UpdatedAt { get; set; }
    }
}
