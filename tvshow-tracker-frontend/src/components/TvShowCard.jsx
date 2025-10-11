// src/components/TvShowCard.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import useModal from '../hooks/useModal';
import TvShowModal from './TvShowModal';

const TvShowCard = ({ tvShow, onFavoriteUpdate }) => {
  const { isAuthenticated, user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite, favorites } = useFavorites();
  const [loading, setLoading] = useState(false);
  
  // Hook do modal
  const { isOpen, modalData, openModal, closeModal } = useModal();

  // No TvShowCard.jsx - ADICIONE este debug no handleFavoriteClick:
const handleFavoriteClick = async (e) => {
  e.stopPropagation();
  
  console.log('❤️ Clicou no favorito:', {
    tvShowId: tvShow.id,
    tvShowTitle: tvShow.title,
    tvShowGenre: tvShow.genre, // ← ADICIONE ESTA LINHA
    currentlyFavorite: isFavorite(tvShow.id)
  });

  // ... resto do código
    
    console.log('❤️ Clicou no favorito:', {
      tvShowId: tvShow.id,
      currentlyFavorite: isFavorite(tvShow.id)
    });

    if (!isAuthenticated) {
      alert('Please login to add favorites');
      return;
    }

    setLoading(true);
    try {
      if (isFavorite(tvShow.id)) {
        console.log('🗑️ Removendo favorito...');
        await removeFavorite(tvShow.id);
      } else {
        console.log('➕ Adicionando favorito...');
        await addFavorite(tvShow.id);
      }
      
      if (onFavoriteUpdate) {
        onFavoriteUpdate();
      }
    } catch (error) {
      console.error('❌ Failed to update favorite:', error);
      alert('Failed to update favorite');
    } finally {
      setLoading(false);
    }
  };

  // Função para formatar a duração (minutos para horas e minutos)
  const formatDuration = (minutes) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Função para mostrar seasons ou duração
  const getRuntimeInfo = () => {
    if (tvShow.type === 'Movie' && tvShow.duration) {
      return `🎬 ${formatDuration(tvShow.duration)}`;
    } else if (tvShow.type === 'Series' && tvShow.seasons) {
      return `📺 ${tvShow.seasons} season${tvShow.seasons !== 1 ? 's' : ''}`;
    }
    return null;
  };

  const handleShowDetails = (e) => {
    if (e) e.stopPropagation();
    openModal(tvShow);
  };

  const handleCardClick = () => {
    handleShowDetails();
  };

  const runtimeInfo = getRuntimeInfo();

  return (
    <>
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
        position: 'relative',
        marginBottom: '7px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }}
      onClick={handleCardClick}
      >
        {/* Botão de Favorito - CORAÇÃO SIMPLES */}
        {isAuthenticated && (
          <button
            onClick={handleFavoriteClick}
            disabled={loading}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              fontSize: '24px',
              cursor: loading ? 'not-allowed' : 'pointer',
              color: isFavorite(tvShow.id) ? '#ef4444' : '#9ca3af',
              transition: 'all 0.3s ease',
              zIndex: 2,
              padding: '8px',
              borderRadius: '50%',
              opacity: loading ? 0.6 : 1,
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title={isFavorite(tvShow.id) ? 'Remove from favorites' : 'Add to favorites'}
          >
            {loading ? '⏳' : (isFavorite(tvShow.id) ? '❤️' : '🤍')}
          </button>
        )}

        {/* TV Show Image */}
        <div style={{ 
          width: '100%', 
          height: '200px', 
          backgroundColor: '#f3f4f6', 
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '15px',
          color: '#6b7280',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {tvShow.imageUrl ? (
            <img 
              src={tvShow.imageUrl} 
              alt={tvShow.title}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover' 
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : null}
          {(!tvShow.imageUrl || !tvShow.imageUrl.includes('http')) && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%'
            }}>
              <span style={{ fontSize: '48px', marginBottom: '8px' }}>
                {tvShow.type === 'Movie' ? '🎬' : '📺'}
              </span>
              <span>No Image</span>
            </div>
          )}
        </div>

        {/* TV Show Info */}
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          marginBottom: '8px',
          color: '#1f2937'
        }}>
          {tvShow.title}
        </h3>
        
        <div style={{ marginBottom: '10px' }}>
          {tvShow.genre && (
            <span style={{ 
              backgroundColor: '#dbeafe',
              color: '#1e40af',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '500',
              marginRight: '8px'
            }}>
              {tvShow.genre}
            </span>
          )}
          {tvShow.type && (
            <span style={{ 
              backgroundColor: '#f3f4f6',
              color: '#6b7280',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {tvShow.type}
            </span>
          )}
        </div>

        {tvShow.rating && (
          <p style={{ color: '#6b7280', marginBottom: '5px' }}>
            ⭐ {tvShow.rating}/10
          </p>
        )}

        {/* Runtime Info - Seasons para séries, Duração para filmes */}
        {runtimeInfo && (
          <p style={{ color: '#6b7280', marginBottom: '15px', fontSize: '14px' }}>
            {runtimeInfo}
          </p>
        )}

        {tvShow.description && (
          <p style={{ 
            color: '#6b7280', 
            marginBottom: '15px', 
            fontSize: '14px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {tvShow.description}
          </p>
        )}

        {/* Atores Principais */}
        {tvShow.featuredActors && tvShow.featuredActors.length > 0 && (
          <div style={{ 
            marginBottom: '15px',
            paddingTop: '15px',
            borderTop: '1px solid #e5e7eb'
          }}>
            <h4 style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              marginBottom: '8px',
              color: '#4b5563'
            }}>
              Elenco Principal:
            </h4>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '6px' 
            }}>
              {tvShow.featuredActors.slice(0, 3).map((actor) => (
                <div key={actor.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px' 
                }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    flexShrink: 0
                  }}>
                    {actor.name.charAt(0)}
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    minWidth: 0,
                    flexGrow: 1
                  }}>
                    <span style={{ 
                      fontSize: '12px', 
                      fontWeight: '500', 
                      color: '#1f2937',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {actor.name}
                    </span>
                    {actor.characterName && (
                      <span style={{ 
                        fontSize: '10px', 
                        color: '#6b7280',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        como {actor.characterName}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button 
          style={{ 
            width: '100%',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            padding: '10px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1d4ed8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
          }}
          onClick={handleShowDetails}
        >
          Mostrar Detalhes
        </button>
      </div>

      {/* Modal */}
      <TvShowModal 
        isOpen={isOpen}
        data={modalData}
        onClose={closeModal}
      />
    </>
  );
};

export default TvShowCard;