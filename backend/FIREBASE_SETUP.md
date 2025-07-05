# HealthHub Backend - Firebase Setup Instructions

## Firebase Service Account Setup

To connect your .NET backend to Firebase/Firestore, you need to create a service account key:

### Steps:

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select your project: `lifelog-f2904`

2. **Navigate to Project Settings**
   - Click on the gear icon ⚙️ next to "Project Overview"
   - Select "Project settings"

3. **Go to Service Accounts Tab**
   - Click on the "Service accounts" tab
   - You should see "Firebase Admin SDK"

4. **Generate New Private Key**
   - Click "Generate new private key"
   - This will download a JSON file

5. **Save the File**
   - Rename the downloaded file to: `firebase-service-account.json`
   - Place it in your project root: `C:\Users\philk\Projects2\HealthHubBackend\firebase-service-account.json`

6. **Verify Configuration**
   - Your `appsettings.json` already points to the correct path
   - Once you add the file, restart the application

### Current Configuration Status:
- ✅ Project ID: `lifelog-f2904` 
- ✅ Firebase client configuration available
- ❌ Service account key missing
- ✅ .NET application configured and ready

### Running the Application:
```bash
dotnet run
```

### Testing Endpoints:
- Health check: `GET /ping`
- Firestore test: `GET /api/FirestoreTest/test-connection`
- Weather forecast: `GET /weatherforecast`

### Security Note:
- Never commit the `firebase-service-account.json` file to version control
- Add it to your `.gitignore` file
- In production, use environment variables or secure key management
