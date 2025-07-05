using HealthHub.Models;
using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HealthHub.Services
{

    public class DiscussionService
    {
        private readonly FirestoreDb _firestoreDb;

        public DiscussionService(string firestoreProjectId, string firestoreJsonPath)
        {
            if (string.IsNullOrEmpty(firestoreProjectId) || string.IsNullOrEmpty(firestoreJsonPath))
            {
                throw new ArgumentException("Firestore project ID and credentials path must be provided.");
            }
            Console.WriteLine($"Initializing Firestore for project {firestoreProjectId} with credentials at {firestoreJsonPath}");
            Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", firestoreJsonPath);
            _firestoreDb = FirestoreDb.Create(firestoreProjectId);
            Console.WriteLine("Connected to Firestore");
        }

        // --- Firestore Methods ---
        public async Task AddDiscussionToFirestoreAsync(Discussion discussion)
        {
            DocumentReference docRef = _firestoreDb.Collection("Discussion").Document(discussion.Id);
            await docRef.SetAsync(discussion);
            Console.WriteLine($"Added discussion {discussion.Id} to Firestore.");
        }

        public async Task<Discussion> GetDiscussionFromFirestoreAsync(string id)
        {
            DocumentReference docRef = _firestoreDb.Collection("Discussion").Document(id);
            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();
            if (snapshot.Exists)
            {
                return snapshot.ConvertTo<Discussion>();
            }
            return null;
        }

        public async Task<List<Discussion>> GetAllDiscussionsFromFirestoreAsync()
        {
            QuerySnapshot snapshot = await _firestoreDb.Collection("Discussion").GetSnapshotAsync();
            var discussions = new List<Discussion>();
            foreach (var doc in snapshot.Documents)
            {
                discussions.Add(doc.ConvertTo<Discussion>());
            }
            return discussions;
        }

        // --- FirestoreTestController support methods ---
        public async Task<bool> TestFirestoreConnectionAsync()
        {
            try
            {
                var collections = _firestoreDb.ListRootCollectionsAsync();
                await foreach (var col in collections)
                {
                    // Just enumerate to test connectivity
                    _ = col.Id;
                }
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<List<string>> ListRootCollectionsAsync()
        {
            var collections = _firestoreDb.ListRootCollectionsAsync();
            var names = new List<string>();
            await foreach (var col in collections)
            {
                names.Add(col.Id);
            }
            return names;
        }

        public async Task<List<Discussion>> GetUserDiscussionsRawAsync(string userId)
        {
            var snapshot = await _firestoreDb.Collection("Discussion").WhereEqualTo("UserId", userId).GetSnapshotAsync();
            var discussions = new List<Discussion>();
            foreach (var doc in snapshot.Documents)
            {
                discussions.Add(doc.ConvertTo<Discussion>());
            }
            return discussions;
        }

        public async Task<List<Discussion>> GetUserDiscussionsAsync(string userId)
        {
            // For now, same as raw
            return await GetUserDiscussionsRawAsync(userId);
        }

        public Task<List<object>> GetUserActivityLogRawAsync(string userId)
        {
            // Placeholder: implement your Firestore activity log logic here
            return Task.FromResult(new List<object>());
        }

        public Task<List<object>> GetUserCategoryRawAsync(string userId)
        {
            // Placeholder: implement your Firestore category logic here
            return Task.FromResult(new List<object>());
        }

        public Task<List<object>> GetUserSummerRawAsync(string userId)
        {
            // Placeholder: implement your Firestore summer logic here
            return Task.FromResult(new List<object>());
        }

        // All MongoDB-related methods have been removed. Add Firestore-only methods as needed.
    }
}
