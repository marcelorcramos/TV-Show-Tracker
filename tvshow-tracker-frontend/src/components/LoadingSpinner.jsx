import React from 'react';

const LoadingSpinner = ({ message = 'Loading...', className = '' }) => {
  return (
    <div 
      data-testid="loading-spinner"
      className={className}
      style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '40px'
      }}
    >
      <div style={{
        width: '50px',
        height: '50px',
        border: '4px solid #e5e7eb',
        borderTop: '4px solid #2563eb',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p style={{ marginTop: '16px', color: '#6b7280' }}>{message}</p>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner;
