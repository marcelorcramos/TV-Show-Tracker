import React, { useState, useEffect } from 'react';
import { episodesAPI } from '../services/api';

const TvShowModal = ({ isOpen, data, onClose }) => {
  const [episodes, setEpisodes] = useState([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [seasons, setSeasons] = useState([]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Carregar episódios quando o modal abrir
  useEffect(() => {
    if (isOpen && data && data.id) {
      loadEpisodes(data.id);
    } else {
      // Resetar estado quando o modal fechar
      setEpisodes([]);
      setSeasons([]);
      setSelectedSeason(1);
    }
  }, [isOpen, data]);

  const loadEpisodes = async (tvShowId) => {
    if (data.type !== 'Series') return; // Só carrega episódios para séries
    
    setLoadingEpisodes(true);
    try {
      console.log(`🎬 Carregando episódios para TV Show ID: ${tvShowId}`);
      const response = await episodesAPI.getByTvShow(tvShowId);
      const episodesData = response.data;
      
      setEpisodes(episodesData);
      
      // Extrair temporadas únicas
      const uniqueSeasons = [...new Set(episodesData.map(ep => ep.seasonNumber))].sort((a, b) => a - b);
      setSeasons(uniqueSeasons);
      
      if (uniqueSeasons.length > 0) {
        setSelectedSeason(uniqueSeasons[0]);
      }
      
      console.log(`✅ Carregados ${episodesData.length} episódios para ${uniqueSeasons.length} temporadas`);
    } catch (error) {
      console.error('❌ Erro ao carregar episódios:', error);
      setEpisodes([]);
      setSeasons([]);
    } finally {
      setLoadingEpisodes(false);
    }
  };

  // Filtrar episódios por temporada selecionada
  const seasonEpisodes = episodes.filter(ep => ep.seasonNumber === selectedSeason);

  if (!isOpen || !data) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header com botão fechar */}
        <div style={styles.modalHeader}>
          <button style={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Conteúdo do Modal */}
        <div style={styles.modalContent}>
          {/* Imagem e Informações Básicas */}
          <div style={styles.heroSection}>
            <div style={styles.imageContainer}>
              <img 
                src={data.imageUrl} 
                alt={data.title}
                style={styles.image}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x600/374151/FFFFFF?text=No+Image';
                }}
              />
            </div>
            
            <div style={styles.infoSection}>
              <h1 style={styles.title}>{data.title}</h1>
              
              <div style={styles.ratingContainer}>
                <span style={styles.rating}>⭐ {data.rating}/10</span>
                <span style={styles.typeBadge}>{data.type}</span>
              </div>

              <div style={styles.detailsGrid}>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Gênero:</span>
                  <span style={styles.detailValue}>{data.genre}</span>
                </div>
                
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Lançamento:</span>
                  <span style={styles.detailValue}>
                    {new Date(data.releaseDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                {data.type === 'Series' ? (
                  <>
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Temporadas:</span>
                      <span style={styles.detailValue}>{data.seasons}</span>
                    </div>
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Episódios:</span>
                      <span style={styles.detailValue}>{episodes.length}</span>
                    </div>
                  </>
                ) : (
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Duração:</span>
                    <span style={styles.detailValue}>{data.duration} minutos</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div style={styles.descriptionSection}>
            <h3 style={styles.sectionTitle}>Sinopse</h3>
            <p style={styles.description}>
              {data.description || 'Descrição não disponível.'}
            </p>
          </div>

          {/* SEÇÃO DE EPISÓDIOS - APENAS PARA SÉRIES */}
          {data.type === 'Series' && (
            <div style={styles.episodesSection}>
              <h3 style={styles.sectionTitle}>📺 Episódios</h3>
              
              {/* Seletor de Temporadas */}
              {seasons.length > 0 && (
                <div style={styles.seasonSelector}>
                  <label style={styles.seasonLabel}>Temporada:</label>
                  <select 
                    value={selectedSeason} 
                    onChange={(e) => setSelectedSeason(parseInt(e.target.value))}
                    style={styles.seasonSelect}
                  >
                    {seasons.map(season => (
                      <option key={season} value={season}>
                        Temporada {season}
                      </option>
                    ))}
                  </select>
                  <span style={styles.episodeCount}>
                    {seasonEpisodes.length} episódio{seasonEpisodes.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}

              {/* Lista de Episódios */}
              {loadingEpisodes ? (
                <div style={styles.loading}>
                  <div style={styles.spinner}></div>
                  <p>Carregando episódios...</p>
                </div>
              ) : seasonEpisodes.length > 0 ? (
                <div style={styles.episodesList}>
                  {seasonEpisodes.map((episode) => (
                    <div key={episode.id} style={styles.episodeCard}>
                      <div style={styles.episodeHeader}>
                        <div style={styles.episodeTitleContainer}>
                          <span style={styles.episodeCode}>{episode.episodeCode}</span>
                          <h4 style={styles.episodeTitle}>{episode.title}</h4>
                        </div>
                        <div style={styles.episodeMeta}>
                          {episode.rating && (
                            <span style={styles.episodeRating}>⭐ {episode.rating.toFixed(1)}</span>
                          )}
                          <span style={{
                            ...styles.episodeStatus,
                            backgroundColor: episode.hasAired ? '#10b981' : '#f59e0b'
                          }}>
                            {episode.status}
                          </span>
                        </div>
                      </div>
                      
                      <div style={styles.episodeDetails}>
                        {episode.description && (
                          <p style={styles.episodeDescription}>{episode.description}</p>
                        )}
                        
                        <div style={styles.episodeInfo}>
                          {episode.releaseDate && (
                            <span style={styles.episodeInfoItem}>
                              📅 {episode.formattedReleaseDate}
                            </span>
                          )}
                          {episode.duration && (
                            <span style={styles.episodeInfoItem}>
                              ⏱️ {episode.formattedDuration}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={styles.noEpisodes}>
                  <p>Nenhum episódio encontrado para esta temporada.</p>
                </div>
              )}
            </div>
          )}

          {/* Para filmes, mostrar informações do "episódio único" */}
          {data.type === 'Movie' && episodes.length > 0 && (
            <div style={styles.episodesSection}>
              <h3 style={styles.sectionTitle}>🎬 Detalhes do Filme</h3>
              <div style={styles.movieEpisode}>
                {episodes.map((episode) => (
                  <div key={episode.id} style={styles.episodeCard}>
                    <div style={styles.episodeHeader}>
                      <h4 style={styles.episodeTitle}>{episode.title}</h4>
                      <div style={styles.episodeMeta}>
                        {episode.rating && (
                          <span style={styles.episodeRating}>⭐ {episode.rating.toFixed(1)}</span>
                        )}
                      </div>
                    </div>
                    
                    <div style={styles.episodeDetails}>
                      {episode.description && (
                        <p style={styles.episodeDescription}>{episode.description}</p>
                      )}
                      
                      <div style={styles.episodeInfo}>
                        {episode.releaseDate && (
                          <span style={styles.episodeInfoItem}>
                            📅 {episode.formattedReleaseDate}
                          </span>
                        )}
                        {episode.duration && (
                          <span style={styles.episodeInfoItem}>
                            ⏱️ {episode.formattedDuration}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Informações Adicionais */}
          <div style={styles.additionalInfo}>
            <div style={styles.infoCard}>
              <h4 style={styles.infoTitle}>📊 Detalhes</h4>
              <div style={styles.infoList}>
                <div style={styles.infoItem}>
                  <strong>Tipo:</strong> {data.type}
                </div>
                <div style={styles.infoItem}>
                  <strong>Gênero:</strong> {data.genre}
                </div>
                <div style={styles.infoItem}>
                  <strong>Rating:</strong> ⭐ {data.rating}/10
                </div>
                <div style={styles.infoItem}>
                  <strong>Lançamento:</strong> {new Date(data.releaseDate).toLocaleDateString('pt-BR')}
                </div>
                {data.type === 'Series' ? (
                  <>
                    <div style={styles.infoItem}>
                      <strong>Temporadas:</strong> {data.seasons}
                    </div>
                    <div style={styles.infoItem}>
                      <strong>Total de Episódios:</strong> {episodes.length}
                    </div>
                  </>
                ) : (
                  <div style={styles.infoItem}>
                    <strong>Duração:</strong> {data.duration} min
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    maxWidth: '900px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  },
  modalHeader: {
    position: 'sticky',
    top: 0,
    backgroundColor: 'white',
    padding: '16px 20px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'flex-end',
    zIndex: 10,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px',
    color: '#6b7280',
    transition: 'all 0.2s ease',
  },
  modalContent: {
    padding: '0 20px 20px 20px',
  },
  heroSection: {
    display: 'grid',
    gridTemplateColumns: '300px 1fr',
    gap: '30px',
    marginBottom: '30px',
    alignItems: 'start',
  },
  imageContainer: {
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
  },
  image: {
    width: '100%',
    height: '450px',
    objectFit: 'cover',
    display: 'block',
  },
  infoSection: {
    padding: '10px 0',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '20px',
    lineHeight: '1.2',
  },
  ratingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '25px',
  },
  rating: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#f59e0b',
  },
  typeBadge: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  detailsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '25px',
  },
  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #f3f4f6',
  },
  detailLabel: {
    fontWeight: '600',
    color: '#374151',
    fontSize: '0.9rem',
  },
  detailValue: {
    color: '#6b7280',
    fontSize: '0.9rem',
  },
  descriptionSection: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '12px',
  },
  description: {
    color: '#4b5563',
    lineHeight: '1.6',
    fontSize: '1rem',
  },
  // ESTILOS PARA EPISÓDIOS
  episodesSection: {
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  },
  seasonSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  seasonLabel: {
    fontWeight: '600',
    color: '#374151',
    fontSize: '0.9rem',
  },
  seasonSelect: {
    padding: '8px 12px',
    border: '2px solid #e5e7eb',
    borderRadius: '6px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  episodeCount: {
    fontSize: '0.8rem',
    color: '#6b7280',
    fontWeight: '500',
  },
  episodesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  episodeCard: {
    backgroundColor: 'white',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    transition: 'all 0.2s ease',
  },
  episodeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px',
    gap: '15px',
  },
  episodeTitleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
  },
  episodeCode: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontWeight: '600',
    minWidth: '50px',
    textAlign: 'center',
  },
  episodeTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0,
    flex: 1,
  },
  episodeMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexShrink: 0,
  },
  episodeRating: {
    fontSize: '0.8rem',
    color: '#f59e0b',
    fontWeight: '600',
  },
  episodeStatus: {
    fontSize: '0.7rem',
    color: 'white',
    padding: '2px 8px',
    borderRadius: '12px',
    fontWeight: '600',
  },
  episodeDetails: {
    marginTop: '8px',
  },
  episodeDescription: {
    color: '#6b7280',
    fontSize: '0.9rem',
    lineHeight: '1.4',
    margin: '0 0 8px 0',
  },
  episodeInfo: {
    display: 'flex',
    gap: '15px',
    fontSize: '0.8rem',
    color: '#9ca3af',
  },
  episodeInfoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  movieEpisode: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#6b7280',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  spinner: {
    width: '30px',
    height: '30px',
    border: '3px solid #f3f4f6',
    borderTop: '3px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  noEpisodes: {
    textAlign: 'center',
    padding: '40px',
    color: '#6b7280',
    fontStyle: 'italic',
  },
  additionalInfo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  infoCard: {
    backgroundColor: '#f8fafc',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  },
  infoTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '12px',
  },
  infoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  infoItem: {
    color: '#6b7280',
    fontSize: '0.9rem',
  },
};

// Adicionar animação do spinner
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);

export default TvShowModal;