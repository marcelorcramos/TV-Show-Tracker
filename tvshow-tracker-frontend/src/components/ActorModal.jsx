import React, { useEffect } from 'react';

const ActorModal = ({ isOpen, data, onClose }) => {
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

  if (!isOpen || !data) return null;

  // Calcular idade
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

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
                alt={data.name}
                style={styles.image}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x450/374151/FFFFFF?text=No+Image';
                }}
              />
            </div>
            
            <div style={styles.infoSection}>
              <h1 style={styles.title}>{data.name}</h1>
              
              <div style={styles.detailsGrid}>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Nationality:</span>
                  <span style={styles.detailValue}>{data.nationality}</span>
                </div>
                
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Date of birth:</span>
                  <span style={styles.detailValue}>
                    {new Date(data.birthDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Age:</span>
                  <span style={styles.detailValue}>
                    {calculateAge(data.birthDate)} years old
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Biografia */}
          <div style={styles.bioSection}>
            <h3 style={styles.sectionTitle}>Biography</h3>
            <p style={styles.bio}>
              {data.bio || 'Biografia não disponível.'}
            </p>
          </div>

          {/* Filmografia */}
          {data.tvShows && data.tvShows.length > 0 && (
            <div style={styles.filmographySection}>
              <h3 style={styles.sectionTitle}>🎬 Filmography</h3>
              <div style={styles.filmographyGrid}>
                {data.tvShows.slice(0, 6).map((show) => (
                  <div key={show.id} style={styles.showCard}>
                    <div style={styles.showImage}>
                      <img 
                        src={show.imageUrl} 
                        alt={show.title}
                        style={styles.showImg}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/80x120/374151/FFFFFF?text=No+Image';
                        }}
                      />
                    </div>
                    <div style={styles.showInfo}>
                      <div style={styles.showTitle}>{show.title}</div>
                      <div style={styles.showMeta}>
                        {show.type} • ⭐{show.rating}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {data.tvShows.length > 6 && (
                <div style={styles.moreShows}>
                  + {data.tvShows.length - 6} more...
                </div>
              )}
            </div>
          )}

          {/* Informações Adicionais */}
          <div style={styles.additionalInfo}>
            <div style={styles.infoCard}>
              <h4 style={styles.infoTitle}>📋 Personal Information</h4>
              <div style={styles.infoList}>
                <div style={styles.infoItem}>
                  <strong>Name:</strong> {data.name}
                </div>
                <div style={styles.infoItem}>
                  <strong>Nationality:</strong> {data.nationality}
                </div>
                <div style={styles.infoItem}>
                  <strong>Date of birth:</strong> {new Date(data.birthDate).toLocaleDateString('pt-BR')}
                </div>
                <div style={styles.infoItem}>
                  <strong>Age:</strong> {calculateAge(data.birthDate)} years old
                </div>
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
    maxWidth: '800px',
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
    ':hover': {
      backgroundColor: '#f3f4f6',
      color: '#374151',
    }
  },
  modalContent: {
    padding: '0 20px 20px 20px',
  },
  heroSection: {
    display: 'grid',
    gridTemplateColumns: '250px 1fr',
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
    height: '350px',
    objectFit: 'cover',
    display: 'block',
  },
  infoSection: {
    padding: '10px 0',
  },
  title: {
    fontSize: '2.2rem',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '20px',
    lineHeight: '1.2',
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
  bioSection: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '12px',
  },
  bio: {
    color: '#4b5563',
    lineHeight: '1.6',
    fontSize: '1rem',
  },
  filmographySection: {
    marginBottom: '30px',
  },
  filmographyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '15px',
  },
  showCard: {
    display: 'flex',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#f1f5f9',
    }
  },
  showImage: {
    flexShrink: 0,
  },
  showImg: {
    width: '60px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '4px',
  },
  showInfo: {
    flex: 1,
    minWidth: 0,
  },
  showTitle: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '4px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  showMeta: {
    fontSize: '0.8rem',
    color: '#6b7280',
  },
  moreShows: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '0.9rem',
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

export default ActorModal;