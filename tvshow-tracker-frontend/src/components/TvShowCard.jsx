// src/components/TvShowCard.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { favoritesAPI } from '../services/api';
import useModal from '../hooks/useModal';
import TvShowModal from './TvShowModal';

const TvShowCard = ({ tvShow, onFavoriteUpdate }) => {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(tvShow.isFavorite || false);
  const [loading, setLoading] = useState(false);
  
  // Hook do modal
  const { isOpen, modalData, openModal, closeModal } = useModal();

  const handleFavoriteClick = async (e) => {
    e.stopPropagation(); // Prevenir que abra o modal
    if (!isAuthenticated) {
      alert('Please login to add favorites');
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        await favoritesAPI.remove(tvShow.id);
        setIsFavorite(false);
      } else {
        await favoritesAPI.add(tvShow.id);
        setIsFavorite(true);
      }
      
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