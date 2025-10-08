using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TvShowTracker.Application.DTOs;
using TvShowTracker.Application.Interfaces;
using TvShowTracker.Infrastructure.Data;

namespace TvShowTracker.Infrastructure.Services
{
    public class TvShowService : ITvShowService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public TvShowService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PagedResult<TvShowDto>> GetTvShowsAsync(TvShowQuery query)
        {
            var tvShowsQuery = _context.TvShows.AsQueryable();

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
                _ => tvShowsQuery.OrderBy(t => t.Title) // Default sort
            };

            // Get total count for pagination
            var totalCount = await tvShowsQuery.CountAsync();

            // Apply pagination
            var tvShows = await tvShowsQuery
                .Skip((query.Page - 1) * query.PageSize)
                .Take(query.PageSize)
                .ToListAsync();

            var tvShowDtos = _mapper.Map<List<TvShowDto>>(tvShows);

            return new PagedResult<TvShowDto>
            {
                Items = tvShowDtos,
                TotalCount = totalCount,
                Page = query.Page,
                PageSize = query.PageSize
            };
        }

        public async Task<TvShowDetailDto?> GetTvShowByIdAsync(int id)
        {
            var tvShow = await _context.TvShows
                .Include(t => t.Episodes.OrderBy(e => e.SeasonNumber).ThenBy(e => e.EpisodeNumber))
                .Include(t => t.TvShowActors)
                    .ThenInclude(ta => ta.Actor)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (tvShow == null) return null;

            var tvShowDetail = _mapper.Map<TvShowDetailDto>(tvShow);
            
            // Map featured actors
            tvShowDetail.FeaturedActors = tvShow.TvShowActors
                .Where(ta => ta.IsFeatured)
                .Select(ta => _mapper.Map<ActorDto>(ta.Actor))
                .ToList();

            return tvShowDetail;
        }

        public async Task<List<string>> GetAvailableGenresAsync()
        {
            return await _context.TvShows
                .Where(t => t.Genre != null)
                .Select(t => t.Genre!)
                .Distinct()
                .OrderBy(g => g)
                .ToListAsync();
        }

        public async Task<List<string>> GetAvailableTypesAsync()
        {
            return await _context.TvShows
                .Where(t => t.Type != null)
                .Select(t => t.Type!)
                .Distinct()
                .OrderBy(t => t)
                .ToListAsync();
        }

        public async Task<List<TvShowDto>> GetRecommendedTvShowsAsync(int userId)
        {
            // Use the recommendation service instead of simple random
            var recommendationService = new RecommendationService(_context, _mapper);
            return await recommendationService.GetRecommendationsAsync(userId, 5);
        }
    }
}