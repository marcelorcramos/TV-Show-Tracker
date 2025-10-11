using Microsoft.AspNetCore.Mvc;
using TvShowTracker.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using TvShowTracker.Infrastructure.Data;

namespace TvShowTracker.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ActorsController : ControllerBase
    {
        private readonly IActorService _actorService;
        private readonly ApplicationDbContext _context;

        public ActorsController(IActorService actorService, ApplicationDbContext context)
        {
            _actorService = actorService;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetActors(
            [FromQuery] string? search = null, 
            [FromQuery] string? nationality = null,
            [FromQuery] string? sortBy = "Name",
            [FromQuery] bool sortDescending = false,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 12)
        {
            try
            {
                Console.WriteLine($"🎭 ActorsController: GetActors chamado - Search: '{search}', Nationality: '{nationality}', SortBy: '{sortBy}', Page: {page}, PageSize: {pageSize}");

                var query = new ActorQuery 
                { 
                    Search = search, 
                    Nationality = nationality,
                    SortBy = sortBy,
                    SortDescending = sortDescending,
                    Page = page,
                    PageSize = pageSize
                };
                
                var actors = await _actorService.GetActorsAsync(query);
                
                Console.WriteLine($"✅ ActorsController: Retornando {actors.Items.Count} atores de {actors.TotalCount} total");
                
                if (actors.Items.Count > 0)
                {
                    Console.WriteLine($"📋 Primeiro ator: {actors.Items[0].Name} (ID: {actors.Items[0].Id}, Nationality: {actors.Items[0].Nationality})");
                }

                return Ok(actors);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ ActorsController: Erro - {ex.Message}");
                return StatusCode(500, new { message = "Error retrieving actors", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetActor(int id)
        {
            try
            {
                Console.WriteLine($"🎭 ActorsController: GetActor chamado para ID: {id}");
                
                var actor = await _actorService.GetActorByIdAsync(id);
                if (actor == null)
                {
                    Console.WriteLine($"❌ ActorsController: Ator {id} não encontrado");
                    return NotFound(new { message = "Actor not found" });
                }
                
                Console.WriteLine($"✅ ActorsController: Retornando ator {actor.Name}");
                return Ok(actor);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ ActorsController: Erro ao buscar ator {id} - {ex.Message}");
                return StatusCode(500, new { message = "Error retrieving actor", error = ex.Message });
            }
        }

        [HttpGet("{id}/tvshows")]
        public async Task<IActionResult> GetActorTvShows(int id)
        {
            try
            {
                Console.WriteLine($"🎭 ActorsController: GetActorTvShows chamado para ator ID: {id}");
                
                var tvShows = await _actorService.GetActorTvShowsAsync(id);
                
                Console.WriteLine($"✅ ActorsController: Retornando {tvShows.Count()} TV shows para ator {id}");
                return Ok(tvShows);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ ActorsController: Erro ao buscar TV shows do ator {id} - {ex.Message}");
                return StatusCode(500, new { message = "Error retrieving actor TV shows", error = ex.Message });
            }
        }

        [HttpGet("nationalities")]
        public async Task<ActionResult<IEnumerable<string>>> GetNationalities()
        {
            try
            {
                Console.WriteLine($"🎭 ActorsController: GetNationalities chamado");
                
                var nationalities = await _context.Actors
                    .Where(a => a.Nationality != null && a.Nationality != "")
                    .Select(a => a.Nationality)
                    .Distinct()
                    .OrderBy(n => n)
                    .ToListAsync();

                Console.WriteLine($"🌍 ActorsController: Nationalities encontradas: {nationalities.Count}");
                Console.WriteLine($"🌍 Lista de nacionalidades: {string.Join(", ", nationalities)}");
                
                return Ok(nationalities);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ ActorsController: Erro ao obter nacionalidades - {ex.Message}");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }
    }
}