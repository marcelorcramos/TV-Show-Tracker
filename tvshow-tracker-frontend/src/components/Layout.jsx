import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

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
            <Link 
              to="/login" 
              style={{ 
                backgroundColor: '#1d4ed8',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '14px'
              }}
            >
              Login
            </Link>
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