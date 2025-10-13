using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using TvShowTracker.Application.DTOs;
using TvShowTracker.Application.Interfaces;
using TvShowTracker.Domain.Entities;
using TvShowTracker.Infrastructure.Data;
using TvShowTracker.Infrastructure.Services;

namespace TvShowTracker.Infrastructure.Services;
public class UserService : IUserService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IJwtService _jwtService; // ✅ MUDAR DE JwtService PARA IJwtService
    private readonly IConfiguration _configuration;

    public UserService(ApplicationDbContext context, IMapper mapper, IJwtService jwtService, IConfiguration configuration)
    {
        _context = context;
        _mapper = mapper;
        _jwtService = jwtService; // ✅ AGORA COMPATÍVEL
        _configuration = configuration;
    }

        public async Task<UserDto> RegisterAsync(CreateUserDto createUserDto)
        {
            // Check if user already exists
            if (await _context.Users.AnyAsync(u => u.Email == createUserDto.Email))
            {
                throw new ArgumentException("User with this email already exists");
            }

            // Create user
            var user = new User
            {
                Name = createUserDto.Name,
                Email = createUserDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(createUserDto.Password),
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return _mapper.Map<UserDto>(user);
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email && u.IsActive);

            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Invalid email or password");
            }

            var token = _jwtService.GenerateToken(user.Id, user.Email);
            var expiresAt = DateTime.UtcNow.AddHours(Convert.ToDouble(_configuration["Jwt:ExpiresInHours"]));

            return new AuthResponseDto
            {
                Token = token,
                ExpiresAt = expiresAt,
                User = _mapper.Map<UserDto>(user)
            };
        }

        public async Task<bool> AddFavoriteTvShowAsync(int userId, int tvShowId)
        {
            var existingFavorite = await _context.UserFavorites
                .FirstOrDefaultAsync(uf => uf.UserId == userId && uf.TvShowId == tvShowId);

            if (existingFavorite != null)
            {
                return false; // Already favorited
            }

            var favorite = new UserFavorite
            {
                UserId = userId,
                TvShowId = tvShowId,
                AddedAt = DateTime.UtcNow
            };

            _context.UserFavorites.Add(favorite);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> RemoveFavoriteTvShowAsync(int userId, int tvShowId)
        {
            var favorite = await _context.UserFavorites
                .FirstOrDefaultAsync(uf => uf.UserId == userId && uf.TvShowId == tvShowId);

            if (favorite == null)
            {
                return false;
            }

            _context.UserFavorites.Remove(favorite);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<List<TvShowDto>> GetUserFavoritesAsync(int userId)
        {
            var favorites = await _context.UserFavorites
                .Where(uf => uf.UserId == userId)
                .Include(uf => uf.TvShow)
                .Select(uf => _mapper.Map<TvShowDto>(uf.TvShow))
                .ToListAsync();

            return favorites;
        }

        public async Task<UserDto> GetUserByIdAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            return _mapper.Map<UserDto>(user);
        }
    }