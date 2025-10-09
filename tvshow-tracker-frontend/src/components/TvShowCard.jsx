import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { favoritesAPI } from '../services/api';

const TvShowCard = ({ tvShow, onFavoriteUpdate }) => {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(tvShow.isFavorite || false);
  const [loading, setLoading] = useState(false);

  const handleFavoriteClick = async () => {
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

  return (
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
            transition: 'color 0.2s'
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
        overflow: 'hidden'
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
          />
        ) : (
          '📺 No Image'
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

      {tvShow.seasons && (
        <p style={{ color: '#6b7280', marginBottom: '15px', fontSize: '14px' }}>
          📺 {tvShow.seasons} season{tvShow.seasons !== 1 ? 's' : ''}
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

      <button style={{ 
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
      >
        Ver Detalhes
      </button>
    </div>
  );
};

export default TvShowCard;