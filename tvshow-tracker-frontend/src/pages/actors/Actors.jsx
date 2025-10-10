// src/pages/actors/Actors.jsx
import React, { useState, useMemo } from 'react';
import { useActors } from '../../hooks/useActors';
import ActorCard from '../../components/ActorCard';
import LoadingSpinner from '../../components/LoadingSpinner';

export const Actors = () => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('Name');
  const [nationalityFilter, setNationalityFilter] = useState('');

  const filters = useMemo(() => ({
    search,
    sortBy,
    nationality: nationalityFilter
  }), [search, sortBy, nationalityFilter]);

  const { actors, loading, error, pagination, changePage } = useActors(filters);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleNationalityChange = (e) => {
    setNationalityFilter(e.target.value);
  };

  const clearFilters = () => {
    setSearch('');
    setSortBy('Name');
    setNationalityFilter('');
  };

  const handlePageChange = (newPage) => {
    changePage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ 
          backgroundColor: '#fef2f2', 
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '20px',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          <h3 style={{ color: '#dc2626', marginBottom: '10px' }}>Erro ao carregar atores</h3>
          <p style={{ color: '#b91c1c', marginBottom: '15px' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: '#1f2937',
          marginBottom: '8px'
        }}>
          Atores
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
          Explore nosso elenco de atores talentosos
        </p>
      </div>

      {/* Filtros */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb',
        marginBottom: '30px'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px',
          marginBottom: '16px'
        }}>
          {/* Search */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151',
              marginBottom: '8px'
            }}>
              🔍 Search
            </label>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search actors..."
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Nationality Filter */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151',
              marginBottom: '8px'
            }}>
              🏴 Nationality
            </label>
            <select
              value={nationalityFilter}
              onChange={handleNationalityChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="">All Nationalities</option>
              <option value="American">American</option>
              <option value="British">British</option>
              <option value="Chilean-American">Chilean-American</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151',
              marginBottom: '8px'
            }}>
              📊 Sort By
            </label>
            <select
              value={sortBy}
              onChange={handleSortChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="Name">Name</option>
              <option value="birthdate">Birth Date</option>
              <option value="nationality">Nationality</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div style={{ display: 'flex', alignItems: 'end' }}>
            <button
              onClick={clearFilters}
              style={{
                width: '100%',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Informações de Resultados */}
      {!loading && actors.length > 0 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px',
          color: '#6b7280',
          fontSize: '14px'
        }}>
          <p>
            Showing <strong>{actors.length}</strong> of <strong>{pagination.totalCount}</strong> actors
          </p>
          <p>
            Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong>
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <LoadingSpinner />
        </div>
      )}

      {/* Grid de Atores - 3 colunas */}
      {!loading && actors.length > 0 && (
        <>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '24px',
            marginBottom: '40px'
          }}>
            {actors.map((actor) => (
              <ActorCard key={actor.id} actor={actor} />
            ))}
          </div>

          {/* Paginação */}
          {pagination.totalPages > 1 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              gap: '8px'
            }}>
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  color: '#374151',
                  cursor: pagination.page === 1 ? 'not-allowed' : 'pointer',
                  opacity: pagination.page === 1 ? 0.5 : 1
                }}
              >
                Previous
              </button>

              <div style={{ display: 'flex', gap: '4px' }}>
                {[...Array(pagination.totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  if (
                    pageNumber === 1 ||
                    pageNumber === pagination.totalPages ||
                    (pageNumber >= pagination.page - 1 && pageNumber <= pagination.page + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        style={{
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          backgroundColor: pagination.page === pageNumber ? '#2563eb' : 'white',
                          color: pagination.page === pageNumber ? 'white' : '#374151',
                          cursor: 'pointer'
                        }}
                      >
                        {pageNumber}
                      </button>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  color: '#374151',
                  cursor: pagination.page === pagination.totalPages ? 'not-allowed' : 'pointer',
                  opacity: pagination.page === pagination.totalPages ? 0.5 : 1
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && actors.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '40px',
            maxWidth: '400px',
            margin: '0 auto',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              backgroundColor: '#f3f4f6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <span style={{ fontSize: '24px' }}>🎭</span>
            </div>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#1f2937',
              marginBottom: '8px'
            }}>
              No actors found
            </h3>
            <p style={{ 
              color: '#6b7280',
              marginBottom: '20px'
            }}>
              {search || nationalityFilter 
                ? 'Try adjusting your search or filters' 
                : 'No actors available at the moment'
              }
            </p>
            {(search || nationalityFilter) && (
              <button
                onClick={clearFilters}
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};