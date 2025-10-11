import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import TvShows from './pages/TvShows';
import { Actors } from './pages/actors/Actors';
import Login from './pages/Login';
import Registration from './pages/Registration';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SearchBar from './components/SearchBar';

// Componente de busca heroica (ATUALIZADO)
const HeroSearch = () => {
  return (
    <div style={styles.heroSearch}>
      <h2 style={styles.heroTitle}>Encontre suas séries e filmes favoritos</h2>
      <p style={styles.heroSubtitle}>Descubra, explore e acompanhe tudo em um só lugar</p>
      
      {/* Search Bar Integrada */}
      <div style={styles.searchWrapper}>
        <SearchBar />
      </div>
    </div>
  );
};

// Componente de estatísticas
const StatsSection = () => {
  const [stats, setStats] = useState({ series: 0, movies: 0, actors: 0 });

  useEffect(() => {
    // Simular dados - você pode substituir por chamadas API reais
    setStats({
      series: 15,
      movies: 17,
      actors: 8
    });
  }, []);

  return (
    <div style={styles.statsSection}>
      <div style={styles.statsContainer}>
        <div style={styles.statItem}>
          <div style={styles.statNumber}>{stats.series}</div>
          <div style={styles.statLabel}>Séries</div>
        </div>
        <div style={styles.statItem}>
          <div style={styles.statNumber}>{stats.movies}</div>
          <div style={styles.statLabel}>Filmes</div>
        </div>
        <div style={styles.statItem}>
          <div style={styles.statNumber}>{stats.actors}</div>
          <div style={styles.statLabel}>Atores</div>
        </div>
        <div style={styles.statItem}>
          <div style={styles.statNumber}>32</div>
          <div style={styles.statLabel}>Total</div>
        </div>
      </div>
    </div>
  );
};

// Componente de recursos
const FeaturesSection = () => {
  const features = [
    {
      icon: '🎬',
      title: 'Catálogo Completo',
      description: 'Acesse séries e filmes com informações detalhadas, ratings e muito mais.'
    },
    {
      icon: '🎭',
      title: 'Elenco e Atores',
      description: 'Descubra os talentos por trás das suas produções favoritas.'
    },
    {
      icon: '⭐',
      title: 'Avaliações',
      description: 'Veja ratings e reviews para ajudar na sua escolha.'
    },
    {
      icon: '🔍',
      title: 'Busca Avançada',
      description: 'Encontre exatamente o que procura com nossos filtros inteligentes.'
    }
  ];

  return (
    <div style={styles.featuresSection}>
      <h2 style={styles.sectionTitle}>Por que usar TV Show Tracker?</h2>
      <div style={styles.featuresGrid}>
        {features.map((feature, index) => (
          <div key={index} style={styles.featureCard}>
            <div style={styles.featureIcon}>{feature.icon}</div>
            <h3 style={styles.featureTitle}>{feature.title}</h3>
            <p style={styles.featureDescription}>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente de navegação rápida
const QuickNavigation = () => {
  const { user } = useAuth();

  return (
    <div style={styles.quickNavSection}>
      <h2 style={styles.sectionTitle}>Comece a Explorar</h2>
      <div style={styles.quickNavGrid}>
        <Link to="/tvshows" style={styles.quickNavCard}>
          <div style={styles.quickNavIcon}>📺</div>
          <div style={styles.quickNavContent}>
            <h3 style={styles.quickNavTitle}>Séries & Filmes</h3>
            <p style={styles.quickNavDescription}>Explore nosso catálogo completo</p>
          </div>
          <div style={styles.quickNavArrow}>→</div>
        </Link>

        <Link to="/actors" style={styles.quickNavCard}>
          <div style={styles.quickNavIcon}>🎭</div>
          <div style={styles.quickNavContent}>
            <h3 style={styles.quickNavTitle}>Atores</h3>
            <p style={styles.quickNavDescription}>Descubra os talentos</p>
          </div>
          <div style={styles.quickNavArrow}>→</div>
        </Link>

        {!user ? (
          <>
            <Link to="/login" style={styles.quickNavCard}>
              <div style={styles.quickNavIcon}>🔐</div>
              <div style={styles.quickNavContent}>
                <h3 style={styles.quickNavTitle}>Fazer Login</h3>
                <p style={styles.quickNavDescription}>Acesse sua conta</p>
              </div>
              <div style={styles.quickNavArrow}>→</div>
            </Link>

            <Link to="/register" style={styles.quickNavCard}>
              <div style={styles.quickNavIcon}>👤</div>
              <div style={styles.quickNavContent}>
                <h3 style={styles.quickNavTitle}>Criar Conta</h3>
                <p style={styles.quickNavDescription}>Junte-se a nós</p>
              </div>
              <div style={styles.quickNavArrow}>→</div>
            </Link>
          </>
        ) : (
          <div style={styles.quickNavCard}>
            <div style={styles.quickNavIcon}>👋</div>
            <div style={styles.quickNavContent}>
              <h3 style={styles.quickNavTitle}>Bem-vindo de volta!</h3>
              <p style={styles.quickNavDescription}>Continue explorando</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Página Home principal
const Home = () => {
  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroBackground}></div>
        <div style={styles.heroContent}>
          <h1 style={styles.mainTitle}>
            <span style={styles.titleGradient}>TV Show Tracker</span>
          </h1>
          <p style={styles.mainSubtitle}>
            Sua plataforma definitiva para descobrir, explorar e acompanhar séries, filmes e atores
          </p>
          <HeroSearch />
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Quick Navigation */}
      <QuickNavigation />

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Pronto para começar?</h2>
          <p style={styles.ctaDescription}>
            Junte-se a milhares de fãs que já descobriram suas próximas séries e filmes favoritos.
          </p>
          <div style={styles.ctaButtons}>
            <Link to="/tvshows" style={styles.ctaButtonPrimary}>
              Explorar Catálogo
            </Link>
            <Link to="/register" style={styles.ctaButtonSecondary}>
              Criar Conta Gratuita
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// Estilos
const styles = {
  container: {
    minHeight: '100vh',
  },
  heroSection: {
    position: 'relative',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '70vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    color: 'white',
    overflow: 'hidden',
  },
  heroBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 30% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
    maxWidth: '800px',
    width: '100%',
  },
  mainTitle: {
    fontSize: '4rem',
    fontWeight: '800',
    marginBottom: '1.5rem',
    lineHeight: '1.1',
  },
  titleGradient: {
    background: 'linear-gradient(45deg, #fff, #f0f4ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  mainSubtitle: {
    fontSize: '1.5rem',
    fontWeight: '300',
    marginBottom: '3rem',
    opacity: 0.9,
    lineHeight: '1.4',
  },
  heroSearch: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: '1.8rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
  },
  heroSubtitle: {
    fontSize: '1.1rem',
    opacity: 0.8,
    marginBottom: '2rem',
  },
  searchWrapper: {
    maxWidth: '500px',
    margin: '0 auto',
  },
  statsSection: {
    background: '#f8fafc',
    padding: '60px 20px',
  },
  statsContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '30px',
    textAlign: 'center',
  },
  statItem: {
    padding: '30px 20px',
  },
  statNumber: {
    fontSize: '3rem',
    fontWeight: '800',
    color: '#1e40af',
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '1.1rem',
    color: '#6b7280',
    fontWeight: '600',
  },
  featuresSection: {
    padding: '80px 20px',
    background: 'white',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '3rem',
    color: '#1e293b',
  },
  featuresGrid: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '30px',
  },
  featureCard: {
    padding: '40px 30px',
    textAlign: 'center',
    background: '#f8fafc',
    borderRadius: '16px',
    transition: 'all 0.3s ease',
    border: '1px solid #e5e7eb',
  },
  featureIcon: {
    fontSize: '3rem',
    marginBottom: '1.5rem',
  },
  featureTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#1e293b',
  },
  featureDescription: {
    color: '#6b7280',
    lineHeight: '1.6',
  },
  quickNavSection: {
    padding: '80px 20px',
    background: '#f8fafc',
  },
  quickNavGrid: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '25px',
  },
  quickNavCard: {
    display: 'flex',
    alignItems: 'center',
    padding: '30px',
    background: 'white',
    borderRadius: '16px',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'all 0.3s ease',
    border: '1px solid #e5e7eb',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 15px rgba(0, 0, 0, 0.1)',
    }
  },
  quickNavIcon: {
    fontSize: '2.5rem',
    marginRight: '20px',
  },
  quickNavContent: {
    flex: '1',
  },
  quickNavTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#1e293b',
  },
  quickNavDescription: {
    color: '#6b7280',
    fontSize: '0.9rem',
  },
  quickNavArrow: {
    fontSize: '1.5rem',
    color: '#6b7280',
    transition: 'transform 0.2s ease',
  },
  ctaSection: {
    padding: '80px 20px',
    background: 'linear-gradient(135deg, #1e40af 0%, #3730a3 100%)',
    color: 'white',
    textAlign: 'center',
  },
  ctaContent: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  ctaTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '1rem',
  },
  ctaDescription: {
    fontSize: '1.2rem',
    opacity: 0.9,
    marginBottom: '2.5rem',
    lineHeight: '1.6',
  },
  ctaButtons: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  ctaButtonPrimary: {
    background: 'white',
    color: '#1e40af',
    padding: '16px 32px',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1.1rem',
    transition: 'all 0.2s ease',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 15px rgba(255, 255, 255, 0.2)',
    }
  },
  ctaButtonSecondary: {
    background: 'transparent',
    color: 'white',
    padding: '16px 32px',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1.1rem',
    border: '2px solid white',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'white',
      color: '#1e40af',
      transform: 'translateY(-2px)',
    }
  },
};

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
            <Route path="/register" element={<Registration />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;