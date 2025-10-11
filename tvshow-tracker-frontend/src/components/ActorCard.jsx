// src/components/ActorCard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import useModal from '../hooks/useModal';
import ActorModal from './ActorModal';

const ActorCard = ({ actor, onFavoriteUpdate }) => {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(actor.isFavorite || false);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(actor.imageUrl);
  const [actorTvShows, setActorTvShows] = useState([]);
  
  // Hook do modal
  const { isOpen, modalData, openModal, closeModal } = useModal();

  // Carrega os TV shows do ator
  useEffect(() => {
    const fetchActorTvShows = async () => {
      try {
        const { actorsAPI } = await import('../services/api');
        const response = await actorsAPI.getTvShows(actor.id);
        setActorTvShows(response.data || []);
      } catch (error) {
        console.error('❌ Erro ao carregar TV shows do ator:', error);
      }
    };

    if (actor.id) {
      fetchActorTvShows();
    }
  }, [actor.id]);

  // Mapeamento de fallback images
  const getActorFallbackImage = (actorName) => {
    const fallbackImages = {
      'Bryan Cranston': 'https://image.tmdb.org/t/p/w500/3gIO6mCd4s4mT2aUdS9dVMXZ9g6.jpg',
      'Aaron Paul': 'https://image.tmdb.org/t/p/w500/7kR4s4k2dW0qwxgQNlMxO7X6xUf.jpg',
      'Pedro Pascal': 'https://image.tmdb.org/t/p/w500/dBOrm29cr7NUrjiDQMTtrTyDpfy.jpg',
      'Emilia Clarke': 'https://image.tmdb.org/t/p/w500/xMIjqwhPDfS1L2l8EWhWhDKpTQQ.jpg',
      'Henry Cavill': 'https://image.tmdb.org/t/p/w500/5h3Dk3g9w8Yd1qwlvWGPWYUBrJ2.jpg',
      'Anya Chalotra': 'https://image.tmdb.org/t/p/w500/1vL1VU5VKy6O8WJzN9kXZ5Qe5b2.jpg',
      'Kit Harington': 'https://image.tmdb.org/t/p/w500/4MqUjb1SYrzHmOodXzQEeZfg3sP.jpg',
      'Jennifer Aniston': 'https://image.tmdb.org/t/p/w500/9Y5q9dW95e9dY4tlgj5YdT2Y4n4.jpg',
      'Leonardo DiCaprio': 'https://image.tmdb.org/t/p/w500/5Brc5dLifH3UInk3wUaCuGXpCqy.jpg',
      'Heath Ledger': 'https://image.tmdb.org/t/p/w500/5Y9HnYYa9jF4NunY9lSgJGjSe8E.jpg',
      'Tom Hardy': 'https://image.tmdb.org/t/p/w500/d81K0RH8UX7tZj49tZaQxqEQJp1.jpg',
      'Bella Ramsey': 'https://image.tmdb.org/t/p/w500/xU5fpn6qqSOJD3v3x1x3Z3w3z5Z.jpg',
      'Courteney Cox': 'https://image.tmdb.org/t/p/w500/4CkY4UEEG2h6xB2DnK1BZ7N86Fz.jpg',
      'Tom Hanks': 'https://image.tmdb.org/t/p/w500/xndWFsBlClOJFRdhSt4NBwiPq2o.jpg',
      'Robin Wright': 'https://image.tmdb.org/t/p/w500/1cT13dS2Swif6o8Q6Qd1JSKOGUc.jpg'
    };
    
    return fallbackImages[actorName] || null;
  };

  // Verifica se a URL da imagem é válida
  const isValidImageUrl = (url) => {
    if (!url) return false;
    if (!url.includes('http')) return false;
    if (url.includes('placeholder.com')) return false;
    return true;
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'N/A';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please login to add favorites');
      return;
    }

    setLoading(true);
    try {
      setIsFavorite(!isFavorite);
      
      if (onFavoriteUpdate) {
        onFavoriteUpdate();
      }
    } catch (error) {
      console.error('Failed to update favorite:', error);
      alert('Failed to update favorite');
    } finally {
      setLoading(false);
    }
  };

  const handleShowDetails = (e) => {
    if (e) e.stopPropagation();
    openModal(actor);
  };

  const handleCardClick = () => {
    handleShowDetails();
  };

  const handleImageError = () => {
    console.log('❌ Erro a carregar imagem para:', actor.name);
    
    const fallbackUrl = getActorFallbackImage(actor.name);
    if (fallbackUrl && fallbackUrl !== currentImageUrl) {
      console.log('🔄 Tentando fallback image:', fallbackUrl);
      setCurrentImageUrl(fallbackUrl);
      setImageError(false);
    } else {
      setImageError(true);
    }
  };

  const handleImageLoad = () => {
    console.log('✅ Imagem carregada com sucesso:', actor.name);
    setImageError(false);
  };

  const showFallback = imageError || !isValidImageUrl(currentImageUrl);

  return (
    <>
      <div 
        style={{ 
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
        {/* Favorite Button */}
        {isAuthenticated && (
          <button
            onClick={handleFavoriteClick}
            disabled={loading}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: isFavorite ? '#ef4444' : '#d1d5db',
              transition: 'color 0.2s',
              zIndex: 2,
              padding: '4px',
              borderRadius: '4px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
        )}

        {/* Actor Image */}
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
          {!showFallback && currentImageUrl ? (
            <img 
              src={currentImageUrl} 
              alt={actor.name}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover' 
              }}
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="lazy"
            />
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              backgroundColor: '#e5e7eb'
            }}>
              <span style={{ fontSize: '48px', marginBottom: '8px' }}>🎭</span>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>{actor.name}</span>
              <span style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>No Image</span>
            </div>
          )}
        </div>

        {/* Actor Info */}
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          marginBottom: '8px',
          color: '#1f2937'
        }}>
          {actor.name}
        </h3>
        
        <div style={{ marginBottom: '10px' }}>
          {actor.nationality && (
            <span style={{ 
              backgroundColor: '#dbeafe',
              color: '#1e40af',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '500',
              marginRight: '8px'
            }}>
              {actor.nationality}
            </span>
          )}
          {actor.birthDate && (
            <span style={{ 
              backgroundColor: '#f3f4f6',
              color: '#6b7280',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {calculateAge(actor.birthDate)} anos
            </span>
          )}
        </div>

        {actor.birthDate && (
          <p style={{ color: '#6b7280', marginBottom: '5px', fontSize: '14px' }}>
            🎂 {new Date(actor.birthDate).toLocaleDateString('pt-BR')}
          </p>
        )}

        {/* TV Shows/Filmes - NOVA SEÇÃO ADICIONADA */}
        {actorTvShows.length > 0 && (
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
              Conhecido por:
            </h4>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '6px' 
            }}>
              {actorTvShows.slice(0, 3).map((tvShow) => (
                <div key={tvShow.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px' 
                }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    backgroundColor: tvShow.type === 'Movie' ? '#fef3c7' : '#f0f9ff',
                    color: tvShow.type === 'Movie' ? '#d97706' : '#0369a1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    flexShrink: 0
                  }}>
                    {tvShow.type === 'Movie' ? '🎬' : '📺'}
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
                      {tvShow.title}
                    </span>
                    <span style={{ 
                      fontSize: '10px', 
                      color: '#6b7280',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {tvShow.genre} • {tvShow.rating}/10
                    </span>
                  </div>
                </div>
              ))}
              {actorTvShows.length > 3 && (
                <div style={{ 
                  fontSize: '11px', 
                  color: '#6b7280',
                  textAlign: 'center',
                  padding: '4px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '4px'
                }}>
                  +{actorTvShows.length - 3} mais
                </div>
              )}
            </div>
          </div>
        )}

        {actor.bio && (
          <p style={{ 
            color: '#6b7280', 
            marginBottom: '15px', 
            fontSize: '14px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {actor.bio}
          </p>
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
      <ActorModal 
        isOpen={isOpen}
        data={modalData}
        onClose={closeModal}
      />
    </>
  );
};

export default ActorCard;