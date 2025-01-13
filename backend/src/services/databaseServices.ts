import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbName = 'mydatabase';

MongoClient.connect(url)
  .then((client) => {
    const db = client.db(dbName);

    // Access the ActivityLog collection
    const activityLogCollection = db.collection('ActivityLog');

    // You can now use the activityLogCollection variable to perform CRUD operations
  })
  .catch((err) => {
    console.log(err);
  });

  export async function selectAllDiscussions(): Promise<any[]> {
    try {
      const client = await MongoClient.connect(url);
      const db = client.db(dbName);
      const discussionCollection = db.collection('Discussion');
      const discussions = await discussionCollection.find().toArray();
      client.close();
      return discussions;
    } catch (err) {
      console.log(err);
      return [];
    }
  }