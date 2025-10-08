using TvShowTracker.Application.DTOs;

namespace TvShowTracker.Application.Interfaces
{
    public interface IGdprService
    {
        Task<UserDataDto> ExportUserDataAsync(int userId);
        Task<bool> DeleteUserAccountAsync(int userId);
        Task AnonymizeUserDataAsync(int userId);
    }

    public class UserDataDto
    {
        public UserDto User { get; set; } = null!;
        public List<TvShowDto> Favorites { get; set; } = new();
        public DateTime ExportedAt { get; set; } = DateTime.UtcNow;
    }
}