// src/contexts/AuthContext.jsx - VERSÃO CORRIGIDA
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);

  // DEBUG: Estado do contexto
  console.log('🔐 AuthContext State:', {
    user,
    loading,
    isAuthenticated: !!user,
    hasLocalStorageToken: !!localStorage.getItem('authToken'),
    hasLocalStorageUser: !!localStorage.getItem('user')
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    console.log('🔄 AuthContext useEffect - Carregando dados:', {
      hasToken: !!token,
      hasUserData: !!userData,
      userData: userData ? JSON.parse(userData) : null
    });

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        console.log('✅ AuthContext - Usuário carregado do localStorage:', parsedUser.email);
      } catch (error) {
        console.error('❌ AuthContext - Erro ao parsear userData:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    } else {
      console.log('ℹ️ AuthContext - Nenhum usuário encontrado no localStorage');
      setUser(null); // ✅ GARANTIR que o estado fica null
    }
    setLoading(false);
  }, []);

  // ✅ LOGIN REAL COM API
  const login = async (email, password) => {
    console.log('🔐 AuthContext.login chamado:', { email });
    
    try {
      const response = await authAPI.login({ email, password });
      const { token, user: userData } = response.data;
      
      console.log('✅ AuthContext - Login bem-sucedido via API:', userData.email);

      // Salvar no localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Atualizar estado
      setUser(userData);
      
      console.log('🎉 AuthContext - Estado atualizado após login real');
      return { success: true, user: userData, token };
      
    } catch (error) {
      console.error('❌ AuthContext - Erro no login:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  // ✅ REGISTER REAL COM API
  const register = async (name, email, password) => {
    console.log('👤 AuthContext.register chamado:', { name, email });
    
    try {
      const response = await authAPI.register({ name, email, password });
      const userData = response.data;
      
      console.log('✅ AuthContext - Registro bem-sucedido via API:', userData.email);
      return { success: true, user: userData };
      
    } catch (error) {
      console.error('❌ AuthContext - Erro no registro:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };
  
  const saveEmailPreference = (email, preference) => {
    localStorage.setItem('userEmail', email);
    localStorage.setItem('emailNotifications', preference.toString());
    setEmailNotifications(preference);
    console.log('📧 Preferência de e-mail salva:', { email, preference });
  };

  
  // ✅ LOGOUT COMPLETO
  const logout = () => {
    console.log('🚪 AuthContext.logout - Removendo dados do localStorage e estado');
    
    // 1. Limpar localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('favorites');
    
    // 2. Limpar estado
    setUser(null);
    setEmailNotifications(false);
    
    // 3. Forçar atualização
    setTimeout(() => {
      console.log('✅ AuthContext - Logout completo, estado resetado');
    }, 100);
  };

  // ✅ VALUE DEFINIDO DENTRO DO COMPONENTE
  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    emailNotifications,
    setEmailNotifications,
    toggleEmailNotifications: () => {
      const newValue = !emailNotifications;
      setEmailNotifications(newValue);
      if (user?.email) {
        saveEmailPreference(user.email, newValue);
      }
  },
  saveEmailPreference 
};
  console.log('🏗️ AuthContext - Provider renderizado:', {
    user: user?.email,
    isAuthenticated: !!user,
    loading
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};