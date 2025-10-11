using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TvShowTracker.Application.DTOs;
using TvShowTracker.Application.Interfaces;
using TvShowTracker.Domain.Entities;
using TvShowTracker.Infrastructure.Data;

namespace TvShowTracker.Infrastructure.Services
{
    public class TvShowService : ITvShowService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ICacheService _cacheService;
        private static bool _hasSeeded = false;
        private static readonly SemaphoreSlim _semaphore = new SemaphoreSlim(1, 1);

        public TvShowService(ApplicationDbContext context, IMapper mapper, ICacheService cacheService)
        {
            _context = context;
            _mapper = mapper;
            _cacheService = cacheService;
            
            // Iniciar o seed de forma assíncrona e segura
            _ = InitializeDatabaseAsync();
        }

        private async Task InitializeDatabaseAsync()
        {
            await _semaphore.WaitAsync();
            try
            {
                if (_hasSeeded) return;

                // PASSO 1: Garantir que o banco e tabelas existem
                Console.WriteLine("🔧 Verificando/Criando banco de dados...");
                await _context.Database.EnsureCreatedAsync();
                
                // PASSO 2: Verificar se já temos dados
                var hasData = await _context.TvShows.AnyAsync();
                if (hasData)
                {
                    Console.WriteLine("✅ Banco de dados já populado.");
                    _hasSeeded = true;
                    return;
                }

                // PASSO 3: Popular com dados iniciais
                Console.WriteLine("📥 Populando banco de dados com dados iniciais...");
                await SeedSampleDataAsync();
                
                _hasSeeded = true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Erro na inicialização do banco: {ex.Message}");
            }
            finally
            {
                _semaphore.Release();
            }
        }

        private async Task SeedSampleDataAsync()
        {
            try
            {
                var tvShows = new List<TvShow>
                {
                    // SÉRIES EXISTENTES
                    new TvShow
                    {
                        Title = "Breaking Bad",
                        Description = "A high school chemistry teacher diagnosed with cancer turns to cooking meth to secure his family's future.",
                        Genre = "Drama",
                        Type = "Series",
                        ReleaseDate = new DateTime(2008, 1, 20),
                        Rating = 9.5m,
                        Seasons = 5,
                        ImageUrl = "https://image.tmdb.org/t/p/w500/3xnWaLQjelJDDF7LT1WBo6f4BRe.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "Stranger Things",
                        Description = "When a young boy disappears, his mother uncovers mysteries involving secret experiments and supernatural forces.",
                        Genre = "Sci-Fi",
                        Type = "Series", 
                        ReleaseDate = new DateTime(2016, 7, 15),
                        Rating = 8.7m,
                        Seasons = 4,
                        ImageUrl = "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "The Crown",
                        Description = "Follows the political rivalries and romance of Queen Elizabeth II's reign.",
                        Genre = "Drama",
                        Type = "Series",
                        ReleaseDate = new DateTime(2016, 11, 4),
                        Rating = 8.6m,
                        Seasons = 6,
                        ImageUrl = "https://image.tmdb.org/t/p/w500/1M876KPjulVwppEpldhdc8V4o68.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "Game of Thrones",
                        Description = "Nine noble families fight for control over the lands of Westeros.",
                        Genre = "Fantasy",
                        Type = "Series",
                        ReleaseDate = new DateTime(2011, 4, 17),
                        Rating = 9.3m,
                        Seasons = 8,
                        ImageUrl = "https://image.tmdb.org/t/p/w500/7WUHnWGx5OO145IRxPDUkQSh4C7.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "The Mandalorian",
                        Description = "The travels of a lone bounty hunter in the outer reaches of the galaxy.",
                        Genre = "Sci-Fi",
                        Type = "Series",
                        ReleaseDate = new DateTime(2019, 11, 12),
                        Rating = 8.8m,
                        Seasons = 3,
                        ImageUrl = "https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg",
                        CreatedAt = DateTime.UtcNow
                    },

                    // NOVAS SÉRIES
                    new TvShow
                    {
                        Title = "The Witcher",
                        Description = "Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts.",
                        Genre = "Fantasy",
                        Type = "Series",
                        ReleaseDate = new DateTime(2019, 12, 20),
                        Rating = 8.2m,
                        Seasons = 3,
                        ImageUrl = "https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "The Last of Us",
                        Description = "After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl who may be humanity's last hope.",
                        Genre = "Drama",
                        Type = "Series",
                        ReleaseDate = new DateTime(2023, 1, 15),
                        Rating = 8.8m,
                        Seasons = 1,
                        ImageUrl = "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "House of the Dragon",
                        Description = "The story of House Targaryen set 200 years before the events of Game of Thrones.",
                        Genre = "Fantasy",
                        Type = "Series",
                        ReleaseDate = new DateTime(2022, 8, 21),
                        Rating = 8.5m,
                        Seasons = 1,
                        ImageUrl = "https://image.tmdb.org/t/p/w500/1X4h40fcB4WWUmIBK0auT4zRBAV.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "The Boys",
                        Description = "A group of vigilantes set out to take down corrupt superheroes who abuse their superpowers.",
                        Genre = "Action",
                        Type = "Series",
                        ReleaseDate = new DateTime(2019, 7, 26),
                        Rating = 8.7m,
                        Seasons = 4,
                        ImageUrl = "https://image.tmdb.org/t/p/w500/stTEycfG9928HYGEISBFaG1ngjM.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "Wednesday",
                        Description = "Follows Wednesday Addams' years as a student, when she attempts to master her emerging psychic ability, thwart a killing spree, and solve the mystery that embroiled her parents.",
                        Genre = "Comedy",
                        Type = "Series",
                        ReleaseDate = new DateTime(2022, 11, 23),
                        Rating = 8.2m,
                        Seasons = 1,
                        ImageUrl = "https://image.tmdb.org/t/p/w500/jeGtaNrG9Kbz37g23Y62yZYs2Oz.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "Money Heist",
                        Description = "An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain.",
                        Genre = "Crime",
                        Type = "Series",
                        ReleaseDate = new DateTime(2017, 5, 2),
                        Rating = 8.3m,
                        Seasons = 5,
                        ImageUrl = "https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "The Queen's Gambit",
                        Description = "Orphaned at the tender age of nine, prodigious introvert Beth Harmon discovers and masters the game of chess in 1960s USA.",
                        Genre = "Drama",
                        Type = "Series",
                        ReleaseDate = new DateTime(2020, 10, 23),
                        Rating = 8.6m,
                        Seasons = 1,
                        ImageUrl = "https://image.tmdb.org/t/p/w500/zU0htwkhNvBQdVSIKB9s6hgVeFK.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "Chernobyl",
                        Description = "In April 1986, the Chernobyl Nuclear Power Plant in the Soviet Union suffers a massive explosion, creating the world's worst nuclear disaster.",
                        Genre = "Drama",
                        Type = "Series",
                        ReleaseDate = new DateTime(2019, 5, 6),
                        Rating = 9.4m,
                        Seasons = 1,
                        ImageUrl = "https://image.tmdb.org/t/p/w500/hlLXt2tOPT6RRnjiUmoxyG1LTFi.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "The Office",
                        Description = "A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.",
                        Genre = "Comedy",
                        Type = "Series",
                        ReleaseDate = new DateTime(2005, 3, 24),
                        Rating = 8.9m,
                        Seasons = 9,
                        ImageUrl = "https://image.tmdb.org/t/p/w500/qWnJzyZhyy74gjpSjIXWmuk0ifX.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "Friends",
                        Description = "Follows the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan.",
                        Genre = "Comedy",
                        Type = "Series",
                        ReleaseDate = new DateTime(1994, 9, 22),
                        Rating = 8.9m,
                        Seasons = 10,
                        ImageUrl = "https://image.tmdb.org/t/p/w500/f496cm9enuEsZkSPzCwnTESEK5s.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    
                    // FILMES EXISTENTES
                    new TvShow
                    {
                        Title = "The Shawshank Redemption",
                        Description = "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
                        Genre = "Drama",
                        Type = "Movie",
                        ReleaseDate = new DateTime(1994, 9, 23),
                        Rating = 9.3m,
                        Seasons = null,
                        Duration = 142,
                        ImageUrl = "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "The Godfather",
                        Description = "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
                        Genre = "Crime",
                        Type = "Movie",
                        ReleaseDate = new DateTime(1972, 3, 24),
                        Rating = 9.2m,
                        Seasons = null,
                        Duration = 175,
                        ImageUrl = "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "The Dark Knight",
                        Description = "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
                        Genre = "Action",
                        Type = "Movie",
                        ReleaseDate = new DateTime(2008, 7, 18),
                        Rating = 9.0m,
                        Seasons = null,
                        Duration = 152,
                        ImageUrl = "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "Pulp Fiction",
                        Description = "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
                        Genre = "Crime",
                        Type = "Movie",
                        ReleaseDate = new DateTime(1994, 10, 14),
                        Rating = 8.9m,
                        Seasons = null,
                        Duration = 154,
                        ImageUrl = "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "Forrest Gump",
                        Description = "The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man with an IQ of 75.",
                        Genre = "Drama",
                        Type = "Movie",
                        ReleaseDate = new DateTime(1994, 7, 6),
                        Rating = 8.8m,
                        Seasons = null,
                        Duration = 142,
                        ImageUrl = "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "Inception",
                        Description = "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
                        Genre = "Sci-Fi",
                        Type = "Movie",
                        ReleaseDate = new DateTime(2010, 7, 16),
                        Rating = 8.8m,
                        Seasons = null,
                        Duration = 148,
                        ImageUrl = "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "The Matrix",
                        Description = "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
                        Genre = "Sci-Fi",
                        Type = "Movie",
                        ReleaseDate = new DateTime(1999, 3, 31),
                        Rating = 8.7m,
                        Seasons = null,
                        Duration = 136,
                        ImageUrl = "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
                        CreatedAt = DateTime.UtcNow
                    },

                    // NOVOS FILMES
                    new TvShow
                    {
                        Title = "Interstellar",
                        Description = "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
                        Genre = "Sci-Fi",
                        Type = "Movie",
                        ReleaseDate = new DateTime(2014, 11, 7),
                        Rating = 8.6m,
                        Seasons = null,
                        Duration = 169,
                        ImageUrl = "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "Parasite",
                        Description = "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
                        Genre = "Thriller",
                        Type = "Movie",
                        ReleaseDate = new DateTime(2019, 5, 30),
                        Rating = 8.6m,
                        Seasons = null,
                        Duration = 132,
                        ImageUrl = "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "Avengers: Endgame",
                        Description = "After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos' actions and restore balance to the universe.",
                        Genre = "Action",
                        Type = "Movie",
                        ReleaseDate = new DateTime(2019, 4, 26),
                        Rating = 8.4m,
                        Seasons = null,
                        Duration = 181,
                        ImageUrl = "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "Spirited Away",
                        Description = "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits.",
                        Genre = "Animation",
                        Type = "Movie",
                        ReleaseDate = new DateTime(2001, 7, 20),
                        Rating = 8.6m,
                        Seasons = null,
                        Duration = 125,
                        ImageUrl = "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "La La Land",
                        Description = "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.",
                        Genre = "Romance",
                        Type = "Movie",
                        ReleaseDate = new DateTime(2016, 12, 9),
                        Rating = 8.0m,
                        Seasons = null,
                        Duration = 128,
                        ImageUrl = "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "The Social Network",
                        Description = "As Harvard student Mark Zuckerberg creates the social networking site that would become known as Facebook, he is sued by the twins who claimed he stole their idea.",
                        Genre = "Drama",
                        Type = "Movie",
                        ReleaseDate = new DateTime(2010, 10, 1),
                        Rating = 7.7m,
                        Seasons = null,
                        Duration = 120,
                        ImageUrl = "https://image.tmdb.org/t/p/w500/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "Get Out",
                        Description = "A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness about their reception of him eventually reaches a boiling point.",
                        Genre = "Horror",
                        Type = "Movie",
                        ReleaseDate = new DateTime(2017, 2, 24),
                        Rating = 7.7m,
                        Seasons = null,
                        Duration = 104,
                        ImageUrl = "https://image.tmdb.org/t/p/w500/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "Mad Max: Fury Road",
                        Description = "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners.",
                        Genre = "Action",
                        Type = "Movie",
                        ReleaseDate = new DateTime(2015, 5, 15),
                        Rating = 8.1m,
                        Seasons = null,
                        Duration = 120,
                        ImageUrl = "https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "Whiplash",
                        Description = "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.",
                        Genre = "Drama",
                        Type = "Movie",
                        ReleaseDate = new DateTime(2014, 10, 10),
                        Rating = 8.5m,
                        Seasons = null,
                        Duration = 106,
                        ImageUrl = "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCtuedzg.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new TvShow
                    {
                        Title = "The Grand Budapest Hotel",
                        Description = "A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy in the hotel's glorious years under an exceptional concierge.",
                        Genre = "Comedy",
                        Type = "Movie",
                        ReleaseDate = new DateTime(2014, 3, 28),
                        Rating = 8.1m,
                        Seasons = null,
                        Duration = 99,
                        ImageUrl = "https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg",
                        CreatedAt = DateTime.UtcNow
                    }
                };

                await _context.TvShows.AddRangeAsync(tvShows);
                await _context.SaveChangesAsync();

                Console.WriteLine($"✅ Seed completado! Adicionados {tvShows.Count} itens com imagens (Séries: 15, Filmes: 17).");
                
                // Aguardar um pouco para garantir que os atores foram criados
                await Task.Delay(2000);
                
                // Agora criar as relações entre TV shows e atores
                await SeedTvShowActorRelationsAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Erro no seed: {ex.Message}");
            }
        }

        private async Task SeedTvShowActorRelationsAsync()
{
    try
    {
        // Verificar se já existem relações
        if (await _context.TvShowActors.AnyAsync()) 
        {
            Console.WriteLine("✅ Relações TvShow-Actor já existem.");
            return;
        }

        var tvShows = await _context.TvShows.ToListAsync();
        var actors = await _context.Actors.ToListAsync();

        Console.WriteLine($"📊 Encontrados {tvShows.Count} TV Shows e {actors.Count} Atores");

        var tvShowActors = new List<TvShowActor>();

        // Mapeamento específico de atores para séries/filmes
        var actorAssignments = new Dictionary<string, List<int>>
        {
            { "Breaking Bad", new List<int> { 0, 1 } }, // Bryan Cranston, Aaron Paul
            { "Stranger Things", new List<int> { 1, 2 } }, // Millie Bobby Brown, Finn Wolfhard
            { "The Witcher", new List<int> { 4 } }, // Henry Cavill
            { "Game of Thrones", new List<int> { 3 } }, // Emilia Clarke
            { "The Dark Knight", new List<int> { 8 } }, // Leonardo DiCaprio
            { "Inception", new List<int> { 8 } }, // Leonardo DiCaprio
            { "The Last of Us", new List<int> { 2 } }, // Pedro Pascal
            { "Friends", new List<int> { 7 } }, // Jennifer Aniston
            { "The Mandalorian", new List<int> { 2 } } // Pedro Pascal
        };

        // Nomes dos personagens
        var characterNames = new Dictionary<string, Dictionary<int, string>>
        {
            { "Breaking Bad", new Dictionary<int, string> { {0, "Walter White"}, {1, "Jesse Pinkman"} } },
            { "Stranger Things", new Dictionary<int, string> { {1, "Eleven"} } },
            { "The Witcher", new Dictionary<int, string> { {4, "Geralt of Rivia"} } },
            { "Game of Thrones", new Dictionary<int, string> { {3, "Daenerys Targaryen"} } },
            { "The Dark Knight", new Dictionary<int, string> { {8, "Bruce Wayne"} } },
            { "Inception", new Dictionary<int, string> { {8, "Dom Cobb"} } },
            { "The Last of Us", new Dictionary<int, string> { {2, "Joel Miller"} } },
            { "Friends", new Dictionary<int, string> { {7, "Rachel Green"} } },
            { "The Mandalorian", new Dictionary<int, string> { {2, "The Mandalorian"} } }
        };

        foreach (var tvShow in tvShows)
        {
            List<int> actorIndices;
            if (actorAssignments.ContainsKey(tvShow.Title))
            {
                actorIndices = actorAssignments[tvShow.Title];
            }
            else
            {
                // Para séries/filmes não mapeados, usar alguns atores aleatórios
                actorIndices = Enumerable.Range(0, Math.Min(2, actors.Count))
                    .OrderBy(a => Guid.NewGuid())
                    .Take(1)
                    .ToList();
            }

            for (int i = 0; i < actorIndices.Count; i++)
            {
                if (actorIndices[i] < actors.Count)
                {
                    string? characterName = null; // ✅ CORRIGIDO: nullable
                    if (characterNames.ContainsKey(tvShow.Title) && 
                        characterNames[tvShow.Title].ContainsKey(actorIndices[i]))
                    {
                        characterName = characterNames[tvShow.Title][actorIndices[i]];
                    }

                    tvShowActors.Add(new TvShowActor
                    {
                        TvShowId = tvShow.Id,
                        ActorId = actors[actorIndices[i]].Id,
                        IsFeatured = true, // Todos são principais para demonstração
                        CharacterName = characterName
                        // ✅ REMOVIDO: CreatedAt se não existir na entidade
                    });

                    Console.WriteLine($"🎬 Relação criada: {tvShow.Title} - {actors[actorIndices[i]].Name} como {characterName ?? "Personagem"}");
                }
            }
        }

        await _context.TvShowActors.AddRangeAsync(tvShowActors);
        await _context.SaveChangesAsync();

        Console.WriteLine($"✅ Relações TvShow-Actor criadas! {tvShowActors.Count} relações adicionadas.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Erro ao criar relações TvShow-Actor: {ex.Message}");
    }
}

        public async Task<PagedResult<TvShowDto>> GetTvShowsAsync(TvShowQuery query)
        {
            try
            {
                var tvShowsQuery = _context.TvShows
                    .Include(t => t.TvShowActors)
                        .ThenInclude(ta => ta.Actor)
                    .AsQueryable();

                // Apply filters
                if (!string.IsNullOrEmpty(query.Genre))
                {
                    tvShowsQuery = tvShowsQuery.Where(t => t.Genre == query.Genre);
                }

                if (!string.IsNullOrEmpty(query.Type))
                {
                    tvShowsQuery = tvShowsQuery.Where(t => t.Type == query.Type);
                }

                if (!string.IsNullOrEmpty(query.Search))
                {
                    tvShowsQuery = tvShowsQuery.Where(t =>
                        t.Title.Contains(query.Search) ||
                        (t.Description != null && t.Description.Contains(query.Search)));
                }

                // Apply sorting
                tvShowsQuery = query.SortBy?.ToLower() switch
                {
                    "title" => query.SortDescending
                        ? tvShowsQuery.OrderByDescending(t => t.Title)
                        : tvShowsQuery.OrderBy(t => t.Title),
                    "releasedate" => query.SortDescending
                        ? tvShowsQuery.OrderByDescending(t => t.ReleaseDate)
                        : tvShowsQuery.OrderBy(t => t.ReleaseDate),
                    "rating" => query.SortDescending
                        ? tvShowsQuery.OrderByDescending(t => t.Rating)
                        : tvShowsQuery.OrderBy(t => t.Rating),
                    "seasons" => query.SortDescending
                        ? tvShowsQuery.OrderByDescending(t => t.Seasons)
                        : tvShowsQuery.OrderBy(t => t.Seasons),
                    _ => tvShowsQuery.OrderBy(t => t.Title)
                };

                // Get total count for pagination
                var totalCount = await tvShowsQuery.CountAsync();

                // Apply pagination
                var tvShows = await tvShowsQuery
                    .Skip((query.Page - 1) * query.PageSize)
                    .Take(query.PageSize)
                    .ToListAsync();

                // Mapear para DTO e incluir os 3 principais atores
                var tvShowDtos = tvShows.Select(tvShow =>
                {
                    var dto = _mapper.Map<TvShowDto>(tvShow);
                    
                    // DEBUG: Log para verificar
                    Console.WriteLine($"🎭 {tvShow.Title} - Total relações: {tvShow.TvShowActors?.Count}");
                    
                    // Pegar os 3 principais atores
                    // No método GetTvShowsAsync - substitua a criação do ActorDto:
                    dto.FeaturedActors = tvShow.TvShowActors?
                        .Where(ta => ta.IsFeatured && ta.Actor != null)
                        .Take(3)
                        .Select(ta => new ActorDto 
                        { 
                            Id = ta.Actor.Id,
                            Name = ta.Actor.Name,
                            CharacterName = ta.CharacterName,
                            ImageUrl = ta.Actor.ImageUrl // ← ADICIONE ESTA LINHA
                        })
                        .ToList() ?? new List<ActorDto>();
                        
                    Console.WriteLine($"🎭 {tvShow.Title} - Atores mapeados: {dto.FeaturedActors.Count}");
                        
                    return dto;
                }).ToList();

                return new PagedResult<TvShowDto>
                {
                    Items = tvShowDtos,
                    TotalCount = totalCount,
                    Page = query.Page,
                    PageSize = query.PageSize
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Erro em GetTvShowsAsync: {ex.Message}");
                throw;
            }
        }

        public async Task<List<string>> GetAvailableGenresAsync()
        {
            try
            {
                var cacheKey = "available_genres";
                var cachedGenres = await _cacheService.GetAsync<List<string>>(cacheKey);
                if (cachedGenres != null)
                {
                    return cachedGenres;
                }

                var genres = await _context.TvShows
                    .Where(t => t.Genre != null)
                    .Select(t => t.Genre!)
                    .Distinct()
                    .OrderBy(g => g)
                    .ToListAsync();

                await _cacheService.SetAsync(cacheKey, genres, TimeSpan.FromHours(6));
                return genres;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Erro em GetAvailableGenresAsync: {ex.Message}");
                return new List<string>();
            }
        }

        public async Task<List<string>> GetAvailableTypesAsync()
        {
            try
            {
                var cacheKey = "available_types";
                var cachedTypes = await _cacheService.GetAsync<List<string>>(cacheKey);
                if (cachedTypes != null)
                {
                    return cachedTypes;
                }

                var types = await _context.TvShows
                    .Where(t => t.Type != null)
                    .Select(t => t.Type!)
                    .Distinct()
                    .OrderBy(t => t)
                    .ToListAsync();

                await _cacheService.SetAsync(cacheKey, types, TimeSpan.FromHours(6));
                return types;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Erro em GetAvailableTypesAsync: {ex.Message}");
                return new List<string>();
            }
        }

        public async Task<TvShowDetailDto?> GetTvShowByIdAsync(int id)
        {
            try
            {
                var tvShow = await _context.TvShows
                    .Include(t => t.Episodes.OrderBy(e => e.SeasonNumber).ThenBy(e => e.EpisodeNumber))
                    .Include(t => t.TvShowActors)
                        .ThenInclude(ta => ta.Actor)
                    .FirstOrDefaultAsync(t => t.Id == id);

                if (tvShow == null) return null;

                var tvShowDetail = _mapper.Map<TvShowDetailDto>(tvShow);
                
                tvShowDetail.FeaturedActors = tvShow.TvShowActors
                    .Where(ta => ta.IsFeatured)
                    .Select(ta => new ActorDto 
                    { 
                        Id = ta.Actor.Id,
                        Name = ta.Actor.Name,
                        CharacterName = ta.CharacterName
                    })
                    .ToList();

                return tvShowDetail;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Erro em GetTvShowByIdAsync: {ex.Message}");
                throw;
            }
        }

        public async Task<List<TvShowDto>> GetRecommendedTvShowsAsync(int userId)
        {
            try
            {
                var recommendationService = new RecommendationService(_context, _mapper);
                return await recommendationService.GetRecommendationsAsync(userId, 5);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Erro em GetRecommendedTvShowsAsync: {ex.Message}");
                return new List<TvShowDto>();
            }
        }

        public async Task<string> DebugDatabase()
        {
            try
            {
                var tvShowsCount = await _context.TvShows.CountAsync();
                var actorsCount = await _context.Actors.CountAsync();
                var tvShowActorsCount = await _context.TvShowActors.CountAsync();
                var types = await _context.TvShows.Select(t => t.Type).Distinct().ToListAsync();
                
                return $"Total TvShows: {tvShowsCount}, Actors: {actorsCount}, Relations: {tvShowActorsCount}, Types: {string.Join(", ", types)}";
            }
            catch (Exception ex)
            {
                return $"Erro no debug: {ex.Message}";
            }
        }
    }
}