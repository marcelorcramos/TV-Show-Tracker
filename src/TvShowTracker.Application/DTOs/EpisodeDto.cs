// TvShowTracker.Application/DTOs/EpisodeDto.cs
using System.ComponentModel.DataAnnotations;

namespace TvShowTracker.Application.DTOs
{
    public class EpisodeDto
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        public int SeasonNumber { get; set; }
        public int EpisodeNumber { get; set; }
        public DateTime? ReleaseDate { get; set; }
        public TimeSpan? Duration { get; set; }
        public decimal? Rating { get; set; }
        
        // Propriedades calculadas para facilitar o frontend
        public string EpisodeCode => $"S{SeasonNumber:00}E{EpisodeNumber:00}";
        
        public string FormattedDuration 
        { 
            get 
            {
                if (!Duration.HasValue) return "N/A";
                var totalMinutes = (int)Duration.Value.TotalMinutes;
                return $"{totalMinutes} min";
            }
        }
        
        public string FormattedReleaseDate 
        { 
            get 
            {
                if (!ReleaseDate.HasValue) return "Em breve";
                return ReleaseDate.Value.ToString("dd/MM/yyyy");
            }
        }
        
        public bool HasAired 
        { 
            get 
            {
                return ReleaseDate.HasValue && ReleaseDate.Value <= DateTime.UtcNow;
            }
        }
        
        public string Status 
        { 
            get 
            {
                return HasAired ? "Lançado" : "Em breve";
            }
        }
    }
}