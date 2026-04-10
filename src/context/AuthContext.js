import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function login(username, password) {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/token/', {
        username,
        password,
      });
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);

      // Decode claims from JWT payload
      let role = 'worker';
      let tenant_id = null;
      let tenant_slug = '';
      let tenant_name = '';
      let modules = ['farm'];
      let plan = 'free';
      let retail_perms = {};
      try {
        const payload = JSON.parse(atob(res.data.access.split('.')[1]));
        role = payload.role || 'owner';
        tenant_id = payload.tenant_id || null;
        tenant_slug = payload.tenant_slug || '';
        tenant_name = payload.tenant_name || '';
        modules = payload.modules || ['farm'];
        plan = payload.plan || 'free';
        retail_perms = payload.retail_perms || {};
      } catch { /* fallback */ }

      const userData = {
        username,
        user_id: res.data.user_id || res.data.tenant_id,
        role,
        tenant_id: res.data.tenant_id || tenant_id,
        tenant_slug: res.data.tenant_slug || tenant_slug,
        tenant_name: res.data.tenant_name || tenant_name,
        modules: res.data.modules || modules,
        plan: res.data.plan || plan,
        retail_perms: res.data.retail_perms || retail_perms,
      };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid username or password');
      return false;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
