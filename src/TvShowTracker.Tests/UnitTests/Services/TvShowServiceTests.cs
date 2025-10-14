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
    public class TvShowServiceTests : IDisposable
    {
        private readonly ApplicationDbContext _context;
        private readonly Mock<IMapper> _mockMapper;
        private readonly Mock<ICacheService> _mockCacheService;
        private readonly Mock<IRecommendationService> _mockRecommendationService;
        private readonly TvShowService _tvShowService;

        public TvShowServiceTests()
        {
            // Setup in-memory database
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: $"TvShowsTestDb_{Guid.NewGuid()}")
                .Options;

            _context = new ApplicationDbContext(options);

            // Setup mocks
            _mockMapper = new Mock<IMapper>();
            _mockCacheService = new Mock<ICacheService>();
            _mockRecommendationService = new Mock<IRecommendationService>();

            _tvShowService = new TvShowService(_context, _mockMapper.Object, _mockCacheService.Object, _mockRecommendationService.Object);
        }

        [Fact]
        public async Task GetTvShowsAsync_WithNoFilters_ShouldReturnAllTvShows()
        {
            // Arrange
            var tvShows = new List<TvShow>
            {
                new TvShow { Id = 1, Title = "Show 1", Genre = "Drama", Type = "Series", Rating = 8.5m },
                new TvShow { Id = 2, Title = "Show 2", Genre = "Comedy", Type = "Movie", Rating = 7.8m }
            };
            
            _context.TvShows.AddRange(tvShows);
            await _context.SaveChangesAsync();

            var query = new TvShowQuery { Page = 1, PageSize = 10 };

            // Setup mapper
            _mockMapper.Setup(m => m.Map<TvShowDto>(It.IsAny<TvShow>()))
                     .Returns((TvShow source) => new TvShowDto 
                     { 
                         Id = source.Id, 
                         Title = source.Title,
                         Genre = source.Genre,
                         Type = source.Type,
                         Rating = source.Rating,
                         FeaturedActors = new List<ActorDto>()
                     });

            // Act
            var result = await _tvShowService.GetTvShowsAsync(query);

            // Assert
            result.Should().NotBeNull();
            result.Items.Should().HaveCount(2);
            result.TotalCount.Should().Be(2);
        }

        [Fact]
        public async Task GetTvShowsAsync_WithGenreFilter_ShouldReturnFilteredResults()
        {
            // Arrange
            var tvShows = new List<TvShow>
            {
                new TvShow { Id = 1, Title = "Drama Show", Genre = "Drama", Type = "Series" },
                new TvShow { Id = 2, Title = "Comedy Show", Genre = "Comedy", Type = "Movie" },
                new TvShow { Id = 3, Title = "Another Drama", Genre = "Drama", Type = "Series" }
            };
            
            _context.TvShows.AddRange(tvShows);
            await _context.SaveChangesAsync();

            var query = new TvShowQuery { Genre = "Drama", Page = 1, PageSize = 10 };

            // Setup mapper
            _mockMapper.Setup(m => m.Map<TvShowDto>(It.IsAny<TvShow>()))
                     .Returns((TvShow source) => new TvShowDto 
                     { 
                         Id = source.Id, 
                         Title = source.Title,
                         Genre = source.Genre,
                         Type = source.Type,
                         FeaturedActors = new List<ActorDto>()
                     });

            // Act
            var result = await _tvShowService.GetTvShowsAsync(query);

            // Assert
            result.Should().NotBeNull();
            result.Items.Should().HaveCount(2);
            result.Items.All(s => s.Genre == "Drama").Should().BeTrue();
        }

        [Fact]
        public async Task GetTvShowsAsync_WithSearchFilter_ShouldReturnMatchingResults()
        {
            // Arrange
            var tvShows = new List<TvShow>
            {
                new TvShow { Id = 1, Title = "Breaking Bad", Description = "A chemistry teacher turns to crime", Genre = "Drama" },
                new TvShow { Id = 2, Title = "Game of Thrones", Description = "Fantasy drama", Genre = "Fantasy" },
                new TvShow { Id = 3, Title = "Better Call Saul", Description = "Breaking Bad prequel", Genre = "Drama" }
            };
            
            _context.TvShows.AddRange(tvShows);
            await _context.SaveChangesAsync();

            var query = new TvShowQuery { Search = "Breaking", Page = 1, PageSize = 10 };

            // Setup mapper
            _mockMapper.Setup(m => m.Map<TvShowDto>(It.IsAny<TvShow>()))
                     .Returns((TvShow source) => new TvShowDto 
                     { 
                         Id = source.Id, 
                         Title = source.Title,
                         Genre = source.Genre,
                         Description = source.Description,
                         FeaturedActors = new List<ActorDto>()
                     });

            // Act
            var result = await _tvShowService.GetTvShowsAsync(query);

            // Assert
            result.Should().NotBeNull();
            result.Items.Should().HaveCount(2); // Breaking Bad and Better Call Saul
            result.Items.All(s => s.Title.Contains("Breaking") || s.Description.Contains("Breaking")).Should().BeTrue();
        }

        [Fact]
        public async Task GetTvShowByIdAsync_WithValidId_ShouldReturnTvShow()
        {
            // Arrange
            var tvShow = new TvShow 
            { 
                Id = 1, 
                Title = "Test Show", 
                Genre = "Drama",
                Episodes = new List<Episode>(),
                TvShowActors = new List<TvShowActor>()
            };
            
            _context.TvShows.Add(tvShow);
            await _context.SaveChangesAsync();

            // Setup mapper for detailed TV show
            _mockMapper.Setup(m => m.Map<TvShowDetailDto>(It.IsAny<TvShow>()))
                     .Returns(new TvShowDetailDto 
                     { 
                         Id = 1, 
                         Title = "Test Show",
                         Genre = "Drama",
                         Episodes = new List<EpisodeDto>(),
                         Actors = new List<ActorDto>(),
                         FeaturedActors = new List<ActorDto>()
                     });

            // Act
            var result = await _tvShowService.GetTvShowByIdAsync(1);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(1);
            result.Title.Should().Be("Test Show");
        }

        [Fact]
        public async Task GetTvShowByIdAsync_WithInvalidId_ShouldReturnNull()
        {
            // Arrange
            var tvShowId = 999;

            // Act
            var result = await _tvShowService.GetTvShowByIdAsync(tvShowId);

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async Task GetAvailableGenresAsync_ShouldReturnGenres()
        {
            // Arrange
            var tvShows = new List<TvShow>
            {
                new TvShow { Id = 1, Title = "Show 1", Genre = "Drama" },
                new TvShow { Id = 2, Title = "Show 2", Genre = "Comedy" },
                new TvShow { Id = 3, Title = "Show 3", Genre = "Drama" },
                new TvShow { Id = 4, Title = "Show 4", Genre = "Action" }
            };
            
            _context.TvShows.AddRange(tvShows);
            await _context.SaveChangesAsync();

            // Setup cache to return null (force database query)
            _mockCacheService.Setup(c => c.GetAsync<List<string>>(It.IsAny<string>()))
                           .ReturnsAsync((List<string>)null);

            // Act
            var result = await _tvShowService.GetAvailableGenresAsync();

            // Assert
            result.Should().NotBeNull();
            result.Should().HaveCount(3); // Drama, Comedy, Action
            result.Should().Contain(new[] { "Drama", "Comedy", "Action" });
            result.Should().BeInAscendingOrder();
        }

        [Fact]
        public async Task GetAvailableTypesAsync_ShouldReturnTypes()
        {
            // Arrange
            var tvShows = new List<TvShow>
            {
                new TvShow { Id = 1, Title = "Show 1", Type = "Series" },
                new TvShow { Id = 2, Title = "Show 2", Type = "Movie" },
                new TvShow { Id = 3, Title = "Show 3", Type = "Series" }
            };
            
            _context.TvShows.AddRange(tvShows);
            await _context.SaveChangesAsync();

            // Setup cache to return null (force database query)
            _mockCacheService.Setup(c => c.GetAsync<List<string>>(It.IsAny<string>()))
                           .ReturnsAsync((List<string>)null);

            // Act
            var result = await _tvShowService.GetAvailableTypesAsync();

            // Assert
            result.Should().NotBeNull();
            result.Should().HaveCount(2); // Series, Movie
            result.Should().Contain(new[] { "Series", "Movie" });
            result.Should().BeInAscendingOrder();
        }

        [Fact]
        public async Task GetRecommendedTvShowsAsync_ShouldReturnRecommendations()
        {
            // Arrange
            var userId = 1;
            var expectedRecommendations = new List<TvShowDto>
            {
                new TvShowDto { Id = 1, Title = "Recommended Show 1" },
                new TvShowDto { Id = 2, Title = "Recommended Show 2" }
            };

            _mockRecommendationService.Setup(r => r.GetRecommendationsAsync(userId, 5))
                                    .ReturnsAsync(expectedRecommendations);

            // Act
            var result = await _tvShowService.GetRecommendedTvShowsAsync(userId);

            // Assert
            result.Should().NotBeNull();
            result.Should().HaveCount(2);
            result.Should().BeEquivalentTo(expectedRecommendations);
        }

        public void Dispose()
        {
            _context?.Database?.EnsureDeleted();
            _context?.Dispose();
        }
    }
}
