// src/pages/auth/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5023/api/Auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();
      setUser(userData);
      
    } catch (err) {
      setError('Error loading user data');
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8fafc',
      padding: '2rem 1rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    card: {
      background: 'white',
      borderRadius: '12px',
      padding: '2.5rem 2rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '450px',
      border: '1px solid #e2e8f0',
      textAlign: 'center'
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem'
    },
    iconContainer: {
      width: '80px',
      height: '80px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1.5rem'
    },
    title: {
      fontSize: '1.75rem',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '0.5rem'
    },
    subtitle: {
      color: '#64748b',
      fontSize: '1rem'
    },
    userInfo: {
      background: '#f8fafc',
      borderRadius: '8px',
      padding: '1.5rem',
      marginBottom: '2rem',
      textAlign: 'left'
    },
    infoItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem 0',
      borderBottom: '1px solid #e2e8f0'
    },
    infoItemLast: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem 0'
    },
    label: {
      fontWeight: '500',
      color: '#374151',
      fontSize: '0.9rem'
    },
    value: {
      fontWeight: '400',
      color: '#6b7280',
      fontSize: '0.9rem'
    },
    button: {
      width: '100%',
      padding: '0.875rem',
      background: '#dc2626',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '0.9rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      marginBottom: '1rem'
    },
    buttonHover: {
      background: '#b91c1c',
      transform: 'translateY(-1px)'
    },
    backButton: {
      width: '100%',
      padding: '0.875rem',
      background: '#6b7280',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '0.9rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textDecoration: 'none',
      display: 'block',
      textAlign: 'center'
    },
    backButtonHover: {
      background: '#4b5563'
    },
    loading: {
      textAlign: 'center',
      color: '#64748b',
      fontSize: '1rem'
    },
    error: {
      background: '#fef2f2',
      border: '1px solid #fecaca',
      color: '#dc2626',
      padding: '0.75rem 1rem',
      borderRadius: '6px',
      marginBottom: '1rem',
      fontSize: '0.8rem'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.loading}>Loading user profile...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.error}>{error}</div>
          <button 
            style={styles.backButton}
            onClick={() => navigate('/login')}
            onMouseOver={(e) => {
              e.target.style.background = styles.backButtonHover.background;
            }}
            onMouseOut={(e) => {
              e.target.style.background = styles.backButton.background;
            }}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconContainer}>
            <svg style={{width: '2rem', height: '2rem', color: 'white'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 style={styles.title}>User Profile</h1>
          <p style={styles.subtitle}>Your account information</p>
        </div>

        {/* User Information */}
        {user && (
          <div style={styles.userInfo}>
            <div style={styles.infoItem}>
              <span style={styles.label}>Full Name:</span>
              <span style={styles.value}>{user.name}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.label}>Email:</span>
              <span style={styles.value}>{user.email}</span>
            </div>
            <div style={styles.infoItemLast}>
              <span style={styles.label}>Account Created:</span>
              <span style={styles.value}>
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'N/A'}
              </span>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={styles.button}
          onMouseOver={(e) => {
            e.target.style.background = styles.buttonHover.background;
            e.target.style.transform = styles.buttonHover.transform;
          }}
          onMouseOut={(e) => {
            e.target.style.background = styles.button.background;
            e.target.style.transform = 'none';
          }}
        >
          Logout
        </button>

        {/* Back to Home */}
        <Link 
          to="/" 
          style={styles.backButton}
          onMouseOver={(e) => {
            e.target.style.background = styles.backButtonHover.background;
          }}
          onMouseOut={(e) => {
            e.target.style.background = styles.backButton.background;
          }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default UserProfile;