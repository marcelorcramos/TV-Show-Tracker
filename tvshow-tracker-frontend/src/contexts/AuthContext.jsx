import React, { createContext, useState, useContext, useEffect } from 'react';

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

  // DEBUG: Estado do contexto
  console.log('🔐 AuthContext State:', {
    user,
    loading,
    isAuthenticated: !!user,
    hasLocalStorageToken: !!localStorage.getItem('authToken'),
    hasLocalStorageUser: !!localStorage.getItem('userData')
  });

  // No AuthContext.jsx - CORRIJA o useEffect:
useEffect(() => {
  const token = localStorage.getItem('authToken');
  const userData = localStorage.getItem('user'); // MUDOU DE 'userData' PARA 'user'
  
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
      localStorage.removeItem('user'); // MUDOU AQUI TAMBÉM
    }
  } else {
    console.log('ℹ️ AuthContext - Nenhum usuário encontrado no localStorage');
  }
  setLoading(false);
}, []);

  // No AuthContext.jsx - MODIFIQUE a função login:
const login = async (email, password) => {
  console.log('🔐 AuthContext.login chamado:', { email });
  
  try {
    // Mock login - substituir por chamada real à API
    const mockUser = { 
      id: 1, 
      name: 'Test User', 
      email: email 
    };
    const mockToken = 'mock-token-' + Date.now();
    
    console.log('✅ AuthContext - Salvando no localStorage:', {
      user: mockUser,
      token: mockToken
    });

    localStorage.setItem('authToken', mockToken);
    localStorage.setItem('userData', JSON.stringify(mockUser));
    
    // FORÇAR ATUALIZAÇÃO - adicione um timeout
    setTimeout(() => {
      setUser(mockUser);
      console.log('🎉 AuthContext - Estado atualizado após timeout');
    }, 100);
    
    console.log('🎉 AuthContext - Login bem-sucedido:', mockUser.email);
    
    return { success: true, user: mockUser, token: mockToken };
  } catch (error) {
    console.error('❌ AuthContext - Erro no login:', error);
    return { success: false, error: error.message };
  }
};

  const register = async (name, email, password) => {
    console.log('👤 AuthContext.register chamado:', { name, email });
    return { success: true };
  };

  const logout = () => {
    console.log('🚪 AuthContext.logout - Removendo dados do localStorage');
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    
    console.log('✅ AuthContext - Logout completo');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
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