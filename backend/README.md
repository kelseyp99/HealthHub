# HealthHubBackend

This is a .NET Web API backend project for HealthHub, with planned integration for both MongoDB and Google Firestore. The backend will provide endpoints for discussion data, supporting both databases.

## Features
- ASP.NET Core Web API
- MongoDB integration
- Google Firestore integration
- DiscussionService for dual-database support
- Test endpoint for Firestore connectivity

## Getting Started
1. Install .NET 6 or later.
2. Restore dependencies:
   ```
dotnet restore
   ```
3. Build the project:
   ```
dotnet build
   ```
4. Run the project:
   ```
dotnet run --project HealthHubBackend/HealthHubBackend.csproj
   ```

## Next Steps
- Add MongoDB and Firestore NuGet packages
- Implement DiscussionService
- Add Firestore connectivity test endpoint

---

For workspace-specific Copilot instructions, see `.github/copilot-instructions.md`.
