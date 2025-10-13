using System.ComponentModel.DataAnnotations;

namespace TvShowTracker.Application.DTOs
{
    public class TvShowDto
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        public string? Genre { get; set; }
        public string? Type { get; set; }
        public decimal? Rating { get; set; }
        public DateTime? ReleaseDate { get; set; }
        public int? Seasons { get; set; }
        public int? Duration { get; set; }
        public string? ImageUrl { get; set; }
        
        // ✅ ADICIONAR ESTA LINHA - Episodes property
        public List<EpisodeDto>? Episodes { get; set; }
        
        // Navigation properties
        public List<ActorDto> FeaturedActors { get; set; } = new List<ActorDto>();
        
        // UI properties
        public bool IsFavorite { get; set; }
    }

    public class TvShowDetailDto : TvShowDto
    {
        public List<ActorDto> Actors { get; set; } = new List<ActorDto>();
        // Episodes já está no TvShowDto agora
    }
}
