namespace TvShowTracker.Domain.Entities
{
    public class TvShowActor
    {
        public int TvShowId { get; set; }
        public int ActorId { get; set; }
        public string? CharacterName { get; set; }
        public bool IsFeatured { get; set; }

        // Navigation properties
        public virtual TvShow TvShow { get; set; } = null!;
        public virtual Actor Actor { get; set; } = null!;
    }
}