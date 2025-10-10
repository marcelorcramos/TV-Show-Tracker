import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  // Versão simplificada sem AuthContext
  const styles = {
    nav: {
      backgroundColor: '#2563eb',
      color: 'white',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      padding: '0 1rem'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    logo: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      color: 'white'
    },
    navLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    navLink: {
      color: 'white',
      textDecoration: 'none',
      fontSize: '0.875rem',
      padding: '0.5rem'
    },
    button: {
      backgroundColor: '#1d4ed8',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '0.375rem',
      textDecoration: 'none',
      fontSize: '0.875rem',
      marginLeft: '0.5rem'
    },
    registerButton: {
      backgroundColor: '#059669',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '0.375rem',
      textDecoration: 'none',
      fontSize: '0.875rem',
      marginLeft: '0.5rem'
    }
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <span style={{marginRight: '0.5rem'}}>🎬</span>
          TV Show Tracker
        </Link>

        {/* Navigation Links - Versão SIMPLES */}
        <div style={styles.navLinks}>
          <Link to="/tvshows" style={styles.navLink}>
            TV Shows
          </Link>
          <Link to="/actors" style={styles.navLink}>
            Actors
          </Link>
          
          {/* Botões FIXOS sem auth */}
          <Link to="/login" style={styles.button}>
            Login
          </Link>
          <Link to="/register" style={styles.registerButton}>
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;