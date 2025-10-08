using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TvShowTracker.Application.DTOs;
using TvShowTracker.Application.Interfaces;

namespace TvShowTracker.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FavoritesController : ControllerBase
    {
        private readonly IUserService _userService;

        public FavoritesController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<List<TvShowDto>>> GetFavorites()
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
            var favorites = await _userService.GetUserFavoritesAsync(userId);
            return Ok(favorites);
        }

        [HttpPost("{tvShowId}")]
        public async Task<ActionResult> AddFavorite(int tvShowId)
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
            var result = await _userService.AddFavoriteTvShowAsync(userId, tvShowId);
            
            if (result)
            {
                return Ok(new { message = "TV show added to favorites" });
            }
            else
            {
                return BadRequest(new { message = "TV show is already in favorites" });
            }
        }

        [HttpDelete("{tvShowId}")]
        public async Task<ActionResult> RemoveFavorite(int tvShowId)
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
            var result = await _userService.RemoveFavoriteTvShowAsync(userId, tvShowId);
            
            if (result)
            {
                return Ok(new { message = "TV show removed from favorites" });
            }
            else
            {
                return BadRequest(new { message = "TV show is not in favorites" });
            }
        }
    }
}