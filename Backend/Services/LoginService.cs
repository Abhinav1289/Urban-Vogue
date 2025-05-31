using BCrypt.Net;
using Capstone.Data;
using Capstone.Models;
using Microsoft.EntityFrameworkCore;

namespace Capstone.Services
{
    public class LoginService : ILoginService
    {
        private readonly ApplicationDbContext _context;

        public LoginService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> ValidateUserCredentialsAsync(string email, string password)
        {
            // Find the user by email
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            
            if (user == null)
                return false; // User does not exist

            // Check if the password matches the hashed password in the database
            return BCrypt.Net.BCrypt.Verify(password, user.Password);
        }
    }
}
