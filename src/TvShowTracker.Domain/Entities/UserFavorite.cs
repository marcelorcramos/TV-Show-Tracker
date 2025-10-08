namespace TvShowTracker.Domain.Entities
{
    public class UserFavorite
    {
        public int UserId { get; set; }
        public int TvShowId { get; set; }
        public DateTime AddedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual TvShow TvShow { get; set; } = null!;
    }
}