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
            _ = SeedSampleDataAsync();
        }

        private async Task SeedSampleDataAsync()
        {
            try
            {
                if (await _context.TvShows.AnyAsync())
                {
                    Console.WriteLine("✅ Banco de dados já populado. Pulando seed.");
                    return;
                }

                var tvShows = new List<TvShow>
                {
                    // SERIES
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
                    },
                    
                    // FILMES (sem Duration por enquanto)
                    new TvShow
                    {
                        Title = "The Shawshank Redemption",
                        Description = "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
                        Genre = "Drama",
                        Type = "Movie",
                        ReleaseDate = new DateTime(1994, 9, 23),
                        Rating = 9.3m,
                        Seasons = null,
                        Duration = 142,
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "The Godfather",
                        Description = "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
                        Genre = "Crime",
                        Type = "Movie",
                        ReleaseDate = new DateTime(1972, 3, 24),
                        Rating = 9.2m,
                        Seasons = null,
                        Duration = 175,
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "The Dark Knight",
                        Description = "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
                        Genre = "Action",
                        Type = "Movie",
                        ReleaseDate = new DateTime(2008, 7, 18),
                        Rating = 9.0m,
                        Seasons = null,
                        Duration = 152,
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "Pulp Fiction",
                        Description = "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
                        Genre = "Crime",
                        Type = "Movie",
                        ReleaseDate = new DateTime(1994, 10, 14),
                        Rating = 8.9m,
                        Seasons = null,
                        Duration = 154,
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "Forrest Gump",
                        Description = "The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man with an IQ of 75.",
                        Genre = "Drama",
                        Type = "Movie",
                        ReleaseDate = new DateTime(1994, 7, 6),
                        Rating = 8.8m,
                        Seasons = null,
                        Duration = 142,
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "Inception",
                        Description = "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
                        Genre = "Sci-Fi",
                        Type = "Movie",
                        ReleaseDate = new DateTime(2010, 7, 16),
                        Rating = 8.8m,
                        Seasons = null,
                        Duration = 148,
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "The Matrix",
                        Description = "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
                        Genre = "Sci-Fi",
                        Type = "Movie",
                        ReleaseDate = new DateTime(1999, 3, 31),
                        Rating = 8.7m,
                        Seasons = null,
                        Duration = 136,
                        CreatedAt = DateTime.UtcNow
                    }
                };

                await _context.TvShows.AddRangeAsync(tvShows);
                await _context.SaveChangesAsync();

                Console.WriteLine($"✅ Seed completado! Adicionados {tvShows.Count} itens (Séries: 5, Filmes: 7).");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Erro no seed: {ex.Message}");
            }
        }

        public async Task<PagedResult<TvShowDto>> GetTvShowsAsync(TvShowQuery query)
        {
            try
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

                // Apply sorting (sem Duration por enquanto)
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

                var tvShowDtos = _mapper.Map<List<TvShowDto>>(tvShows);

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
                    .Select(ta => _mapper.Map<ActorDto>(ta.Actor))
                    .ToList();

                return tvShowDetail;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Erro em GetTvShowByIdAsync: {ex.Message}");
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

        public async Task<List<TvShowDto>> GetRecommendedTvShowsAsync(int userId)
        {
            try
            {
                var recommendationService = new RecommendationService(_context, _mapper);
                return await recommendationService.GetRecommendationsAsync(userId, 5);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Erro em GetRecommendedTvShowsAsync: {ex.Message}");
                return new List<TvShowDto>();
            }
        }

        public async Task<string> DebugDatabase()
        {
            try
            {
                var tvShowsCount = await _context.TvShows.CountAsync();
                var types = await _context.TvShows.Select(t => t.Type).Distinct().ToListAsync();
                var titles = await _context.TvShows.Select(t => t.Title).ToListAsync();
                
                return $"Total: {tvShowsCount}, Types: {string.Join(", ", types)}, Titles: {string.Join(", ", titles.Take(5))}";
            }
            catch (Exception ex)
            {
                return $"Erro no debug: {ex.Message}";
            }
        }
    }
}