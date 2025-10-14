using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Moq;
using TvShowTracker.Application.DTOs;
using TvShowTracker.Application.Interfaces;
using TvShowTracker.Domain.Entities;
using TvShowTracker.Infrastructure.Data;
using TvShowTracker.Infrastructure.Services;
using AutoMapper;

namespace TvShowTracker.Tests.UnitTests.Services
{
    public class ActorServiceTests : IDisposable
    {
        private readonly ApplicationDbContext _context;
        private readonly Mock<IMapper> _mockMapper;
        private readonly ActorService _actorService;

        public ActorServiceTests()
        {
            // Setup in-memory database with unique name for each test
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: $"ActorsTestDb_{Guid.NewGuid()}")
                .Options;

            _context = new ApplicationDbContext(options);
            _mockMapper = new Mock<IMapper>();
            _actorService = new ActorService(_context, _mockMapper.Object);
        }

        [Fact]
        public async Task GetActorsAsync_WithNoFilters_ShouldReturnEmptyWhenNoData()
        {
            // Arrange
            var query = new ActorQuery { Page = 1, PageSize = 10 };

            // Act
            var result = await _actorService.GetActorsAsync(query);

            // Assert
            result.Should().NotBeNull();
            result.Items.Should().BeEmpty();
            result.TotalCount.Should().Be(0);
        }

        [Fact]
        public async Task GetActorsAsync_WithData_ShouldReturnActors()
        {
            // Arrange
            var actor = new Actor
            {
                Id = 1,
                Name = "Test Actor",
                Nationality = "American",
                CreatedAt = DateTime.UtcNow
            };
            
            _context.Actors.Add(actor);
            await _context.SaveChangesAsync();

            var query = new ActorQuery { Page = 1, PageSize = 10 };

            // Act
            var result = await _actorService.GetActorsAsync(query);

            // Assert
            result.Should().NotBeNull();
            result.Items.Should().HaveCount(1);
            result.TotalCount.Should().Be(1);
            result.Items[0].Name.Should().Be("Test Actor");
        }

        [Fact]
        public async Task GetActorByIdAsync_WithValidId_ShouldReturnActor()
        {
            // Arrange
            var actor = new Actor
            {
                Id = 1,
                Name = "Test Actor",
                Nationality = "American",
                CreatedAt = DateTime.UtcNow
            };
            
            _context.Actors.Add(actor);
            await _context.SaveChangesAsync();

            // Setup mapper for detailed actor
            var expectedActorDetail = new ActorDetailDto 
            { 
                Id = 1, 
                Name = "Test Actor",
                Nationality = "American",
                TvShows = new List<TvShowDto>()
            };
            
            _mockMapper.Setup(m => m.Map<TvShowDto>(It.IsAny<TvShow>()))
                      .Returns(new TvShowDto { Id = 1, Title = "Test Show" });

            // Act
            var result = await _actorService.GetActorByIdAsync(1);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(1);
            result.Name.Should().Be("Test Actor");
        }

        [Fact]
        public async Task GetActorByIdAsync_WithInvalidId_ShouldReturnNull()
        {
            // Arrange
            var actorId = 999;

            // Act
            var result = await _actorService.GetActorByIdAsync(actorId);

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async Task GetActorTvShowsAsync_WithInvalidActorId_ShouldReturnEmpty()
        {
            // Arrange
            var actorId = 999;

            // Act
            var result = await _actorService.GetActorTvShowsAsync(actorId);

            // Assert
            result.Should().NotBeNull();
            result.Should().BeEmpty();
        }

        [Fact]
        public async Task GetActorsAsync_WithSearchFilter_ShouldReturnFilteredResults()
        {
            // Arrange
            var actors = new List<Actor>
            {
                new Actor { Id = 1, Name = "John Doe", Nationality = "American", CreatedAt = DateTime.UtcNow },
                new Actor { Id = 2, Name = "Jane Smith", Nationality = "British", CreatedAt = DateTime.UtcNow },
                new Actor { Id = 3, Name = "Bob Johnson", Nationality = "American", CreatedAt = DateTime.UtcNow }
            };
            
            _context.Actors.AddRange(actors);
            await _context.SaveChangesAsync();

            var query = new ActorQuery { Search = "John", Page = 1, PageSize = 10 };

            // Act
            var result = await _actorService.GetActorsAsync(query);

            // Assert
            result.Should().NotBeNull();
            result.Items.Should().HaveCount(2); // John Doe and Bob Johnson
            result.Items.All(a => a.Name.Contains("John")).Should().BeTrue();
        }

        [Fact]
        public async Task GetActorsAsync_WithNationalityFilter_ShouldReturnFilteredResults()
        {
            // Arrange
            var actors = new List<Actor>
            {
                new Actor { Id = 1, Name = "John Doe", Nationality = "American", CreatedAt = DateTime.UtcNow },
                new Actor { Id = 2, Name = "Jane Smith", Nationality = "British", CreatedAt = DateTime.UtcNow },
                new Actor { Id = 3, Name = "Bob Johnson", Nationality = "American", CreatedAt = DateTime.UtcNow }
            };
            
            _context.Actors.AddRange(actors);
            await _context.SaveChangesAsync();

            var query = new ActorQuery { Nationality = "American", Page = 1, PageSize = 10 };

            // Act
            var result = await _actorService.GetActorsAsync(query);

            // Assert
            result.Should().NotBeNull();
            result.Items.Should().HaveCount(2);
            result.Items.All(a => a.Nationality == "American").Should().BeTrue();
        }

        public void Dispose()
        {
            _context?.Database?.EnsureDeleted();
            _context?.Dispose();
        }
    }
}
