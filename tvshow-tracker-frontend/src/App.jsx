import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Layout from './components/Layout';
import TvShows from './pages/TvShows';
import { Actors } from './pages/actors/Actors';
import Login from './pages/Login';
import Registration from './pages/Registration';
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
            <Route path="/register" element={<Registration />} /> {/* ← Adicione esta linha */}
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;