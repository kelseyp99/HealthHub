using System;
using System.Threading.Tasks;
using HealthHub.Models;
using HealthHub.Services;

namespace HealthHub.Tests
{
    public class FirestoreConnectionTest
    {
        public static async Task Main(string[] args)
        {
            // Replace with your actual values
            string firestoreProjectId = "your-firebase-project-id";
            string firestoreJsonPath = "backend/Keys/firebase-service-account.json";

            try
            {
                var service = new DiscussionService(
                    firestoreProjectId,
                    firestoreJsonPath
                );

                // Try to add a test discussion to Firestore
                var discussion = new Discussion
                {
                    Id = Guid.NewGuid().ToString(),
                    Title = "Test Firestore connection",
                    Content = "Testing Firestore connectivity.",
                    Category = "Test",
                    UserId = "test-user",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                await service.AddDiscussionToFirestoreAsync(discussion);
                Console.WriteLine("Successfully connected and wrote to Firestore!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Firestore connection test failed: {ex.Message}");
            }
        }
    }
}
