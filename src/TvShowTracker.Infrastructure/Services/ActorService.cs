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

        public ActorService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
            SeedSampleDataAsync().Wait(); // Adicionar dados de exemplo
        }

        private async Task SeedSampleDataAsync()
        {
            // Verificar se já existem Atores
            if (!await _context.Actors.AnyAsync())
            {
                var actors = new List<Actor>
                {
                    new Actor
                    {
                        Name = "Bryan Cranston",
                        Bio = "American actor known for Breaking Bad",
                        Nationality = "American",
                        BirthDate = new DateTime(1956, 3, 7),
                        CreatedAt = DateTime.UtcNow
                    },
                    new Actor
                    {
                        Name = "Millie Bobby Brown", 
                        Bio = "British actress known for Stranger Things",
                        Nationality = "British",
                        BirthDate = new DateTime(2004, 2, 19),
                        CreatedAt = DateTime.UtcNow
                    },
                    new Actor
                    {
                        Name = "Pedro Pascal",
                        Bio = "Chilean-American actor known for The Mandalorian",
                        Nationality = "Chilean-American",
                        BirthDate = new DateTime(1975, 4, 2),
                        CreatedAt = DateTime.UtcNow
                    },
                    new Actor
                    {
                        Name = "Emilia Clarke",
                        Bio = "English actress known for Game of Thrones",
                        Nationality = "British",
                        BirthDate = new DateTime(1986, 10, 23),
                        CreatedAt = DateTime.UtcNow
                    },
                    new Actor
                    {
                        Name = "Aaron Paul",
                        Bio = "American actor known for Breaking Bad",
                        Nationality = "American", 
                        BirthDate = new DateTime(1979, 8, 27),
                        CreatedAt = DateTime.UtcNow
                    },
                    new Actor
                    {
                        Name = "Winona Ryder",
                        Bio = "American actress known for Stranger Things",
                        Nationality = "American",
                        BirthDate = new DateTime(1971, 10, 29),
                        CreatedAt = DateTime.UtcNow
                    }
                };

                _context.Actors.AddRange(actors);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<PagedResult<ActorDto>> GetActorsAsync(ActorQuery query)
        {
            var actorsQuery = _context.Actors.AsQueryable();

            // Apply search filter
            if (!string.IsNullOrEmpty(query.Search))
            {
                actorsQuery = actorsQuery.Where(a => 
                    a.Name.Contains(query.Search) || 
                    (a.Nationality != null && a.Nationality.Contains(query.Search)));
            }

            // Apply sorting
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
                _ => actorsQuery.OrderBy(a => a.Name) // Default sort
            };

            // Get total count for pagination
            var totalCount = await actorsQuery.CountAsync();

            // Apply pagination
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

        public async Task<ActorDetailDto?> GetActorByIdAsync(int id)
        {
            var actor = await _context.Actors
                .Include(a => a.TvShowActors)
                    .ThenInclude(ta => ta.TvShow)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (actor == null) return null;

            var actorDetail = _mapper.Map<ActorDetailDto>(actor);
            
            // Map TV shows
            actorDetail.TvShows = actor.TvShowActors
                .Select(ta => _mapper.Map<TvShowDto>(ta.TvShow))
                .ToList();

            return actorDetail;
        }

        public async Task<IEnumerable<TvShowDto>> GetActorTvShowsAsync(int actorId)
        {
            // Verifica se o ator existe
            var actorExists = await _context.Actors.AnyAsync(a => a.Id == actorId);
            if (!actorExists)
            {
                return Enumerable.Empty<TvShowDto>();
            }

            var tvShows = await _context.TvShowActors
                .Where(ta => ta.ActorId == actorId)
                .Include(ta => ta.TvShow)
                .Select(ta => ta.TvShow)
                .ToListAsync();

            return _mapper.Map<List<TvShowDto>>(tvShows);
        }
    }
}