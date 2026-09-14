import axios from 'axios';

const api = axios.create({
  baseURL: 'https://lpu-hustle-2-0.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token automatically to outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lpuhustle_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle expired sessions and normalize error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or invalid
      const currentPath = window.location.pathname;
      if (
        !currentPath.includes('/login') &&
        !currentPath.includes('/register') &&
        localStorage.getItem('lpuhustle_token')
      ) {
        localStorage.removeItem('lpuhustle_token');
        localStorage.removeItem('lpuhustle_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
