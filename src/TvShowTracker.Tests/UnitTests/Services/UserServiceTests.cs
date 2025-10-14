using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Moq;
using TvShowTracker.Application.DTOs;
using TvShowTracker.Application.Interfaces;
using TvShowTracker.Domain.Entities;
using TvShowTracker.Infrastructure.Data;
using TvShowTracker.Infrastructure.Services;
using AutoMapper;
using Microsoft.Extensions.Configuration;

namespace TvShowTracker.Tests.UnitTests.Services
{
    public class UserServiceTests : IDisposable
    {
        private readonly ApplicationDbContext _context;
        private readonly Mock<IMapper> _mockMapper;
        private readonly Mock<IConfiguration> _mockConfig;
        private readonly UserService _userService;

        public UserServiceTests()
        {
            // Setup in-memory database
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: $"TestDb_{Guid.NewGuid()}")
                .Options;

            _context = new ApplicationDbContext(options);

            // Setup mocks
            _mockMapper = new Mock<IMapper>();
            _mockConfig = new Mock<IConfiguration>();

            // Setup configuration
            _mockConfig.Setup(x => x["Jwt:ExpiresInHours"]).Returns("24");

            // Create real JwtService instance for testing
            var jwtService = new JwtService(_mockConfig.Object);

            _userService = new UserService(_context, _mockMapper.Object, jwtService, _mockConfig.Object);

            // Seed test data
            SeedTestData();
        }

        private void SeedTestData()
        {
            // Add test user
            var testUser = new User
            {
                Id = 1,
                Name = "Test User",
                Email = "test@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            _context.Users.Add(testUser);
            _context.SaveChanges();
        }

        [Fact]
        public async Task RegisterAsync_WithValidData_ShouldCreateUser()
        {
            // Arrange
            var createUserDto = new CreateUserDto
            {
                Name = "New User",
                Email = "newuser@example.com",
                Password = "password123"
            };

            var expectedUser = new UserDto { Id = 2, Name = "New User", Email = "newuser@example.com" };
            _mockMapper.Setup(m => m.Map<UserDto>(It.IsAny<User>())).Returns(expectedUser);

            // Act
            var result = await _userService.RegisterAsync(createUserDto);

            // Assert
            result.Should().NotBeNull();
            result.Email.Should().Be(createUserDto.Email);
            result.Name.Should().Be(createUserDto.Name);

            // Verify user was saved to database
            var userInDb = await _context.Users.FindAsync(2);
            userInDb.Should().NotBeNull();
            userInDb.Email.Should().Be(createUserDto.Email);
        }

        [Fact]
        public async Task RegisterAsync_WithExistingEmail_ShouldThrowException()
        {
            // Arrange
            var createUserDto = new CreateUserDto
            {
                Name = "Test User",
                Email = "test@example.com", // Already exists
                Password = "password123"
            };

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _userService.RegisterAsync(createUserDto));
        }

        [Fact]
        public async Task LoginAsync_WithValidCredentials_ShouldReturnAuthResponse()
        {
            // Arrange
            var loginDto = new LoginDto
            {
                Email = "test@example.com",
                Password = "password123"
            };

            var expectedUser = new UserDto { Id = 1, Name = "Test User", Email = "test@example.com" };
            _mockMapper.Setup(m => m.Map<UserDto>(It.IsAny<User>())).Returns(expectedUser);

            // Act
            var result = await _userService.LoginAsync(loginDto);

            // Assert
            result.Should().NotBeNull();
            result.Token.Should().NotBeNullOrEmpty();
            result.User.Email.Should().Be(loginDto.Email);
            result.ExpiresAt.Should().BeAfter(DateTime.UtcNow);
        }

        [Fact]
        public async Task LoginAsync_WithInvalidCredentials_ShouldThrowException()
        {
            // Arrange
            var loginDto = new LoginDto
            {
                Email = "test@example.com",
                Password = "wrongpassword"
            };

            // Act & Assert
            await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _userService.LoginAsync(loginDto));
        }

        [Fact]
        public async Task AddFavoriteTvShowAsync_WithValidData_ShouldAddFavorite()
        {
            // Arrange
            var userId = 1;
            var tvShowId = 1;

            // Add test TV show
            var tvShow = new TvShow { Id = tvShowId, Title = "Test Show" };
            _context.TvShows.Add(tvShow);
            await _context.SaveChangesAsync();

            // Act
            var result = await _userService.AddFavoriteTvShowAsync(userId, tvShowId);

            // Assert
            result.Should().BeTrue();

            var favorite = await _context.UserFavorites
                .FirstOrDefaultAsync(uf => uf.UserId == userId && uf.TvShowId == tvShowId);
            favorite.Should().NotBeNull();
        }

        [Fact]
        public async Task RemoveFavoriteTvShowAsync_WithExistingFavorite_ShouldRemoveFavorite()
        {
            // Arrange
            var userId = 1;
            var tvShowId = 1;

            // Add favorite first
            var favorite = new UserFavorite { UserId = userId, TvShowId = tvShowId, AddedAt = DateTime.UtcNow };
            _context.UserFavorites.Add(favorite);
            await _context.SaveChangesAsync();

            // Act
            var result = await _userService.RemoveFavoriteTvShowAsync(userId, tvShowId);

            // Assert
            result.Should().BeTrue();

            var favoriteInDb = await _context.UserFavorites
                .FirstOrDefaultAsync(uf => uf.UserId == userId && uf.TvShowId == tvShowId);
            favoriteInDb.Should().BeNull();
        }

        [Fact]
        public async Task GetUserByIdAsync_WithValidId_ShouldReturnUser()
        {
            // Arrange
            var userId = 1;
            var expectedUser = new UserDto { Id = 1, Name = "Test User", Email = "test@example.com" };
            _mockMapper.Setup(m => m.Map<UserDto>(It.IsAny<User>())).Returns(expectedUser);

            // Act
            var result = await _userService.GetUserByIdAsync(userId);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(userId);
            result.Email.Should().Be("test@example.com");
        }

        public void Dispose()
        {
            _context?.Database?.EnsureDeleted();
            _context?.Dispose();
        }
    }
}
