// src/pages/PrivacyPolicy.jsx
import React from 'react';
import { useGDPR } from '../hooks/useGDPR';

const PrivacyPolicy = () => {
  const { exportUserData, deleteUserData } = useGDPR();

  const handleExport = () => {
    const data = exportUserData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meus-dados-tvshows.json';
    a.click();
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Privacy Policy - TV Show Tracker</h1>
      
      <div style={{ marginTop: '30px' }}>
        <h2>📊 Your Data</h2>
        <p>You have full control over your personal data.</p>
        
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          marginTop: '20px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={handleExport}
            style={{
              padding: '12px 20px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            📥 Exportar Meus Dados (JSON)
          </button>
          
          <button
            onClick={deleteUserData}
            style={{
              padding: '12px 20px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            🗑️ Delete All My Data
          </button>
        </div>
      </div>
      
      <div style={{ marginTop: '40px' }}>
        <h2>🔒 How We Use Your Data</h2>
        <ul>
          <li><strong>Favorites:</strong> For personalized recommendationss</li>
          <li><strong>E-mail:</strong> Only with your explicit consent</li>
          <li><strong>Cookies:</strong> For basic website functionality</li>
        </ul>
      </div>
    </div>
  );
};

export default PrivacyPolicy;