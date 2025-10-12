// TvShowTracker.Application/Interfaces/IEpisodeService.cs
using TvShowTracker.Application.DTOs;

namespace TvShowTracker.Application.Interfaces
{
    public interface IEpisodeService
    {
        Task<List<EpisodeDto>> GetEpisodesByTvShowAsync(int tvShowId);
        Task<EpisodeDto?> GetEpisodeByIdAsync(int id);
    }
}