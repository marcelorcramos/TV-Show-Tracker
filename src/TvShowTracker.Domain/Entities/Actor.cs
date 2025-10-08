using System.ComponentModel.DataAnnotations;

namespace TvShowTracker.Domain.Entities
{
    public class Actor : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        
        public DateTime? BirthDate { get; set; }
        public string? Nationality { get; set; }
        public string? Bio { get; set; }
        public string? ImageUrl { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public virtual ICollection<TvShowActor> TvShowActors { get; set; } = new List<TvShowActor>();
    }
}