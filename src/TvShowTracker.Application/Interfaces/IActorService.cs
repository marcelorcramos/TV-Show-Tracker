using TvShowTracker.Application.DTOs;

namespace TvShowTracker.Application.Interfaces
{
    public interface IActorService
    {
        Task<PagedResult<ActorDto>> GetActorsAsync(ActorQuery query);
        Task<ActorDetailDto?> GetActorByIdAsync(int id);
        Task<IEnumerable<TvShowDto>> GetActorTvShowsAsync(int actorId);
    }

    public class ActorQuery
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Search { get; set; }
        public string? Nationality { get; set; }
        public string? SortBy { get; set; } = "Name";
        public bool SortDescending { get; set; } = false;
    }
}