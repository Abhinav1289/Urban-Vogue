namespace Capstone.Services
{
    public interface ILoginService
    {
        Task<bool> ValidateUserCredentialsAsync(string email, string password);
    }
}