import React, { useState } from 'react';
import { useTvShows, useTvShowGenres, useTvShowTypes } from '../hooks/useTvShows';
import TvShowCard from '../components/TvShowCard';
import LoadingSpinner from '../components/LoadingSpinner';

const TvShows = () => {
  const [filters, setFilters] = useState({
    genre: '',
    type: '',
    search: '',
    sortBy: 'Title'
  });

  const { tvShows, loading, error, pagination, changePage } = useTvShows(filters);
  const { genres } = useTvShowGenres();
  const { types } = useTvShowTypes();

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = (searchTerm) => {
    handleFilterChange('search', searchTerm);
  };

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h1 style={{ color: '#1e40af', marginBottom: '20px' }}>📺 TV Shows</h1>
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
      <h1 style={{ color: '#1e40af', marginBottom: '20px' }}>📺 TV Shows</h1>
      
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
              placeholder="Search TV shows..."
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

          {/* Genre Filter */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              🎭 Genre
            </label>
            <select
              value={filters.genre}
              onChange={(e) => handleFilterChange('genre', e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                minWidth: '150px'
              }}
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              📋 Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                minWidth: '150px'
              }}
            >
              <option value="">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
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
              <option value="Title">Title</option>
              <option value="Rating">Rating</option>
              <option value="ReleaseDate">Release Date</option>
            </select>
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => setFilters({ genre: '', type: '', search: '', sortBy: 'Title' })}
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

      {/* TV Shows Grid */}
      {!loading && (
        <>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '20px',
            marginBottom: '30px'
          }}>
            {tvShows.map(tvShow => (
              <TvShowCard key={tvShow.id} tvShow={tvShow} />
            ))}
          </div>

          {/* No Results */}
          {tvShows.length === 0 && !loading && (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <p style={{ color: '#6b7280', fontSize: '18px' }}>
                No TV shows found matching your filters.
              </p>
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

export default TvShows;