import React, { useRef, useEffect } from 'react';
import { useSearch } from '../hooks/useSearch';

const SearchBar = () => {
  const { 
    searchTerm, 
    setSearchTerm,
    showResults,
    setShowResults,
    isLoading,
    results,
    hasResults,
    clearSearch
  } = useSearch();
  
  const searchRef = useRef(null);

  // Fechar resultados ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowResults]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClear = () => {
    clearSearch();
  };

  const handleItemClick = () => {
    setShowResults(false);
  };

  return (
    <div ref={searchRef} style={styles.searchContainer}>
      <div style={styles.searchInputWrapper}>
        <input
          type="text"
          placeholder="Buscar séries, filmes, atores..."
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => searchTerm && setShowResults(true)}
          style={styles.searchInput}
        />
        
        {isLoading && (
          <div style={styles.loadingSpinner}>
            <div style={styles.spinner}></div>
          </div>
        )}
        
        {searchTerm && !isLoading && (
          <button
            onClick={handleClear}
            style={styles.clearButton}
            type="button"
          >
            ✕
          </button>
        )}
      </div>

      {/* Resultados da Search */}
      {showResults && (
        <div style={styles.resultsContainer}>
          {/* TV Shows */}
          {results.tvShows.length > 0 && (
            <div style={styles.resultsSection}>
              <div style={styles.sectionTitle}>
                📺 Séries & Filmes ({results.tvShows.length})
              </div>
              {results.tvShows.map(tvShow => (
                <div
                  key={`tvshow-${tvShow.id}`}
                  style={styles.resultItem}
                  onClick={handleItemClick}
                >
                  <div style={styles.itemContent}>
                    <div style={styles.itemName}>{tvShow.title}</div>
                    <div style={styles.itemMeta}>
                      {tvShow.type} • {tvShow.genre} • ⭐{tvShow.rating}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Atores */}
          {results.actors.length > 0 && (
            <div style={styles.resultsSection}>
              <div style={styles.sectionTitle}>
                🎭 Atores ({results.actors.length})
              </div>
              {results.actors.map(actor => (
                <div
                  key={`actor-${actor.id}`}
                  style={styles.resultItem}
                  onClick={handleItemClick}
                >
                  <div style={styles.itemContent}>
                    <div style={styles.itemName}>{actor.name}</div>
                    <div style={styles.itemMeta}>
                      {actor.nationality} • 🎂{new Date(actor.birthDate).getFullYear()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sem resultados */}
          {!isLoading && !hasResults && searchTerm && (
            <div style={styles.noResults}>
              <div style={styles.noResultsIcon}>🔍</div>
              <div style={styles.noResultsText}>
                Nenhum resultado encontrado para "{searchTerm}"
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  searchContainer: {
    position: 'relative',
    width: '100%',
    maxWidth: '500px'
  },
  searchInputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  searchInput: {
    width: '100%',
    padding: '12px 45px 12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.2s ease',
    backgroundColor: 'white',
    ':focus': {
      borderColor: '#2563eb',
      boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)'
    }
  },
  loadingSpinner: {
    position: 'absolute',
    right: '35px',
    top: '50%',
    transform: 'translateY(-50%)'
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid #e5e7eb',
    borderTop: '2px solid #2563eb',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  clearButton: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    fontSize: '16px',
    color: '#6b7280',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: '#f3f4f6'
    }
  },
  resultsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    maxHeight: '400px',
    overflowY: 'auto',
    zIndex: 1000,
    marginTop: '4px'
  },
  resultsSection: {
    padding: '12px 0'
  },
  sectionTitle: {
    padding: '8px 16px 4px 16px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  resultItem: {
    padding: '12px 16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: '#f8fafc'
    }
  },
  itemContent: {
    display: 'flex',
    flexDirection: 'column'
  },
  itemName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: '2px'
  },
  itemMeta: {
    fontSize: '12px',
    color: '#6b7280'
  },
  noResults: {
    padding: '24px 16px',
    textAlign: 'center',
    color: '#6b7280'
  },
  noResultsIcon: {
    fontSize: '24px',
    marginBottom: '8px'
  },
  noResultsText: {
    fontSize: '14px'
  }
};

// Adicionar a animação do spinner
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);

export default SearchBar;