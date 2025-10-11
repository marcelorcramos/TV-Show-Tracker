// src/pages/actors/Actors.jsx
import React, { useState, useEffect } from 'react';
import { useActors } from '../../hooks/useActors'
import ActorCard from '../../components/ActorCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const Actors = () => {
  const [filters, setFilters] = useState({
    search: '',
    nationality: '',
    sortBy: 'Name'
  });

  const { actors, loading, error, pagination, changePage } = useActors(filters);
  
  // Estado separado para todas as nacionalidades disponíveis
  const [allNationalities, setAllNationalities] = useState([]);

  // Carrega todas as nacionalidades uma vez
  useEffect(() => {
    const fetchAllNationalities = async () => {
      try {
        // Faz uma chamada à API sem filtros para pegar todas as nacionalidades
        const { actorsAPI } = await import('../../services/api');
        const response = await actorsAPI.getAll({ pageSize: 100 });
        const allActors = response.data.items || [];
        
        // Extrai nacionalidades únicas
        const nationalities = [...new Set(allActors.map(actor => actor.nationality).filter(Boolean))].sort();
        setAllNationalities(nationalities);
      } catch (err) {
        console.error('❌ Erro ao carregar nacionalidades:', err);
      }
    };

    fetchAllNationalities();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = (searchTerm) => {
    handleFilterChange('search', searchTerm);
  };

  // Calcular páginas para mostrar na paginação
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, pagination.page - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h1 style={{ 
          color: '#1e40af', 
          marginBottom: '20px',
          fontSize: '2.5rem',
          fontWeight: '700'
        }}>
          🎭 Actors
        </h1>
        <div style={{ 
          backgroundColor: '#fef2f2', 
          color: '#dc2626', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #fecaca'
        }}>
          <p>❌ Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ 
          color: '#1e40af', 
          marginBottom: '10px',
          fontSize: '2.5rem',
          fontWeight: '700'
        }}>
          🎭 Actors
        </h1>
        <p style={{ 
          color: '#6b7280', 
          fontSize: '1.1rem',
          marginBottom: '15px'
        }}>
          Discover {pagination.totalCount} talented actors
        </p>
        
        {/* Quick Filter Buttons - AGORA COM TODAS AS NACIONALIDADES SEMPRE VISÍVEIS */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {/* Botão "All Actors" */}
          <button
            onClick={() => setFilters({ search: '', nationality: '', sortBy: 'Name' })}
            style={{
              backgroundColor: !filters.nationality && !filters.search ? '#2563eb' : '#e5e7eb',
              color: !filters.nationality && !filters.search ? 'white' : '#374151',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
          >
            All Actors ({pagination.totalCount})
          </button>

          {/* Botões de nacionalidade - SEMPRE VISÍVEIS */}
          {allNationalities.slice(0, 6).map(nationality => {
            // Conta quantos atores têm esta nacionalidade (dos atores filtrados)
            const count = actors.filter(actor => actor.nationality === nationality).length;
            
            return (
              <button
                key={nationality}
                onClick={() => setFilters({ search: '', nationality: nationality, sortBy: 'Name' })}
                style={{
                  backgroundColor: filters.nationality === nationality ? '#2563eb' : '#e5e7eb',
                  color: filters.nationality === nationality ? 'white' : '#374151',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
              >
                {nationality} ({count})
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Filters Section */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '25px', 
        borderRadius: '12px',
        marginBottom: '30px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ 
          marginBottom: '20px', 
          color: '#374151',
          fontSize: '1.2rem',
          fontWeight: '600'
        }}>
          🔍 Search & Filter
        </h3>
        
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'end' }}>
          {/* Search */}
          <div style={{ flex: '1', minWidth: '250px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#374151',
              fontSize: '0.9rem'
            }}>
              Search Actors
            </label>
            <input
              type="text"
              placeholder="Search actors by name..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                padding: '10px 14px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                width: '100%',
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }}
            />
          </div>

          {/* Nationality Filter */}
          <div style={{ minWidth: '180px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#374151',
              fontSize: '0.9rem'
            }}>
              Nationality
            </label>
            <select
              value={filters.nationality}
              onChange={(e) => handleFilterChange('nationality', e.target.value)}
              style={{
                padding: '10px 12px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                width: '100%',
                fontSize: '1rem',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="">All Nationalities</option>
              {allNationalities.map(nationality => (
                <option key={nationality} value={nationality}>{nationality}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div style={{ minWidth: '180px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#374151',
              fontSize: '0.9rem'
            }}>
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              style={{
                padding: '10px 12px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                width: '100%',
                fontSize: '1rem',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="Name">Name (A-Z)</option>
              <option value="birthdate">Birth Date (Oldest)</option>
              <option value="nationality">Nationality (A-Z)</option>
            </select>
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => setFilters({ search: '', nationality: '', sortBy: 'Name' })}
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              height: 'fit-content',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}
          >
            Clear All
          </button>
        </div>

        {/* Active Filters Display */}
        {(filters.nationality || filters.search) && (
          <div style={{ 
            marginTop: '15px', 
            padding: '10px 15px',
            backgroundColor: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '6px',
            fontSize: '0.9rem'
          }}>
            <span style={{ fontWeight: '600', color: '#0369a1' }}>Active filters: </span>
            {filters.nationality && (
              <span style={{ 
                backgroundColor: '#dbeafe', 
                color: '#1e40af',
                padding: '2px 8px',
                borderRadius: '12px',
                margin: '0 5px',
                fontSize: '0.8rem'
              }}>
                Nationality: {filters.nationality}
              </span>
            )}
            {filters.search && (
              <span style={{ 
                backgroundColor: '#fef3c7', 
                color: '#d97706',
                padding: '2px 8px',
                borderRadius: '12px',
                margin: '0 5px',
                fontSize: '0.8rem'
              }}>
                Search: "{filters.search}"
              </span>
            )}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && <LoadingSpinner />}

      {/* Actors Grid */}
      {!loading && (
        <>
          {/* Results Count */}
          {actors.length > 0 && (
            <div style={{ 
              marginBottom: '20px',
              color: '#6b7280',
              fontSize: '0.9rem'
            }}>
              Showing {((pagination.page - 1) * 12) + 1}-{Math.min(pagination.page * 12, pagination.totalCount)} of {pagination.totalCount} actors
              {pagination.totalPages > 1 && ` • Page ${pagination.page} of ${pagination.totalPages}`}
            </div>
          )}

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '25px',
            marginBottom: '40px'
          }}>
            {actors.map(actor => (
              <ActorCard key={actor.id} actor={actor} />
            ))}
          </div>

          {/* No Results */}
          {actors.length === 0 && !loading && (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 40px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ 
                fontSize: '4rem',
                marginBottom: '20px'
              }}>
                🎭
              </div>
              <h3 style={{ 
                color: '#374151', 
                marginBottom: '10px',
                fontSize: '1.5rem'
              }}>
                No actors found
              </h3>
              <p style={{ 
                color: '#6b7280', 
                fontSize: '1.1rem',
                marginBottom: '25px'
              }}>
                Try adjusting your search criteria or filters
              </p>
              <button
                onClick={() => setFilters({ search: '', nationality: '', sortBy: 'Name' })}
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}
              >
                Show All Actors
              </button>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              gap: '8px',
              marginTop: '40px',
              flexWrap: 'wrap'
            }}>
              {/* Previous Button */}
              <button
                onClick={() => changePage(pagination.page - 1)}
                disabled={pagination.page === 1}
                style={{
                  backgroundColor: pagination.page === 1 ? '#f3f4f6' : '#2563eb',
                  color: pagination.page === 1 ? '#9ca3af' : 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: pagination.page === 1 ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}
              >
                ← Previous
              </button>

              {/* Page Numbers */}
              {getPageNumbers().map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => changePage(pageNum)}
                  style={{
                    backgroundColor: pageNum === pagination.page ? '#1e40af' : '#2563eb',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    minWidth: '40px'
                  }}
                >
                  {pageNum}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => changePage(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                style={{
                  backgroundColor: pagination.page === pagination.totalPages ? '#f3f4f6' : '#2563eb',
                  color: pagination.page === pagination.totalPages ? '#9ca3af' : 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: pagination.page === pagination.totalPages ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export { Actors };