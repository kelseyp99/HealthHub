using Google.Cloud.Firestore;

namespace HealthHubBackend.Services
{
    public interface IFirestoreService
    {
        FirestoreDb? Database { get; }
        bool IsConfigured { get; }
        Task<bool> TestConnectionAsync();
    }

    public class FirestoreService : IFirestoreService
    {
        public FirestoreDb? Database { get; private set; }
        public bool IsConfigured => Database != null;

        public FirestoreService(FirestoreDb? database = null)
        {
            Database = database;
        }

        public async Task<bool> TestConnectionAsync()
        {
            if (Database == null)
                return false;

            try
            {
                var collections = await Database.ListRootCollectionsAsync().ToListAsync();
                return collections.Count >= 0;
            }
            catch
            {
                return false;
            }
        }
    }
}
