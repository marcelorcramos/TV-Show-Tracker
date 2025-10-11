using Microsoft.EntityFrameworkCore;
using TvShowTracker.Domain.Entities;
using TvShowTracker.Infrastructure.Data;

namespace TvShowTracker.Infrastructure.Services
{
    public class DataSeedService
    {
        private readonly ApplicationDbContext _context;
        private static bool _hasSeeded = false;
        private static readonly SemaphoreSlim _semaphore = new SemaphoreSlim(1, 1);

        public DataSeedService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task InitializeDatabaseAsync()
        {
            await _semaphore.WaitAsync();
            try
            {
                if (_hasSeeded) return;

                Console.WriteLine("🔧 Inicializando banco de dados...");
                await _context.Database.EnsureCreatedAsync();
                
                var hasData = await _context.TvShows.AnyAsync();
                if (hasData)
                {
                    Console.WriteLine("✅ Banco de dados já populado.");
                    _hasSeeded = true;
                    return;
                }

                Console.WriteLine("📥 Executando seed completo...");
                
                // 1. Primeiro criar atores
                await SeedActorsAsync();
                
                // 2. Depois criar TV shows
                await SeedTvShowsAsync();
                
                // 3. Finalmente criar as relações
                await SeedTvShowActorRelationsAsync();

                _hasSeeded = true;
                Console.WriteLine("✅ Seed completo finalizado!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Erro no seed: {ex.Message}");
            }
            finally
            {
                _semaphore.Release();
            }
        }

        private async Task SeedActorsAsync()
        {
            try
            {
                var actors = new List<Actor>
                {
                    new Actor { Name = "Bryan Cranston" },
                    new Actor { Name = "Aaron Paul" },
                    new Actor { Name = "Pedro Pascal" },
                    new Actor { Name = "Emilia Clarke" },
                    new Actor { Name = "Henry Cavill" },
                    new Actor { Name = "Anya Chalotra" },
                    new Actor { Name = "Kit Harington" },
                    new Actor { Name = "Jennifer Aniston" },
                    new Actor { Name = "Leonardo DiCaprio" },
                    new Actor { Name = "Heath Ledger" },
                    new Actor { Name = "Tom Hardy" },
                    new Actor { Name = "Bella Ramsey" },
                    new Actor { Name = "Courteney Cox" },
                    new Actor { Name = "Tom Hanks"},
                    new Actor { Name = "Robin Wright"} // NOVO ATOR ADICIONADO
                };

                await _context.Actors.AddRangeAsync(actors);
                await _context.SaveChangesAsync();
                Console.WriteLine($"✅ Atores seed completado! {actors.Count} atores criados.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Erro no seed de atores: {ex.Message}");
            }
        }

        private async Task SeedTvShowsAsync()
        {
            try
            {
                var tvShows = new List<TvShow>
                {
                    // SÉRIES
                    new TvShow { Title = "Breaking Bad", Genre = "Drama", Type = "Series", ReleaseDate = new DateTime(2008, 1, 20), Rating = 9.5m, Seasons = 5, ImageUrl = "https://image.tmdb.org/t/p/w500/3xnWaLQjelJDDF7LT1WBo6f4BRe.jpg" },
                    new TvShow { Title = "Stranger Things", Genre = "Sci-Fi", Type = "Series", ReleaseDate = new DateTime(2016, 7, 15), Rating = 8.7m, Seasons = 4, ImageUrl = "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg" },
                    new TvShow { Title = "Game of Thrones", Genre = "Fantasy", Type = "Series", ReleaseDate = new DateTime(2011, 4, 17), Rating = 9.3m, Seasons = 8, ImageUrl = "https://image.tmdb.org/t/p/w500/7WUHnWGx5OO145IRxPDUkQSh4C7.jpg" },
                    new TvShow { Title = "The Witcher", Genre = "Fantasy", Type = "Series", ReleaseDate = new DateTime(2019, 12, 20), Rating = 8.2m, Seasons = 3, ImageUrl = "https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg" },
                    new TvShow { Title = "The Last of Us", Genre = "Drama", Type = "Series", ReleaseDate = new DateTime(2023, 1, 15), Rating = 8.8m, Seasons = 1, ImageUrl = "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg" },
                    new TvShow { Title = "Friends", Genre = "Comedy", Type = "Series", ReleaseDate = new DateTime(1994, 9, 22), Rating = 8.9m, Seasons = 10, ImageUrl = "https://image.tmdb.org/t/p/w500/f496cm9enuEsZkSPzCwnTESEK5s.jpg" },
                    
                    // FILMES
                    new TvShow { Title = "The Dark Knight", Genre = "Action", Type = "Movie", ReleaseDate = new DateTime(2008, 7, 18), Rating = 9.0m, Duration = 152, ImageUrl = "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg" },
                    new TvShow { Title = "Inception", Genre = "Sci-Fi", Type = "Movie", ReleaseDate = new DateTime(2010, 7, 16), Rating = 8.8m, Duration = 148, ImageUrl = "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg" },
                    new TvShow { Title = "Forrest Gump", Genre= "Drama", Type = "Movie", ReleaseDate = new DateTime(1994, 7,6), Rating = 8.8m, Duration = 142, ImageUrl ="https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg"},
                    new TvShow { Title = "Avengers: Endgame", Genre = "Action", Type = "Movie", ReleaseDate = new DateTime(2019, 4, 26), Rating = 8.4m, Duration = 181, ImageUrl = "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg" }
                };

                await _context.TvShows.AddRangeAsync(tvShows);
                await _context.SaveChangesAsync();
                Console.WriteLine($"✅ TV Shows seed completado! {tvShows.Count} itens criados.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Erro no seed de TV shows: {ex.Message}");
            }
        }

        // No método SeedTvShowActorRelationsAsync, atualize o mapeamento:
private async Task SeedTvShowActorRelationsAsync()
{
    try
    {
        var tvShows = await _context.TvShows.ToListAsync();
        var actors = await _context.Actors.ToListAsync();

        Console.WriteLine($"📊 Criando relações: {tvShows.Count} TV Shows e {actors.Count} Atores");

        var tvShowActors = new List<TvShowActor>();

        // MAPEAMENTO COMPLETO - CADA ATOR COM PELO MENOS 1 FILME/SÉRIE
        var actorAssignments = new Dictionary<string, List<int>>
        {
            { "Breaking Bad", new List<int> { 0, 1 } }, // Bryan Cranston, Aaron Paul
            { "Stranger Things", new List<int> { 2, 11 } }, // Pedro Pascal, Bella Ramsey
            { "Game of Thrones", new List<int> { 3, 6 } }, // Emilia Clarke, Kit Harington
            { "The Witcher", new List<int> { 4, 5 } }, // Henry Cavill, Anya Chalotra
            { "The Last of Us", new List<int> { 2, 11 } }, // Pedro Pascal, Bella Ramsey
            { "Friends", new List<int> { 7, 12 } }, // Jennifer Aniston, Courteney Cox
            { "The Dark Knight", new List<int> { 8, 9, 10 } }, // Leonardo DiCaprio, Heath Ledger, Tom Hardy
            { "Inception", new List<int> { 8, 10 } }, // Leonardo DiCaprio, Tom Hardy
            { "Avengers: Endgame", new List<int> { 8, 4 } }, // Leonardo DiCaprio, Henry Cavill
            { "Forrest Gump", new List<int> { 13, 14 } } // Tom Hanks, Robin Wright
        };

        var characterNames = new Dictionary<string, Dictionary<int, string>>
        {
            { "Breaking Bad", new Dictionary<int, string> { 
                {0, "Walter White"}, 
                {1, "Jesse Pinkman"} 
            }},
            { "Game of Thrones", new Dictionary<int, string> { 
                {3, "Daenerys Targaryen"}, 
                {6, "Jon Snow"} 
            }},
            { "The Witcher", new Dictionary<int, string> { 
                {4, "Geralt of Rivia"}, 
                {5, "Yennefer"} 
            }},
            { "The Last of Us", new Dictionary<int, string> { 
                {2, "Joel Miller"}, 
                {11, "Ellie Williams"} 
            }},
            { "Friends", new Dictionary<int, string> { 
                {7, "Rachel Green"}, 
                {12, "Monica Geller"} 
            }},
            { "The Dark Knight", new Dictionary<int, string> { 
                {8, "Bruce Wayne"}, 
                {9, "Joker"},
                {10, "Bane"}
            }},
            { "Inception", new Dictionary<int, string> { 
                {8, "Dom Cobb"}, 
                {10, "Eames"} 
            }},
            { "Forrest Gump", new Dictionary<int, string> { 
                {13, "Forrest Gump"},
                {14, "Jenny Curran"}
            }}
        };

        foreach (var tvShow in tvShows)
        {
            if (actorAssignments.ContainsKey(tvShow.Title))
            {
                var actorIndices = actorAssignments[tvShow.Title];
                
                foreach (var actorIndex in actorIndices)
                {
                    if (actorIndex < actors.Count)
                    {
                        string? characterName = null;
                        if (characterNames.ContainsKey(tvShow.Title) && 
                            characterNames[tvShow.Title].ContainsKey(actorIndex))
                        {
                            characterName = characterNames[tvShow.Title][actorIndex];
                        }

                        tvShowActors.Add(new TvShowActor
                        {
                            TvShowId = tvShow.Id,
                            ActorId = actors[actorIndex].Id,
                            IsFeatured = true,
                            CharacterName = characterName
                        });

                        Console.WriteLine($"🎬 Relação: {tvShow.Title} - {actors[actorIndex].Name} como {characterName}");
                    }
                }
            }
        }

        await _context.TvShowActors.AddRangeAsync(tvShowActors);
        await _context.SaveChangesAsync();
        Console.WriteLine($"✅ Relações criadas! {tvShowActors.Count} relações adicionadas.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Erro ao criar relações: {ex.Message}");
    }
}
    }
}