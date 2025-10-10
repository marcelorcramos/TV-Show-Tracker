using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TvShowTracker.Application.DTOs;
using TvShowTracker.Application.Interfaces;
using TvShowTracker.Domain.Entities;
using TvShowTracker.Infrastructure.Data;

namespace TvShowTracker.Infrastructure.Services
{
    public class TvShowService : ITvShowService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ICacheService _cacheService;

        public TvShowService(ApplicationDbContext context, IMapper mapper, ICacheService cacheService)
        {
            _context = context;
            _mapper = mapper;
            _cacheService = cacheService;
            SeedSampleDataAsync().Wait(); // Adicionar dados de exemplo
        }

        private async Task SeedSampleDataAsync()
        {
            // Verificar se já existem TV Shows
            if (!await _context.TvShows.AnyAsync())
            {
                var tvShows = new List<TvShow>
                {
                    new TvShow
                    {
                        Title = "Breaking Bad",
                        Description = "A high school chemistry teacher diagnosed with cancer turns to cooking meth to secure his family's future.",
                        Genre = "Drama",
                        Type = "Series",
                        ReleaseDate = new DateTime(2008, 1, 20),
                        Rating = 9.5m,
                        Seasons = 5,
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "Stranger Things",
                        Description = "When a young boy disappears, his mother uncovers mysteries involving secret experiments and supernatural forces.",
                        Genre = "Sci-Fi",
                        Type = "Series", 
                        ReleaseDate = new DateTime(2016, 7, 15),
                        Rating = 8.7m,
                        Seasons = 4,
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "The Crown",
                        Description = "Follows the political rivalries and romance of Queen Elizabeth II's reign.",
                        Genre = "Drama",
                        Type = "Series",
                        ReleaseDate = new DateTime(2016, 11, 4),
                        Rating = 8.6m,
                        Seasons = 6,
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "Game of Thrones",
                        Description = "Nine noble families fight for control over the lands of Westeros.",
                        Genre = "Fantasy",
                        Type = "Series",
                        ReleaseDate = new DateTime(2011, 4, 17),
                        Rating = 9.3m,
                        Seasons = 8,
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "The Mandalorian",
                        Description = "The travels of a lone bounty hunter in the outer reaches of the galaxy.",
                        Genre = "Sci-Fi",
                        Type = "Series",
                        ReleaseDate = new DateTime(2019, 11, 12),
                        Rating = 8.8m,
                        Seasons = 3,
                        CreatedAt = DateTime.UtcNow
                    }
                };

                _context.TvShows.AddRange(tvShows);
                await _context.SaveChangesAsync();
            }

            // Verificar se já existem Atores
           // Verificar se já existem Atores
if (!await _context.Actors.AnyAsync())
{
    var actors = new List<Actor>
    {
        new Actor
        {
            Name = "Bryan Cranston",
            Bio = "American actor known for Breaking Bad",
            Nationality = "American",
            BirthDate = new DateTime(1956, 3, 7),
            CreatedAt = DateTime.UtcNow
        },
        new Actor
        {
            Name = "Millie Bobby Brown", 
            Bio = "British actress known for Stranger Things",
            Nationality = "British",
            BirthDate = new DateTime(2004, 2, 19),
            CreatedAt = DateTime.UtcNow
        },
        new Actor
        {
            Name = "Pedro Pascal",
            Bio = "Chilean-American actor known for The Mandalorian",
            Nationality = "Chilean-American",
            BirthDate = new DateTime(1975, 4, 2),
            CreatedAt = DateTime.UtcNow
        },
        new Actor
        {
            Name = "Emilia Clarke",
            Bio = "English actress known for Game of Thrones",
            Nationality = "British",
            BirthDate = new DateTime(1986, 10, 23),
            CreatedAt = DateTime.UtcNow
        }
    };

    _context.Actors.AddRange(actors);
    await _context.SaveChangesAsync();
}
        }
        

        public async Task<PagedResult<TvShowDto>> GetTvShowsAsync(TvShowQuery query)
        {
            var tvShowsQuery = _context.TvShows.AsQueryable();

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
                _ => tvShowsQuery.OrderBy(t => t.Title) // Default sort
            };

            // Get total count for pagination
            var totalCount = await tvShowsQuery.CountAsync();

            // Apply pagination
            var tvShows = await tvShowsQuery
                .Skip((query.Page - 1) * query.PageSize)
                .Take(query.PageSize)
                .ToListAsync();

            var tvShowDtos = _mapper.Map<List<TvShowDto>>(tvShows);

            return new PagedResult<TvShowDto>
            {
                Items = tvShowDtos,
                TotalCount = totalCount,
                Page = query.Page,
                PageSize = query.PageSize
            };
        }

        public async Task<TvShowDetailDto?> GetTvShowByIdAsync(int id)
        {
            var tvShow = await _context.TvShows
                .Include(t => t.Episodes.OrderBy(e => e.SeasonNumber).ThenBy(e => e.EpisodeNumber))
                .Include(t => t.TvShowActors)
                    .ThenInclude(ta => ta.Actor)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (tvShow == null) return null;

            var tvShowDetail = _mapper.Map<TvShowDetailDto>(tvShow);
            
            // Map featured actors
            tvShowDetail.FeaturedActors = tvShow.TvShowActors
                .Where(ta => ta.IsFeatured)
                .Select(ta => _mapper.Map<ActorDto>(ta.Actor))
                .ToList();

            return tvShowDetail;
        }

       public async Task<List<string>> GetAvailableGenresAsync()
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

        await _cacheService.SetAsync(cacheKey, genres, TimeSpan.FromHours(6)); // Cache for 6 hours
        
        return genres;
         }

         public async Task<List<string>> GetAvailableTypesAsync()
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

        public async Task<List<TvShowDto>> GetRecommendedTvShowsAsync(int userId)
        {
            // Use the recommendation service instead of simple random
            var recommendationService = new RecommendationService(_context, _mapper);
            return await recommendationService.GetRecommendationsAsync(userId, 5);
        }
    }
}