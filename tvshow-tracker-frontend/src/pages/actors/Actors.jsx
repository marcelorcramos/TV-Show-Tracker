// src/pages/actors/Actors.jsx
import React, { useState } from 'react';
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

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = (searchTerm) => {
    handleFilterChange('search', searchTerm);
  };

  // Extrai nacionalidades únicas dos atores para o dropdown
  const availableNationalities = [...new Set(actors.map(actor => actor.nationality).filter(Boolean))].sort();

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h1 style={{ color: '#1e40af', marginBottom: '20px' }}>🎭 Actors</h1>
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
    <div>
      <h1 style={{ color: '#1e40af', marginBottom: '20px' }}>🎭 Actors</h1>
      
      {/* Filters */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '30px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'end' }}>
          {/* Search */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              🔍 Search
            </label>
            <input
              type="text"
              placeholder="Search actors..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                width: '200px'
              }}
            />
          </div>

          {/* Nationality Filter */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              🏴 Nationality
            </label>
            <select
              value={filters.nationality}
              onChange={(e) => handleFilterChange('nationality', e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                minWidth: '150px'
              }}
            >
              <option value="">All Nationalities</option>
              {availableNationalities.map(nationality => (
                <option key={nationality} value={nationality}>{nationality}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              🔄 Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                minWidth: '150px'
              }}
            >
              <option value="Name">Name</option>
              <option value="birthdate">Birth Date</option>
              <option value="nationality">Nationality</option>
            </select>
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => setFilters({ search: '', nationality: '', sortBy: 'Name' })}
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              height: 'fit-content'
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && <LoadingSpinner />}

      {/* Actors Grid */}
      {!loading && (
        <>
          {/* Results Info */}
          {actors.length > 0 && (
            <div style={{ 
              marginBottom: '20px',
              color: '#6b7280',
              fontSize: '14px'
            }}>
              <p>
                Showing <strong>{actors.length}</strong> of <strong>{pagination.totalCount}</strong> actors
              </p>
            </div>
          )}

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '20px',
            marginBottom: '30px'
          }}>
            {actors.map(actor => (
              <ActorCard key={actor.id} actor={actor} />
            ))}
          </div>

          {/* No Results */}
          {actors.length === 0 && !loading && (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <p style={{ color: '#6b7280', fontSize: '18px' }}>
                No actors found matching your filters.
              </p>
              {(filters.search || filters.nationality) && (
                <button
                  onClick={() => setFilters({ search: '', nationality: '', sortBy: 'Name' })}
                  style={{
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    marginTop: '10px'
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              gap: '10px',
              marginTop: '30px'
            }}>
              <button
                onClick={() => changePage(pagination.page - 1)}
                disabled={pagination.page === 1}
                style={{
                  backgroundColor: pagination.page === 1 ? '#d1d5db' : '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: pagination.page === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                ← Previous
              </button>

              <span style={{ color: '#6b7280', fontWeight: '500' }}>
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button
                onClick={() => changePage(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                style={{
                  backgroundColor: pagination.page === pagination.totalPages ? '#d1d5db' : '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: pagination.page === pagination.totalPages ? 'not-allowed' : 'pointer'
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