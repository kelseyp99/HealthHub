using System;
using System.IdentityModel.Tokens.Jwt;
using MongoDB.Driver;
using MongoDB.Bson;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace HealthHub.Services
{
    public interface IDietitianService
    {
        string GenerateJwt(string userId, string dietitianId);
    }

    public class DietitianService : IDietitianService
    {
        private readonly string _jwtSecretKey = "YourSuperSecretKeyHere"; // Replace with your actual secret key
        private readonly string _issuer = "YourAppIssuer";
        private readonly string _audience = "YourAppAudience";

        public string GenerateJwt(string userId, string dietitianId)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_jwtSecretKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("UserId", userId),
                    new Claim("DietitianId", dietitianId)
                }),
                Expires = DateTime.UtcNow.AddDays(7), // Token expiration
                Issuer = _issuer,
                Audience = _audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }

    public class UserService
    {
        private readonly IMongoCollection<User> _users;

        public UserService(IMongoDatabase database)
        {
            _users = database.GetCollection<User>("Users");
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _users.Find(u => true).ToListAsync();
        }

        public async Task<User> GetUserAsync(string id)
        {
            var objectId = new ObjectId(id);
            return await _users.Find(u => u.Id == objectId).FirstOrDefaultAsync();
        }

        public async Task CreateUserAsync(User user)
        {
            await _users.InsertOneAsync(user);
        }

        public async Task UpdateUserAsync(string id, User user)
        {
            var objectId = new ObjectId(id);
            await _users.ReplaceOneAsync(u => u.Id == objectId, user);
        }

        public async Task DeleteUserAsync(string id)
        {
            var objectId = new ObjectId(id);
            await _users.DeleteOneAsync(u => u.Id == objectId);
        }
    }

    public class User
    {
        public ObjectId Id { get; set; }
        public string? Name { get; set; }
        public string Email { get; set; } = string.Empty;
        // Add other properties as needed
    }
}
