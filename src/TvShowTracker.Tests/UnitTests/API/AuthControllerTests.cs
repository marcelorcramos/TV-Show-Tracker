using Microsoft.AspNetCore.Mvc;
using Moq;
using FluentAssertions;
using TvShowTracker.Application.DTOs;
using TvShowTracker.Application.Interfaces;
using Microsoft.Extensions.Logging;

namespace TvShowTracker.Tests.UnitTests.API
{
    public class AuthControllerTests
    {
        private readonly Mock<IUserService> _mockUserService;
        private readonly Mock<ILogger<TvShowTracker.API.Controllers.AuthController>> _mockLogger;
        private readonly TvShowTracker.API.Controllers.AuthController _authController;

        public AuthControllerTests()
        {
            _mockUserService = new Mock<IUserService>();
            _mockLogger = new Mock<ILogger<TvShowTracker.API.Controllers.AuthController>>();
            _authController = new TvShowTracker.API.Controllers.AuthController(_mockUserService.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task Register_WithValidData_ShouldReturnOk()
        {
            // Arrange
            var createUserDto = new CreateUserDto
            {
                Name = "Test User",
                Email = "test@example.com",
                Password = "password123"
            };

            var expectedUser = new UserDto { Id = 1, Name = "Test User", Email = "test@example.com" };
            _mockUserService.Setup(s => s.RegisterAsync(createUserDto))
                          .ReturnsAsync(expectedUser);

            // Act
            var result = await _authController.Register(createUserDto);

            // Assert
            result.Result.Should().BeOfType<OkObjectResult>();
            var okResult = result.Result as OkObjectResult;
            okResult.Value.Should().BeEquivalentTo(expectedUser);
        }

        [Fact]
        public async Task Register_WithExistingEmail_ShouldReturnBadRequest()
        {
            // Arrange
            var createUserDto = new CreateUserDto
            {
                Name = "Test User",
                Email = "existing@example.com",
                Password = "password123"
            };

            _mockUserService.Setup(s => s.RegisterAsync(createUserDto))
                          .ThrowsAsync(new ArgumentException("User with this email already exists"));

            // Act
            var result = await _authController.Register(createUserDto);

            // Assert
            result.Result.Should().BeOfType<BadRequestObjectResult>();
            var badRequestResult = result.Result as BadRequestObjectResult;
            badRequestResult.Value.Should().BeEquivalentTo(new { message = "User with this email already exists" });
        }

        [Fact]
        public async Task Register_WithInvalidData_ShouldReturnBadRequest()
        {
            // Arrange
            var createUserDto = new CreateUserDto
            {
                Name = "", // Invalid - empty name
                Email = "test@example.com",
                Password = "123" // Invalid - too short
            };

            // Act
            var result = await _authController.Register(createUserDto);

            // Assert
            result.Result.Should().BeOfType<BadRequestObjectResult>();
        }

        [Fact]
        public async Task Login_WithValidCredentials_ShouldReturnOk()
        {
            // Arrange
            var loginDto = new LoginDto
            {
                Email = "test@example.com",
                Password = "password123"
            };

            var authResponse = new AuthResponseDto
            {
                Token = "fake-jwt-token",
                ExpiresAt = DateTime.UtcNow.AddHours(24),
                User = new UserDto { Id = 1, Name = "Test User", Email = "test@example.com" }
            };

            _mockUserService.Setup(s => s.LoginAsync(loginDto))
                          .ReturnsAsync(authResponse);

            // Act
            var result = await _authController.Login(loginDto);

            // Assert
            result.Result.Should().BeOfType<OkObjectResult>();
            var okResult = result.Result as OkObjectResult;
            okResult.Value.Should().BeEquivalentTo(authResponse);
        }

        [Fact]
        public async Task Login_WithInvalidCredentials_ShouldReturnUnauthorized()
        {
            // Arrange
            var loginDto = new LoginDto
            {
                Email = "test@example.com",
                Password = "wrongpassword"
            };

            _mockUserService.Setup(s => s.LoginAsync(loginDto))
                          .ThrowsAsync(new UnauthorizedAccessException("Invalid email or password"));

            // Act
            var result = await _authController.Login(loginDto);

            // Assert
            result.Result.Should().BeOfType<UnauthorizedObjectResult>();
            var unauthorizedResult = result.Result as UnauthorizedObjectResult;
            unauthorizedResult.Value.Should().BeEquivalentTo(new { message = "Invalid email or password" });
        }

        [Fact]
        public async Task Login_WithInvalidData_ShouldReturnBadRequest()
        {
            // Arrange
            var loginDto = new LoginDto
            {
                Email = "", // Invalid - empty email
                Password = "" // Invalid - empty password
            };

            // Act
            var result = await _authController.Login(loginDto);

            // Assert
            result.Result.Should().BeOfType<BadRequestObjectResult>();
        }

        [Fact]
        public void DebugNoAuth_ShouldReturnOk()
        {
            // Act
            var result = _authController.DebugNoAuth();

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult.Value.Should().NotBeNull();
        }
    }
}
