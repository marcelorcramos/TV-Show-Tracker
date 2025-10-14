
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

// Recommendations Component
const RecommendationsSection = () => {
  const { recommendations, loading, hasFavorites, favoriteGenres } = useRecommendations(6);
  const { isAuthenticated } = useAuth();
  const { favorites } = useFavorites();

  if (!isAuthenticated) {
    return (
      <div style={styles.recommendationsSection}>
        <h2 style={styles.sectionTitle}>🎯 Personalized Recommendations</h2>
        <p style={styles.recommendationsSubtitle}>
          Login and add movies/series to favorites to receive personalized recommendations!
        </p>
      </div>
    );
  }

  if (!hasFavorites) {
    return (
      <div style={styles.recommendationsSection}>
        <h2 style={styles.sectionTitle}>🎯 Your Recommendations</h2>
        <p style={styles.recommendationsSubtitle}>
          Add some movies or series to your favorites to receive personalized recommendations!
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.recommendationsSection}>
        <h2 style={styles.sectionTitle}>🎯 Loading recommendations...</h2>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div style={styles.recommendationsSection}>
        <h2 style={styles.sectionTitle}>🎯 Your Recommendations</h2>
        <p style={styles.recommendationsSubtitle}>
          We haven't found recommendations based on your favorites yet. Try favoriting more content!
        </p>
      </div>
    );
  }

  return (
    <div style={styles.recommendationsSection}>
      <h2 style={styles.sectionTitle}>🎯 Recommended for You</h2>
      <p style={styles.recommendationsSubtitle}>
        Based on your favorite genres: <span style={{fontWeight: 'bold', color: '#374151'}}>{favoriteGenres.join(', ')}</span>
      </p>
      
      <div style={styles.recommendationsGrid}>
        {recommendations.map(show => (
          <TvShowCard key={show.id} tvShow={show} />
        ))}
      </div>
    </div>
  );
};

// Quick Navigation Component
const QuickNavigation = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div style={styles.quickNavSection}>
      <div style={styles.quickNavContainer}>
        <h2 style={styles.sectionTitle}>Explore Our Platform</h2>
        <p style={styles.quickNavSubtitle}>
          Discover everything we have to offer
        </p>
        
        <div style={styles.quickNavGrid}>
          {/* TV Shows */}
          <Link to="/tvshows" style={styles.quickNavCard}>
            <div style={styles.quickNavIcon}>🎬</div>
            <div style={styles.quickNavContent}>
              <h3 style={styles.quickNavTitle}>Series & Movies</h3>
              <p style={styles.quickNavDescription}>
                Explore our complete catalog with advanced filters
              </p>
              <div style={styles.quickNavStats}>
                <div style={styles.quickNavStat}>15+ Contents</div>
                <div style={styles.quickNavStat}>⭐ 8.0+ Rating</div>
              </div>
            </div>
            <div style={styles.quickNavArrow}>→</div>
          </Link>

          {/* Actors */}
          <Link to="/actors" style={styles.quickNavCard}>
            <div style={styles.quickNavIcon}>🎭</div>
            <div style={styles.quickNavContent}>
              <h3 style={styles.quickNavTitle}>Actors & Cast</h3>
              <p style={styles.quickNavDescription}>
                Discover the talents behind the productions
              </p>
              <div style={styles.quickNavStats}>
                <div style={styles.quickNavStat}>15+ Actors</div>
                <div style={styles.quickNavStat}>🎬 Multi-genres</div>
              </div>
            </div>
            <div style={styles.quickNavArrow}>→</div>
          </Link>

          {/* Authentication */}
          {!isAuthenticated ? (
            <>
              <Link to="/login" style={styles.quickNavCard}>
                <div style={styles.quickNavIcon}>🔐</div>
                <div style={styles.quickNavContent}>
                  <h3 style={styles.quickNavTitle}>Login</h3>
                  <p style={styles.quickNavDescription}>
                    Access your account to favorite content
                  </p>
                  <div style={styles.quickNavStats}>
                    <div style={styles.quickNavStat}>💫 Customization</div>
                    <div style={styles.quickNavStat}>❤️ Favorites</div>
                  </div>
                </div>
                <div style={styles.quickNavArrow}>→</div>
              </Link>

              <Link to="/register" style={styles.quickNavCard}>
                <div style={styles.quickNavIcon}>👤</div>
                <div style={styles.quickNavContent}>
                  <h3 style={styles.quickNavTitle}>Create Account</h3>
                  <p style={styles.quickNavDescription}>
                    Join our fan community
                  </p>
                  <div style={styles.quickNavStats}>
                    <div style={styles.quickNavStat}>🚀 Free</div>
                    <div style={styles.quickNavStat}>🎯 Recommendations</div>
                  </div>
                </div>
                <div style={styles.quickNavArrow}>→</div>
              </Link>
            </>
          ) : (
            <div style={styles.quickNavCard}>
              <div style={styles.quickNavIcon}>👋</div>
              <div style={styles.quickNavContent}>
                <h3 style={styles.quickNavTitle}>Welcome Back!</h3>
                <p style={styles.quickNavDescription}>
                  Continue exploring our platform
                </p>
                <div style={styles.quickNavStats}>
                  <div style={styles.quickNavStat}>✅ Logged in as</div>
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

// Footer List Item Component
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

// Footer Component
const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerContainer}>
        <div style={styles.footerSection}>
          <h3 style={styles.footerTitle}>TV Show Tracker</h3>
          <p style={styles.footerDescription}>
            Your ultimate platform to discover, explore and track your favorite series, 
            movies and actors.
          </p>
          <div style={styles.footerSocial}>
            <div style={styles.socialIcon}>🎬</div>
            <div style={styles.socialIcon}>📺</div>
            <div style={styles.socialIcon}>⭐</div>
          </div>
        </div>
        
        <div style={styles.footerSection}>
          <h4 style={styles.footerSubtitle}>Navigation</h4>
          <div style={styles.footerLinks}>
            <FooterListItem to="/">Home</FooterListItem>
            <FooterListItem to="/tvshows">Series & Movies</FooterListItem>
            <FooterListItem to="/actors">Actors</FooterListItem>
            <FooterListItem to="/login">Login</FooterListItem>
            <FooterListItem to="/register">Register</FooterListItem>
          </div>
        </div>
        
        <div style={styles.footerSection}>
          <h4 style={styles.footerSubtitle}>Features</h4>
          <div style={styles.footerLinks}>
            <FooterListItem>🎯 Recommendations</FooterListItem>
            <FooterListItem>❤️ Favorites</FooterListItem>
            <FooterListItem>🔍 Advanced Search</FooterListItem>
            <FooterListItem>⭐ Ratings</FooterListItem>
            <FooterListItem>🎭 Cast</FooterListItem>
          </div>
        </div>
        
        <div style={styles.footerSection}>
          <h4 style={styles.footerSubtitle}>Statistics</h4>
          <div style={styles.footerStats}>
            <div style={styles.footerStat}>
              <div style={styles.footerStatNumber}>15+</div>
              <div style={styles.footerStatLabel}>Movies & Series</div>
            </div>
            <div style={styles.footerStat}>
              <div style={styles.footerStatNumber}>15+</div>
              <div style={styles.footerStatLabel}>Actors</div>
            </div>
            <div style={styles.footerStat}>
              <div style={styles.footerStatNumber}>6+</div>
              <div style={styles.footerStatLabel}>Genres</div>
            </div>
          </div>
        </div>
      </div>
      
      <div style={styles.footerBottom}>
        <p style={styles.footerCopyright}>
          © 2024 TV Show Tracker
        </p>
      </div>
    </footer>
  );
};

// Modern Home Component
const Home = () => {
  return (
    <div style={styles.container}>
      {/* Modern Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroBackground}></div>
        
        <div style={styles.heroContent}>
          {/* Featured badge */}
          <div style={styles.heroBadge}>
            <span style={styles.badgeIcon}>🎬</span>
            <span>Explore +15k TV Shows & Movies</span>
          </div>

          {/* Main title with effect */}
          <h1 style={styles.mainTitle}>
            <span style={styles.titleGradient}>TV Show</span>
            <span style={styles.titleTrailer}>Tracker</span>
          </h1>

          {/* Subtitle with highlight */}
          <div style={styles.subtitleContainer}>
            <p style={styles.mainSubtitle}>
              Your <span style={styles.highlight}>ultimate platform</span> to discover, 
              explore and track your favorite series, films and actors
            </p>
          </div>

          {/* Modern CTA Buttons */}
          <div style={styles.ctaButtons}>
            <Link to="/tvshows" style={styles.ctaButtonPrimary}>
              <span style={styles.buttonIcon}>🎭</span>
              Explore Catalog
              <span style={styles.buttonArrow}>→</span>
            </Link>
            
            <Link to="/register" style={styles.ctaButtonSecondary}>
              <span style={styles.buttonIcon}>⭐</span>
              Start Free Trial
            </Link>
          </div>

          {/* Trust badges */}
          <div style={styles.trustBadges}>
            <div style={styles.trustItem}>
              <span style={styles.trustIcon}>🔒</span>
              Secure Platform
            </div>
            <div style={styles.trustItem}>
              <span style={styles.trustIcon}>📱</span>
              Multi-Device
            </div>
            <div style={styles.trustItem}>
              <span style={styles.trustIcon}>🎯</span>
              Smart Recommendations
            </div>
          </div>
        </div>

        {/* Floating elements for depth */}
        <div style={styles.floatingElement1}>🎬</div>
        <div style={styles.floatingElement2}>📺</div>
        <div style={styles.floatingElement3}>⭐</div>
      </section>

      {/* Recommendations Section */}
      <RecommendationsSection />

      {/* Quick Navigation */}
      <QuickNavigation />

      {/* Enhanced Statistics Section */}
      <div style={styles.statsSection}>
        <div style={styles.statsContent}>
          <h2 style={styles.sectionTitle}>📊 Our Growing Library</h2>
          <p style={styles.statsSubtitle}>
            Join thousands of users exploring our extensive collection
          </p>
          
          <div style={styles.statsContainer}>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>🎬</div>
              <div style={styles.statNumber}>9+</div>
              <div style={styles.statLabel}>Blockbuster Movies</div>
              <div style={styles.statTrend}>
                <span style={styles.trendUp}>↑ 3 new this month</span>
              </div>
            </div>
            
            <div style={styles.statCard}>
              <div style={styles.statIcon}>📺</div>
              <div style={styles.statNumber}>6+</div>
              <div style={styles.statLabel}>TV Series</div>
              <div style={styles.statTrend}>
                <span style={styles.trendUp}>↑ 2 ongoing</span>
              </div>
            </div>
            
            <div style={styles.statCard}>
              <div style={styles.statIcon}>🎭</div>
              <div style={styles.statNumber}>15+</div>
              <div style={styles.statLabel}>Talented Actors</div>
              <div style={styles.statTrend}>
                <span style={styles.trendUp}>↑ 5 featured</span>
              </div>
            </div>
            
            <div style={styles.statCard}>
              <div style={styles.statIcon}>🎪</div>
              <div style={styles.statNumber}>6+</div>
              <div style={styles.statLabel}>Diverse Genres</div>
              <div style={styles.statTrend}>
                <span style={styles.trendUp}>↑ Action, Drama, Sci-Fi</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Add animation styles */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        `}
      </style>
    </div>
  );
};

// Main App Component
function App() {
  useEffect(() => {
    // Start background worker
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
            <GDPRBanner />
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

// Unified Color Scheme
const styles = {
  container: {
    minHeight: '100vh',
    position: 'relative',
    backgroundColor: '#f8fafc',
  },
  heroSection: {
    position: 'relative',
    minHeight: '70vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  },
  heroBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 80%, rgba(148, 163, 184, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(100, 116, 139, 0.1) 0%, transparent 50%)
    `,
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
    maxWidth: '1000px',
    width: '100%',
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    padding: '10px 18px',
    borderRadius: '50px',
    marginBottom: '25px',
    color: '#475569',
    fontSize: '14px',
    fontWeight: '500',
    animation: 'fadeInUp 0.8s ease-out',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
  },
  badgeIcon: {
    fontSize: '16px',
  },
  mainTitle: {
    fontSize: 'clamp(2.5rem, 6vw, 4rem)',
    fontWeight: '800',
    marginBottom: '1.2rem',
    lineHeight: '1.1',
    color: '#1e293b',
    animation: 'fadeInUp 0.8s ease-out 0.2s both',
  },
  titleGradient: {
    background: 'linear-gradient(45deg, #475569, #64748b)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  titleTrailer: {
    background: 'linear-gradient(45deg, #94a3b8, #cbd5e1)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitleContainer: {
    maxWidth: '500px',
    margin: '0 auto 2.5rem',
    animation: 'fadeInUp 0.8s ease-out 0.4s both',
  },
  mainSubtitle: {
    fontSize: 'clamp(1rem, 2vw, 1.2rem)',
    color: '#475569',
    lineHeight: '1.6',
    marginBottom: '0',
  },
  highlight: {
    color: '#475569',
    fontWeight: '600',
    backgroundColor: '#f1f5f9',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  ctaButtons: {
    display: 'flex',
    gap: '1.2rem',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '2.5rem',
    animation: 'fadeInUp 0.8s ease-out 0.6s both',
    flexWrap: 'wrap',
  },
  ctaButtonPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    background: '#475569',
    color: 'white',
    padding: '14px 28px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(71, 85, 105, 0.2)',
    border: 'none',
    cursor: 'pointer',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(71, 85, 105, 0.3)',
      background: '#374151',
    }
  },
  ctaButtonSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    background: 'white',
    color: '#475569',
    padding: '14px 28px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
    ':hover': {
      transform: 'translateY(-2px)',
      background: '#f8fafc',
      borderColor: '#cbd5e1',
    }
  },
  buttonIcon: {
    fontSize: '1.1rem',
  },
  buttonArrow: {
    transition: 'transform 0.3s ease',
  },
  trustBadges: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1.5rem',
    animation: 'fadeInUp 0.8s ease-out 0.8s both',
    flexWrap: 'wrap',
  },
  trustItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#64748b',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  trustIcon: {
    fontSize: '0.9rem',
  },
  floatingElement1: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    fontSize: '2rem',
    opacity: 0.1,
    color: '#64748b',
    animation: 'float 6s ease-in-out infinite',
  },
  floatingElement2: {
    position: 'absolute',
    top: '60%',
    right: '10%',
    fontSize: '1.8rem',
    opacity: 0.1,
    color: '#64748b',
    animation: 'float 8s ease-in-out infinite 2s',
  },
  floatingElement3: {
    position: 'absolute',
    bottom: '20%',
    left: '15%',
    fontSize: '1.5rem',
    opacity: 0.1,
    color: '#64748b',
    animation: 'float 7s ease-in-out infinite 1s',
  },
  recommendationsSection: {
    padding: '60px 20px',
    backgroundColor: 'white',
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
    color: '#64748b',
    fontSize: '1rem',
    marginBottom: '2rem',
    maxWidth: '500px',
    margin: '0 auto 2rem',
  },
  recommendationsGrid: {
    maxWidth: '1000px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '25px',
  },
  quickNavSection: {
    padding: '60px 20px',
    backgroundColor: '#f8fafc',
  },
  quickNavContainer: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  quickNavSubtitle: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: '1rem',
    marginBottom: '2.5rem',
  },
  quickNavGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '25px',
  },
  quickNavCard: {
    display: 'flex',
    alignItems: 'center',
    padding: '25px',
    background: 'white',
    borderRadius: '12px',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'all 0.3s ease',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    ':hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
    }
  },
  quickNavIcon: {
    fontSize: '2.2rem',
    marginRight: '18px',
    flexShrink: 0,
  },
  quickNavContent: {
    flex: '1',
  },
  quickNavTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#1e293b',
  },
  quickNavDescription: {
    color: '#64748b',
    fontSize: '0.9rem',
    marginBottom: '12px',
    lineHeight: '1.4',
  },
  quickNavStats: {
    display: 'flex',
    gap: '8px',
    fontSize: '0.75rem',
  },
  quickNavStat: {
    background: '#f1f5f9',
    padding: '4px 8px',
    borderRadius: '12px',
    color: '#475569',
    fontWeight: '500',
  },
  quickNavArrow: {
    fontSize: '1.2rem',
    color: '#94a3b8',
    transition: 'transform 0.2s ease',
  },
  statsSection: {
    padding: '60px 20px',
    backgroundColor: 'white',
  },
  statsContent: {
    maxWidth: '1000px',
    margin: '0 auto',
    textAlign: 'center',
  },
  statsSubtitle: {
    fontSize: '1rem',
    color: '#64748b',
    marginBottom: '40px',
    maxWidth: '400px',
    margin: '0 auto 40px',
    lineHeight: '1.5',
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  statCard: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '20px 15px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    }
  },
  statIcon: {
    fontSize: '2rem',
    marginBottom: '12px',
    opacity: '0.8',
  },
  statNumber: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '6px',
  },
  statLabel: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#475569',
    marginBottom: '8px',
  },
  statTrend: {
    fontSize: '0.8rem',
    fontWeight: '500',
  },
  trendUp: {
    color: '#059669',
    background: '#d1fae5',
    padding: '3px 6px',
    borderRadius: '8px',
  },
  footer: {
    background: '#f1f5f9',
    color: '#374151',
    padding: '50px 20px 20px',
    borderTop: '1px solid #e2e8f0',
  },
  footerContainer: {
    maxWidth: '1000px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '30px',
    marginBottom: '30px',
  },
  footerSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  footerTitle: {
    fontSize: '1.3rem',
    fontWeight: '700',
    marginBottom: '1rem',
    color: '#1e293b',
  },
  footerDescription: {
    color: '#64748b',
    lineHeight: '1.5',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
  footerSocial: {
    display: 'flex',
    gap: '12px',
  },
  socialIcon: {
    fontSize: '1.3rem',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    ':hover': {
      transform: 'scale(1.1)',
    }
  },
  footerSubtitle: {
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#374151',
  },
  footerLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  footerListItem: {
    marginBottom: '6px',
  },
  footerLink: {
    color: '#64748b',
    textDecoration: 'none',
    transition: 'color 0.2s',
    fontSize: '0.9rem',
    ':hover': {
      color: '#374151',
    }
  },
  footerStats: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  footerStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '15px',
    background: 'white',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  footerStatNumber: {
    fontSize: '1.3rem',
    fontWeight: '700',
    marginBottom: '4px',
    color: '#1e293b',
  },
  footerStatLabel: {
    fontSize: '0.8rem',
    color: '#64748b',
    fontWeight: '500',
  },
  footerBottom: {
    borderTop: '1px solid #e2e8f0',
    paddingTop: '20px',
    textAlign: 'center',
  },
  footerCopyright: {
    color: '#94a3b8',
    fontSize: '0.85rem',
  },
};

export default App;