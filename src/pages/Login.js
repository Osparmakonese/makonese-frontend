import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const S = {
  container: {
    minHeight: '100vh', background: '#f9fafb', display: 'flex',
    alignItems: 'center', justifyContent: 'center', padding: 20,
  },
  card: {
    background: '#fff', borderRadius: 14, padding: '40px 32px',
    width: '100%', maxWidth: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    textAlign: 'center',
  },
  logo: { fontSize: 48, marginBottom: 12 },
  title: {
    fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700,
    color: '#111827', margin: '0 0 4px',
  },
  sub: { fontSize: 13, color: '#6b7280', margin: '0 0 16px' },
  envBadge: {
    display: 'inline-block', background: '#e8f5ee', color: '#1a6b3a',
    fontSize: 9, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
    letterSpacing: '0.08em', marginBottom: 24, textTransform: 'uppercase',
  },
  form: { textAlign: 'left' },
  field: { marginBottom: 16 },
  label: { display: 'block', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 6 },
  input: {
    width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb',
    borderRadius: 8, fontSize: 13, outline: 'none', color: '#111827',
    transition: 'border-color 0.15s',
  },
  error: {
    background: '#fdecea', color: '#c0392b', fontSize: 12,
    padding: '10px 12px', borderRadius: 8, marginBottom: 12,
  },
  btn: {
    width: '100%', padding: '12px', background: '#1a6b3a', color: '#fff',
    border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700,
    cursor: 'pointer', letterSpacing: '0.02em', transition: 'background 0.15s',
  },
  footer: { marginTop: 20, fontSize: 11, color: '#9ca3af' },
};

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const ok = await login(username, password);
    if (ok) navigate('/');
  }

  return (
    <div style={S.container}>
      <div style={S.card}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <Logo size={56} />
        </div>
        {(process.env.REACT_APP_API_URL || '').includes('localhost') || (process.env.REACT_APP_API_URL || '').includes('127.0.0.1') || !process.env.REACT_APP_API_URL ? (
          <div style={{ display:'inline-block', background:'#E8593C', color:'#fff', fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:20, letterSpacing:'0.08em', marginTop:8, marginBottom: 24 }}>DEVELOPMENT</div>
        ) : null}

        <form onSubmit={handleSubmit} style={S.form}>
          <div style={S.field}>
            <label style={S.label}>Username</label>
            <input
              style={S.input}
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter your username"
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
          {error && <div style={S.error}>{error}</div>}
          <button
            style={{ ...S.btn, opacity: loading ? 0.6 : 1 }}
            type="submit"
            disabled={loading}
            onMouseEnter={e => { e.currentTarget.style.background = '#2d9e58'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#1a6b3a'; }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p style={S.footer}>Forgot your password? Contact the system owner.</p>
      </div>
    </div>
  );
}
