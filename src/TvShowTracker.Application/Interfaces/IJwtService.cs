namespace TvShowTracker.Application.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(int userId, string email);
        // Remover ValidateToken se não for usado
    }
}