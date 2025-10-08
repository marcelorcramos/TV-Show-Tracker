using Microsoft.AspNetCore.Mvc;
using TvShowTracker.Application.DTOs;
using TvShowTracker.Application.Interfaces;

namespace TvShowTracker.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(CreateUserDto createUserDto)
        {
            try
            {
                var user = await _userService.RegisterAsync(createUserDto);
                return Ok(user);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto loginDto)
        {
            try
            {
                var authResponse = await _userService.LoginAsync(loginDto);
                return Ok(authResponse);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }
    }
}