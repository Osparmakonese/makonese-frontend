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

  function _extractUserData(res, username) {
    // Decode claims from JWT payload
    let role = 'worker';
    let tenant_id = null;
    let tenant_slug = '';
    let tenant_name = '';
    let modules = ['farm'];
    let plan = 'free';
    let retail_perms = {};
    let farm_perms = {};
    let is_demo = false;
    try {
      const payload = JSON.parse(atob(res.data.access.split('.')[1]));
      role = payload.role || 'owner';
      tenant_id = payload.tenant_id || null;
      tenant_slug = payload.tenant_slug || '';
      tenant_name = payload.tenant_name || '';
      modules = payload.modules || ['farm'];
      plan = payload.plan || 'free';
      retail_perms = payload.retail_perms || {};
      farm_perms = payload.farm_perms || {};
      is_demo = !!payload.is_demo;
    } catch { /* fallback */ }

    return {
      username: username || res.data.username,
      user_id: res.data.user_id,
      role: res.data.role || role,
      tenant_id: res.data.tenant_id || tenant_id,
      tenant_slug: res.data.tenant_slug || tenant_slug,
      tenant_name: res.data.tenant_name || tenant_name,
      modules: res.data.modules || modules,
      plan: res.data.plan || plan,
      retail_perms: res.data.retail_perms || retail_perms,
      farm_perms: res.data.farm_perms || farm_perms,
      is_demo: res.data.is_demo === true ? true : is_demo,
    };
  }

  async function login(username, password) {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/token/', { username, password });
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);

      const userData = _extractUserData(res, username);
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

  async function register(formData) {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/core/tenants/register/', formData);
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);

      const userData = _extractUserData(res, formData.username);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (err) {
      const detail = err.response?.data;
      if (typeof detail === 'object' && detail !== null) {
        // DRF validation errors come as { field: [errors] }
        const messages = Object.entries(detail)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
          .join('. ');
        setError(messages);
      } else {
        setError(detail?.detail || 'Registration failed. Please try again.');
      }
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function demoLogin() {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/core/auth/demo_login/', {});
      localStorage.setItem('access_token', res.data.access);
      // No refresh token for demo — force a fresh demo-login when the
      // 30-minute access token expires.
      localStorage.setItem('refresh_token', res.data.refresh || '');

      const userData = _extractUserData(res, res.data.username);
      userData.is_demo = true; // belt + suspenders
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Live demo is temporarily unavailable. Try again in a moment.'
      );
      return false;
    } finally {
      setLoading(false);
    }
  }

  function switchTenant(tokenData) {
    // Called after POST /api/core/tenants/switch/ returns new tokens
    localStorage.setItem('access_token', tokenData.access);
    localStorage.setItem('refresh_token', tokenData.refresh);
    const userData = {
      ...user,
      tenant_id: tokenData.tenant_id,
      tenant_slug: tokenData.tenant_slug,
      tenant_name: tokenData.tenant_name,
      modules: tokenData.modules,
      plan: tokenData.plan,
    };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, demoLogin, switchTenant, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
