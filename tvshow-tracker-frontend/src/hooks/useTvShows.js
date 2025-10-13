import { useState, useEffect } from 'react';
import { tvShowsAPI } from '../services/api';

export const useTvShows = (filters = {}) => {
  const [tvShows, setTvShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 9,
    totalCount: 0,
    totalPages: 0
  });

  const fetchTvShows = async (page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      // ✅ CORREÇÃO: Definir sortDescending baseado no tipo de ordenação
      const sortDescending = filters.sortBy === 'Rating' || filters.sortBy === 'ReleaseDate';
      
      const params = {
        page: page,
        pageSize: pagination.pageSize,
        genre: filters.genre || '',
        type: filters.type || '',
        search: filters.search || '',
        sortBy: filters.sortBy || 'Title',
        sortDescending: sortDescending // ✅ Agora envia true para Rating e ReleaseDate
      };

      console.log('🎬 Parâmetros da busca:', params);

      const response = await tvShowsAPI.getAll(params);
      const data = response.data;
      
      setTvShows(data.items);
      setPagination(prev => ({
        ...prev,
        page: data.page,
        totalCount: data.totalCount,
        totalPages: data.totalPages
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Falha ao carregar séries e filmes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTvShows(1);
  }, [filters.genre, filters.type, filters.search, filters.sortBy]);

  const changePage = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchTvShows(page);
    }
  };

  return {
    tvShows,
    loading,
    error,
    pagination,
    changePage,
    refetch: () => fetchTvShows(pagination.page)
  };
};

// Os outros hooks (useTvShowGenres e useTvShowTypes) permanecem iguais
export const useTvShowGenres = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await tvShowsAPI.getGenres();
        setGenres(response.data);
      } catch (error) {
        console.error('Falha ao carregar gêneros:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  return { genres, loading };
};

export const useTvShowTypes = () => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await tvShowsAPI.getTypes();
        setTypes(response.data);
      } catch (error) {
        console.error('Falha ao carregar tipos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTypes();
  }, []);

  return { types, loading };
};