import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <nav style={{ 
        backgroundColor: 'white', 
        color: '#1e293b', 
        padding: '1rem',
        marginBottom: '0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link to="/" style={{ 
            color: '#1e293b', 
            textDecoration: 'none', 
            fontSize: '1.25rem', 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            transition: 'color 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.color = '#374151'}
          onMouseOut={(e) => e.target.style.color = '#1e293b'}
          >
            <span style={{ marginRight: '8px' }}>🎬</span>
            TV Show Tracker
          </Link>
          
          <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
            <Link 
              to="/tvshows" 
              style={{ 
                color: isActive('/tvshows') ? 'white' : '#374151',
                textDecoration: 'none',
                fontWeight: isActive('/tvshows') ? '600' : '500',
                fontSize: '15px',
                padding: '8px 16px',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                backgroundColor: isActive('/tvshows') ? '#374151' : '#f1f5f9',
                border: isActive('/tvshows') ? '1px solid #374151' : '1px solid #e2e8f0'
              }}
              onMouseOver={(e) => {
                if (!isActive('/tvshows')) {
                  e.target.style.backgroundColor = '#374151';
                  e.target.style.color = 'white';
                  e.target.style.borderColor = '#374151';
                }
              }}
              onMouseOut={(e) => {
                if (!isActive('/tvshows')) {
                  e.target.style.backgroundColor = '#f1f5f9';
                  e.target.style.color = '#374151';
                  e.target.style.borderColor = '#e2e8f0';
                }
              }}
            >
              TV Shows
            </Link>
            <Link 
              to="/actors" 
              style={{ 
                color: isActive('/actors') ? 'white' : '#374151',
                textDecoration: 'none',
                fontWeight: isActive('/actors') ? '600' : '500',
                fontSize: '15px',
                padding: '8px 16px',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                backgroundColor: isActive('/actors') ? '#374151' : '#f1f5f9',
                border: isActive('/actors') ? '1px solid #374151' : '1px solid #e2e8f0'
              }}
              onMouseOver={(e) => {
                if (!isActive('/actors')) {
                  e.target.style.backgroundColor = '#374151';
                  e.target.style.color = 'white';
                  e.target.style.borderColor = '#374151';
                }
              }}
              onMouseOut={(e) => {
                if (!isActive('/actors')) {
                  e.target.style.backgroundColor = '#f1f5f9';
                  e.target.style.color = '#374151';
                  e.target.style.borderColor = '#e2e8f0';
                }
              }}
            >
              Actors
            </Link>
            
            {/* Conditional Navigation - Show Profile when authenticated */}
            {isAuthenticated ? (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Link 
                  to="/profile" 
                  style={{ 
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: '1px solid #e2e8f0'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#e2e8f0';
                    e.target.style.color = '#374151';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#f1f5f9';
                    e.target.style.color = '#475569';
                  }}
                >
                  <svg style={{width: '16px', height: '16px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  style={{ 
                    backgroundColor: '#fef2f2',
                    color: '#dc2626',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #fecaca',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#fee2e2';
                    e.target.style.color = '#b91c1c';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#fef2f2';
                    e.target.style.color = '#dc2626';
                  }}
                >
                  <svg style={{width: '16px', height: '16px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            ) : (
              // Show Login/Register when not authenticated
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Link 
                  to="/login" 
                  style={{ 
                    backgroundColor: '#374151',
                    color: 'white',
                    padding: '8px 20px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    border: '1px solid #374151'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#1f2937';
                    e.target.style.borderColor = '#1f2937';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#374151';
                    e.target.style.borderColor = '#374151';
                  }}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  style={{ 
                    backgroundColor: '#1e293b',
                    color: 'white',
                    padding: '8px 20px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    border: '1px solid #1e293b'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#0f172a';
                    e.target.style.borderColor = '#0f172a';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#1e293b';
                    e.target.style.borderColor = '#1e293b';
                  }}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 20px',
        backgroundColor: '#f8fafc',
        minHeight: 'calc(100vh - 80px)'
      }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;