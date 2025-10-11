import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import  useModal  from '../hooks/useModal';
import ActorModal from './ActorModal';

const ActorCard = ({ actor, onFavoriteUpdate }) => {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(actor.isFavorite || false);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(actor.imageUrl);
  
  // Hook do modal
  const { isOpen, modalData, openModal, closeModal } = useModal();

  // Mapeamento completo de fallback images para atores
  const getActorFallbackImage = (actorName) => {
    const fallbackImages = {
      'Bryan Cranston': 'https://image.tmdb.org/t/p/w500/3gIO6mCd4s4mT2aUdS9dVMXZ9g6.jpg',
      'Millie Bobby Brown': 'https://image.tmdb.org/t/p/w500/4D7fFjD4Ok3bD5iMGRWOM5r7cL6.jpg',
      'Pedro Pascal': 'https://image.tmdb.org/t/p/w500/dBOrm29cr7NUrjiDQMTtrTyDpfy.jpg',
      'Emilia Clarke': 'https://image.tmdb.org/t/p/w500/xMIjqwhPDfS1L2l8EWhWhDKpTQQ.jpg',
      'Henry Cavill': 'https://image.tmdb.org/t/p/w500/5h3Dk3g9w8Yd1qwlvWGPWYUBrJ2.jpg',
      'Zendaya': 'https://image.tmdb.org/t/p/w500/soXY5hq1i4K9LZEqY3WidBQD2KJ.jpg',
      'Tom Hanks': 'https://image.tmdb.org/t/p/w500/xndWFsBlClOJFRdhSt4NBwiPq2o.jpg',
      'Jennifer Aniston': 'https://image.tmdb.org/t/p/w500/9Y5q9dW95e9dY4tlgj5YdT2Y4n4.jpg',
      'Leonardo DiCaprio': 'https://image.tmdb.org/t/p/w500/5Brc5dLifH3UInk3wUaCuGXpCqy.jpg',
      'Margot Robbie': 'https://image.tmdb.org/t/p/w500/euDPyqLnuwaWMHajcU3oZ9uZezR.jpg',
      'Keanu Reeves': 'https://image.tmdb.org/t/p/w500/4D0PpNI0km5y0h1hqHkFcCqML6o.jpg',
      'Scarlett Johansson': 'https://image.tmdb.org/t/p/w500/6NsMbJXRlDZuDzatN2akFdGuTvx.jpg'
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
    
    // Tenta usar o fallback
    const fallbackUrl = getActorFallbackImage(actor.name);
    if (fallbackUrl && fallbackUrl !== currentImageUrl) {
      console.log('🔄 Tentando fallback image:', fallbackUrl);
      setCurrentImageUrl(fallbackUrl);
      setImageError(false); // Reseta o erro para tentar carregar o fallback
    } else {
      setImageError(true); // Se não há fallback, mostra placeholder
    }
  };

  const handleImageLoad = () => {
    console.log('✅ Imagem carregada com sucesso:', actor.name);
    setImageError(false);
  };

  // Determina qual imagem mostrar
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
          position: 'relative'
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

        {/* Actor Image com Fallback Robusto */}
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
              loading="lazy" // Otimização de performance
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