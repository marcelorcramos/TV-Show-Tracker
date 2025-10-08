using System.ComponentModel.DataAnnotations;

namespace TvShowTracker.Domain.Entities
{
    public class Episode : BaseEntity
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        public int SeasonNumber { get; set; }
        public int EpisodeNumber { get; set; }
        public DateTime? ReleaseDate { get; set; }
        public TimeSpan? Duration { get; set; }
        public decimal? Rating { get; set; }
        
        public int TvShowId { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public virtual TvShow TvShow { get; set; } = null!;
    }
}