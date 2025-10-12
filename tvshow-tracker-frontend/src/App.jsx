// src/App.jsx - VERSÃO CORRIGIDA
import React, {useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Layout from './components/Layout';
import TvShows from './pages/TvShows';
import { Actors } from './pages/actors/Actors';
import Login from './pages/Login';
import Registration from './pages/Registration';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FavoritesProvider, useFavorites } from './contexts/FavoritesContext';
import { useRecommendations } from './hooks/useRecommendations';
import TvShowCard from './components/TvShowCard';
import GDPRBanner from './components/GDPRBanner';
import EmailPreferences from './components/EmailPreferences';
import ExportData from './components/ExportData';
import PrivacyPolicy from './pages/PrivacyPolicy';
import { backgroundWorker } from './services/backgroundWorker';
import UserProfile from './pages/auth/UserProfile';

// Componente de Recomendações
const RecommendationsSection = () => {
  const { recommendations, loading, hasFavorites, favoriteGenres } = useRecommendations(6);
  const { isAuthenticated } = useAuth();
  const { favorites } = useFavorites();

  if (!isAuthenticated) {
    return (
      <div style={styles.recommendationsSection}>
        <h2 style={styles.sectionTitle}>🎯 Recomendações Personalizadas</h2>
        <p style={styles.recommendationsSubtitle}>
          Faça login e adicione filmes/séries aos favoritos para receber recomendações personalizadas!
        </p>
      </div>
    );
  }

  if (!hasFavorites) {
    return (
      <div style={styles.recommendationsSection}>
        <h2 style={styles.sectionTitle}>🎯 Suas Recomendações</h2>
        <p style={styles.recommendationsSubtitle}>
          Adicione alguns filmes ou séries aos favoritos para receber recomendações personalizadas!
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.recommendationsSection}>
        <h2 style={styles.sectionTitle}>🎯 Carregando recomendações...</h2>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div style={styles.recommendationsSection}>
        <h2 style={styles.sectionTitle}>🎯 Suas Recomendações</h2>
        <p style={styles.recommendationsSubtitle}>
          Ainda não encontramos recomendações baseadas nos seus favoritos. Tente favoritar mais conteúdos!
        </p>
      </div>
    );
  }

  return (
    <div style={styles.recommendationsSection}>
      <h2 style={styles.sectionTitle}>🎯 Recomendados para você</h2>
      <p style={styles.recommendationsSubtitle}>
        Baseado nos seus gêneros favoritos: <span style={{fontWeight: 'bold'}}>{favoriteGenres.join(', ')}</span>
      </p>
      
      <div style={styles.recommendationsGrid}>
        {recommendations.map(show => (
          <TvShowCard key={show.id} tvShow={show} />
        ))}
      </div>
    </div>
  );
};

// Componente de Navegação Rápida
const QuickNavigation = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div style={styles.quickNavSection}>
      <div style={styles.quickNavContainer}>
        <h2 style={styles.sectionTitle}>Explore Nossa Plataforma</h2>
        <p style={styles.quickNavSubtitle}>
          Descubra tudo o que temos para oferecer
        </p>
        
        <div style={styles.quickNavGrid}>
          {/* TV Shows */}
          <Link to="/tvshows" style={styles.quickNavCard}>
            <div style={styles.quickNavIcon}>🎬</div>
            <div style={styles.quickNavContent}>
              <h3 style={styles.quickNavTitle}>Séries & Filmes</h3>
              <p style={styles.quickNavDescription}>
                Explore nosso catálogo completo com filtros avançados
              </p>
              <div style={styles.quickNavStats}>
                <div style={styles.quickNavStat}>15+ Conteúdos</div>
                <div style={styles.quickNavStat}>⭐ 8.0+ Rating</div>
              </div>
            </div>
            <div style={styles.quickNavArrow}>→</div>
          </Link>

          {/* Atores */}
          <Link to="/actors" style={styles.quickNavCard}>
            <div style={styles.quickNavIcon}>🎭</div>
            <div style={styles.quickNavContent}>
              <h3 style={styles.quickNavTitle}>Atores & Elenco</h3>
              <p style={styles.quickNavDescription}>
                Descubra os talentos por trás das produções
              </p>
              <div style={styles.quickNavStats}>
                <div style={styles.quickNavStat}>15+ Atores</div>
                <div style={styles.quickNavStat}>🎬 Multi-gêneros</div>
              </div>
            </div>
            <div style={styles.quickNavArrow}>→</div>
          </Link>

          {/* Autenticação */}
          {!isAuthenticated ? (
            <>
              <Link to="/login" style={styles.quickNavCard}>
                <div style={styles.quickNavIcon}>🔐</div>
                <div style={styles.quickNavContent}>
                  <h3 style={styles.quickNavTitle}>Fazer Login</h3>
                  <p style={styles.quickNavDescription}>
                    Acesse sua conta para favoritar conteúdos
                  </p>
                  <div style={styles.quickNavStats}>
                    <div style={styles.quickNavStat}>💫 Personalização</div>
                    <div style={styles.quickNavStat}>❤️ Favoritos</div>
                  </div>
                </div>
                <div style={styles.quickNavArrow}>→</div>
              </Link>

              <Link to="/register" style={styles.quickNavCard}>
                <div style={styles.quickNavIcon}>👤</div>
                <div style={styles.quickNavContent}>
                  <h3 style={styles.quickNavTitle}>Criar Conta</h3>
                  <p style={styles.quickNavDescription}>
                    Junte-se à nossa comunidade de fãs
                  </p>
                  <div style={styles.quickNavStats}>
                    <div style={styles.quickNavStat}>🚀 Grátis</div>
                    <div style={styles.quickNavStat}>🎯 Recomendações</div>
                  </div>
                </div>
                <div style={styles.quickNavArrow}>→</div>
              </Link>
            </>
          ) : (
            <div style={styles.quickNavCard}>
              <div style={styles.quickNavIcon}>👋</div>
              <div style={styles.quickNavContent}>
                <h3 style={styles.quickNavTitle}>Bem-vindo de volta!</h3>
                <p style={styles.quickNavDescription}>
                  Continue explorando nossa plataforma
                </p>
                <div style={styles.quickNavStats}>
                  <div style={styles.quickNavStat}>✅ Logado como</div>
                  <div style={styles.quickNavStat}>{user?.email}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente para itens da lista do rodapé
const FooterListItem = ({ children, to }) => {
  if (to) {
    return (
      <div style={styles.footerListItem}>
        <Link to={to} style={styles.footerLink}>
          {children}
        </Link>
      </div>
    );
  }
  return (
    <div style={styles.footerListItem}>
      <div style={styles.footerLink}>
        {children}
      </div>
    </div>
  );
};

// Componente Rodapé
const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerContainer}>
        <div style={styles.footerSection}>
          <h3 style={styles.footerTitle}>TV Show Tracker</h3>
          <p style={styles.footerDescription}>
            Sua plataforma definitiva para descobrir, explorar e acompanhar séries, 
            filmes e atores favoritos.
          </p>
          <div style={styles.footerSocial}>
            <div style={styles.socialIcon}>🎬</div>
            <div style={styles.socialIcon}>📺</div>
            <div style={styles.socialIcon}>⭐</div>
          </div>
        </div>
        
        <div style={styles.footerSection}>
          <h4 style={styles.footerSubtitle}>Navegação</h4>
          <div style={styles.footerLinks}>
            <FooterListItem to="/">Início</FooterListItem>
            <FooterListItem to="/tvshows">Séries & Filmes</FooterListItem>
            <FooterListItem to="/actors">Atores</FooterListItem>
            <FooterListItem to="/login">Login</FooterListItem>
            <FooterListItem to="/register">Registro</FooterListItem>
          </div>
        </div>
        
        <div style={styles.footerSection}>
          <h4 style={styles.footerSubtitle}>Recursos</h4>
          <div style={styles.footerLinks}>
            <FooterListItem>🎯 Recomendações</FooterListItem>
            <FooterListItem>❤️ Favoritos</FooterListItem>
            <FooterListItem>🔍 Busca Avançada</FooterListItem>
            <FooterListItem>⭐ Avaliações</FooterListItem>
            <FooterListItem>🎭 Elenco</FooterListItem>
          </div>
        </div>
        
        <div style={styles.footerSection}>
          <h4 style={styles.footerSubtitle}>Estatísticas</h4>
          <div style={styles.footerStats}>
            <div style={styles.footerStat}>
              <div style={styles.footerStatNumber}>15+</div>
              <div style={styles.footerStatLabel}>Filmes & Séries</div>
            </div>
            <div style={styles.footerStat}>
              <div style={styles.footerStatNumber}>15+</div>
              <div style={styles.footerStatLabel}>Atores</div>
            </div>
            <div style={styles.footerStat}>
              <div style={styles.footerStatNumber}>6+</div>
              <div style={styles.footerStatLabel}>Gêneros</div>
            </div>
          </div>
        </div>
      </div>
      
      <div style={styles.footerBottom}>
        <p style={styles.footerCopyright}>
          © 2024 TV Show Tracker. Desenvolvido com ❤️ para amantes de cinema e séries.
        </p>
      </div>
    </footer>
  );
};

// Componente Home atualizado
const Home = () => {
  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.mainTitle}>
            TV Show Tracker
          </h1>
          <p style={styles.mainSubtitle}>
            Sua plataforma definitiva para descobrir, explorar e acompanhar séries, filmes e atores
          </p>
          <div style={styles.ctaButtons}>
            <Link to="/tvshows" style={styles.ctaButtonPrimary}>
              Explorar Catálogo
            </Link>
            <Link to="/register" style={styles.ctaButtonSecondary}>
              Criar Conta
            </Link>
          </div>
        </div>
      </section>

      {/* Seção de Recomendações */}
      <RecommendationsSection />

      {/* Seção de Navegação Rápida */}
      <QuickNavigation />

      {/* Quick Stats */}
      <div style={styles.statsSection}>
        <h2 style={styles.sectionTitle}>Nossa Biblioteca</h2>
        <div style={styles.statsContainer}>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>9</div>
            <div style={styles.statLabel}>Filmes</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>6</div>
            <div style={styles.statLabel}>Séries</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>15</div>
            <div style={styles.statLabel}>Atores</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>6</div>
            <div style={styles.statLabel}>Gêneros</div>
          </div>
        </div>
      </div>

      {/* Rodapé */}
      <Footer />
    </div>
  );
};

// Componente App principal
function App() {
  useEffect(() => {
    // Iniciar trabalhador em segundo plano
    backgroundWorker.start();
    
    return () => {
      backgroundWorker.stop();
    };
  }, []);

  return (
    <AuthProvider>
      <FavoritesProvider>
        <Router>
          <Layout>
            <GDPRBanner /> {/* Banner RGPD */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tvshows" element={<TvShows />} />
              <Route path="/actors" element={<Actors />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/profile" element={<UserProfile />} />
            </Routes>
          </Layout>
        </Router>
      </FavoritesProvider>
    </AuthProvider>
  );
}

// Estilos
const styles = {
  container: {
    minHeight: '100vh',
  },
  heroSection: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '80px 20px',
    color: 'white',
    textAlign: 'center',
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  mainTitle: {
    fontSize: '3.5rem',
    fontWeight: '800',
    marginBottom: '1rem',
  },
  mainSubtitle: {
    fontSize: '1.3rem',
    marginBottom: '2rem',
    opacity: 0.9,
  },
  ctaButtons: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  ctaButtonPrimary: {
    background: 'white',
    color: '#667eea',
    padding: '12px 24px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'transform 0.2s',
  },
  ctaButtonSecondary: {
    background: 'transparent',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    border: '2px solid white',
    transition: 'all 0.2s',
  },
  recommendationsSection: {
    padding: '60px 20px',
    background: 'white',
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '1rem',
    color: '#1e293b',
  },
  recommendationsSubtitle: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '1.1rem',
    marginBottom: '2rem',
    maxWidth: '600px',
    margin: '0 auto 2rem',
  },
  recommendationsGrid: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '25px',
  },
  quickNavSection: {
    padding: '80px 20px',
    background: '#f8fafc',
  },
  quickNavContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  quickNavSubtitle: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '1.1rem',
    marginBottom: '3rem',
  },
  quickNavGrid: {
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
  },
  quickNavIcon: {
    fontSize: '2.5rem',
    marginRight: '20px',
    flexShrink: 0,
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
    marginBottom: '12px',
  },
  quickNavStats: {
    display: 'flex',
    gap: '10px',
    fontSize: '0.8rem',
  },
  quickNavStat: {
    background: '#f3f4f6',
    padding: '4px 8px',
    borderRadius: '12px',
    color: '#6b7280',
  },
  quickNavArrow: {
    fontSize: '1.5rem',
    color: '#6b7280',
    transition: 'transform 0.2s ease',
  },
  statsSection: {
    padding: '60px 20px',
    background: 'white',
  },
  statsContainer: {
    maxWidth: '1000px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '30px',
    textAlign: 'center',
  },
  statItem: {
    padding: '20px',
  },
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#1e40af',
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '1.1rem',
    color: '#6b7280',
    fontWeight: '600',
  },
  footer: {
    background: '#1f2937',
    color: 'white',
    padding: '60px 20px 20px',
  },
  footerContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '40px',
    marginBottom: '40px',
  },
  footerSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  footerTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '1rem',
    color: '#fbbf24',
  },
  footerDescription: {
    color: '#d1d5db',
    lineHeight: '1.6',
    marginBottom: '1rem',
  },
  footerSocial: {
    display: 'flex',
    gap: '10px',
  },
  socialIcon: {
    fontSize: '1.5rem',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  footerSubtitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#fbbf24',
  },
  footerLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  footerListItem: {
    marginBottom: '0.5rem',
  },
  footerLink: {
    color: '#d1d5db',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  footerStats: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  footerStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '15px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
  },
  footerStatNumber: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  footerStatLabel: {
    fontSize: '0.9rem',
    color: '#9ca3af',
  },
  footerBottom: {
    borderTop: '1px solid #374151',
    paddingTop: '20px',
    textAlign: 'center',
  },
  footerCopyright: {
    color: '#9ca3af',
    fontSize: '0.9rem',
  },
};

export default App;