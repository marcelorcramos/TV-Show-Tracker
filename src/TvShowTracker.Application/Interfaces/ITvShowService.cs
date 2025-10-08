using TvShowTracker.Application.DTOs;

namespace TvShowTracker.Application.Interfaces
{
    public interface ITvShowService
    {
        Task<PagedResult<TvShowDto>> GetTvShowsAsync(int page, int pageSize, string? genre, string? type, string? sortBy);
        Task<TvShowDetailDto?> GetTvShowByIdAsync(int id);
        Task<List<TvShowDto>> GetRecommendedTvShowsAsync(int userId);
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
}