// Production: https://makonese-farm-production.up.railway.app
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh on 401, handle 403 gracefully (FIX 11)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = localStorage.getItem('refresh_token');
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api'}/token/refresh/`,
          { refresh }
        );
        localStorage.setItem('access_token', res.data.access);
        original.headers.Authorization = `Bearer ${res.data.access}`;
        return api(original);
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    // 403 — permission denied (role may have changed)
    if (error.response?.status === 403) {
      // Do not clear storage for 403 — just return the error
      // The UI should show the permission error to the user
    }
    return Promise.reject(error);
  }
);

export default api;
