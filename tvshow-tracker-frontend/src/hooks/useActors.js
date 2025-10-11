import { useState, useEffect } from 'react';
import { actorsAPI } from '../services/api';

export const useActors = (filters = {}) => {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 12,
    totalCount: 0,
    totalPages: 0
  });

  const fetchActors = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      // Prepara os parâmetros para a API
      const params = {
        page: page,
        pageSize: pagination.pageSize,
      };

      // Adiciona apenas os filtros que têm valor
      if (filters.search && filters.search.trim() !== '') {
        params.search = filters.search.trim();
      }

      if (filters.nationality && filters.nationality.trim() !== '') {
        params.nationality = filters.nationality.trim();
      }

      if (filters.sortBy && filters.sortBy.trim() !== '') {
        params.sortBy = filters.sortBy.trim();
      }

      console.log('🔍 [useActors] Parâmetros enviados para a API:', params);
      console.log('🔍 [useActors] Filtros atuais:', filters);
      
      const response = await actorsAPI.getAll(params);
      const data = response.data;
      
      console.log('✅ [useActors] Resposta da API:', {
        itemsCount: data.items?.length || 0,
        totalCount: data.totalCount || 0,
        page: data.page || 1,
        totalPages: data.totalPages || 0,
        items: data.items?.map(item => ({ 
          id: item.id, 
          name: item.name, 
          nationality: item.nationality 
        }))
      });
      
      setActors(data.items || []);
      setPagination(prev => ({
        ...prev,
        page: data.page || 1,
        totalCount: data.totalCount || 0,
        totalPages: data.totalPages || 0
      }));

      console.log('🎭 [useActors] Actors no state:', data.items?.length || 0);
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch actors';
      setError(errorMessage);
      console.error('❌ [useActors] Erro no fetchActors:', err);
    } finally {
      setLoading(false);
    }
  };

  // Recarrega quando os filtros mudam
  useEffect(() => {
    console.log('🔄 [useActors] Filtros mudaram, recarregando atores...', filters);
    fetchActors(1);
  }, [filters.search, filters.nationality, filters.sortBy]);

  const changePage = (page) => {
    console.log('📄 [useActors] Mudando para página:', page);
    if (page >= 1 && page <= pagination.totalPages) {
      fetchActors(page);
    }
  };

  return {
    actors,
    loading,
    error,
    pagination,
    changePage,
    refetch: () => fetchActors(pagination.page)
  };
};