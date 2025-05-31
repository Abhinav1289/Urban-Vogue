namespace Capstone.Services
{
    public interface IJwtService
    {
        string GenerateToken(int userId, string email);
        string? ValidateToken(string token); // ✅ Add this method
    }


}
