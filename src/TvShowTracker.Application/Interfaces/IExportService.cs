using TvShowTracker.Application.DTOs;

namespace TvShowTracker.Application.Interfaces
{
    public interface IExportService
    {
        Task<byte[]> ExportTvShowsToCsvAsync(TvShowQuery query);
        Task<byte[]> ExportTvShowsToPdfAsync(TvShowQuery query);
        Task<byte[]> ExportUserFavoritesToCsvAsync(int userId);
        Task<byte[]> ExportUserFavoritesToPdfAsync(int userId);
    }
}