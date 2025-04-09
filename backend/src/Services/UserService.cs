using MyApp.Models;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MyApp.Services
{
    
        public class UserService
        {
            private readonly IMongoCollection<User> _users;
        
            public UserService(IMongoDatabase database) => _users = database.GetCollection<User>("Users");
        

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _users.Find(_ => true).ToListAsync();
        }

        public async Task CreateUserAsync(User user)
        {
            await _users.InsertOneAsync(user);
        }
    }
}
