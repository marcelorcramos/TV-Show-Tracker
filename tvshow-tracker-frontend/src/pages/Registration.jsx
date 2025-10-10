import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validações
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5023/api/Auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      
      console.log('Registration successful:', data);
      
      // Redireciona para login após registo bem-sucedido
      navigate('/login', { 
        state: { message: 'Registration successful! Please login.' }
      });
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Estilos consistentes com o Login
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
      maxWidth: '420px',
      border: '1px solid #e2e8f0'
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem'
    },
    iconContainer: {
      width: '60px',
      height: '60px',
      background: '#059669',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1.25rem'
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '0.5rem'
    },
    subtitle: {
      color: '#64748b',
      fontSize: '0.9rem'
    },
    inputContainer: {
      marginBottom: '1.25rem'
    },
    label: {
      display: 'block',
      fontSize: '0.8rem',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '0.5rem',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      paddingLeft: '0.5rem'
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '0.9rem',
      transition: 'all 0.2s ease',
      outline: 'none',
      backgroundColor: 'white',
      boxSizing: 'border-box'
    },
    inputFocus: {
      borderColor: '#059669',
      boxShadow: '0 0 0 3px rgba(5, 150, 105, 0.1)'
    },
    button: {
      width: '100%',
      padding: '0.875rem',
      background: '#059669',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '0.9rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      marginTop: '0.5rem',
      boxSizing: 'border-box'
    },
    buttonHover: {
      background: '#047857',
      transform: 'translateY(-1px)'
    },
    buttonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed'
    },
    error: {
      background: '#fef2f2',
      border: '1px solid #fecaca',
      color: '#dc2626',
      padding: '0.75rem 1rem',
      borderRadius: '6px',
      marginBottom: '1rem',
      fontSize: '0.8rem',
      width: '100%',
      boxSizing: 'border-box'
    },
    backLink: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#64748b',
      textDecoration: 'none',
      fontSize: '0.8rem',
      fontWeight: '500',
      marginTop: '1.5rem',
      transition: 'color 0.2s ease'
    },
    loginLink: {
      textAlign: 'center',
      marginTop: '1rem',
      fontSize: '0.8rem',
      color: '#64748b'
    },
    formContainer: {
      padding: '0 0.5rem'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconContainer}>
            <svg style={{width: '1.5rem', height: '1.5rem', color: 'white'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join TV Show Tracker today</p>
        </div>

        {/* Form Container */}
        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={styles.error}>
                {error}
              </div>
            )}
            
            {/* Name Input */}
            <div style={styles.inputContainer}>
              <label htmlFor="name" style={styles.label}>
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                style={styles.input}
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={(e) => {
                  e.target.style.borderColor = styles.inputFocus.borderColor;
                  e.target.style.boxShadow = styles.inputFocus.boxShadow;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = styles.input.border;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            {/* Email Input */}
            <div style={styles.inputContainer}>
              <label htmlFor="email" style={styles.label}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                style={styles.input}
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={(e) => {
                  e.target.style.borderColor = styles.inputFocus.borderColor;
                  e.target.style.boxShadow = styles.inputFocus.boxShadow;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = styles.input.border;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            {/* Password Input */}
            <div style={styles.inputContainer}>
              <label htmlFor="password" style={styles.label}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                style={styles.input}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={(e) => {
                  e.target.style.borderColor = styles.inputFocus.borderColor;
                  e.target.style.boxShadow = styles.inputFocus.boxShadow;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = styles.input.border;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            {/* Confirm Password Input */}
            <div style={styles.inputContainer}>
              <label htmlFor="confirmPassword" style={styles.label}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                style={styles.input}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={(e) => {
                  e.target.style.borderColor = styles.inputFocus.borderColor;
                  e.target.style.boxShadow = styles.inputFocus.boxShadow;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = styles.input.border;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                ...(loading ? styles.buttonDisabled : {}),
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.target.style.background = styles.buttonHover.background;
                  e.target.style.transform = styles.buttonHover.transform;
                }
              }}
              onMouseOut={(e) => {
                e.target.style.background = styles.button.background;
                e.target.style.transform = 'none';
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            {/* Login Link */}
            <div style={styles.loginLink}>
              Already have an account?{' '}
              <Link 
                to="/login" 
                style={{color: '#059669', fontWeight: '500', textDecoration: 'none'}}
                onMouseOver={(e) => e.target.style.color = '#047857'}
                onMouseOut={(e) => e.target.style.color = '#059669'}
              >
                Sign in
              </Link>
            </div>

            {/* Back Link */}
            <Link 
              to="/" 
              style={styles.backLink}
              onMouseOver={(e) => e.target.style.color = '#374151'}
              onMouseOut={(e) => e.target.style.color = styles.backLink.color}
            >
              <svg style={{width: '0.875rem', height: '0.875rem', marginRight: '0.5rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;