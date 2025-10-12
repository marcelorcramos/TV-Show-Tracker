// src/hooks/useGDPR.js
import { useState, useEffect } from 'react';

export const useGDPR = () => {
  const [gdprConsent, setGdprConsent] = useState(false);
  const [cookiesAccepted, setCookiesAccepted] = useState(false);

  // ✅ MOVER a função para dentro do hook, antes de ser usada
  const clearNonEssentialCookies = () => {
    // Limpar cookies de analytics, marketing, etc.
    localStorage.removeItem('analyticsData');
    localStorage.removeItem('marketingPreferences');
  };

  useEffect(() => {
    // Verificar consentimento salvo
    const savedConsent = localStorage.getItem('gdprConsent');
    const savedCookies = localStorage.getItem('cookiesAccepted');
    
    if (savedConsent) {
      setGdprConsent(JSON.parse(savedConsent));
    }
    
    if (savedCookies) {
      setCookiesAccepted(JSON.parse(savedCookies));
    }
  }, []);

  const acceptGDPR = () => {
    setGdprConsent(true);
    setCookiesAccepted(true);
    localStorage.setItem('gdprConsent', 'true');
    localStorage.setItem('cookiesAccepted', 'true');
  };

  const rejectGDPR = () => {
    setGdprConsent(true);
    setCookiesAccepted(false);
    localStorage.setItem('gdprConsent', 'true');
    localStorage.setItem('cookiesAccepted', 'false');
    // Limpar cookies não essenciais
    clearNonEssentialCookies(); // ✅ CORRIGIDO - sem "this"
  };

  const exportUserData = () => {
    const userData = {
      favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
      user: JSON.parse(localStorage.getItem('user') || 'null'),
      preferences: {
        emailNotifications: localStorage.getItem('emailNotifications') === 'true',
        gdprConsent: localStorage.getItem('gdprConsent') === 'true'
      }
    };
    
    return JSON.stringify(userData, null, 2);
  };

  const deleteUserData = () => {
    // Limpar todos os dados do usuário
    localStorage.removeItem('favorites');
    localStorage.removeItem('user');
    localStorage.removeItem('emailNotifications');
    localStorage.removeItem('userEmail');
    
    // Manter apenas o consentimento RGPD
    localStorage.setItem('gdprConsent', 'true');
    localStorage.setItem('cookiesAccepted', 'false');
    
    window.location.reload();
  };

  return {
    gdprConsent,
    cookiesAccepted,
    acceptGDPR,
    rejectGDPR,
    exportUserData,
    deleteUserData
  };
};