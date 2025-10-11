import { useState, useEffect, useRef } from 'react';
import { useTvShows } from './useTvShows';
import { useActors } from './useActors';

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  
  // Usar os teus hooks existentes com pageSize reduzido para search
  const { 
    tvShows: tvShowResults, 
    loading: tvShowsLoading,
    error: tvShowsError 
  } = useTvShows({
    search: searchTerm,
    page: 1,
    pageSize: 5 // Apenas 5 resultados para search
  });

  const { 
    actors: actorResults, 
    loading: actorsLoading,
    error: actorsError 
  } = useActors({
    search: searchTerm,
    page: 1,
    pageSize: 5 // Apenas 5 resultados para search
  });

  const isLoading = tvShowsLoading || actorsLoading;
  const hasError = tvShowsError || actorsError;

  // Filtrar resultados vazios
  const filteredTvShows = (tvShowResults || []).filter(item => item.title);
  const filteredActors = (actorResults || []).filter(item => item.name);

  const hasResults = filteredTvShows.length > 0 || filteredActors.length > 0;

  // Mostrar resultados apenas quando há search term e não está loading
  useEffect(() => {
    if (searchTerm.trim() && !isLoading) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [searchTerm, isLoading, hasResults]);

  const clearSearch = () => {
    setSearchTerm('');
    setShowResults(false);
  };

  return {
    searchTerm,
    setSearchTerm,
    showResults,
    setShowResults,
    isLoading,
    hasError,
    results: {
      tvShows: filteredTvShows,
      actors: filteredActors
    },
    hasResults,
    clearSearch
  };
};