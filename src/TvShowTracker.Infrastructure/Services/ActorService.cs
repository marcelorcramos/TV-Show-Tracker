using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TvShowTracker.Application.DTOs;
using TvShowTracker.Application.Interfaces;
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
        }

        public async Task<PagedResult<ActorDto>> GetActorsAsync(ActorQuery query)
        {
            var actorsQuery = _context.Actors.AsQueryable();

            // Apply search filter
            if (!string.IsNullOrEmpty(query.Search))
            {
                actorsQuery = actorsQuery.Where(a => 
                    a.Name.Contains(query.Search) || 
                    a.Nationality != null && a.Nationality.Contains(query.Search));
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
    }
}