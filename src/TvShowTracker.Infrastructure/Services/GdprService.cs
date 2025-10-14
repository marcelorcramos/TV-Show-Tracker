using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TvShowTracker.Application.DTOs;
using TvShowTracker.Application.Interfaces;
using TvShowTracker.Infrastructure.Data;

namespace TvShowTracker.Infrastructure.Services
{
    public class GdprService : IGdprService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GdprService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<UserDataDto> ExportUserDataAsync(int userId)
        {
            var user = await _context.Users
                .Include(u => u.Favorites)
                    .ThenInclude(f => f.TvShow)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                throw new ArgumentException("User not found");
            }

            var userData = new UserDataDto
            {
                User = _mapper.Map<UserDto>(user),
                Favorites = user.Favorites
                    .Select(f => _mapper.Map<TvShowDto>(f.TvShow))
                    .ToList(),
                ExportedAt = DateTime.UtcNow
            };

            // Log the data export for compliance
            await LogDataExportAsync(userId);

            return userData;
        }

        public async Task<bool> DeleteUserAccountAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return false;
            }

            // Remove user favorites
            var favorites = await _context.UserFavorites
                .Where(uf => uf.UserId == userId)
                .ToListAsync();
            
            _context.UserFavorites.RemoveRange(favorites);

            // Anonymize user data instead of complete deletion
            user.Name = "Deleted User";
            user.Email = $"deleted{userId}@example.com";
            user.PasswordHash = "DELETED";
            user.IsActive = false;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Log the deletion for compliance
            await LogAccountDeletionAsync(userId);

            return true;
        }

        public async Task AnonymizeUserDataAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user != null)
            {
                user.Name = "Anonymous User";
                user.Email = $"anonymous{userId}@example.com";
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                await LogDataAnonymizationAsync(userId);
            }
        }

        private async Task LogDataExportAsync(int userId)
        {
            // In a real implementation, log to a dedicated audit table
            Console.WriteLine($"GDPR: Data exported for user {userId} at {DateTime.UtcNow}");
            await Task.CompletedTask;
        }

        private async Task LogAccountDeletionAsync(int userId)
        {
            // In a real implementation, log to a dedicated audit table
            Console.WriteLine($"GDPR: Account deleted for user {userId} at {DateTime.UtcNow}");
            await Task.CompletedTask;
        }

        private async Task LogDataAnonymizationAsync(int userId)
        {
            // In a real implementation, log to a dedicated audit table
            Console.WriteLine($"GDPR: Data anonymized for user {userId} at {DateTime.UtcNow}");
            await Task.CompletedTask;
        }
    }
}