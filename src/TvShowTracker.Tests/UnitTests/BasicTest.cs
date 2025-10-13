using Xunit;
using FluentAssertions;

namespace TvShowTracker.Tests.UnitTests
{
    public class BasicTest
    {
        [Fact]
        public void SimpleTest_ShouldPass()
        {
            // Arrange
            var expected = 4;

            // Act
            var actual = 2 + 2;

            // Assert
            Assert.Equal(expected, actual);
            actual.Should().Be(4);
        }

        [Theory]
        [InlineData(1)]
        [InlineData(2)]
        [InlineData(3)]
        public void TheoryTest_ShouldPass(int value)
        {
            // Arrange & Act & Assert
            value.Should().BeGreaterThan(0);
        }
    }
}