// src/components/Layout.jsx - ATUALIZADO
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
        backgroundColor: '#2563eb', 
        color: 'white', 
        padding: '1rem',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link to="/" style={{ 
            color: 'white', 
            textDecoration: 'none', 
            fontSize: '1.25rem', 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ marginRight: '8px' }}>🎬</span>
            TV Show Tracker
          </Link>
          
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link 
              to="/tvshows" 
              style={{ 
                color: isActive('/tvshows') ? '#bfdbfe' : 'white',
                textDecoration: 'none',
                fontWeight: isActive('/tvshows') ? '600' : 'normal'
              }}
            >
              TV Shows
            </Link>
            <Link 
              to="/actors" 
              style={{ 
                color: isActive('/actors') ? '#bfdbfe' : 'white',
                textDecoration: 'none',
                fontWeight: isActive('/actors') ? '600' : 'normal'
              }}
            >
              Actors
            </Link>
            
            {/* Conditional Navigation - Show Profile when authenticated */}
            {isAuthenticated ? (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Link 
                  to="/profile" 
                  style={{ 
                    backgroundColor: '#7c3aed',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'background-color 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#6d28d9'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#7c3aed'}
                >
                  <svg style={{width: '16px', height: '16px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  style={{ 
                    backgroundColor: '#dc2626',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#b91c1c'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#dc2626'}
                >
                  <svg style={{width: '16px', height: '16px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            ) : (
              // Show Login/Register when not authenticated
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Link 
                  to="/login" 
                  style={{ 
                    backgroundColor: '#1d4ed8',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#1e40af'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  style={{ 
                    backgroundColor: '#059669',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#047857'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#059669'}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;