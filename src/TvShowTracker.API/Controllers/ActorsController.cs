using Microsoft.AspNetCore.Mvc;
using TvShowTracker.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace TvShowTracker.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ActorsController : ControllerBase
    {
        private readonly IActorService _actorService;

        public ActorsController(IActorService actorService)
        {
            _actorService = actorService;
        }

        [HttpGet]
        public async Task<IActionResult> GetActors([FromQuery] string? search = null, [FromQuery] string? sortBy = "Name")
        {
            try
            {
                // Corrige o primeiro erro - usar ActorQuery em vez de parâmetros separados
                var query = new ActorQuery 
                { 
                    Search = search, 
                    SortBy = sortBy 
                };
                
                var actors = await _actorService.GetActorsAsync(query);
                return Ok(actors);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving actors", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetActor(int id)
        {
            try
            {
                var actor = await _actorService.GetActorByIdAsync(id);
                if (actor == null)
                {
                    return NotFound(new { message = "Actor not found" });
                }
                return Ok(actor);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving actor", error = ex.Message });
            }
        }

        [HttpGet("{id}/tvshows")]
        public async Task<IActionResult> GetActorTvShows(int id)
        {
            try
            {
                // Corrige o segundo erro - usar o novo método
                var tvShows = await _actorService.GetActorTvShowsAsync(id);
                return Ok(tvShows);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving actor TV shows", error = ex.Message });
            }
        }
    }
}