// src/pages/auth/UserProfile.jsx - VERSÃO COMPLETA COM EXPORTAÇÃO
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ExportData from '../../components/ExportData';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    fetchUserData();
    loadEmailPreferences();
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

  const loadEmailPreferences = () => {
    const savedPreference = localStorage.getItem('emailNotifications') === 'true';
    setEmailNotifications(savedPreference);
  };

  const saveEmailPreference = (preference) => {
    setEmailNotifications(preference);
    localStorage.setItem('emailNotifications', preference.toString());
    if (user?.email) {
      localStorage.setItem('userEmail', user.email);
    }
    console.log('📧 Preferência de e-mail salva:', { 
      email: user?.email, 
      preference 
    });
  };

  const handleLogout = () => {
    logout();
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
      maxWidth: '550px',
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
      marginBottom: '1.5rem',
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
    preferencesSection: {
      background: '#f8fafc',
      borderRadius: '8px',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      textAlign: 'left'
    },
    preferencesTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    preferenceItem: {
      marginBottom: '0.5rem'
    },
    preferenceLabel: {
      display: 'flex',
      alignItems: 'center',
      fontWeight: '500',
      color: '#374151',
      cursor: 'pointer',
      fontSize: '0.9rem'
    },
    checkbox: {
      marginRight: '0.75rem',
      width: '1.1rem',
      height: '1.1rem',
      cursor: 'pointer'
    },
    preferenceDescription: {
      fontSize: '0.8rem',
      color: '#6b7280',
      margin: '0.5rem 0 0 1.85rem',
      lineHeight: '1.4'
    },
    exportSection: {
      background: '#f0f9ff',
      borderRadius: '8px',
      padding: '1.5rem',
      marginBottom: '2rem',
      textAlign: 'left',
      border: '1px solid #bae6fd'
    },
    exportTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#0369a1',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    exportDescription: {
      fontSize: '0.85rem',
      color: '#0c4a6e',
      marginBottom: '1rem',
      lineHeight: '1.5'
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
    secondaryButton: {
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
      marginBottom: '1rem',
      textDecoration: 'none',
      display: 'block',
      textAlign: 'center'
    },
    secondaryButtonHover: {
      background: '#4b5563'
    },
    backButton: {
      width: '100%',
      padding: '0.875rem',
      background: '#374151',
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
      background: '#1f2937'
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
    },
    statusIndicator: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.25rem 0.5rem',
      borderRadius: '12px',
      fontSize: '0.7rem',
      fontWeight: '500',
      marginLeft: '0.5rem'
    },
    statusActive: {
      background: '#dcfce7',
      color: '#166534'
    },
    statusInactive: {
      background: '#fef2f2',
      color: '#dc2626'
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

        {/* Email Preferences Section */}
        <div style={styles.preferencesSection}>
          <h3 style={styles.preferencesTitle}>
            📧 Email Preferences
            <span 
              style={{
                ...styles.statusIndicator,
                ...(emailNotifications ? styles.statusActive : styles.statusInactive)
              }}
            >
              {emailNotifications ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </h3>
          <div style={styles.preferenceItem}>
            <label style={styles.preferenceLabel}>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => saveEmailPreference(e.target.checked)}
                style={styles.checkbox}
              />
              Receive weekly recommendations by email
            </label>
            <p style={styles.preferenceDescription}>
              Get personalized TV show and movie recommendations based on your favorites 
              delivered to your inbox every week. You can change this setting at any time.
            </p>
          </div>
        </div>

        {/* Export Data Section - NOVA SEÇÃO ADICIONADA */}
        <div style={styles.exportSection}>
          <h3 style={styles.exportTitle}>
            📤 Export My Data
          </h3>
          <p style={styles.exportDescription}>
            Export your personal data, favorites, and account information in CSV or PDF format. 
            This is useful for backup purposes or GDPR compliance.
          </p>
          <ExportData />
        </div>

        {/* Action Buttons */}
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

        <Link 
          to="/" 
          style={styles.secondaryButton}
          onMouseOver={(e) => {
            e.target.style.background = styles.secondaryButtonHover.background;
          }}
          onMouseOut={(e) => {
            e.target.style.background = styles.secondaryButton.background;
          }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default UserProfile;