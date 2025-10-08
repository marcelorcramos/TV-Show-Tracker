using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;
using TvShowTracker.Application.Interfaces;

namespace TvShowTracker.Infrastructure.Services
{
    public class RedisCacheService : ICacheService
    {
        private readonly IDistributedCache _cache;
        private readonly TimeSpan _defaultExpiration = TimeSpan.FromHours(1);

        public RedisCacheService(IDistributedCache cache)
        {
            _cache = cache;
        }

        public async Task<T?> GetAsync<T>(string key)
        {
            var cachedData = await _cache.GetStringAsync(key);
            if (string.IsNullOrEmpty(cachedData))
            {
                return default;
            }

            return JsonSerializer.Deserialize<T>(cachedData);
        }

        public async Task SetAsync<T>(string key, T value, TimeSpan expiration)
        {
            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = expiration
            };

            var serializedData = JsonSerializer.Serialize(value);
            await _cache.SetStringAsync(key, serializedData, options);
        }

        public async Task SetAsync<T>(string key, T value)
        {
            await SetAsync(key, value, _defaultExpiration);
        }

        public async Task RemoveAsync(string key)
        {
            await _cache.RemoveAsync(key);
        }

        public async Task<bool> ExistsAsync(string key)
        {
            var cachedData = await _cache.GetStringAsync(key);
            return !string.IsNullOrEmpty(cachedData);
        }
    }
}