import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

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
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
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
  getAll: (params = {}) => api.get('/tvshows', { params }),
  getById: (id) => api.get(`/tvshows/${id}`),
  getGenres: () => api.get('/tvshows/genres'),
  getTypes: () => api.get('/tvshows/types'),
  getRecommendations: () => api.get('/tvshows/recommendations'),
};

export const actorsAPI = {
  getAll: (params = {}) => api.get('/actors', { params }),
  getById: (id) => api.get(`/actors/${id}`),
};

export const favoritesAPI = {
  getAll: () => api.get('/favorites'),
  add: (tvShowId) => api.post(`/favorites/${tvShowId}`),
  remove: (tvShowId) => api.delete(`/favorites/${tvShowId}`),
};

export default api;