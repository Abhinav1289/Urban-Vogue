using BCrypt.Net;
using Capstone.Data;
using Capstone.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging; // Added for logging
using System;
using System.Threading.Tasks;

namespace Capstone.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;
        private readonly LoggerService _logger; // Added logger service

        public UserService(ApplicationDbContext context, LoggerService logger) // Updated constructor
        {
            _context = context;
            _logger = logger; // Initialize logger
        }

        public async Task<bool> UserExistsAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }

        public async Task RegisterUserAsync(User user)
        {
            // Hash the password before saving
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

            // Save user to database
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"User registered: {user.Email}"); // Log registration
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> GetUserByIdAsync(int userId)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        }


    }
}
