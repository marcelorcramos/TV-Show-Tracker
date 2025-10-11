import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import useModal from '../hooks/useModal'; // ← Importação sem chaves
import ActorModal from './ActorModal';

const ActorCard = ({ actor, onFavoriteUpdate }) => {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(actor.isFavorite || false);
  const [loading, setLoading] = useState(false);
  
  // Hook do modal
  const { isOpen, modalData, openModal, closeModal } = useModal();

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
    e.stopPropagation(); // Prevenir que abra o modal
    if (!isAuthenticated) {
      alert('Please login to add favorites');
      return;
    }

    setLoading(true);
    try {
      // Simulação temporária
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
          {actor.imageUrl ? (
            <img 
              src={actor.imageUrl} 
              alt={actor.name}
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
          {(!actor.imageUrl || !actor.imageUrl.includes('http')) && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%'
            }}>
              <span style={{ fontSize: '48px', marginBottom: '8px' }}>🎭</span>
              <span>No Image</span>
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