using Microsoft.EntityFrameworkCore;
using TvShowTracker.Application.DTOs;
using TvShowTracker.Application.Interfaces;
using TvShowTracker.Infrastructure.Data;
using AutoMapper;
using TvShowTracker.Domain.Entities;

namespace TvShowTracker.Infrastructure.Services
{
    public class TvShowService : ITvShowService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ICacheService _cacheService;
        private readonly IRecommendationService _recommendationService;

        public TvShowService(ApplicationDbContext context, IMapper mapper, ICacheService cacheService, IRecommendationService recommendationService)
        {
            _context = context;
            _mapper = mapper;
            _cacheService = cacheService;
            _recommendationService = recommendationService;
        }

        public async Task<PagedResult<TvShowDto>> GetTvShowsAsync(TvShowQuery query)
        {
            try
            {
                Console.WriteLine($"TvShowService - Parâmetros recebidos:");
                Console.WriteLine($"   SortBy: {query.SortBy}");
                Console.WriteLine($"   SortDescending: {query.SortDescending}");
                Console.WriteLine($"   Genre: {query.Genre}");
                Console.WriteLine($"   Type: {query.Type}");
                Console.WriteLine($"   Search: {query.Search}");
                Console.WriteLine($"   Page: {query.Page}");
                Console.WriteLine($"   PageSize: {query.PageSize}");

                var tvShowsQuery = _context.TvShows
                    .Include(t => t.TvShowActors)
                        .ThenInclude(ta => ta.Actor)
                    .Include(t => t.Episodes) 
                    .AsQueryable();

                // Aplicar filtros
                if (!string.IsNullOrEmpty(query.Genre))
                {
                    tvShowsQuery = tvShowsQuery.Where(t => t.Genre == query.Genre);
                    Console.WriteLine($"Aplicado filtro de gênero: {query.Genre}");
                }

                if (!string.IsNullOrEmpty(query.Type))
                {
                    tvShowsQuery = tvShowsQuery.Where(t => t.Type == query.Type);
                    Console.WriteLine($"Aplicado filtro de tipo: {query.Type}");
                }

                if (!string.IsNullOrEmpty(query.Search))
                {
                    tvShowsQuery = tvShowsQuery.Where(t =>
                        t.Title.Contains(query.Search) ||
                        (t.Description != null && t.Description.Contains(query.Search)));
                    Console.WriteLine($"Aplicado filtro de busca: {query.Search}");
                }

                // CORREÇÃO: Obter todos os dados primeiro
                var allTvShows = await tvShowsQuery.ToListAsync();
                Console.WriteLine($"Total de TV shows encontrados: {allTvShows.Count}");
                
                // CORREÇÃO: Usar var para evitar problemas de namespace
                var sortedTvShows = allTvShows.AsEnumerable();

                // Aplicar ordenação no lado do cliente
                switch (query.SortBy?.ToLower())
                {
                    case "title":
                        sortedTvShows = query.SortDescending
                            ? sortedTvShows.OrderByDescending(t => t.Title)
                            : sortedTvShows.OrderBy(t => t.Title);
                        Console.WriteLine($"Ordenação aplicada: Title (Descending: {query.SortDescending})");
                        break;
                    case "releasedate":
                        sortedTvShows = query.SortDescending
                            ? sortedTvShows.OrderByDescending(t => t.ReleaseDate)
                            : sortedTvShows.OrderBy(t => t.ReleaseDate);
                        Console.WriteLine($"Ordenação aplicada: ReleaseDate (Descending: {query.SortDescending})");
                        break;
                    case "rating":
                        sortedTvShows = query.SortDescending
                            ? sortedTvShows.OrderByDescending(t => t.Rating)
                            : sortedTvShows.OrderBy(t => t.Rating);
                        Console.WriteLine($"Ordenação aplicada: Rating (Descending: {query.SortDescending})");
                        break;
                    case "seasons":
                        sortedTvShows = query.SortDescending
                            ? sortedTvShows.OrderByDescending(t => t.Seasons)
                            : sortedTvShows.OrderBy(t => t.Seasons);
                        Console.WriteLine($"🎬 Ordenação aplicada: Seasons (Descending: {query.SortDescending})");
                        break;
                    default:
                        sortedTvShows = sortedTvShows.OrderBy(t => t.Title);
                        Console.WriteLine($"🎬 Ordenação padrão aplicada: Title");
                        break;
                }

                var totalCount = sortedTvShows.Count();
                var pagedTvShows = sortedTvShows
                    .Skip((query.Page - 1) * query.PageSize)
                    .Take(query.PageSize)
                    .ToList();

                Console.WriteLine($"🎬 Paginação: {pagedTvShows.Count} itens da página {query.Page}");

                // CORREÇÃO CRÍTICA: Mapeamento MANUAL para garantir DESCRIPTION
                var tvShowDtos = pagedTvShows.Select(tvShow =>
                {
                    // MAPEAMENTO MANUAL - GARANTE TODOS OS CAMPOS
                    var dto = new TvShowDto
                    {
                        Id = tvShow.Id,
                        Title = tvShow.Title,
                        Description = tvShow.Description, 
                        Genre = tvShow.Genre,
                        Type = tvShow.Type,
                        Rating = tvShow.Rating,
                        ReleaseDate = tvShow.ReleaseDate,
                        Seasons = tvShow.Seasons,
                        Duration = tvShow.Duration,
                        ImageUrl = tvShow.ImageUrl,
                        Episodes = new List<EpisodeDto>(),
                        FeaturedActors = new List<ActorDto>(),
                        IsFavorite = false
                    };

                    Console.WriteLine($"📝 TV Show '{tvShow.Title}': Description = '{tvShow.Description?.Substring(0, Math.Min(50, tvShow.Description?.Length ?? 0))}...'");

                    // Mapear atores destacados
                    dto.FeaturedActors = tvShow.TvShowActors?
                        .Where(ta => ta.IsFeatured && ta.Actor != null)
                        .Take(3)
                        .Select(ta => new ActorDto 
                        { 
                            Id = ta.Actor.Id,
                            Name = ta.Actor.Name,
                            CharacterName = ta.CharacterName,
                            ImageUrl = ta.Actor.ImageUrl
                        })
                        .ToList() ?? new List<ActorDto>();

                    // Mapear episódios se existirem
                    if (tvShow.Episodes != null && tvShow.Episodes.Any())
                    {
                        dto.Episodes = tvShow.Episodes
                            .OrderBy(e => e.SeasonNumber)
                            .ThenBy(e => e.EpisodeNumber)
                            .Select(e => _mapper.Map<EpisodeDto>(e))
                            .ToList();
                        
                        Console.WriteLine($"📺 TV Show '{tvShow.Title}' tem {tvShow.Episodes.Count} episódios");
                    }
                    else
                    {
                        dto.Episodes = new List<EpisodeDto>();
                        Console.WriteLine($"📺 TV Show '{tvShow.Title}' não tem episódios");
                    }
                        
                    return dto;
                }).ToList();

                Console.WriteLine($"🎬 Retornando {tvShowDtos.Count} TV shows mapeados COM DESCRIPTION");

                return new PagedResult<TvShowDto>
                {
                    Items = tvShowDtos,
                    TotalCount = totalCount,
                    Page = query.Page,
                    PageSize = query.PageSize
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Erro em GetTvShowsAsync: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                throw;
            }
        }

        public async Task<List<string>> GetAvailableGenresAsync()
        {
            try
            {
                var cacheKey = "available_genres";
                var cachedGenres = await _cacheService.GetAsync<List<string>>(cacheKey);
                if (cachedGenres != null)
                {
                    return cachedGenres;
                }

                var genres = await _context.TvShows
                    .Where(t => t.Genre != null)
                    .Select(t => t.Genre!)
                    .Distinct()
                    .OrderBy(g => g)
                    .ToListAsync();

                await _cacheService.SetAsync(cacheKey, genres, TimeSpan.FromHours(6));
                return genres;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Erro em GetAvailableGenresAsync: {ex.Message}");
                return new List<string>();
            }
        }

        public async Task<List<string>> GetAvailableTypesAsync()
        {
            try
            {
                var cacheKey = "available_types";
                var cachedTypes = await _cacheService.GetAsync<List<string>>(cacheKey);
                if (cachedTypes != null)
                {
                    return cachedTypes;
                }

                var types = await _context.TvShows
                    .Where(t => t.Type != null)
                    .Select(t => t.Type!)
                    .Distinct()
                    .OrderBy(t => t)
                    .ToListAsync();

                await _cacheService.SetAsync(cacheKey, types, TimeSpan.FromHours(6));
                return types;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Erro em GetAvailableTypesAsync: {ex.Message}");
                return new List<string>();
            }
        }

        public async Task<TvShowDetailDto?> GetTvShowByIdAsync(int id)
        {
            try
            {
                var tvShow = await _context.TvShows
                    .Include(t => t.Episodes.OrderBy(e => e.SeasonNumber).ThenBy(e => e.EpisodeNumber))
                    .Include(t => t.TvShowActors)
                        .ThenInclude(ta => ta.Actor)
                    .FirstOrDefaultAsync(t => t.Id == id);

                if (tvShow == null) return null;

                var tvShowDetail = _mapper.Map<TvShowDetailDto>(tvShow);
                
                tvShowDetail.FeaturedActors = tvShow.TvShowActors
                    .Where(ta => ta.IsFeatured)
                    .Select(ta => new ActorDto 
                    { 
                        Id = ta.Actor.Id,
                        Name = ta.Actor.Name,
                        CharacterName = ta.CharacterName
                    })
                    .ToList();

                return tvShowDetail;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Erro em GetTvShowByIdAsync: {ex.Message}");
                throw;
            }
        }

        public async Task<List<TvShowDto>> GetRecommendedTvShowsAsync(int userId)
        {
            try
            {
                return await _recommendationService.GetRecommendationsAsync(userId, 5);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Erro em GetRecommendedTvShowsAsync: {ex.Message}");
                return new List<TvShowDto>();
            }
        }
    }
}