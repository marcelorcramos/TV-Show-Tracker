using TvShowTracker.Application.DTOs;

namespace TvShowTracker.Application.Interfaces
{
    public interface ITvShowService
    {
        Task<PagedResult<TvShowDto>> GetTvShowsAsync(TvShowQuery query);
        Task<TvShowDetailDto?> GetTvShowByIdAsync(int id);
        Task<List<TvShowDto>> GetRecommendedTvShowsAsync(int userId);
        Task<List<string>> GetAvailableGenresAsync();
        Task<List<string>> GetAvailableTypesAsync();
    }

    public class PagedResult<T>
    {
        public List<T> Items { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
        public bool HasPrevious => Page > 1;
        public bool HasNext => Page < TotalPages;
    }

    public class TvShowQuery
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Genre { get; set; }
        public string? Type { get; set; }
        public string? Search { get; set; }
        public string? SortBy { get; set; } = "Title";
        public bool SortDescending { get; set; } = false;
    }
}