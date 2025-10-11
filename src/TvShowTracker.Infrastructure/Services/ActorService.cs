using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TvShowTracker.Application.DTOs;
using TvShowTracker.Application.Interfaces;
using TvShowTracker.Domain.Entities;
using TvShowTracker.Infrastructure.Data;

namespace TvShowTracker.Infrastructure.Services
{
    public class ActorService : IActorService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private static bool _hasSeeded = false;
        private static readonly SemaphoreSlim _semaphore = new SemaphoreSlim(1, 1);

        public ActorService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
            _ = InitializeDatabaseAsync();
        }

        private async Task InitializeDatabaseAsync()
        {
            await _semaphore.WaitAsync();
            try
            {
                if (_hasSeeded) return;

                Console.WriteLine("🔧 Verificando/Criando banco de dados para Actors...");
                await _context.Database.EnsureCreatedAsync();
                
                var hasData = await _context.Actors.AnyAsync();
                if (hasData)
                {
                    Console.WriteLine("✅ Banco de dados de Actors já populado.");
                    _hasSeeded = true;
                    return;
                }

                Console.WriteLine("📥 Populando banco de dados com atores...");
                await SeedSampleDataAsync();
                
                _hasSeeded = true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Erro na inicialização do banco de Actors: {ex.Message}");
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
                var actors = new List<Actor>
                {
                    new Actor
                    {
                        Name = "Bryan Cranston",
                        Bio = "American actor known for his role as Walter White in Breaking Bad. He has won multiple Emmy Awards for his performance.",
                        Nationality = "American",
                        BirthDate = new DateTime(1956, 3, 7),
                        ImageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNMSt___dK1Umy1K7b6_Hr3coqsxQgKbsWpg&s",
                        CreatedAt = DateTime.UtcNow
                    },
                    new Actor
                    {
                        Name = "Aaron Paul",
                        Bio = "American actor known for his role as Jesse Pinkman in Breaking Bad.",
                        Nationality = "American", 
                        BirthDate = new DateTime(1979, 8, 27),
                        ImageUrl = "https://image.tmdb.org/t/p/w500/7kR4s4k2dW0qwxgQNlMxO7X6xUf.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new Actor
                    {
                        Name = "Pedro Pascal",
                        Bio = "Chilean-American actor known for The Mandalorian, The Last of Us, and Narcos. He has become one of Hollywood's most sought-after actors.",
                        Nationality = "Chilean-American",
                        BirthDate = new DateTime(1975, 4, 2),
                        ImageUrl = "https://image.tmdb.org/t/p/w500/dBOrm29cr7NUrjiDQMTtrTyDpfy.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new Actor
                    {
                        Name = "Emilia Clarke",
                        Bio = "English actress known for her role as Daenerys Targaryen in Game of Thrones. She has also starred in major film franchises.",
                        Nationality = "British",
                        BirthDate = new DateTime(1986, 10, 23),
                        ImageUrl = "https://image.tmdb.org/t/p/w500/xMIjqwhPDfS1L2l8EWhWhDKpTQQ.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new Actor
                    {
                        Name = "Henry Cavill",
                        Bio = "British actor known for his roles as Superman in the DC Extended Universe and Geralt of Rivia in The Witcher.",
                        Nationality = "British",
                        BirthDate = new DateTime(1983, 5, 5),
                        ImageUrl = "https://image.tmdb.org/t/p/w500/5h3Dk3g9w8Yd1qwlvWGPWYUBrJ2.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new Actor
                    {
                        Name = "Anya Chalotra",
                        Bio = "British actress known for her role as Yennefer in The Witcher series.",
                        Nationality = "British",
                        BirthDate = new DateTime(1996, 7, 21),
                        ImageUrl = "https://image.tmdb.org/t/p/w500/1vL1VU5VKy6O8WJzN9kXZ5Qe5b2.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new Actor
                    {
                        Name = "Kit Harington",
                        Bio = "English actor known for his role as Jon Snow in Game of Thrones.",
                        Nationality = "British",
                        BirthDate = new DateTime(1986, 12, 26),
                        ImageUrl = "https://image.tmdb.org/t/p/w500/4MqUjb1SYrzHmOodXzQEeZfg3sP.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new Actor
                    {
                        Name = "Jennifer Aniston",
                        Bio = "American actress and producer. She gained worldwide recognition for her role as Rachel Green on the television sitcom Friends.",
                        Nationality = "American",
                        BirthDate = new DateTime(1969, 2, 11),
                        ImageUrl = "https://image.tmdb.org/t/p/w500/9Y5q9dW95e9dY4tlgj5YdT2Y4n4.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new Actor
                    {
                        Name = "Leonardo DiCaprio",
                        Bio = "American actor and film producer. Known for his work in Titanic, Inception, and The Revenant, for which he won an Academy Award.",
                        Nationality = "American",
                        BirthDate = new DateTime(1974, 11, 11),
                        ImageUrl = "https://image.tmdb.org/t/p/w500/5Brc5dLifH3UInk3wUaCuGXpCqy.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new Actor
                    {
                        Name = "Heath Ledger",
                        Bio = "Australian actor known for his role as Joker in The Dark Knight.",
                        Nationality = "Australian",
                        BirthDate = new DateTime(1979, 4, 4),
                        ImageUrl = "https://image.tmdb.org/t/p/w500/5Y9HnYYa9jF4NunY9lSgJGjSe8E.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new Actor
                    {
                        Name = "Tom Hardy",
                        Bio = "English actor known for his roles in Inception, The Dark Knight Rises, and Mad Max: Fury Road.",
                        Nationality = "British",
                        BirthDate = new DateTime(1977, 9, 15),
                        ImageUrl = "https://image.tmdb.org/t/p/w500/d81K0RH8UX7tZj49tZaQxqEQJp1.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new Actor
                    {
                        Name = "Bella Ramsey",
                        Bio = "English actress known for her roles in Game of Thrones and The Last of Us.",
                        Nationality = "British",
                        BirthDate = new DateTime(2003, 9, 30),
                        ImageUrl = "https://image.tmdb.org/t/p/w500/xU5fpn6qqSOJD3v3x1x3Z3w3z5Z.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new Actor
                    {
                        Name = "Courteney Cox",
                        Bio = "American actress known for her role as Monica Geller on Friends.",
                        Nationality = "American",
                        BirthDate = new DateTime(1964, 6, 15),
                        ImageUrl = "https://image.tmdb.org/t/p/w500/4CkY4UEEG2h6xB2DnK1BZ7N86Fz.jpg",
                        CreatedAt = DateTime.UtcNow
                    }
                };

                await _context.Actors.AddRangeAsync(actors);
                await _context.SaveChangesAsync();

                Console.WriteLine($"✅ Actors seed completado! Adicionados {actors.Count} atores com imagens.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Erro no seed de atores: {ex.Message}");
            }
        }

        public async Task<PagedResult<ActorDto>> GetActorsAsync(ActorQuery query)
        {
            try
            {
                var actorsQuery = _context.Actors.AsQueryable();

                // Filtro por search (nome)
                if (!string.IsNullOrEmpty(query.Search))
                {
                    actorsQuery = actorsQuery.Where(a => a.Name.Contains(query.Search));
                }

                // ✅ ADICIONA ESTE FILTRO PARA NACIONALIDADE
                if (!string.IsNullOrEmpty(query.Nationality))
                {
                    actorsQuery = actorsQuery.Where(a => a.Nationality.Contains(query.Nationality));
                }

                actorsQuery = query.SortBy?.ToLower() switch
                {
                    "name" => query.SortDescending 
                        ? actorsQuery.OrderByDescending(a => a.Name)
                        : actorsQuery.OrderBy(a => a.Name),
                    "birthdate" => query.SortDescending
                        ? actorsQuery.OrderByDescending(a => a.BirthDate)
                        : actorsQuery.OrderBy(a => a.BirthDate),
                    "nationality" => query.SortDescending
                        ? actorsQuery.OrderByDescending(a => a.Nationality)
                        : actorsQuery.OrderBy(a => a.Nationality),
                    _ => actorsQuery.OrderBy(a => a.Name)
                };

                var totalCount = await actorsQuery.CountAsync();
                var actors = await actorsQuery
                    .Skip((query.Page - 1) * query.PageSize)
                    .Take(query.PageSize)
                    .ToListAsync();

                var actorDtos = _mapper.Map<List<ActorDto>>(actors);

                return new PagedResult<ActorDto>
                {
                    Items = actorDtos,
                    TotalCount = totalCount,
                    Page = query.Page,
                    PageSize = query.PageSize
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error in GetActorsAsync: {ex.Message}");
                throw;
            }
        }

        public async Task<ActorDetailDto?> GetActorByIdAsync(int id)
        {
            try
            {
                var actor = await _context.Actors
                    .Include(a => a.TvShowActors)
                        .ThenInclude(ta => ta.TvShow)
                    .FirstOrDefaultAsync(a => a.Id == id);

                if (actor == null) return null;

                var actorDetail = _mapper.Map<ActorDetailDto>(actor);
                
                actorDetail.TvShows = actor.TvShowActors
                    .Select(ta => _mapper.Map<TvShowDto>(ta.TvShow))
                    .ToList();

                return actorDetail;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error in GetActorByIdAsync: {ex.Message}");
                throw;
            }
        }

        public async Task<IEnumerable<TvShowDto>> GetActorTvShowsAsync(int actorId)
        {
            try
            {
                var actorExists = await _context.Actors.AnyAsync(a => a.Id == actorId);
                if (!actorExists) return Enumerable.Empty<TvShowDto>();

                var tvShows = await _context.TvShowActors
                    .Where(ta => ta.ActorId == actorId)
                    .Include(ta => ta.TvShow)
                    .Select(ta => ta.TvShow)
                    .ToListAsync();

                return _mapper.Map<List<TvShowDto>>(tvShows);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error in GetActorTvShowsAsync: {ex.Message}");
                return Enumerable.Empty<TvShowDto>();
            }
        }
    }
}