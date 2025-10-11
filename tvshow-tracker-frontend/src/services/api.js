// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5023/api';

// Criar instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // DEBUG: Log das requisições
    console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params,
      data: config.data
    });
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros globalmente
api.interceptors.response.use(
  (response) => {
    // DEBUG: Log das respostas bem-sucedidas
    console.log(`✅ API Response: ${response.status} ${response.config.url}`, {
      data: response.data,
      count: response.data?.items?.length || response.data?.length || 'N/A'
    });
    return response;
  },
  (error) => {
    // DEBUG: Log dos erros
    console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`, {
      error: error.message,
      response: error.response?.data
    });
    
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Serviços da API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

export const tvShowsAPI = {
  getAll: (params = {}) => {
    console.log('🎬 TVShowsAPI.getAll chamado com params:', params);
    return api.get('/tvshows', { params });
  },
  getById: (id) => {
    console.log(`🎬 TVShowsAPI.getById chamado para ID: ${id}`);
    return api.get(`/tvshows/${id}`);
  },
  getGenres: () => {
    console.log('🎬 TVShowsAPI.getGenres chamado');
    return api.get('/tvshows/genres');
  },
  getTypes: () => {
    console.log('🎬 TVShowsAPI.getTypes chamado');
    return api.get('/tvshows/types');
  },
  getRecommendations: () => {
    console.log('🎬 TVShowsAPI.getRecommendations chamado');
    return api.get('/tvshows/recommendations');
  },
};

export const actorsAPI = {
  getAll: (params = {}) => {
    console.log('🎭 ActorsAPI.getAll chamado com params:', params);
    return api.get('/actors', { 
      params: {
        page: params.page || 1,
        pageSize: params.pageSize || 12,
        search: params.search || '',
        nationality: params.nationality || '',
        sortBy: params.sortBy || 'Name'
      }
    });
  },
  getById: (id) => {
    console.log(`🎭 ActorsAPI.getById chamado para ID: ${id}`);
    return api.get(`/actors/${id}`);
  },
  getTvShows: (actorId) => {
    console.log(`🎭 ActorsAPI.getTvShows chamado para actorId: ${actorId}`);
    return api.get(`/actors/${actorId}/tvshows`);
  },
  getNationalities: () => {
    console.log('🎭 ActorsAPI.getNationalities chamado');
    return api.get('/actors/nationalities');
  }
};

export const favoritesAPI = {
  getAll: () => {
    console.log('❤️ FavoritesAPI.getAll chamado');
    return api.get('/favorites');
  },
  add: (tvShowId) => {
    console.log(`❤️ FavoritesAPI.add chamado para tvShowId: ${tvShowId}`);
    return api.post(`/favorites/${tvShowId}`);
  },
  remove: (tvShowId) => {
    console.log(`❤️ FavoritesAPI.remove chamado para tvShowId: ${tvShowId}`);
    return api.delete(`/favorites/${tvShowId}`);
  },
};

// Função de teste para verificar se a API está respondendo
export const testAPI = {
  health: () => {
    console.log('🏥 TestAPI.health chamado');
    return api.get('/health');
  },
  testActors: () => {
    console.log('🧪 TestAPI.testActors chamado');
    return api.get('/actors?pageSize=5');
  },
  testTvShows: () => {
    console.log('🧪 TestAPI.testTvShows chamado');
    return api.get('/tvshows?pageSize=5');
  }
};

export default api;