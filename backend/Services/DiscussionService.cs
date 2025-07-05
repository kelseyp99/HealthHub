using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HealthHubBackend.Services
{
    public class DiscussionService
    {
        private readonly FirestoreDb _firestoreDb;

        public DiscussionService(FirestoreDb firestoreDb)
        {
            _firestoreDb = firestoreDb;
        }

        // Get all discussions for a user (collection path: /Users/{userId}/Discussions)
        public async Task<List<Discussion>> GetUserDiscussionsAsync(string userId)
        {
            var result = new List<Discussion>();
            if (object.ReferenceEquals(_firestoreDb, null))
                return result;

            var discussionsRef = _firestoreDb.Collection("Users").Document(userId).Collection("Discussions");
            var snapshot = await discussionsRef.GetSnapshotAsync();
            foreach (var doc in snapshot.Documents)
            {
                if (doc.Exists)
                {
                    var discussion = doc.ConvertTo<Discussion>();
                    result.Add(discussion);
                }
            }
            return result;
        }

        // Get all discussions for a user as raw Firestore data (for debugging)
        public async Task<List<Dictionary<string, object>>> GetUserDiscussionsRawAsync(string userId)
        {
            var result = new List<Dictionary<string, object>>();
            if (object.ReferenceEquals(_firestoreDb, null))
                return result;

            var discussionsRef = _firestoreDb.Collection("Users").Document(userId).Collection("Discussions");
            var snapshot = await discussionsRef.GetSnapshotAsync();
            foreach (var doc in snapshot.Documents)
            {
                if (doc.Exists)
                {
                    result.Add(doc.ToDictionary());
                }
            }
            return result;
        }

        // Get all activity logs for a user as raw Firestore data
        public async Task<List<Dictionary<string, object>>> GetUserActivityLogRawAsync(string userId)
        {
            var result = new List<Dictionary<string, object>>();
            if (object.ReferenceEquals(_firestoreDb, null))
                return result;

            var activityLogRef = _firestoreDb.Collection("Users").Document(userId).Collection("ActivityLog");
            var snapshot = await activityLogRef.GetSnapshotAsync();
            foreach (var doc in snapshot.Documents)
            {
                if (doc.Exists)
                {
                    result.Add(doc.ToDictionary());
                }
            }
            return result;
        }

        // Get all categories for a user as raw Firestore data
        public async Task<List<Dictionary<string, object>>> GetUserCategoryRawAsync(string userId)
        {
            var result = new List<Dictionary<string, object>>();
            if (object.ReferenceEquals(_firestoreDb, null))
                return result;

            var categoryRef = _firestoreDb.Collection("Users").Document(userId).Collection("Category");
            var snapshot = await categoryRef.GetSnapshotAsync();
            foreach (var doc in snapshot.Documents)
            {
                if (doc.Exists)
                {
                    result.Add(doc.ToDictionary());
                }
            }
            return result;
        }

        // Get all summer data for a user as raw Firestore data
        public async Task<List<Dictionary<string, object>>> GetUserSummerRawAsync(string userId)
        {
            var result = new List<Dictionary<string, object>>();
            if (object.ReferenceEquals(_firestoreDb, null))
                return result;

            var summerRef = _firestoreDb.Collection("Users").Document(userId).Collection("Summer");
            var snapshot = await summerRef.GetSnapshotAsync();
            foreach (var doc in snapshot.Documents)
            {
                if (doc.Exists)
                {
                    result.Add(doc.ToDictionary());
                }
            }
            return result;
        }

        public async Task<bool> TestFirestoreConnectionAsync()
        {
            if (object.ReferenceEquals(_firestoreDb, null))
            {
                Console.WriteLine("Firestore is not configured.");
                return false;
            }

            var collections = await _firestoreDb.ListRootCollectionsAsync().ToListAsync();
            Console.WriteLine($"Found {collections.Count} root collections in Firestore.");
            return collections.Count >= 0;
        }

        // List all root collections in Firestore
        public async Task<List<string>> ListRootCollectionsAsync()
        {
            var result = new List<string>();
            if (object.ReferenceEquals(_firestoreDb, null))
                return result;

            var collections = await _firestoreDb.ListRootCollectionsAsync().ToListAsync();
            foreach (var col in collections)
            {
                result.Add(col.Id);
            }
            return result;
        }
    }

    // Minimal Discussion model for test
    public class Discussion
    {
        public string Id { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool Synced { get; set; }
    }
}
