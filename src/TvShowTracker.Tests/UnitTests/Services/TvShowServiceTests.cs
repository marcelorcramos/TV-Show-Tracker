using Xunit;
using FluentAssertions;
using Moq;
using Microsoft.EntityFrameworkCore;
using TvShowTracker.Application.Interfaces;
using TvShowTracker.Application.DTOs;
using TvShowTracker.Infrastructure.Data;
using TvShowTracker.Infrastructure.Services;
using AutoMapper;
using TvShowTracker.Domain.Entities;

namespace TvShowTracker.Tests.UnitTests.Services
{
    public class TvShowServiceTests
    {
        private readonly ApplicationDbContext _context;
        private readonly Mock<IMapper> _mockMapper;
        private readonly Mock<ICacheService> _mockCacheService;
        private readonly Mock<IRecommendationService> _mockRecommendationService;
        private readonly TvShowService _tvShowService;

        public TvShowServiceTests()
        {
            // Configurar DbContext em memória
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: $"TestDatabase_{Guid.NewGuid()}")
                .Options;

            _context = new ApplicationDbContext(options);
            _mockMapper = new Mock<IMapper>();
            _mockCacheService = new Mock<ICacheService>();
            _mockRecommendationService = new Mock<IRecommendationService>();

            _tvShowService = new TvShowService(
                _context, 
                _mockMapper.Object, 
                _mockCacheService.Object, 
                _mockRecommendationService.Object
            );

            SeedTestData();
        }

        private void SeedTestData()
        {
            // Limpar dados anteriores
            _context.Database.EnsureDeleted();
            _context.Database.EnsureCreated();

            var testShows = new List<TvShow>
            {
                new TvShow 
                { 
                    Id = 1, 
                    Title = "Breaking Bad", 
                    Genre = "Drama", 
                    Type = "Series",
                    Rating = 9.5m,
                    ReleaseDate = new DateTime(2008, 1, 20)
                },
                new TvShow 
                { 
                    Id = 2, 
                    Title = "Game of Thrones", 
                    Genre = "Fantasy", 
                    Type = "Series",
                    Rating = 9.3m,
                    ReleaseDate = new DateTime(2011, 4, 17)
                },
                new TvShow 
                { 
                    Id = 3, 
                    Title = "The Dark Knight", 
                    Genre = "Action", 
                    Type = "Movie",
                    Rating = 9.0m,
                    ReleaseDate = new DateTime(2008, 7, 18)
                }
            };

            _context.TvShows.AddRange(testShows);
            _context.SaveChanges();
        }

        [Fact]
        public async Task GetTvShowsAsync_ShouldReturnPagedResults()
        {
            // Arrange
            var query = new TvShowQuery { Page = 1, PageSize = 10 };

            _mockMapper.Setup(m => m.Map<TvShowDto>(It.IsAny<TvShow>()))
                      .Returns((TvShow source) => new TvShowDto 
                      { 
                          Id = source.Id, 
                          Title = source.Title,
                          Genre = source.Genre
                      });

            // Act
            var result = await _tvShowService.GetTvShowsAsync(query);

            // Assert
            result.Should().NotBeNull();
            result.Items.Should().HaveCount(3);
            result.TotalCount.Should().Be(3);
            result.Page.Should().Be(1);
        }

        [Fact]
        public async Task GetTvShowsAsync_ShouldFilterByGenre()
        {
            // Arrange
            var query = new TvShowQuery { Genre = "Drama", Page = 1, PageSize = 10 };

            _mockMapper.Setup(m => m.Map<TvShowDto>(It.IsAny<TvShow>()))
                      .Returns((TvShow source) => new TvShowDto 
                      { 
                          Id = source.Id, 
                          Title = source.Title,
                          Genre = source.Genre
                      });

            // Act
            var result = await _tvShowService.GetTvShowsAsync(query);

            // Assert
            result.Should().NotBeNull();
            result.Items.Should().HaveCount(1);
            result.Items[0].Genre.Should().Be("Drama");
            result.Items[0].Title.Should().Be("Breaking Bad");
        }

        [Fact]
        public async Task GetTvShowsAsync_ShouldSortByRatingDescending()
        {
            // Arrange
            var query = new TvShowQuery 
            { 
                SortBy = "Rating", 
                SortDescending = true,
                Page = 1, 
                PageSize = 10 
            };

            _mockMapper.Setup(m => m.Map<TvShowDto>(It.IsAny<TvShow>()))
                      .Returns((TvShow source) => new TvShowDto 
                      { 
                          Id = source.Id, 
                          Title = source.Title,
                          Rating = source.Rating
                      });

            // Act
            var result = await _tvShowService.GetTvShowsAsync(query);

            // Assert
            result.Should().NotBeNull();
            result.Items.Should().HaveCount(3);
            result.Items[0].Rating.Should().Be(9.5m); // Breaking Bad
            result.Items[1].Rating.Should().Be(9.3m); // Game of Thrones
            result.Items[2].Rating.Should().Be(9.0m); // The Dark Knight
        }

        [Fact]
        public async Task GetTvShowByIdAsync_ShouldReturnTvShow_WhenExists()
        {
            // Arrange
            var tvShowId = 1;

            _mockMapper.Setup(m => m.Map<TvShowDetailDto>(It.IsAny<TvShow>()))
                      .Returns(new TvShowDetailDto { Id = 1, Title = "Breaking Bad" });

            // Act
            var result = await _tvShowService.GetTvShowByIdAsync(tvShowId);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(tvShowId);
            result.Title.Should().Be("Breaking Bad");
        }

        [Fact]
        public async Task GetTvShowByIdAsync_ShouldReturnNull_WhenNotExists()
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
            _mockCacheService.Setup(c => c.GetAsync<List<string>>(It.IsAny<string>()))
                           .ReturnsAsync((List<string>)null);

            // Act
            var result = await _tvShowService.GetAvailableGenresAsync();

            // Assert
            result.Should().NotBeNull();
            result.Should().Contain("Drama");
            result.Should().Contain("Fantasy");
            result.Should().Contain("Action");
        }

        [Fact]
        public async Task GetAvailableTypesAsync_ShouldReturnTypes()
        {
            // Arrange
            _mockCacheService.Setup(c => c.GetAsync<List<string>>(It.IsAny<string>()))
                           .ReturnsAsync((List<string>)null);

            // Act
            var result = await _tvShowService.GetAvailableTypesAsync();

            // Assert
            result.Should().NotBeNull();
            result.Should().Contain("Series");
            result.Should().Contain("Movie");
        }
    }
}