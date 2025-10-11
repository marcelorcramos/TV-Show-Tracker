import React, { useEffect } from 'react';

const TvShowModal = ({ isOpen, data, onClose }) => {
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
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Temporadas:</span>
                    <span style={styles.detailValue}>{data.seasons}</span>
                  </div>
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
                  <div style={styles.infoItem}>
                    <strong>Temporadas:</strong> {data.seasons}
                  </div>
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

export default TvShowModal;