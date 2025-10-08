using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TvShowTracker.Application.Interfaces;
using TvShowTracker.Application.DTOs;

namespace TvShowTracker.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TvShowsController : ControllerBase
    {
        private readonly ITvShowService _tvShowService;

        public TvShowsController(ITvShowService tvShowService)
        {
            _tvShowService = tvShowService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<TvShowDto>>> GetTvShows(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? genre = null,
            [FromQuery] string? type = null,
            [FromQuery] string? search = null,
            [FromQuery] string? sortBy = "Title",
            [FromQuery] bool sortDescending = false)
        {
            var query = new TvShowQuery
            {
                Page = page,
                PageSize = pageSize,
                Genre = genre,
                Type = type,
                Search = search,
                SortBy = sortBy,
                SortDescending = sortDescending
            };

            var result = await _tvShowService.GetTvShowsAsync(query);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TvShowDetailDto>> GetTvShow(int id)
        {
            var tvShow = await _tvShowService.GetTvShowByIdAsync(id);
            if (tvShow == null)
            {
                return NotFound();
            }
            return Ok(tvShow);
        }

        [HttpGet("genres")]
        public async Task<ActionResult<List<string>>> GetGenres()
        {
            var genres = await _tvShowService.GetAvailableGenresAsync();
            return Ok(genres);
        }

        [HttpGet("types")]
        public async Task<ActionResult<List<string>>> GetTypes()
        {
            var types = await _tvShowService.GetAvailableTypesAsync();
            return Ok(types);
        }

        [Authorize]
        [HttpGet("recommendations")]
        public async Task<ActionResult<List<TvShowDto>>> GetRecommendations()
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
            var recommendations = await _tvShowService.GetRecommendedTvShowsAsync(userId);
            return Ok(recommendations);
        }
    }
}