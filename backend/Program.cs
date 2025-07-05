using HealthHubBackend.Services;
using Google.Cloud.Firestore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers();

// Configure Firestore
var firestoreProjectId = builder.Configuration["Firestore:ProjectId"];
var firestoreCredentialsPath = builder.Configuration["Firestore:CredentialsPath"];

if (!string.IsNullOrEmpty(firestoreProjectId) && !string.IsNullOrEmpty(firestoreCredentialsPath))
{
    if (File.Exists(firestoreCredentialsPath))
    {
        Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", firestoreCredentialsPath);
        builder.Services.AddSingleton<FirestoreDb>(FirestoreDb.Create(firestoreProjectId));
        Console.WriteLine($"Firestore configured with project: {firestoreProjectId}");
    }
    else
    {
        Console.WriteLine($"Warning: Firebase credentials file not found at: {firestoreCredentialsPath}");
        Console.WriteLine("Firestore will not be available. Please add your Firebase service account key.");
        builder.Services.AddSingleton<FirestoreDb>(_ => null!); // null-forgiving operator
    }
}
else
{
    Console.WriteLine("Warning: Firestore configuration missing in appsettings.json");
    builder.Services.AddSingleton<FirestoreDb>(_ => null!);
}

// Register services
builder.Services.AddScoped<DiscussionService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Map controllers
app.MapControllers();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.MapGet("/ping", () => Results.Ok(new { message = "pong" }));

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
