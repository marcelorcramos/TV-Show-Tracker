using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TvShowTracker.Application.DTOs;
using TvShowTracker.Application.Interfaces;
using TvShowTracker.Infrastructure.Data;

namespace TvShowTracker.Infrastructure.Services
{
    public class RecommendationService : IRecommendationService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public RecommendationService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<TvShowDto>> GetRecommendationsAsync(int userId, int count = 5)
        {
            // Get user's favorite shows
            var userFavorites = await _context.UserFavorites
                .Where(uf => uf.UserId == userId)
                .Include(uf => uf.TvShow)
                .Select(uf => uf.TvShow)
                .ToListAsync();

            if (!userFavorites.Any())
            {
                // If no favorites, return popular shows
                return await GetPopularShowsAsync(count);
            }

            // Analyze user preferences
            var preferences = await AnalyzeUserPreferencesAsync(userId);

            // Get recommendations based on preferences
            var recommendedShows = await _context.TvShows
                .Where(t => 
                    !userFavorites.Any(f => f.Id == t.Id) && // Not already favorite
                    (preferences.PreferredGenres.Contains(t.Genre!) || 
                     t.Rating >= preferences.MinRating) &&
                    (string.IsNullOrEmpty(t.Type) || preferences.PreferredTypes.Contains(t.Type!))
                )
                .OrderByDescending(t => t.Rating)
                .Take(count * 2) // Get more than needed for variety
                .ToListAsync();

            // If not enough recommendations, add some random popular shows
            if (recommendedShows.Count < count)
            {
                var additionalShows = await GetPopularShowsAsync(count - recommendedShows.Count);
                var additionalShowIds = additionalShows.Select(s => s.Id).ToList();
                
                var additionalEntities = await _context.TvShows
                    .Where(t => additionalShowIds.Contains(t.Id) && 
                               !recommendedShows.Any(r => r.Id == t.Id))
                    .ToListAsync();

                recommendedShows.AddRange(additionalEntities);
            }

            // Shuffle and take the required count
            var finalRecommendations = recommendedShows
                .OrderBy(x => Guid.NewGuid())
                .Take(count)
                .ToList();

            return _mapper.Map<List<TvShowDto>>(finalRecommendations);
        }

        private async Task<UserPreferences> AnalyzeUserPreferencesAsync(int userId)
        {
            var favorites = await _context.UserFavorites
                .Where(uf => uf.UserId == userId)
                .Include(uf => uf.TvShow)
                .Select(uf => uf.TvShow)
                .ToListAsync();

            var preferences = new UserPreferences { UserId = userId };

            if (favorites.Any())
            {
                // Analyze genres
                var genreCounts = favorites
                    .Where(t => !string.IsNullOrEmpty(t.Genre))
                    .GroupBy(t => t.Genre)
                    .OrderByDescending(g => g.Count())
                    .Take(3)
                    .Select(g => g.Key!)
                    .ToList();

                preferences.PreferredGenres = genreCounts;

                // Analyze types
                var typeCounts = favorites
                    .Where(t => !string.IsNullOrEmpty(t.Type))
                    .GroupBy(t => t.Type)
                    .OrderByDescending(g => g.Count())
                    .Take(2)
                    .Select(g => g.Key!)
                    .ToList();

                preferences.PreferredTypes = typeCounts;

                // Calculate average rating preference
                preferences.MinRating = favorites
                    .Where(t => t.Rating.HasValue)
                    .Average(t => t.Rating.Value) * 0.8m; // 80% of average rating
            }

            return preferences;
        }

        private async Task<List<TvShowDto>> GetPopularShowsAsync(int count)
        {
            var popularShows = await _context.TvShows
                .Where(t => t.Rating > 7.5m)
                .OrderByDescending(t => t.Rating)
                .ThenByDescending(t => t.ReleaseDate)
                .Take(count)
                .ToListAsync();

            return _mapper.Map<List<TvShowDto>>(popularShows);
        }

        public async Task TrainRecommendationModelAsync()
        {
            // Placeholder for more advanced ML training
            // This could integrate with ML.NET for collaborative filtering
            await Task.CompletedTask;
        }
    }
}