using Microsoft.EntityFrameworkCore;
using TvShowTracker.Domain.Entities;

namespace TvShowTracker.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<TvShow> TvShows => Set<TvShow>();
        public DbSet<Actor> Actors => Set<Actor>();
        public DbSet<Episode> Episodes => Set<Episode>();
        public DbSet<TvShowActor> TvShowActors => Set<TvShowActor>();
        public DbSet<UserFavorite> UserFavorites => Set<UserFavorite>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(u => u.Email).IsUnique();
                entity.Property(u => u.CreatedAt).HasDefaultValueSql("datetime('now')");
            });

            // TvShow configuration
            modelBuilder.Entity<TvShow>(entity =>
            {
                entity.HasIndex(t => t.Title);
                entity.HasIndex(t => t.Genre);
                entity.HasIndex(t => t.Type);
                entity.Property(t => t.CreatedAt).HasDefaultValueSql("datetime('now')");
            });

            // Actor configuration
            modelBuilder.Entity<Actor>(entity =>
            {
                entity.HasIndex(a => a.Name);
                entity.Property(a => a.CreatedAt).HasDefaultValueSql("datetime('now')");
            });

            // Episode configuration
            modelBuilder.Entity<Episode>(entity =>
            {
                entity.HasIndex(e => e.TvShowId);
                entity.HasIndex(e => new { e.TvShowId, e.SeasonNumber, e.EpisodeNumber });
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("datetime('now')");
                
                entity.HasOne(e => e.TvShow)
                      .WithMany(t => t.Episodes)
                      .HasForeignKey(e => e.TvShowId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // TvShowActor configuration (junction table)
            modelBuilder.Entity<TvShowActor>(entity =>
            {
                entity.HasKey(ta => new { ta.TvShowId, ta.ActorId });
                
                entity.HasOne(ta => ta.TvShow)
                      .WithMany(t => t.TvShowActors)
                      .HasForeignKey(ta => ta.TvShowId)
                      .OnDelete(DeleteBehavior.Cascade);
                
                entity.HasOne(ta => ta.Actor)
                      .WithMany(a => a.TvShowActors)
                      .HasForeignKey(ta => ta.ActorId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // UserFavorite configuration (junction table)
            modelBuilder.Entity<UserFavorite>(entity =>
            {
                entity.HasKey(uf => new { uf.UserId, uf.TvShowId });
                
                entity.HasOne(uf => uf.User)
                      .WithMany(u => u.Favorites)
                      .HasForeignKey(uf => uf.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
                
                entity.HasOne(uf => uf.TvShow)
                      .WithMany(t => t.UserFavorites)
                      .HasForeignKey(uf => uf.TvShowId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}