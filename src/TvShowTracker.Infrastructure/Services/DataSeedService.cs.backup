using Microsoft.EntityFrameworkCore;
using TvShowTracker.Domain.Entities;
using TvShowTracker.Infrastructure.Data;
using TvShowTracker.Application.Interfaces;
using AutoMapper;

namespace TvShowTracker.Infrastructure.Services
{
    public class DataSeedService : IDataSeedService // ✅ IMPLEMENTA APENAS IDataSeedService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private static bool _hasSeeded = false;
        private static readonly SemaphoreSlim _semaphore = new SemaphoreSlim(1, 1);

        // ✅ CONSTRUTOR SIMPLIFICADO (sem cache service)
        public DataSeedService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task InitializeDatabaseAsync()
        {
            await _semaphore.WaitAsync();
            try
            {
                if (_hasSeeded) return;

                Console.WriteLine("🔧 Inicializando banco de dados...");
                await _context.Database.EnsureCreatedAsync();
                
                // ✅ PRIMEIRO criar usuários
                await SeedUsersAsync();
                
                // Depois o resto...
                await SeedActorsAsync();
                await SeedTvShowsAsync();
                await SeedEpisodesAsync();
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

        // ✅ MÉTODO PARA LIMPAR BANCO
        public async Task ClearDatabaseAsync()
        {
            await _semaphore.WaitAsync();
            try
            {
                Console.WriteLine("🗑️  Limpando banco de dados...");

                _context.TvShowActors.RemoveRange(_context.TvShowActors);
                _context.TvShows.RemoveRange(_context.TvShows);
                _context.Actors.RemoveRange(_context.Actors);

                await _context.SaveChangesAsync();

                _hasSeeded = false;

                Console.WriteLine("✅ Banco de dados limpo com sucesso!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Erro ao limpar banco de dados: {ex.Message}");
            }
            finally
            {
                _semaphore.Release();
            }
        }

        // ✅ SEED DE ATORES COMPLETO (COM BirthDate, Bio, ImageUrl)
        private async Task SeedActorsAsync()
        {
            try
            {
                var actors = new List<Actor>
                {
                    new Actor 
                    { 
                        Name = "Bryan Cranston", 
                        Nationality = "American",
                        BirthDate = new DateTime(1956, 3, 7),
                        Bio = "American actor known for his role as Walter White in Breaking Bad.",
                        ImageUrl = "https://image.tmdb.org/t/p/w500/3gIO6mCd4s4mT2aUdS9dVMXZ9g6.jpg"
                    },
                    new Actor 
                    { 
                        Name = "Aaron Paul", 
                        Nationality = "American",
                        BirthDate = new DateTime(1979, 8, 27),
                        Bio = "American actor known for his role as Jesse Pinkman in Breaking Bad.",
                        ImageUrl = "https://image.tmdb.org/t/p/w500/7kR4s4k2dW0qwxgQNlMxO7X6xUf.jpg"
                    },
                    new Actor 
                    { 
                        Name = "Pedro Pascal", 
                        Nationality = "Chilean-American",
                        BirthDate = new DateTime(1975, 4, 2),
                        Bio = "Chilean-American actor known for The Mandalorian and The Last of Us.",
                        ImageUrl = "https://image.tmdb.org/t/p/w500/dBOrm29cr7NUrjiDQMTtrTyDpfy.jpg"
                    },
                    new Actor 
                    { 
                        Name = "Emilia Clarke", 
                        Nationality = "British",
                        BirthDate = new DateTime(1986, 10, 23),
                        Bio = "English actress known for her role as Daenerys Targaryen in Game of Thrones.",
                        ImageUrl = "https://image.tmdb.org/t/p/w500/xMIjqwhPDfS1L2l8EWhWhDKpTQQ.jpg"
                    },
                    new Actor 
                    { 
                        Name = "Henry Cavill", 
                        Nationality = "British",
                        BirthDate = new DateTime(1983, 5, 5),
                        Bio = "British actor known for his roles as Superman and Geralt of Rivia.",
                        ImageUrl = "https://image.tmdb.org/t/p/w500/5h3Dk3g9w8Yd1qwlvWGPWYUBrJ2.jpg"
                    },
                    new Actor 
                    { 
                        Name = "Anya Chalotra", 
                        Nationality = "British",
                        BirthDate = new DateTime(1996, 7, 21),
                        Bio = "British actress known for her role as Yennefer in The Witcher.",
                        ImageUrl = "https://image.tmdb.org/t/p/w500/1vL1VU5VKy6O8WJzN9kXZ5Qe5b2.jpg"
                    },
                    new Actor 
                    { 
                        Name = "Kit Harington", 
                        Nationality = "British",
                        BirthDate = new DateTime(1986, 12, 26),
                        Bio = "English actor known for his role as Jon Snow in Game of Thrones.",
                        ImageUrl = "https://image.tmdb.org/t/p/w500/4MqUjb1SYrzHmOodXzQEeZfg3sP.jpg"
                    },
                    new Actor 
                    { 
                        Name = "Jennifer Aniston", 
                        Nationality = "American",
                        BirthDate = new DateTime(1969, 2, 11),
                        Bio = "American actress known for her role as Rachel Green on Friends.",
                        ImageUrl = "https://image.tmdb.org/t/p/w500/9Y5q9dW95e9dY4tlgj5YdT2Y4n4.jpg"
                    },
                    new Actor 
                    { 
                        Name = "Leonardo DiCaprio", 
                        Nationality = "American",
                        BirthDate = new DateTime(1974, 11, 11),
                        Bio = "American actor known for Titanic, Inception, and The Revenant.",
                        ImageUrl = "https://image.tmdb.org/t/p/w500/5Brc5dLifH3UInk3wUaCuGXpCqy.jpg"
                    },
                    new Actor 
                    { 
                        Name = "Heath Ledger", 
                        Nationality = "Australian",
                        BirthDate = new DateTime(1979, 4, 4),
                        Bio = "Australian actor known for his role as Joker in The Dark Knight.",
                        ImageUrl = "https://image.tmdb.org/t/p/w500/5Y9HnYYa9jF4NunY9lSgJGjSe8E.jpg"
                    },
                    new Actor 
                    { 
                        Name = "Tom Hardy", 
                        Nationality = "British",
                        BirthDate = new DateTime(1977, 9, 15),
                        Bio = "English actor known for his roles in Inception and Mad Max: Fury Road.",
                        ImageUrl = "https://image.tmdb.org/t/p/w500/d81K0RH8UX7tZj49tZaQxqEQJp1.jpg"
                    },
                    new Actor 
                    { 
                        Name = "Bella Ramsey", 
                        Nationality = "British",
                        BirthDate = new DateTime(2003, 9, 30),
                        Bio = "English actress known for her roles in Game of Thrones and The Last of Us.",
                        ImageUrl = "https://image.tmdb.org/t/p/w500/xU5fpn6qqSOJD3v3x1x3Z3w3z5Z.jpg"
                    },
                    new Actor 
                    { 
                        Name = "Courteney Cox", 
                        Nationality = "American",
                        BirthDate = new DateTime(1964, 6, 15),
                        Bio = "American actress known for her role as Monica Geller on Friends.",
                        ImageUrl = "https://image.tmdb.org/t/p/w500/4CkY4UEEG2h6xB2DnK1BZ7N86Fz.jpg"
                    },
                    new Actor 
                    { 
                        Name = "Tom Hanks", 
                        Nationality = "American",
                        BirthDate = new DateTime(1956, 7, 9),
                        Bio = "American actor known for his roles in Forrest Gump and Cast Away.",
                        ImageUrl = "https://image.tmdb.org/t/p/w500/xndWFsBlClOJFRdhSt4NBwiPq2o.jpg"
                    },
                    new Actor 
                    { 
                        Name = "Robin Wright", 
                        Nationality = "American",
                        BirthDate = new DateTime(1966, 4, 8),
                        Bio = "American actress known for her roles in Forrest Gump and House of Cards.",
                        ImageUrl = "https://image.tmdb.org/t/p/w500/1cT13dS2Swif6o8Q6Qd1JSKOGUc.jpg"
                    }
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

        // ✅ SEED DE USUÁRIOS
        private async Task SeedUsersAsync()
        {
            try
            {
                var usersExist = await _context.Users.AnyAsync();
                if (usersExist)
                {
                    Console.WriteLine("✅ Usuários já existem no banco.");
                    return;
                }

                var users = new List<User>
                {
                    new User 
                    { 
                        Name = "Demo User", 
                        Email = "novo@example.com",
                        // Hash BCrypt para "Password123!"
                        PasswordHash = "$2a$11$rH6UJJ1a8p8b8Q8Z8Z8Z8e8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new User 
                    { 
                        Name = "Test User", 
                        Email = "test@example.com",
                        // Hash BCrypt para "Test123!"
                        PasswordHash = "$2a$11$4R/X5T5u3qYzBqZJQ8q8Z.HR3eQ7p8Nc1uYzW2kZq3pYfXqYfXqYf",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    }
                };

                await _context.Users.AddRangeAsync(users);
                await _context.SaveChangesAsync();
                Console.WriteLine($"✅ Users seed completado! {users.Count} usuários criados.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Erro no seed de usuários: {ex.Message}");
            }
        }

        // ✅ SEED DE TV SHOWS
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

        // ✅ SEED DE EPISÓDIOS MELHORADO
        private async Task SeedEpisodesAsync()
        {
            try
            {
                // ✅ FORÇAR recarregamento dos TV Shows
                _context.ChangeTracker.Clear();
                var tvShows = await _context.TvShows.ToListAsync();
                
                Console.WriteLine($"🎬 SeedEpisodes: Encontrados {tvShows.Count} TV Shows");
                
                // ✅ DEBUG: Mostrar IDs reais
                foreach (var tvShow in tvShows)
                {
                    Console.WriteLine($"🎬 TV Show: {tvShow.Title} (ID: {tvShow.Id})");
                }

                var episodes = new List<Episode>();
                var random = new Random();

                foreach (var tvShow in tvShows)
                {
                    Console.WriteLine($"🎬 Criando episódios para: {tvShow.Title} (ID: {tvShow.Id})");

                    if (tvShow.Type == "Series" && tvShow.Seasons.HasValue)
                    {
                        for (int season = 1; season <= tvShow.Seasons.Value; season++)
                        {
                            int episodesPerSeason = season == 1 ? 6 : 8;
                            
                            for (int episodeNum = 1; episodeNum <= episodesPerSeason; episodeNum++)
                            {
                                var baseReleaseDate = tvShow.ReleaseDate ?? new DateTime(2020, 1, 1);
                                var releaseDate = baseReleaseDate.AddDays((season - 1) * 180 + (episodeNum - 1) * 7);
                                
                                var episode = new Episode
                                {
                                    Title = GetEpisodeTitle(season, episodeNum),
                                    Description = GetEpisodeDescription(tvShow.Title, season, episodeNum),
                                    SeasonNumber = season,
                                    EpisodeNumber = episodeNum,
                                    ReleaseDate = releaseDate,
                                    Duration = TimeSpan.FromMinutes(45 + random.Next(0, 15)),
                                    Rating = (decimal)(7.5 + (random.NextDouble() * 2.0)),
                                    TvShowId = tvShow.Id, // ✅ USAR ID CORRETO
                                    CreatedAt = DateTime.UtcNow
                                };
                                
                                episodes.Add(episode);
                                Console.WriteLine($"   ✅ Episódio: S{season}E{episodeNum} - TvShowId: {episode.TvShowId}");
                            }
                        }
                    }
                    else if (tvShow.Type == "Movie")
                    {
                        var episode = new Episode
                        {
                            Title = "Full Movie",
                            Description = $"The complete {tvShow.Title} movie experience",
                            SeasonNumber = 1,
                            EpisodeNumber = 1,
                            ReleaseDate = tvShow.ReleaseDate,
                            Duration = TimeSpan.FromMinutes(tvShow.Duration ?? 120),
                            Rating = tvShow.Rating,
                            TvShowId = tvShow.Id, // ✅ USAR ID CORRETO
                            CreatedAt = DateTime.UtcNow
                        };
                        
                        episodes.Add(episode);
                        Console.WriteLine($"   ✅ Episódio filme - TvShowId: {episode.TvShowId}");
                    }
                }

                Console.WriteLine($"🎬 Total episódios a criar: {episodes.Count}");
                
                await _context.Episodes.AddRangeAsync(episodes);
                var saved = await _context.SaveChangesAsync();
                
                Console.WriteLine($"✅ Episodes seed: {saved} episódios salvos");

                // ✅ VERIFICAÇÃO FINAL
                var episodeCount = await _context.Episodes.CountAsync();
                Console.WriteLine($"✅ Verificação: {episodeCount} episódios no banco");
                
                // ✅ VERIFICAÇÃO POR TV SHOW
                foreach (var tvShow in tvShows)
                {
                    var count = await _context.Episodes.CountAsync(e => e.TvShowId == tvShow.Id);
                    Console.WriteLine($"✅ {tvShow.Title} (ID: {tvShow.Id}): {count} episódios");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Erro no seed de episódios: {ex.Message}");
                throw;
            }
        }

        // ✅ MÉTODOS AUXILIARES PARA GERAR TÍTULOS E DESCRIÇÕES
        private string GetEpisodeTitle(int season, int episode)
        {
            var titles = new[]
            {
                "The Beginning", "Secrets Revealed", "New Alliances", "The Turning Point",
                "Echoes of the Past", "Crossroads", "The Final Stand", "A New Dawn",
                "Shadows and Light", "The Price of Victory", "Unexpected Journey", "Legacy"
            };
            
            return titles[(season + episode) % titles.Length];
        }

        private string GetEpisodeDescription(string showTitle, int season, int episode)
        {
            var descriptions = new[]
            {
                $"In this pivotal episode of {showTitle}, characters face their greatest challenges yet.",
                $"Secrets from the past come to light in season {season}, changing everything.",
                $"New alliances are formed as the story of {showTitle} takes an unexpected turn.",
                $"The stakes have never been higher in this thrilling installment.",
                $"Emotions run high as long-buried truths are finally revealed.",
                $"A game-changing moment that will redefine the future of {showTitle}."
            };
            
            return descriptions[(season + episode) % descriptions.Length];
        }

        // ✅ SEED DE RELAÇÕES
        private async Task SeedTvShowActorRelationsAsync()
        {
            try
            {
                var tvShows = await _context.TvShows.ToListAsync();
                var actors = await _context.Actors.ToListAsync();

                Console.WriteLine($"📊 Criando relações: {tvShows.Count} TV Shows e {actors.Count} Atores");

                var tvShowActors = new List<TvShowActor>();

                var actorAssignments = new Dictionary<string, List<int>>
                {
                    { "Breaking Bad", new List<int> { 0, 1 } },
                    { "Stranger Things", new List<int> { 2, 11 } },
                    { "Game of Thrones", new List<int> { 3, 6 } },
                    { "The Witcher", new List<int> { 4, 5 } },
                    { "The Last of Us", new List<int> { 2, 11 } },
                    { "Friends", new List<int> { 7, 12 } },
                    { "The Dark Knight", new List<int> { 8, 9, 10 } },
                    { "Inception", new List<int> { 8, 10 } },
                    { "Avengers: Endgame", new List<int> { 8, 4 } },
                    { "Forrest Gump", new List<int> { 13, 14 } }
                };

                var characterNames = new Dictionary<string, Dictionary<int, string>>
                {
                    { "Breaking Bad", new Dictionary<int, string> { {0, "Walter White"}, {1, "Jesse Pinkman"} } },
                    { "Game of Thrones", new Dictionary<int, string> { {3, "Daenerys Targaryen"}, {6, "Jon Snow"} } },
                    { "The Witcher", new Dictionary<int, string> { {4, "Geralt of Rivia"}, {5, "Yennefer"} } },
                    { "The Last of Us", new Dictionary<int, string> { {2, "Joel Miller"}, {11, "Ellie Williams"} } },
                    { "Friends", new Dictionary<int, string> { {7, "Rachel Green"}, {12, "Monica Geller"} } },
                    { "The Dark Knight", new Dictionary<int, string> { {8, "Bruce Wayne"}, {9, "Joker"}, {10, "Bane"} } },
                    { "Inception", new Dictionary<int, string> { {8, "Dom Cobb"}, {10, "Eames"} } },
                    { "Forrest Gump", new Dictionary<int, string> { {13, "Forrest Gump"}, {14, "Jenny Curran"} } }
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