// Controllers/EpisodesController.cs
using Microsoft.AspNetCore.Mvc;
using TvShowTracker.Application.Interfaces;
using TvShowTracker.Application.DTOs; // ✅ USING ADICIONADO

namespace TvShowTracker.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EpisodesController : ControllerBase
    {
        private readonly IEpisodeService _episodeService;
        private readonly ILogger<EpisodesController> _logger;

        public EpisodesController(IEpisodeService episodeService, ILogger<EpisodesController> logger)
        {
            _episodeService = episodeService;
            _logger = logger;
        }

        [HttpGet("tvshow/{tvShowId}")]
        public async Task<ActionResult<List<EpisodeDto>>> GetEpisodesByTvShow(int tvShowId)
        {
            try
            {
                _logger.LogInformation("🎬 Buscando episódios para TV Show ID: {TvShowId}", tvShowId);
                
                var episodes = await _episodeService.GetEpisodesByTvShowAsync(tvShowId);
                
                _logger.LogInformation("✅ Encontrados {Count} episódios para TV Show ID: {TvShowId}", 
                    episodes.Count, tvShowId);
                
                return Ok(episodes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Erro ao buscar episódios para TV Show ID: {TvShowId}", tvShowId);
                return StatusCode(500, new { message = "Erro ao buscar episódios" });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EpisodeDto>> GetEpisode(int id)
        {
            try
            {
                _logger.LogInformation("🎬 Buscando episódio ID: {EpisodeId}", id);
                
                var episode = await _episodeService.GetEpisodeByIdAsync(id);
                
                if (episode == null)
                {
                    _logger.LogWarning("⚠️ Episódio não encontrado ID: {EpisodeId}", id);
                    return NotFound(new { message = "Episódio não encontrado" });
                }
                
                _logger.LogInformation("✅ Episódio encontrado: {Title} (ID: {EpisodeId})", 
                    episode.Title, id);
                
                return Ok(episode);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Erro ao buscar episódio ID: {EpisodeId}", id);
                return StatusCode(500, new { message = "Erro ao buscar episódio" });
            }
        }

        [HttpGet("tvshow/{tvShowId}/season/{seasonNumber}")]
        public async Task<ActionResult<List<EpisodeDto>>> GetEpisodesBySeason(int tvShowId, int seasonNumber)
        {
            try
            {
                _logger.LogInformation("🎬 Buscando episódios da temporada {Season} para TV Show ID: {TvShowId}", 
                    seasonNumber, tvShowId);
                
                var episodes = await _episodeService.GetEpisodesByTvShowAsync(tvShowId);
                var seasonEpisodes = episodes.Where(e => e.SeasonNumber == seasonNumber).ToList();
                
                _logger.LogInformation("✅ Encontrados {Count} episódios da temporada {Season} para TV Show ID: {TvShowId}", 
                    seasonEpisodes.Count, seasonNumber, tvShowId);
                
                return Ok(seasonEpisodes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Erro ao buscar episódios da temporada {Season} para TV Show ID: {TvShowId}", 
                    seasonNumber, tvShowId);
                return StatusCode(500, new { message = "Erro ao buscar episódios da temporada" });
            }
        }

        [HttpGet("tvshow/{tvShowId}/season/{seasonNumber}/episode/{episodeNumber}")]
        public async Task<ActionResult<EpisodeDto>> GetEpisodeByNumber(int tvShowId, int seasonNumber, int episodeNumber)
        {
            try
            {
                _logger.LogInformation("🎬 Buscando episódio S{Season}E{Episode} para TV Show ID: {TvShowId}", 
                    seasonNumber, episodeNumber, tvShowId);
                
                var episodes = await _episodeService.GetEpisodesByTvShowAsync(tvShowId);
                var episode = episodes.FirstOrDefault(e => 
                    e.SeasonNumber == seasonNumber && e.EpisodeNumber == episodeNumber);
                
                if (episode == null)
                {
                    _logger.LogWarning("⚠️ Episódio S{Season}E{Episode} não encontrado para TV Show ID: {TvShowId}", 
                        seasonNumber, episodeNumber, tvShowId);
                    return NotFound(new { message = "Episódio não encontrado" });
                }
                
                _logger.LogInformation("✅ Episódio encontrado: {Title} (S{Season}E{Episode})", 
                    episode.Title, seasonNumber, episodeNumber);
                
                return Ok(episode);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Erro ao buscar episódio S{Season}E{Episode} para TV Show ID: {TvShowId}", 
                    seasonNumber, episodeNumber, tvShowId);
                return StatusCode(500, new { message = "Erro ao buscar episódio" });
            }
        }
    }
}