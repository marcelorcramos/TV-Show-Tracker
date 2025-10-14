import { useState, useEffect } from 'react';

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

  useEffect(() => {
    const fetchActors = async () => {
      try {
        setLoading(true);
        console.log('🔄 useActors: Iniciando fetch com filtros:', filters);
        
        const { actorsAPI } = await import('../services/api');
        
        const queryParams = {
          page: pagination.page,
          pageSize: pagination.pageSize,
          search: filters.search || '',
          nationality: filters.nationality || '',
          sortBy: filters.sortBy || 'Name'
        };

        console.log('📡 useActors: Parâmetros da query:', queryParams);

        const response = await actorsAPI.getAll(queryParams);
        
        console.log('✅ useActors: Resposta da API:', {
          data: response.data,
          itemsCount: response.data?.items?.length || 0,
          totalCount: response.data?.totalCount || 0
        });

        if (response.data && response.data.items) {
          setActors(response.data.items);
          setPagination(prev => ({
            ...prev,
            totalCount: response.data.totalCount,
            totalPages: Math.ceil(response.data.totalCount / prev.pageSize)
          }));
        } else {
          console.warn('⚠️ useActors: Resposta sem dados esperados', response);
          setActors([]);
        }
        
        setError(null);
      } catch (err) {
        console.error('❌ useActors: Erro ao carregar atores:', err);
        setError(err.message);
        setActors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActors();
  }, [filters, pagination.page]);

  const changePage = (newPage) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };

  return {
    actors,
    loading,
    error,
    pagination,
    changePage
  };
};