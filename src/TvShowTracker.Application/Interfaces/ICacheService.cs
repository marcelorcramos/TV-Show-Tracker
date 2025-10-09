namespace TvShowTracker.Application.Interfaces
{
    public interface ICacheService
    {
        Task<T?> GetAsync<T>(string key);
        Task SetAsync<T>(string key, T value, TimeSpan expiration);
        Task SetAsync<T>(string key, T value); // ← ADICIONAR ESTE MÉTODO
        Task RemoveAsync(string key);
        Task<bool> ExistsAsync(string key);
    }
}