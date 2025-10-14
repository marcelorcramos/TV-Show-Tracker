import React, { useState } from 'react';
import { useFavorites } from '../contexts/FavoritesContext';
import { exportService } from '../services/exportService';
import { useAuth } from '../contexts/AuthContext';

const ExportData = () => {
  const { favorites } = useFavorites();
  const { user } = useAuth();
  const [exporting, setExporting] = useState(false);
  const [exportType, setExportType] = useState('');

  const handleExportCSV = async (type = 'favorites') => {
    setExporting(true);
    setExportType('csv');
    
    try {
      const token = localStorage.getItem('authToken');
      
      let url = '';
      let filename = '';
      
      if (type === 'favorites') {
        url = 'http://localhost:5023/api/Export/favorites/csv';
        filename = `meus-favoritos-${new Date().toISOString().split('T')[0]}.csv`;
      } else if (type === 'tvshows') {
        url = 'http://localhost:5023/api/Export/tvshows/csv';
        filename = `catalogo-tvshows-${new Date().toISOString().split('T')[0]}.csv`;
      }
      
      console.log(`📊 Exportando ${type} CSV:`, url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error(`Erro na exportação: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
      
      console.log(`✅ ${type.toUpperCase()} CSV exportado com sucesso!`);
      
    } catch (error) {
      console.error(`❌ Erro ao exportar ${type} CSV:`, error);
    
      console.log('🔄 Usando fallback local...');
      const data = prepareLocalData(type);
      exportService.exportToCSV(data, `meus-favoritos-${new Date().getTime()}.csv`);
      
    } finally {
      setExporting(false);
      setExportType('');
    }
  };

  const handleExportPDF = async (type = 'favorites') => {
    setExporting(true);
    setExportType('pdf');
    
    try {
      const token = localStorage.getItem('authToken');
      
      let url = '';
      let filename = '';
      
      if (type === 'favorites') {
        url = 'http://localhost:5023/api/Export/favorites/pdf';
        filename = `meus-favoritos-${new Date().toISOString().split('T')[0]}.pdf`;
      } else if (type === 'tvshows') {
        url = 'http://localhost:5023/api/Export/tvshows/pdf';
        filename = `catalogo-tvshows-${new Date().toISOString().split('T')[0]}.pdf`;
      }
      
      console.log(`📄 Exportando ${type} PDF:`, url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error(`Erro na exportação: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
      
      console.log(`✅ ${type.toUpperCase()} PDF exportado com sucesso!`);
      
    } catch (error) {
      console.error(`❌ Erro ao exportar ${type} PDF:`, error);
      
      console.log('🔄 Usando fallback local...');
      const data = prepareLocalData(type);
      exportService.exportToPDF(data, `meus-favoritos-${new Date().getTime()}.pdf`);
      
    } finally {
      setExporting(false);
      setExportType('');
    }
  };

  const prepareLocalData = (type = 'favorites') => {
    if (type === 'favorites') {
      return favorites.map(fav => ({
        'ID': fav.id,
        'Título': fav.title,
        'Gênero': fav.genre,
        'Tipo': fav.type,
        'Rating': fav.rating,
        'Descrição': fav.description || 'N/A',
        'Data de Lançamento': fav.releaseDate ? new Date(fav.releaseDate).toLocaleDateString('pt-BR') : 'N/A',
        'Data de Favorito': new Date().toLocaleDateString('pt-BR')
      }));
    }
    
    // Para TV Shows
    return [
      {
        'ID': 1,
        'Título': 'Stranger Things',
        'Gênero': 'Sci-Fi',
        'Tipo': 'Series',
        'Rating': 8.7,
        'Descrição': 'Um grupo de amigos investiga o desaparecimento de um colega',
        'Data de Lançamento': '15/07/2016'
      },
      {
        'ID': 2,
        'Título': 'The Crown',
        'Gênero': 'Drama',
        'Tipo': 'Series',
        'Rating': 8.6,
        'Descrição': 'A vida da Rainha Elizabeth II',
        'Data de Lançamento': '04/11/2016'
      }
    ];
  };

  // Exportar dados do usuário (GDPR)
  const handleExportUserData = async () => {
    setExporting(true);
    setExportType('user');
    
    try {
      const token = localStorage.getItem('authToken');
      
      console.log('👤 Exportando dados do usuário...');
      
      const response = await fetch('http://localhost:5023/api/Gdpr/export-data', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error(`Erro na exportação: ${response.status}`);
      }

      const userData = await response.json();
      
      // Converter para CSV
      const csvData = [
        {
          'Nome': userData.user?.name || 'N/A',
          'Email': userData.user?.email || 'N/A',
          'Data de Criação': userData.user?.createdAt ? new Date(userData.user.createdAt).toLocaleDateString('pt-BR') : 'N/A',
          'Total de Favoritos': userData.favorites?.length || 0,
          'Data da Exportação': new Date().toLocaleDateString('pt-BR')
        }
      ];
      
      exportService.exportToCSV(csvData, `meus-dados-${new Date().getTime()}.csv`);
      console.log('✅ Dados do usuário exportados com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro ao exportar dados do usuário:', error);
      alert('Erro ao exportar dados do usuário');
    } finally {
      setExporting(false);
      setExportType('');
    }
  };

  const styles = {
    container: {
      padding: '25px',
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      maxWidth: '600px',
      margin: '0 auto'
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '10px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    subtitle: {
      color: '#6b7280',
      marginBottom: '25px',
      fontSize: '0.95rem'
    },
    section: {
      marginBottom: '25px',
      padding: '20px',
      background: '#f8fafc',
      borderRadius: '8px',
      border: '1px solid #e2e8f0'
    },
    sectionTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '15px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap'
    },
    button: {
      padding: '12px 20px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '500',
      fontSize: '0.9rem',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      minWidth: '140px',
      justifyContent: 'center'
    },
    buttonCSV: {
      background: '#10b981',
      color: 'white'
    },
    buttonPDF: {
      background: '#ef4444',
      color: 'white'
    },
    buttonUser: {
      background: '#8b5cf6',
      color: 'white'
    },
    buttonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed'
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    },
    stats: {
      fontSize: '0.85rem',
      color: '#6b7280',
      marginTop: '15px',
      fontStyle: 'italic',
      display: 'flex',
      gap: '15px',
      flexWrap: 'wrap'
    },
    emptyState: {
      padding: '30px',
      background: '#f3f4f6',
      borderRadius: '8px',
      textAlign: 'center',
      color: '#6b7280'
    },
    loading: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#6b7280',
      fontSize: '0.9rem'
    }
  };

  if (!user) {
    return (
      <div style={styles.emptyState}>
        <p>🔐 Log in to export your data</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        📤 Export Data
      </h2>
      <p style={styles.subtitle}>
      Export your personal data, favorites and platform information
      </p>

      {/* Seção de Favoritos */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          ❤️ My Favorites
          <span style={{ fontSize: '0.8rem', background: '#e2e8f0', padding: '2px 8px', borderRadius: '12px' }}>
            {favorites.length} items
          </span>
        </h3>
        
        <div style={styles.buttonGroup}>
          <button
            onClick={() => handleExportCSV('favorites')}
            disabled={exporting || favorites.length === 0}
            style={{
              ...styles.button,
              ...styles.buttonCSV,
              ...((exporting && exportType === 'csv') ? styles.buttonDisabled : {})
            }}
            onMouseOver={(e) => {
              if (!exporting && favorites.length > 0) {
                e.target.style.transform = styles.buttonHover.transform;
                e.target.style.boxShadow = styles.buttonHover.boxShadow;
              }
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'none';
              e.target.style.boxShadow = 'none';
            }}
          >
            {exporting && exportType === 'csv' ? (
              <span style={styles.loading}>⏳</span>
            ) : (
              '📊 CSV'
            )}
          </button>
          
          <button
            onClick={() => handleExportPDF('favorites')}
            disabled={exporting || favorites.length === 0}
            style={{
              ...styles.button,
              ...styles.buttonPDF,
              ...((exporting && exportType === 'pdf') ? styles.buttonDisabled : {})
            }}
            onMouseOver={(e) => {
              if (!exporting && favorites.length > 0) {
                e.target.style.transform = styles.buttonHover.transform;
                e.target.style.boxShadow = styles.buttonHover.boxShadow;
              }
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'none';
              e.target.style.boxShadow = 'none';
            }}
          >
            {exporting && exportType === 'pdf' ? (
              <span style={styles.loading}>⏳</span>
            ) : (
              '📄 PDF'
            )}
          </button>
        </div>
        
        {favorites.length === 0 && (
          <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '10px' }}>
            Add some favorites to export
          </p>
        )}
      </div>

      {/* Seção de Dados Pessoais */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>👤 My Personal Data</h3>
        
        <div style={styles.buttonGroup}>
          <button
            onClick={handleExportUserData}
            disabled={exporting}
            style={{
              ...styles.button,
              ...styles.buttonUser,
              ...(exporting ? styles.buttonDisabled : {})
            }}
            onMouseOver={(e) => {
              if (!exporting) {
                e.target.style.transform = styles.buttonHover.transform;
                e.target.style.boxShadow = styles.buttonHover.boxShadow;
              }
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'none';
              e.target.style.boxShadow = 'none';
            }}
          >
            {exporting && exportType === 'user' ? (
              <span style={styles.loading}>⏳</span>
            ) : (
              '📋 Dados Pessoais'
            )}
          </button>
        </div>
        
        <div style={styles.stats}>
          <span>📧 {user.email}</span>
          <span>📅 Account created on: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'N/A'}</span>
        </div>
      </div>

      {/* Status de Exportação */}
      {exporting && (
        <div style={{
          padding: '12px',
          background: '#fef3c7',
          borderRadius: '6px',
          textAlign: 'center',
          fontSize: '0.9rem',
          color: '#92400e'
        }}>
          ⏳ Exporting data... Please wait
        </div>
      )}
    </div>
  );
};

export default ExportData;