using System.Security.Claims;

namespace TvShowTracker.Application.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(int userId, string email);
        ClaimsPrincipal? ValidateToken(string token);
    }
}