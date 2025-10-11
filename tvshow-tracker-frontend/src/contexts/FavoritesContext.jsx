// src/contexts/FavoritesContext.jsx - VERSÃO CORRIGIDA
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { favoritesAPI } from '../services/api';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Carregar favoritos quando usuário fizer login
  useEffect(() => {
    if (isAuthenticated && user) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [isAuthenticated, user]);

  const loadFavorites = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      console.log('📥 Carregando favoritos...');
      
      // Mock temporário - em produção, usar: await favoritesAPI.getAll();
      const mockFavorites = [
        // Estes dados serão preenchidos quando o usuário favoritar algo
      ];
      
      console.log('✅ Favoritos carregados (mock):', mockFavorites);
      setFavorites(mockFavorites);
    } catch (error) {
      console.error('❌ Erro ao carregar favoritos:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
    
    setLoading(true);
    try {
      console.log('📥 Carregando favoritos...');
      const response = await favoritesAPI.getAll();
      console.log('✅ Favoritos carregados:', response.data);
      setFavorites(response.data);
    } catch (error) {
      console.error('❌ Erro ao carregar favoritos:', error);
      // Mock data temporário para teste
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (tvShowId) => {
    console.log('➕ Adicionando favorito:', tvShowId);
    try {
      await favoritesAPI.add(tvShowId);
      // Atualizar localmente imediatamente para feedback visual
      setFavorites(prev => [...prev, { id: tvShowId }]);
      // Recarregar da API para ter dados completos
      await loadFavorites();
      console.log('✅ Favorito adicionado com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro ao adicionar favorito:', error);
      return false;
    }
  };

  const removeFavorite = async (tvShowId) => {
    console.log('🗑️ Removendo favorito:', tvShowId);
    try {
      await favoritesAPI.remove(tvShowId);
      // Atualizar localmente imediatamente para feedback visual
      setFavorites(prev => prev.filter(fav => fav.id !== tvShowId));
      console.log('✅ Favorito removido com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro ao remover favorito:', error);
      return false;
    }
  };

  const isFavorite = (tvShowId) => {
    return favorites.some(fav => fav.id === tvShowId);
  };

  // No FavoritesContext.jsx - ATUALIZE a função getFavoriteGenres:
const getFavoriteGenres = () => {
    // Extrair gêneros dos favoritos que já têm o genre incluído
    const genresFromFavorites = favorites
      .map(fav => fav.genre)
      .filter(genre => genre && genre.trim() !== '');
    
    console.log('🎭 Gêneros dos favoritos:', genresFromFavorites);
    
    return [...new Set(genresFromFavorites)];
  };

  const value = {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavoriteGenres,
    refreshFavorites: loadFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};