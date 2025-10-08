using TvShowTracker.Application.DTOs;

namespace TvShowTracker.Application.Interfaces
{
    public interface IUserService
    {
        Task<UserDto> RegisterAsync(CreateUserDto createUserDto);
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
        Task<UserDto> GetUserByIdAsync(int id);
        Task<bool> AddFavoriteTvShowAsync(int userId, int tvShowId);
        Task<bool> RemoveFavoriteTvShowAsync(int userId, int tvShowId);
        Task<List<TvShowDto>> GetUserFavoritesAsync(int userId);
    }
}