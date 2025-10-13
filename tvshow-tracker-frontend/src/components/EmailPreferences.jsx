// src/components/EmailPreferences.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const EmailPreferences = () => {
  const { user, emailNotifications, toggleEmailNotifications } = useAuth();

  return (
    <div style={{
      padding: '20px',
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      margin: '20px 0'
    }}>
      <h3 style={{ marginBottom: '15px' }}>📧 Email Preferences</h3>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input
          type="checkbox"
          id="emailNotifications"
          checked={emailNotifications}
          onChange={toggleEmailNotifications}
        />
        <label htmlFor="emailNotifications" style={{ cursor: 'pointer' }}>
        Receive recommendations by email (once a day)
        </label>
      </div>
      
      <p style={{ 
        fontSize: '0.8rem', 
        color: '#6b7280', 
        marginTop: '8px',
        fontStyle: 'italic'
      }}>
        {emailNotifications 
          ? `E-mails serão enviados para: ${user?.email}`
          : 'Notificações por e-mail desativadas'
        }
      </p>
    </div>
  );
};

export default EmailPreferences;