using System.ComponentModel.DataAnnotations;

namespace TvShowTracker.Domain.Entities
{
    public class TvShow : BaseEntity
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        
        [MaxLength(50)]
        public string? Genre { get; set; }
        
        [MaxLength(20)]
        public string? Type { get; set; }
        
        public DateTime? ReleaseDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? Seasons { get; set; }
        public int? Duration { get; set; }    
        public decimal? Rating { get; set; }
        public string? ImageUrl { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public virtual ICollection<Episode> Episodes { get; set; } = new List<Episode>();
        public virtual ICollection<TvShowActor> TvShowActors { get; set; } = new List<TvShowActor>();
        public virtual ICollection<UserFavorite> UserFavorites { get; set; } = new List<UserFavorite>();
    }
}