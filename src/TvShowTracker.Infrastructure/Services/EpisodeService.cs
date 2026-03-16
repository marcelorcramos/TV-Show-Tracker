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
            Console.WriteLine($"EpisodeService: INICIANDO - TV Show ID: {tvShowId}");
            
            try
            {
                // DEBUG 1: Verificar se o contexto está funcionando
                Console.WriteLine($"EpisodeService: Contexto database: {_context.Database.CanConnect()}");
                
                // DEBUG 2: Verificar quantos episódios existem no total
                var totalEpisodes = await _context.Episodes.CountAsync();
                Console.WriteLine($"EpisodeService: Total de episódios no banco: {totalEpisodes}");
                
                // DEBUG 3: Verificar se o TV Show existe
                var tvShowExists = await _context.TvShows.AnyAsync(t => t.Id == tvShowId);
                Console.WriteLine($"EpisodeService: TV Show ID {tvShowId} existe: {tvShowExists}");
                
                if (!tvShowExists)
                {
                    Console.WriteLine($"EpisodeService: TV Show ID {tvShowId} NÃO EXISTE!");
                    return new List<EpisodeDto>();
                }

                // DEBUG 4: Buscar episódios com query detalhada
                Console.WriteLine($"EpisodeService: Executando query...");
                var episodes = await _context.Episodes
                    .Where(e => e.TvShowId == tvShowId)
                    .OrderBy(e => e.SeasonNumber)
                    .ThenBy(e => e.EpisodeNumber)
                    .ToListAsync();

                Console.WriteLine($"EpisodeService: Query retornou {episodes.Count} episódios");
                
                // DEBUG 5: Log detalhado dos episódios encontrados
                if (episodes.Count > 0)
                {
                    Console.WriteLine($"EpisodeService: DETALHES DOS EPI SÓDIOS:");
                    foreach (var episode in episodes.Take(5)) // 5 primeiros
                    {
                        Console.WriteLine($"   ID: {episode.Id}, Title: {episode.Title}, S{episode.SeasonNumber}E{episode.EpisodeNumber}, TvShowId: {episode.TvShowId}");
                    }
                    if (episodes.Count > 5)
                    {
                        Console.WriteLine($"   ... e mais {episodes.Count - 5} episódios");
                    }
                }
                else
                {
                    Console.WriteLine($"EpisodeService: NENHUM EPI SÓDIO ENCONTRADO para TvShowId: {tvShowId}");
                    
                    // DEBUG EXTRA: Verificar quais TvShowIds existem nos episódios
                    var existingTvShowIds = await _context.Episodes
                        .Select(e => e.TvShowId)
                        .Distinct()
                        .ToListAsync();
                    Console.WriteLine($"EpisodeService: TvShowIds com episódios: {string.Join(", ", existingTvShowIds)}");
                }

                // DEBUG 6: Testar mapeamento manual
                Console.WriteLine($"EpisodeService: Iniciando mapeamento manual...");
                var manualDtos = new List<EpisodeDto>();
                
                foreach (var episode in episodes)
                {
                    try
                    {
                        var dto = new EpisodeDto
                        {
                            Id = episode.Id,
                            Title = episode.Title ?? "Sem título",
                            Description = episode.Description,
                            SeasonNumber = episode.SeasonNumber,
                            EpisodeNumber = episode.EpisodeNumber,
                            ReleaseDate = episode.ReleaseDate,
                            Duration = episode.Duration,
                            Rating = episode.Rating
                        };
                        manualDtos.Add(dto);
                    }
                    catch (Exception mapEx)
                    {
                        Console.WriteLine($"EpisodeService: Erro no mapeamento do episódio {episode.Id}: {mapEx.Message}");
                    }
                }

                Console.WriteLine($"EpisodeService: Mapeamento manual criou {manualDtos.Count} DTOs");
                
                if (manualDtos.Count > 0)
                {
                    Console.WriteLine($"EpisodeService: Primeiro DTO - Title: '{manualDtos[0].Title}', Season: {manualDtos[0].SeasonNumber}");
                }

                return manualDtos;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"EpisodeService: ERRO CRÍTICO: {ex.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                }
                throw;
            }
        }

        public async Task<EpisodeDto?> GetEpisodeByIdAsync(int id)
        {
            try
            {
                Console.WriteLine($"EpisodeService: Buscando episódio por ID: {id}");
                
                var episode = await _context.Episodes
                    .FirstOrDefaultAsync(e => e.Id == id);

                if (episode == null)
                {
                    Console.WriteLine($"EpisodeService: Episódio ID {id} não encontrado");
                    return null;
                }

                Console.WriteLine($"EpisodeService: Episódio encontrado: {episode.Title}");
                return _mapper.Map<EpisodeDto?>(episode);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"EpisodeService: Erro ao buscar episódio {id}: {ex.Message}");
                throw;
            }
        }
    }
}