import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const S = {
  wrapper: {
    minHeight: '100vh', display: 'flex', background: '#fff',
  },
  leftSide: {
    flex: 1,
    backgroundImage: 'url(https://cdn.pixabay.com/photo/2021/06/11/22/41/wheat-6329586_1280.jpg)',
    backgroundSize: 'cover', backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '40px 20px', position: 'relative',
    '@media (max-width: 900px)': { display: 'none' },
  },
  leftOverlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(135deg,rgba(13,74,34,.9) 0%,rgba(26,107,58,.85) 50%,rgba(45,158,88,.8) 100%)',
  },
  leftContent: {
    position: 'relative', zIndex: 10, textAlign: 'center', color: '#fff',
    maxWidth: 400,
  },
  leftTitle: {
    fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 700,
    margin: '0 0 16px', letterSpacing: '-1px',
  },
  leftSubtitle: {
    fontSize: 16, lineHeight: 1.6, marginBottom: 40, opacity: 0.95,
  },
  pillsContainer: {
    display: 'flex', flexDirection: 'column', gap: 12,
  },
  pill: {
    background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(10px)',
    borderRadius: '20px', padding: '12px 20px', fontSize: 13, fontWeight: 600,
    color: '#fff', textAlign: 'center',
  },
  rightSide: {
    width: 480, background: '#fff', display: 'flex', flexDirection: 'column',
    padding: 48, overflowY: 'auto', '@media (max-width: 900px)': { flex: 1, width: 'auto', padding: 24 },
  },
  logo: {
    marginBottom: 32,
  },
  title: {
    fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700,
    color: '#111827', margin: '0 0 8px',
  },
  subtitle: {
    fontSize: 14, color: '#6b7280', lineHeight: 1.5, marginBottom: 24,
  },
  form: {},
  field: {
    marginBottom: 20,
  },
  label: {
    display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8,
  },
  input: {
    width: '100%', padding: '12px 14px', border: '1px solid #e5e7eb',
    borderRadius: 8, fontSize: 14, outline: 'none', color: '#111827',
    boxSizing: 'border-box', transition: 'border-color 0.15s',
  },
  checkboxRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 24,
  },
  checkboxLabel: {
    display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151',
    cursor: 'pointer',
  },
  checkbox: {
    width: 18, height: 18, cursor: 'pointer', accentColor: '#1a6b3a',
  },
  forgotLink: {
    fontSize: 13, color: '#1a6b3a', fontWeight: 600, textDecoration: 'none',
  },
  button: {
    width: '100%', padding: '14px 16px', background: '#1a6b3a', color: '#fff',
    border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700,
    cursor: 'pointer', transition: 'background 0.15s',
  },
  divider: {
    display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0',
  },
  dividerLine: {
    flex: 1, height: 1, background: '#e5e7eb',
  },
  dividerText: {
    fontSize: 13, color: '#9ca3af', fontWeight: 500,
  },
  googleButton: {
    width: '100%', padding: '12px 16px', background: '#fff', color: '#111827',
    border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, fontWeight: 600,
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 10, transition: 'border-color 0.15s',
  },
  error: {
    background: '#fdecea', color: '#c0392b', fontSize: 13,
    padding: '12px 14px', borderRadius: 8, marginBottom: 16,
  },
  footer: {
    marginTop: 'auto', paddingTop: 24, fontSize: 13, color: '#6b7280', textAlign: 'center',
    borderTop: '1px solid #e5e7eb',
  },
  footerLink: {
    color: '#1a6b3a', fontWeight: 600, textDecoration: 'none',
  },
};

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const ok = await login(username, password);
    if (ok) navigate('/app');
  }

  return (
    <div style={S.wrapper}>
      {/* Left Side - Hidden on mobile */}
      <div style={{ ...S.leftSide, display: window.innerWidth <= 900 ? 'none' : 'flex' }}>
        <div style={S.leftOverlay} />
        <div style={S.leftContent}>
          <h1 style={S.leftTitle}>Welcome Back</h1>
          <p style={S.leftSubtitle}>
            Log into your Pewil account to manage your farm, shop, or both.
          </p>
          <div style={S.pillsContainer}>
            <div style={S.pill}>🌱 Farm Management</div>
            <div style={S.pill}>🛒 Retail POS</div>
            <div style={S.pill}>🤖 AI Analysis</div>
            <div style={S.pill}>📊 Reports</div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div style={S.rightSide}>
        <div style={S.logo}>
          <Logo size={40} showText={false} />
        </div>

        <h2 style={S.title}>Sign In</h2>
        <p style={S.subtitle}>Enter your credentials to access your account</p>

        {error && <div style={S.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={S.form}>
          <div style={S.field}>
            <label style={S.label}>Username or Email</label>
            <input
              style={S.input}
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter your username or email"
              required
              autoComplete="username"
              onFocus={e => { e.target.style.borderColor = '#1a6b3a'; }}
              onBlur={e => { e.target.style.borderColor = '#e5e7eb'; }}
            />
          </div>

          <div style={S.field}>
            <label style={S.label}>Password</label>
            <input
              style={S.input}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              onFocus={e => { e.target.style.borderColor = '#1a6b3a'; }}
              onBlur={e => { e.target.style.borderColor = '#e5e7eb'; }}
            />
          </div>

          <div style={S.checkboxRow}>
            <label style={S.checkboxLabel}>
              <input
                style={S.checkbox}
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <Link to="/forgot-password" style={S.forgotLink}>
              Forgot password?
            </Link>
          </div>

          <button
            style={{ ...S.button, opacity: loading ? 0.6 : 1 }}
            type="submit"
            disabled={loading}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#2d9e58'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#1a6b3a'; }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div style={S.divider}>
          <div style={S.dividerLine} />
          <span style={S.dividerText}>or</span>
          <div style={S.dividerLine} />
        </div>

        <button
          style={S.googleButton}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#1a6b3a'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div style={S.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={S.footerLink}>
            Start free trial
          </Link>
        </div>
      </div>
    </div>
  );
}
