using Capstone.Models;
using Capstone.Services;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;

namespace Capstone.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILoginService _loginService;
        private readonly IJwtService _jwtService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IUserService userService, ILoginService loginService, IJwtService jwtService, ILogger<AuthController> logger)
        {
            _userService = userService;
            _loginService = loginService;
            _jwtService = jwtService;
            _logger = logger;
        }

        // ✅ POST: api/auth/signup
        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody] User user)
        {
            if (user == null)
                return BadRequest("Invalid user data.");

            if (await _userService.UserExistsAsync(user.Email))
                return BadRequest("Email is already in use.");

            await _userService.RegisterUserAsync(user);
            return Ok(new { Message = "User registered successfully" });
        }

        // ✅ POST: api/auth/login (Store JWT in HttpOnly Cookie)
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLogin loginRequest)
        {
            if (loginRequest == null || string.IsNullOrEmpty(loginRequest.Email) || string.IsNullOrEmpty(loginRequest.Password))
                return BadRequest("Invalid login data.");

            _logger.LogInformation($"Login attempt for email: {loginRequest.Email}");

            var user = await _userService.GetUserByEmailAsync(loginRequest.Email);

            if (user == null || !await _loginService.ValidateUserCredentialsAsync(loginRequest.Email, loginRequest.Password))
            {
                _logger.LogWarning($"Failed login attempt for email: {loginRequest.Email}");
                return Unauthorized(new { Message = "Invalid email or password" });
            }

            // ✅ Generate JWT Token (Contains `userId`)
            var token = _jwtService.GenerateToken(user.Id, user.Email);

            // ✅ Set JWT in an HTTP-only Secure Cookie
            Response.Cookies.Append("jwt", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = false, // Use `true` in production
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddHours(2) // Token expiry
            });

            return Ok(new { Message = "Login successful" });
        }



        // ✅ GET: api/auth/token (Read JWT from Cookie)
        [HttpGet("token")]
        public async Task<IActionResult> GetCurrentUser()
        {
            if (!Request.Cookies.TryGetValue("jwt", out string? token) || string.IsNullOrEmpty(token))
            {
                return Unauthorized(new { message = "User is not authenticated." });
            }

            var userIdString = _jwtService.ValidateToken(token);
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
            {
                Console.WriteLine("Invalid Token");
                return Unauthorized(new { message = "Invalid token." });
            }

            var user = await _userService.GetUserByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            return Ok(new { user.Id, user.Name, user.Email });
        }





        // ✅ POST: api/auth/logout (Clear JWT Cookie)
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // ✅ Remove JWT token cookie
            Response.Cookies.Delete("jwt");

            return Ok(new { message = "User logged out successfully." });
        }

    }
}