// src/pages/Actors.jsx
import React, { useState, useMemo } from 'react';
import { useActors } from '../../hooks/useActors';
import { ActorCard } from '../../components/ActorCard'; 
import  LoadingSpinner  from '../../components/LoadingSpinner';

export const Actors = () => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('Name');
  
  // Usar useMemo para evitar recriação desnecessária do objeto filters
  const filters = useMemo(() => ({
    search,
    sortBy
  }), [search, sortBy]);

  const { actors, loading, error, pagination, changePage } = useActors(filters);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handlePageChange = (newPage) => {
    changePage(newPage);
    // Scroll para o topo quando mudar de página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Erro ao carregar atores</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Tentar Novamente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Atores</h1>
          <p className="text-gray-600 text-lg">Descubra e explore nosso elenco de atores talentosos</p>
        </div>

        {/* Filtros e Busca */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campo de Busca */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                🔍 Buscar Atores
              </label>
              <input
                type="text"
                id="search"
                value={search}
                onChange={handleSearchChange}
                placeholder="Buscar por nome ou nacionalidade..."
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            
            {/* Ordenação */}
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
                📊 Ordenar por
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={handleSortChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="Name">Nome (A-Z)</option>
                <option value="birthdate">Data de Nascimento</option>
                <option value="nationality">Nacionalidade</option>
              </select>
            </div>
          </div>
        </div>

        {/* Informações de Resultados */}
        {!loading && actors.length > 0 && (
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600">
              Mostrando <span className="font-semibold">{actors.length}</span> de{' '}
              <span className="font-semibold">{pagination.totalCount}</span> atores
            </p>
            <p className="text-gray-600">
              Página <span className="font-semibold">{pagination.page}</span> de{' '}
              <span className="font-semibold">{pagination.totalPages}</span>
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Grid de Atores */}
        {!loading && actors.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {actors.map((actor) => (
                <ActorCard key={actor.id} actor={actor} />
              ))}
            </div>

            {/* Paginação */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                {/* Botão Anterior */}
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>

                {/* Números das Páginas */}
                <div className="flex space-x-1">
                  {[...Array(pagination.totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Mostrar apenas algumas páginas ao redor da atual
                    if (
                      pageNumber === 1 ||
                      pageNumber === pagination.totalPages ||
                      (pageNumber >= pagination.page - 1 && pageNumber <= pagination.page + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            pagination.page === pageNumber
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === pagination.page - 2 ||
                      pageNumber === pagination.page + 2
                    ) {
                      return (
                        <span key={pageNumber} className="px-3 py-2 text-gray-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                {/* Botão Próximo */}
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Próximo
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && actors.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhum ator encontrado</h3>
              <p className="mt-2 text-gray-500">
                {search ? `Nenhum resultado para "${search}"` : 'Não há atores cadastrados no momento'}
              </p>
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Limpar Busca
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};