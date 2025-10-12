// TvShowTracker.Infrastructure/Services/EpisodeService.cs
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TvShowTracker.Application.DTOs;
using TvShowTracker.Application.Interfaces;
using TvShowTracker.Infrastructure.Data;

namespace TvShowTracker.Infrastructure.Services
{
    public class EpisodeService : IEpisodeService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public EpisodeService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<EpisodeDto>> GetEpisodesByTvShowAsync(int tvShowId)
        {
            var episodes = await _context.Episodes
                .Where(e => e.TvShowId == tvShowId)
                .OrderBy(e => e.SeasonNumber)
                .ThenBy(e => e.EpisodeNumber)
                .ToListAsync();

            return _mapper.Map<List<EpisodeDto>>(episodes);
        }

        public async Task<EpisodeDto?> GetEpisodeByIdAsync(int id)
        {
            var episode = await _context.Episodes
                .FirstOrDefaultAsync(e => e.Id == id);

            return _mapper.Map<EpisodeDto?>(episode);
        }
    }
}