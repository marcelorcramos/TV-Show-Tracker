import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Layout from './components/Layout';
import TvShows from './pages/TvShows';
import { Actors } from './pages/actors/Actors';
import { AuthProvider } from './contexts/AuthContext';

// Páginas
const Home = () => (
  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
    <h1 style={{ color: '#1e40af', marginBottom: '20px' }}>🎬 Bem-vindo ao TV Show Tracker</h1>
    <p style={{ fontSize: '18px', color: '#4b5563', marginBottom: '30px' }}>
      Descubra novas séries, explore atores e mantenha suas favoritas organizadas.
    </p>
    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
      <Link 
        to="/tvshows" 
        style={{ 
          backgroundColor: '#2563eb', 
          color: 'white', 
          padding: '12px 24px',
          textDecoration: 'none',
          borderRadius: '8px',
          fontWeight: '600',
          display: 'inline-block'
        }}
      >
        📺 Explorar TV Shows
      </Link>
      <Link 
        to="/actors" 
        style={{ 
          backgroundColor: '#059669', 
          color: 'white', 
          padding: '12px 24px',
          textDecoration: 'none',
          borderRadius: '8px',
          fontWeight: '600',
          display: 'inline-block'
        }}
      >
        🎭 Explorar Atores
      </Link>
    </div>
  </div>
);

const Login = () => (
  <div style={{ maxWidth: '400px', margin: '40px auto' }}>
    <h1 style={{ color: '#1e40af', marginBottom: '30px', textAlign: 'center' }}>🔐 Login</h1>
    <div style={{ 
      backgroundColor: 'white', 
      padding: '30px', 
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '20px' }}>
        Página de login em desenvolvimento...
      </p>
      <Link 
        to="/" 
        style={{ 
          display: 'block',
          textAlign: 'center',
          color: '#2563eb',
          textDecoration: 'none',
          fontWeight: '500'
        }}
      >
        ← Voltar para Home
      </Link>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tvshows" element={<TvShows />} />
            <Route path="/actors" element={<Actors />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App; 