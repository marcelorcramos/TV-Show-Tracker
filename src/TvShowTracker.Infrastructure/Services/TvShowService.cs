using Microsoft.EntityFrameworkCore;
using TvShowTracker.Application.DTOs;
using TvShowTracker.Application.Interfaces;
using TvShowTracker.Infrastructure.Data;
using AutoMapper;

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
                var tvShowsQuery = _context.TvShows
                    .Include(t => t.TvShowActors)
                        .ThenInclude(ta => ta.Actor)
                    .AsQueryable();

                // Apply filters
                if (!string.IsNullOrEmpty(query.Genre))
                {
                    tvShowsQuery = tvShowsQuery.Where(t => t.Genre == query.Genre);
                }

                if (!string.IsNullOrEmpty(query.Type))
                {
                    tvShowsQuery = tvShowsQuery.Where(t => t.Type == query.Type);
                }

                if (!string.IsNullOrEmpty(query.Search))
                {
                    tvShowsQuery = tvShowsQuery.Where(t =>
                        t.Title.Contains(query.Search) ||
                        (t.Description != null && t.Description.Contains(query.Search)));
                }

                // Apply sorting
                tvShowsQuery = query.SortBy?.ToLower() switch
                {
                    "title" => query.SortDescending
                        ? tvShowsQuery.OrderByDescending(t => t.Title)
                        : tvShowsQuery.OrderBy(t => t.Title),
                    "releasedate" => query.SortDescending
                        ? tvShowsQuery.OrderByDescending(t => t.ReleaseDate)
                        : tvShowsQuery.OrderBy(t => t.ReleaseDate),
                    "rating" => query.SortDescending
                        ? tvShowsQuery.OrderByDescending(t => t.Rating)
                        : tvShowsQuery.OrderBy(t => t.Rating),
                    "seasons" => query.SortDescending
                        ? tvShowsQuery.OrderByDescending(t => t.Seasons)
                        : tvShowsQuery.OrderBy(t => t.Seasons),
                    _ => tvShowsQuery.OrderBy(t => t.Title)
                };

                // Get total count for pagination
                var totalCount = await tvShowsQuery.CountAsync();

                // Apply pagination
                var tvShows = await tvShowsQuery
                    .Skip((query.Page - 1) * query.PageSize)
                    .Take(query.PageSize)
                    .ToListAsync();

                // Mapear para DTO e incluir os 3 principais atores
                var tvShowDtos = tvShows.Select(tvShow =>
                {
                    var dto = _mapper.Map<TvShowDto>(tvShow);
                    
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
                        
                    return dto;
                }).ToList();

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
