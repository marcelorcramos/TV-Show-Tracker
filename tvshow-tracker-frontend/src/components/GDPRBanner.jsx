// src/components/GDPRBanner.jsx
import React from 'react';
import { useGDPR } from '../hooks/useGDPR';

const GDPRBanner = () => {
  const { gdprConsent, acceptGDPR, rejectGDPR } = useGDPR();

  if (gdprConsent) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '0',
      left: '0',
      right: '0',
      background: '#1f2937',
      color: 'white',
      padding: '20px',
      zIndex: 1000,
      borderTop: '2px solid #fbbf24'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div style={{ flex: '1' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#fbbf24' }}>
            🍪 Cookie Consent
          </h4>
          <p style={{ margin: '0', fontSize: '0.9rem', opacity: 0.9 }}>
          We use cookies to improve your experience, personalize content and recommendations. 
          By accepting, you agree to our{' '}
            <a href="/privacy" style={{ color: '#60a5fa' }}>Privacy Policy</a>.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={rejectGDPR}
            style={{
              padding: '8px 16px',
              background: 'transparent',
              color: 'white',
              border: '1px solid #6b7280',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Refuse
          </button>
          <button
            onClick={acceptGDPR}
            style={{
              padding: '8px 16px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Accept Cookies
          </button>
        </div>
      </div>
    </div>
  );
};

export default GDPRBanner;