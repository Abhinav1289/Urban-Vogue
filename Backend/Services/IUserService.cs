using Capstone.Models;

namespace Capstone.Services
{
    public interface IUserService
    {
        Task<bool> UserExistsAsync(string email);
        Task RegisterUserAsync(User user);
        Task<User?> GetUserByEmailAsync(string email);
        Task<User?> GetUserByIdAsync(int userId);  
    }

}
