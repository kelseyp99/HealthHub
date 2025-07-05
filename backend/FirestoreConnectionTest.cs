using System;
using System.Threading.Tasks;
using HealthHubBackend.Services;

namespace HealthHubBackend
{
    public class FirestoreConnectionTest
    {
        public static async Task Main(string[] args)
        {
            // TODO: Replace with your actual values
            string firestoreProjectId = "your-firebase-project-id";
            string firestoreJsonPath = "path-to-your-service-account.json";

            try
            {

                // Set up FirestoreDb if credentials are available
                Google.Cloud.Firestore.FirestoreDb? firestoreDb = null;
                if (!string.IsNullOrEmpty(firestoreProjectId) && !string.IsNullOrEmpty(firestoreJsonPath) && System.IO.File.Exists(firestoreJsonPath))
                {
                    Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", firestoreJsonPath);
                    firestoreDb = Google.Cloud.Firestore.FirestoreDb.Create(firestoreProjectId);
                }
                var service = new DiscussionService(firestoreDb);

                bool connected = await service.TestFirestoreConnectionAsync();
                Console.WriteLine(connected ? "Successfully connected to Firestore!" : "Failed to connect to Firestore.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Firestore connection test failed: {ex.Message}");
            }
        }
    }
}
