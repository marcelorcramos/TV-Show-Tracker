using Microsoft.AspNetCore.Mvc;
using TvShowTracker.Application.DTOs;
using TvShowTracker.Application.Interfaces;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace TvShowTracker.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IUserService userService, ILogger<AuthController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register([FromBody] CreateUserDto createUserDto)
        {
            try
            {
                _logger.LogInformation("Attempting to register new user: {Email}", createUserDto.Email);
                
                if (string.IsNullOrWhiteSpace(createUserDto.Name) || 
                    string.IsNullOrWhiteSpace(createUserDto.Email) || 
                    string.IsNullOrWhiteSpace(createUserDto.Password))
                {
                    return BadRequest(new { message = "Name, email and password are required" });
                }

                if (createUserDto.Password.Length < 6)
                {
                    return BadRequest(new { message = "Password must be at least 6 characters long" });
                }

                var user = await _userService.RegisterAsync(createUserDto);
                
                _logger.LogInformation("User registered successfully: {Email} (ID: {UserId})", createUserDto.Email, user.Id);
                return Ok(user);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning("Registration failed - user already exists: {Email}", createUserDto.Email);
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during user registration for {Email}", createUserDto.Email);
                return StatusCode(500, new { message = "An error occurred during registration" });
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                _logger.LogInformation("Login attempt for user: {Email}", loginDto.Email);
                
                if (string.IsNullOrWhiteSpace(loginDto.Email) || string.IsNullOrWhiteSpace(loginDto.Password))
                {
                    return BadRequest(new { message = "Email and password are required" });
                }

                var authResponse = await _userService.LoginAsync(loginDto);
                
                _logger.LogInformation("User logged in successfully: {Email} (ID: {UserId})", loginDto.Email, authResponse.User.Id);
                return Ok(authResponse);
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning("Login failed - invalid credentials for {Email}", loginDto.Email);
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login for {Email}", loginDto.Email);
                return StatusCode(500, new { message = "An error occurred during login" });
            }
        }

        // Endpoint sem autorização para debug
        [HttpGet("debug-no-auth")]
        public ActionResult DebugNoAuth()
        {
            return Ok(new { 
                Message = "This endpoint doesn't require authentication",
                Time = DateTime.UtcNow
            });
        }

        [HttpGet("debug-token")]
        [Authorize] // Requer autenticação
        public ActionResult DebugToken()
        {
            try
            {
                _logger.LogInformation("=== DEBUG TOKEN START ===");
                _logger.LogInformation("User Identity: IsAuthenticated={IsAuthenticated}, Name={Name}, AuthenticationType={AuthType}", 
                    User.Identity?.IsAuthenticated, User.Identity?.Name, User.Identity?.AuthenticationType);

                var claims = new List<object>();
                foreach (var claim in User.Claims)
                {
                    claims.Add(new { 
                        Type = claim.Type, 
                        Value = claim.Value,
                        ShortType = claim.Type.Split('/').Last()
                    });
                    _logger.LogInformation("CLAIM: {Type} = {Value}", claim.Type, claim.Value);
                }

                _logger.LogInformation("=== DEBUG TOKEN END ===");

                return Ok(new { 
                    Message = "Token debug information",
                    IsAuthenticated = User.Identity?.IsAuthenticated ?? false,
                    AuthenticationType = User.Identity?.AuthenticationType,
                    Name = User.Identity?.Name,
                    Claims = claims,
                    NameIdentifier = User.FindFirst(ClaimTypes.NameIdentifier)?.Value,
                    Email = User.FindFirst(ClaimTypes.Email)?.Value,
                    NameClaim = User.FindFirst(ClaimTypes.Name)?.Value
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in debug token");
                return StatusCode(500, new { message = "Error in debug token: " + ex.Message });
            }
        }

        [HttpGet("me")]
        [Authorize] // Requer autenticação
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            try
            {
                _logger.LogInformation("=== GET ME START ===");

                if (User.Identity == null || !User.Identity.IsAuthenticated)
                {
                    _logger.LogWarning("User not authenticated - Identity is null or not authenticated");
                    return Unauthorized(new { message = "User not authenticated" });
                }

                // Log todas as claims para debug
                _logger.LogInformation("User authenticated. Claims:");
                foreach (var claim in User.Claims)
                {
                    _logger.LogInformation("  {Type} = {Value}", claim.Type, claim.Value);
                }

                // Busca o user ID
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                _logger.LogInformation("UserId from NameIdentifier: {UserId}", userIdClaim);

                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    _logger.LogWarning("Could not parse user ID from NameIdentifier claim");
                    return Unauthorized(new { message = "Invalid token - could not read user ID" });
                }

                _logger.LogInformation("Parsed userId: {UserId}", userId);

                var user = await _userService.GetUserByIdAsync(userId);
                if (user == null)
                {
                    _logger.LogWarning("User not found in database for ID: {UserId}", userId);
                    return NotFound(new { message = "User not found" });
                }

                _logger.LogInformation("Successfully retrieved user: {Email} (ID: {UserId})", user.Email, user.Id);
                _logger.LogInformation("=== GET ME END ===");
                
                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting current user");
                return StatusCode(500, new { message = "An error occurred while getting user information" });
            }
        }
    }
}