// TvShowTracker.Infrastructure/Services/RecommendationService.cs
using Microsoft.EntityFrameworkCore;
using TvShowTracker.Application.DTOs;
using TvShowTracker.Application.Interfaces;
using TvShowTracker.Infrastructure.Data;
using AutoMapper;

namespace TvShowTracker.Infrastructure.Services
{
    public class RecommendationService : IRecommendationService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public RecommendationService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<TvShowDto>> GetRecommendationsAsync(int userId, int count = 5)
{
    try
    {
        Console.WriteLine($"🎯 RecommendationService: Gerando recomendações para usuário {userId}");

        // 1. Obter favoritos do usuário
        var userFavorites = await _context.UserFavorites
            .Where(uf => uf.UserId == userId)
            .Select(uf => uf.TvShowId)
            .ToListAsync();

        Console.WriteLine($"🎯 Usuário tem {userFavorites.Count} favoritos: {string.Join(", ", userFavorites)}");

        if (userFavorites.Count == 0)
        {
            // Se não tem favoritos, retornar TV shows populares
            Console.WriteLine($"🎯 Nenhum favorito encontrado, retornando TV shows populares");
            return await GetPopularTvShowsAsync(count);
        }

        // 2. Obter gêneros dos favoritos
        var favoriteGenres = await _context.TvShows
            .Where(t => userFavorites.Contains(t.Id) && t.Genre != null)
            .Select(t => t.Genre)
            .Distinct()
            .ToListAsync();

        Console.WriteLine($"🎯 Gêneros preferidos: {string.Join(", ", favoriteGenres)}");

        if (favoriteGenres.Count == 0)
        {
            Console.WriteLine($"🎯 Nenhum gênero encontrado nos favoritos, retornando TV shows populares");
            return await GetPopularTvShowsAsync(count);
        }

        // 3. Buscar recomendações baseadas nos gêneros
       // No RecommendationService.cs, modifique a query:
// ✅ CORRIGIR A QUERY - LINHA ~47
var recommendedTvShows = await _context.TvShows
    .Where(t => !userFavorites.Contains(t.Id) && 
               t.Genre != null && 
               favoriteGenres.Contains(t.Genre) &&
               t.Episodes.Any())
    .Include(t => t.TvShowActors)
        .ThenInclude(ta => ta.Actor)
    .Include(t => t.Episodes) // ✅ ADICIONAR ESTA LINHA
    .ToListAsync();

        Console.WriteLine($"🎯 Encontrados {recommendedTvShows.Count} TV shows compatíveis");

        // DEBUG: Mostrar detalhes dos TV shows encontrados
        if (recommendedTvShows.Count > 0)
        {
            Console.WriteLine($"🎯 Detalhes dos TV shows recomendados:");
            foreach (var tvShow in recommendedTvShows)
            {
                Console.WriteLine($"   📺 ID: {tvShow.Id}, Title: {tvShow.Title}, Genre: {tvShow.Genre}, Type: {tvShow.Type}");
            }
        }

        // 4. Ordenar por rating (no CLIENT-SIDE) ✅ CORREÇÃO DO SQLite
        var sortedRecommendations = recommendedTvShows
            .OrderByDescending(t => t.Rating)
            .ThenBy(t => t.Title)
            .Take(count)
            .ToList();

        Console.WriteLine($"🎯 Selecionadas {sortedRecommendations.Count} recomendações finais");

        // DEBUG: Mostrar recomendações finais
        Console.WriteLine($"🎯 Recomendações finais:");
        foreach (var tvShow in sortedRecommendations)
        {
            Console.WriteLine($"   ✅ ID: {tvShow.Id}, Title: {tvShow.Title}, Rating: {tvShow.Rating}");
        }

        // 5. Mapear para DTO
        var result = sortedRecommendations.Select(tvShow =>
        {
            var dto = _mapper.Map<TvShowDto>(tvShow);
            
            dto.FeaturedActors = tvShow.TvShowActors?
                .Where(ta => ta.IsFeatured && ta.Actor != null)
                .Take(3)
                .Select(ta => new ActorDto 
                { 
                    Id = ta.Actor.Id,
                    Name = ta.Actor.Name,
                    CharacterName = ta.CharacterName,
                    ImageUrl = ta.Actor.ImageUrl
                })
                .ToList() ?? new List<ActorDto>();
                
            return dto;
        }).ToList();

        Console.WriteLine($"🎯 RecommendationService: Retornando {result.Count} recomendações");
        return result;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Erro no RecommendationService: {ex.Message}");
        Console.WriteLine($"Stack trace: {ex.StackTrace}");
        
        // Fallback: retornar TV shows populares em caso de erro
        Console.WriteLine($"🎯 Usando fallback devido a erro");
        return await GetPopularTvShowsAsync(count);
    }
}

        // ✅ IMPLEMENTAR MÉTODO DA INTERFACE
        public async Task TrainRecommendationModelAsync()
        {
            try
            {
                Console.WriteLine("🎯 RecommendationService: Iniciando treinamento do modelo...");
                
                // Simular treinamento do modelo (para uma implementação futura com ML)
                await Task.Delay(100); // Simular processamento
                
                Console.WriteLine("✅ RecommendationService: Modelo 'treinado' (simulado)");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Erro no treinamento do modelo: {ex.Message}");
                throw;
            }
        }

        // Método auxiliar para TV shows populares (fallback)
        private async Task<List<TvShowDto>> GetPopularTvShowsAsync(int count)
        {
            try
            {
                Console.WriteLine($"🎯 Usando fallback: TV shows populares");
                
                var popularTvShows = await _context.TvShows
                    .Include(t => t.TvShowActors)
                        .ThenInclude(ta => ta.Actor)
                    .ToListAsync();

                var sortedTvShows = popularTvShows
                    .OrderByDescending(t => t.Rating)
                    .ThenBy(t => t.Title)
                    .Take(count)
                    .ToList();

                return sortedTvShows.Select(tvShow =>
                {
                    var dto = _mapper.Map<TvShowDto>(tvShow);
                    
                    dto.FeaturedActors = tvShow.TvShowActors?
                        .Where(ta => ta.IsFeatured && ta.Actor != null)
                        .Take(3)
                        .Select(ta => new ActorDto 
                        { 
                            Id = ta.Actor.Id,
                            Name = ta.Actor.Name,
                            CharacterName = ta.CharacterName,
                            ImageUrl = ta.Actor.ImageUrl
                        })
                        .ToList() ?? new List<ActorDto>();
                        
                    return dto;
                }).ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Erro no fallback: {ex.Message}");
                return new List<TvShowDto>();
            }
        }
    }
}