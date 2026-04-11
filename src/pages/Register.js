import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const S = {
  container: {
    minHeight: '100vh', background: '#f9fafb', display: 'flex',
    alignItems: 'center', justifyContent: 'center', padding: 20,
  },
  card: {
    background: '#fff', borderRadius: 14, padding: '40px 32px',
    width: '100%', maxWidth: 440, boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    textAlign: 'center',
  },
  title: {
    fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700,
    color: '#111827', margin: '12px 0 4px',
  },
  sub: { fontSize: 13, color: '#6b7280', margin: '0 0 24px' },
  form: { textAlign: 'left' },
  field: { marginBottom: 14 },
  label: { display: 'block', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 6 },
  input: {
    width: '100%', padding: '10px 12px', borderRadius: 8, fontSize: 14,
    border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box',
  },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  moduleRow: { display: 'flex', gap: 12, marginTop: 6 },
  moduleBtn: (active) => ({
    flex: 1, padding: '10px 12px', borderRadius: 8, fontSize: 13,
    fontWeight: 600, cursor: 'pointer', textAlign: 'center',
    border: active ? '2px solid #1a6b3a' : '1px solid #d1d5db',
    background: active ? '#e8f5ee' : '#fff',
    color: active ? '#1a6b3a' : '#6b7280',
  }),
  btn: {
    width: '100%', padding: '12px 0', borderRadius: 8, fontSize: 15,
    fontWeight: 700, color: '#fff', background: '#1a6b3a', border: 'none',
    cursor: 'pointer', marginTop: 8,
  },
  btnDisabled: { opacity: 0.6, cursor: 'not-allowed' },
  error: {
    background: '#fef2f2', color: '#c0392b', padding: '10px 14px',
    borderRadius: 8, fontSize: 13, margin: '0 0 16px', textAlign: 'left',
  },
  link: { fontSize: 13, color: '#6b7280', marginTop: 20 },
  a: { color: '#1a6b3a', fontWeight: 600, textDecoration: 'none' },
  trial: {
    display: 'inline-block', background: '#e8f5ee', color: '#1a6b3a',
    fontSize: 10, fontWeight: 700, padding: '3px 12px', borderRadius: 20,
    letterSpacing: '0.06em', marginBottom: 20, textTransform: 'uppercase',
  },
};

export default function Register() {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    business_name: '',
    modules: ['farm'],
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const toggleModule = (mod) => {
    setForm(p => {
      const mods = p.modules.includes(mod)
        ? p.modules.filter(m => m !== mod)
        : [...p.modules, mod];
      return { ...p, modules: mods.length ? mods : [mod] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await register(form);
    if (ok) navigate('/');
  };

  const valid = form.username && form.email && form.password.length >= 8 && form.business_name;

  return (
    <div style={S.container}>
      <div style={S.card}>
        <Logo size={40} showText={false} />
        <h1 style={S.title}>Create your account</h1>
        <p style={S.sub}>Start managing your business with Pewil</p>
        <div style={S.trial}>{'\u{2728}'} 14-day free trial {'\u{2022}'} No card required</div>

        {error && <div style={S.error}>{error}</div>}

        <form style={S.form} onSubmit={handleSubmit}>
          <div style={S.field}>
            <label style={S.label}>Business Name</label>
            <input
              style={S.input}
              placeholder="e.g. Sunshine Farm"
              value={form.business_name}
              onChange={e => set('business_name', e.target.value)}
              required
            />
          </div>

          <div style={S.row}>
            <div style={S.field}>
              <label style={S.label}>First Name</label>
              <input
                style={S.input}
                value={form.first_name}
                onChange={e => set('first_name', e.target.value)}
              />
            </div>
            <div style={S.field}>
              <label style={S.label}>Last Name</label>
              <input
                style={S.input}
                value={form.last_name}
                onChange={e => set('last_name', e.target.value)}
              />
            </div>
          </div>

          <div style={S.field}>
            <label style={S.label}>Username</label>
            <input
              style={S.input}
              placeholder="Choose a username"
              value={form.username}
              onChange={e => set('username', e.target.value)}
              required
            />
          </div>

          <div style={S.field}>
            <label style={S.label}>Email</label>
            <input
              style={S.input}
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              required
            />
          </div>

          <div style={S.field}>
            <label style={S.label}>Password (min 8 characters)</label>
            <input
              style={S.input}
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={e => set('password', e.target.value)}
              required
              minLength={8}
            />
          </div>

          <div style={S.field}>
            <label style={S.label}>What modules do you need?</label>
            <div style={S.moduleRow}>
              <div
                style={S.moduleBtn(form.modules.includes('farm'))}
                onClick={() => toggleModule('farm')}
              >
                {'\u{1F33E}'} Agriculture
              </div>
              <div
                style={S.moduleBtn(form.modules.includes('retail'))}
                onClick={() => toggleModule('retail')}
              >
                {'\u{1F6D2}'} Retail / POS
              </div>
            </div>
          </div>

          <button
            type="submit"
            style={{ ...S.btn, ...((!valid || loading) ? S.btnDisabled : {}) }}
            disabled={!valid || loading}
          >
            {loading ? 'Creating account...' : 'Start free trial'}
          </button>
        </form>

        <p style={S.link}>
          Already have an account?{' '}
          <Link to="/login" style={S.a}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
