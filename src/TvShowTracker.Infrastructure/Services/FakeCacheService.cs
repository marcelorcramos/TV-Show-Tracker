using TvShowTracker.Application.Interfaces;

namespace TvShowTracker.Infrastructure.Services
{
    public class FakeCacheService : ICacheService
    {
        public Task<T?> GetAsync<T>(string key)
        {
            return Task.FromResult(default(T));
        }

        public Task SetAsync<T>(string key, T value, TimeSpan expiration)
        {
            return Task.CompletedTask;
        }

        public Task SetAsync<T>(string key, T value)
        {
            return Task.CompletedTask;
        }

        public Task RemoveAsync(string key)
        {
            return Task.CompletedTask;
        }

        public Task<bool> ExistsAsync(string key)
        {
            return Task.FromResult(false);
        }
    }
}