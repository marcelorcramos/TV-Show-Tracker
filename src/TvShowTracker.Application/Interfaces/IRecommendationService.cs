using TvShowTracker.Application.DTOs;

namespace TvShowTracker.Application.Interfaces
{
    public interface IRecommendationService
    {
        Task<List<TvShowDto>> GetRecommendationsAsync(int userId, int count = 5);
        Task TrainRecommendationModelAsync();
    }

    public class UserPreferences
    {
        public int UserId { get; set; }
        public List<string> PreferredGenres { get; set; } = new();
        public List<string> PreferredTypes { get; set; } = new();
        public decimal MinRating { get; set; } = 7.0m;
    }
}