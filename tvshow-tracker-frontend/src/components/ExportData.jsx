// src/components/ExportData.jsx
import React, { useState } from 'react';
import { useFavorites } from '../contexts/FavoritesContext';
import { exportService } from '../services/exportService';

const ExportData = () => {
  const { favorites } = useFavorites();
  const [exporting, setExporting] = useState(false);

  const prepareData = () => {
    return favorites.map(fav => ({
      Título: fav.title,
      Gênero: fav.genre,
      Tipo: fav.type,
      Rating: fav.rating,
      'Data de Favorito': new Date().toLocaleDateString('pt-BR')
    }));
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const data = prepareData();
      exportService.exportToCSV(data, 'meus-favoritos.csv');
    } catch (error) {
      console.error('❌ Erro ao exportar CSV:', error);
      alert('Erro ao exportar dados');
    } finally {
      setExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const data = prepareData();
      exportService.exportToPDF(data, 'meus-favoritos.pdf');
    } catch (error) {
      console.error('❌ Erro ao exportar PDF:', error);
      alert('Erro ao exportar dados');
    } finally {
      setExporting(false);
    }
  };

  if (favorites.length === 0) {
    return (
      <div style={{
        padding: '20px',
        background: '#f3f4f6',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <p>Nenhum dado disponível para exportação</p>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #e5e7eb'
    }}>
      <h3 style={{ marginBottom: '15px' }}>📤 Exportar Meus Dados</h3>
      <p style={{ marginBottom: '15px', color: '#6b7280' }}>
        Exporte seus favoritos para arquivos CSV ou PDF
      </p>
      
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={handleExportCSV}
          disabled={exporting}
          style={{
            padding: '10px 16px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: exporting ? 'not-allowed' : 'pointer',
            opacity: exporting ? 0.6 : 1
          }}
        >
          {exporting ? 'Exportando...' : '📊 Exportar CSV'}
        </button>
        
        <button
          onClick={handleExportPDF}
          disabled={exporting}
          style={{
            padding: '10px 16px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: exporting ? 'not-allowed' : 'pointer',
            opacity: exporting ? 0.6 : 1
          }}
        >
          {exporting ? 'Exportando...' : '📄 Exportar PDF'}
        </button>
      </div>
      
      <p style={{ 
        fontSize: '0.8rem', 
        color: '#6b7280', 
        marginTop: '10px',
        fontStyle: 'italic'
      }}>
        {favorites.length} itens disponíveis para exportação
      </p>
    </div>
  );
};

export default ExportData;