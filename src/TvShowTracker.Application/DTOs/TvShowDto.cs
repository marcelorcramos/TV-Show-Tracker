namespace TvShowTracker.Application.DTOs
{
    public class TvShowDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Genre { get; set; }
        public string? Type { get; set; }
        public DateTime? ReleaseDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? Seasons { get; set; }
        public decimal? Rating { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsFavorite { get; set; }
    }

    public class TvShowDetailDto : TvShowDto
    {
        public List<EpisodeDto> Episodes { get; set; } = new();
        public List<ActorDto> FeaturedActors { get; set; } = new();
    }

    public class EpisodeDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int SeasonNumber { get; set; }
        public int EpisodeNumber { get; set; }
        public DateTime? ReleaseDate { get; set; }
        public TimeSpan? Duration { get; set; }
        public decimal? Rating { get; set; }
    }

    public class ActorDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime? BirthDate { get; set; }
        public string? Nationality { get; set; }
        public string? Bio { get; set; }
        public string? ImageUrl { get; set; }
    }
}