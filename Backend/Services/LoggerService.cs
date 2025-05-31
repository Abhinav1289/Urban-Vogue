using Microsoft.Extensions.Logging;

namespace Capstone.Services
{
    public class LoggerService
    {
        private readonly ILogger<LoggerService> _logger;

        public LoggerService(ILogger<LoggerService> logger)
        {
            _logger = logger;
        }

        public void LogInformation(string message)
        {
            _logger.LogInformation(message);
        }

        public void LogError(string message)
        {
            _logger.LogError(message);
        }
    }
}
