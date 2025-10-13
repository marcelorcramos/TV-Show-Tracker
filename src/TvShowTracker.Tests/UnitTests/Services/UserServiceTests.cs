using Xunit;
using FluentAssertions;
using Moq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using AutoMapper;
using TvShowTracker.Application.Interfaces;
using TvShowTracker.Application.DTOs;
using TvShowTracker.Infrastructure.Data;
using TvShowTracker.Infrastructure.Services;
using TvShowTracker.Domain.Entities;

namespace TvShowTracker.Tests.UnitTests.Services
{
    public class UserServiceTests
    {
        private readonly ApplicationDbContext _context;
        private readonly Mock<IMapper> _mockMapper;
        private readonly Mock<IJwtService> _mockJwtService;
        private readonly Mock<IConfiguration> _mockConfiguration;
        private readonly UserService _userService;

        public UserServiceTests()
        {
            // Configurar DbContext em memória
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: $"UserTestDatabase_{Guid.NewGuid()}")
                .Options;

            _context = new ApplicationDbContext(options);
            _mockMapper = new Mock<IMapper>();
            _mockJwtService = new Mock<IJwtService>();
            _mockConfiguration = new Mock<IConfiguration>();

            // Configurar mocks
            _mockConfiguration.Setup(c => c["Jwt:ExpiresInHours"]).Returns("24");
            _mockJwtService.Setup(j => j.GenerateToken(It.IsAny<int>(), It.IsAny<string>()))
                          .Returns("mock-jwt-token");

            _userService = new UserService(
                _context, 
                _mockMapper.Object, 
                _mockJwtService.Object,
                _mockConfiguration.Object
            );

            InitializeTestData();
        }

        private void InitializeTestData()
        {
            // Limpar dados anteriores
            _context.Database.EnsureDeleted();
            _context.Database.EnsureCreated();

            // Usuário de teste
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
        public async Task RegisterAsync_ShouldCreateNewUser_WhenValidData()
        {
            // Arrange
            var createUserDto = new CreateUserDto
            {
                Name = "New User",
                Email = "newuser@example.com",
                Password = "password123"
            };

            _mockMapper.Setup(m => m.Map<UserDto>(It.IsAny<User>()))
                      .Returns((User source) => new UserDto 
                      { 
                          Id = source.Id, 
                          Name = source.Name,
                          Email = source.Email
                      });

            // Act
            var result = await _userService.RegisterAsync(createUserDto);

            // Assert
            result.Should().NotBeNull();
            result.Name.Should().Be("New User");
            result.Email.Should().Be("newuser@example.com");
        }

        [Fact]
        public async Task LoginAsync_ShouldReturnAuthResponse_WhenValidCredentials()
        {
            // Arrange
            var loginDto = new LoginDto
            {
                Email = "test@example.com",
                Password = "password123"
            };

            _mockMapper.Setup(m => m.Map<UserDto>(It.IsAny<User>()))
                      .Returns((User source) => new UserDto 
                      { 
                          Id = source.Id, 
                          Name = source.Name,
                          Email = source.Email
                      });

            // Act
            var result = await _userService.LoginAsync(loginDto);

            // Assert
            result.Should().NotBeNull();
            result.Token.Should().Be("mock-jwt-token");
            result.User.Should().NotBeNull();
            result.User.Email.Should().Be("test@example.com");
        }

        // ... manter os outros testes que estavam funcionando
    }
}