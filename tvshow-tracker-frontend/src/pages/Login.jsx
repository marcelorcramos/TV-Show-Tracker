// src/pages/Login.jsx - VERSÃO COMPLETA E CORRIGIDA
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // ✅ REDIRECIONAR SE JÁ ESTIVER AUTENTICADO
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔐 Tentando login com:', { email });
      
      // ✅ USAR A FUNÇÃO DO AUTHCONTEXT
      const result = await login(email, password);
      
      if (result.success) {
        console.log('✅ Login bem-sucedido, redirecionando...');
        navigate('/profile');
      } else {
        throw new Error(result.error || 'Login failed');
      }
      
    } catch (err) {
      console.error('❌ Erro no login:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Estilos com inputs alinhados à esquerda
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
      maxWidth: '380px',
      border: '1px solid #e2e8f0'
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem'
    },
    iconContainer: {
      width: '60px',
      height: '60px',
      background: '#1e293b',
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
      borderColor: '#1e293b',
      boxShadow: '0 0 0 3px rgba(30, 41, 59, 0.1)'
    },
    button: {
      width: '100%',
      padding: '0.875rem',
      background: '#1e293b',
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
      background: '#374151',
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
    registerLink: {
      textAlign: 'center',
      marginTop: '1rem',
      fontSize: '0.8rem',
      color: '#64748b'
    },
    demoBox: {
      background: '#f8fafc',
      borderRadius: '8px',
      padding: '1rem',
      marginTop: '1.5rem',
      textAlign: 'center',
      border: '1px solid #e2e8f0',
      width: '100%',
      boxSizing: 'border-box'
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to your account</p>
        </div>

        {/* Form Container com padding à esquerda */}
        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={styles.error}>
                {error}
              </div>
            )}
            
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
                autoComplete="current-password"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                ...(loading ? styles.buttonDisabled : {})
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
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            {/* Link para Registro */}
            <div style={styles.registerLink}>
              Ainda não tem conta criada?{' '}
              <Link 
                to="/register" 
                style={{
                  color: '#059669', 
                  fontWeight: '500', 
                  textDecoration: 'none'
                }}
                onMouseOver={(e) => e.target.style.color = '#047857'}
                onMouseOut={(e) => e.target.style.color = '#059669'}
              >
                Criar conta
              </Link>
            </div>

            {/* Back Link */}
            <Link 
              to="/" 
              style={styles.backLink}
              onMouseOver={(e) => e.target.style.color = '#374151'}
              onMouseOut={(e) => e.target.style.color = '#64748b'}
            >
              <svg style={{width: '0.875rem', height: '0.875rem', marginRight: '0.5rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </form>

          {/* Demo Credentials */}
          <div style={styles.demoBox}>
            <p style={{
              margin: '0 0 0.5rem 0', 
              fontSize: '0.75rem', 
              color: '#64748b', 
              fontWeight: '500'
            }}>
              💡 Demo Credentials
            </p>
            <p style={{
              margin: '0 0 0.25rem 0', 
              fontSize: '0.7rem', 
              color: '#94a3b8', 
              fontFamily: 'monospace'
            }}>
              novo@example.com
            </p>
            <p style={{
              margin: 0, 
              fontSize: '0.7rem', 
              color: '#94a3b8', 
              fontFamily: 'monospace'
            }}>
              Password123!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;