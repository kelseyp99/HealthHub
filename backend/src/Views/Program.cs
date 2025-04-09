using MongoDB.Driver;
using HealthHub.Services;

var builder = WebApplication.CreateBuilder(args);

// MongoDB connection setup
var mongoConnectionString = builder.Configuration.GetValue<string>("MongoDBSettings:ConnectionString");
var databaseName = builder.Configuration.GetValue<string>("MongoDBSettings:DatabaseName");

if (string.IsNullOrEmpty(mongoConnectionString))
{
    throw new ArgumentNullException(nameof(mongoConnectionString), "MongoDB connection string cannot be null or empty.");
}

var mongoClient = new MongoClient(mongoConnectionString);
var mongoDatabase = mongoClient.GetDatabase(databaseName);

// Register MongoDB and services
builder.Services.AddSingleton<IMongoDatabase>(mongoDatabase);
builder.Services.AddSingleton(new ActivityLogService(mongoConnectionString, databaseName));
builder.Services.AddSingleton(new DiscussionService(mongoConnectionString, databaseName));
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<IDietitianService, DietitianService>();

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()    // Allow requests from any origin
               .AllowAnyMethod()    // Allow all HTTP methods (GET, POST, etc.)
               .AllowAnyHeader();   // Allow any headers
    });
});

// Add controllers with case-insensitive JSON options
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
});

// Add logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole(); // Logs to the terminal/console
builder.Logging.AddDebug();   // Logs to debug output (useful in IDEs)


// Build the app
var app = builder.Build();

// Enable CORS
app.UseCors("AllowAll");

// Enable request logging
app.Use(async (context, next) =>
{
    Console.WriteLine($"Incoming request: {context.Request.Method} {context.Request.Path}");
    await next.Invoke();
});

// Enable developer exception page for development
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

// Map controllers
app.MapControllers();

// Run the application
app.Run();
