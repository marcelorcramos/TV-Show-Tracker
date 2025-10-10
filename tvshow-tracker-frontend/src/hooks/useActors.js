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
      
      const params = {
        page,
        pageSize: pagination.pageSize,
        ...filters
      };

      // Remove parâmetros vazios para não enviar à API
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] == null) {
          delete params[key];
        }
      });

      console.log('🔍 Parâmetros enviados para a API:', params); // Debug
      
      const response = await actorsAPI.getAll(params);
      const data = response.data;
      
      setActors(data.items);
      setPagination(prev => ({
        ...prev,
        page: data.page,
        totalCount: data.totalCount,
        totalPages: data.totalPages
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch actors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActors(1);
  }, [filters.search, filters.sortBy, filters.nationality]); // ← ADICIONE filters.nationality aqui

  const changePage = (page) => {
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