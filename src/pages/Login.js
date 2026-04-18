import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Exact palette from pewil-design-3-living-africa.html
const C = {
  amber: '#f4a743',
  terra: '#d9562c',
  clay: '#b13b17',
  forest: '#1f3d26',
  forest2: '#2d5a37',
  sand: '#fff7ec',
  sand2: '#fdeedd',
  cream: '#fffcf7',
  ink: '#1b1b1b',
  muted: '#6b5d50',
  line: 'rgba(27,27,27,.12)',
};

const SERIF = "'Fraunces', Georgia, serif";
const SANS = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";

const S = {
  wrapper: {
    minHeight: '100vh', background: C.cream, fontFamily: SANS,
    display: 'grid', gridTemplateColumns: '1.1fr 1fr',
  },
  wrapperMobile: {
    minHeight: '100vh', background: C.cream, fontFamily: SANS,
    display: 'flex', flexDirection: 'column',
  },
  // ===== left photo side =====
  side: {
    position: 'relative', overflow: 'hidden', padding: 44,
    backgroundImage: 'linear-gradient(180deg,rgba(31,61,38,.15),rgba(177,59,23,.55) 75%), url(https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1400&q=75&auto=format&fit=crop)',
    backgroundSize: 'cover', backgroundPosition: 'center',
    color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
  },
  sideMobile: {
    position: 'relative', overflow: 'hidden', padding: '32px 24px', minHeight: 260,
    backgroundImage: 'linear-gradient(180deg,rgba(31,61,38,.25),rgba(177,59,23,.7) 85%), url(https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&q=75&auto=format&fit=crop)',
    backgroundSize: 'cover', backgroundPosition: 'center',
    color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 10,
    fontWeight: 700, fontSize: 22, color: '#fff', letterSpacing: '-0.01em',
  },
  logoMark: {
    width: 34, height: 34, borderRadius: 12,
    background: '#fff',
    position: 'relative', boxShadow: '0 4px 14px rgba(217,86,44,.3)',
  },
  logoDot: {
    position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
    width: 14, height: 14, borderRadius: '50%', background: C.clay, opacity: 0.9,
  },
  quoteCard: {
    background: 'rgba(255,255,255,.14)', backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    border: '1px solid rgba(255,255,255,.25)',
    borderRadius: 24, padding: '28px 30px', maxWidth: 440,
  },
  quoteText: {
    fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic',
    fontSize: 26, lineHeight: 1.25, letterSpacing: '-0.01em',
  },
  quoteWho: {
    marginTop: 22, display: 'flex', gap: 12, alignItems: 'center',
  },
  quoteAv: {
    width: 44, height: 44, borderRadius: '50%',
    background: 'linear-gradient(135deg,#f4a743,#d9562c)',
    border: '2px solid #fff', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontWeight: 700, fontSize: 15, fontFamily: SERIF,
  },
  quoteName: { fontSize: 15, fontWeight: 700 },
  quoteRole: { fontSize: 13, opacity: 0.8 },

  // ===== right form side =====
  formWrap: {
    padding: '56px 48px', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: C.cream,
  },
  formWrapMobile: {
    padding: '36px 22px', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: C.cream, flex: 1,
  },
  form: { width: '100%', maxWidth: 440 },
  back: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    color: C.muted, fontSize: 14, marginBottom: 36, fontWeight: 500,
    textDecoration: 'none',
  },
  title: {
    fontFamily: SERIF, fontWeight: 700, fontSize: 44,
    letterSpacing: '-0.025em', lineHeight: 1.05, marginBottom: 10,
    color: C.ink,
  },
  titleEm: { color: C.clay, fontStyle: 'italic', fontWeight: 600 },
  sub: {
    color: C.muted, fontSize: 15.5, marginBottom: 32, lineHeight: 1.55,
  },
  error: {
    background: '#fce0d6', color: '#a53815', fontSize: 13,
    padding: '12px 14px', borderRadius: 14, marginBottom: 18,
    borderLeft: `3px solid ${C.terra}`,
  },
  oauth: { display: 'grid', gap: 10, margin: '4px 0 20px' },
  oauthBtn: {
    width: '100%', padding: '13px', border: `1.5px solid ${C.line}`,
    borderRadius: 999,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    fontSize: 14.5, fontWeight: 600,
    background: '#fff', color: C.ink, cursor: 'pointer',
    fontFamily: SANS, transition: 'border-color 0.15s, background 0.15s',
  },
  divider: {
    textAlign: 'center', color: C.muted, fontSize: 12.5,
    position: 'relative', margin: '20px 0',
  },
  dividerLine: {
    display: 'flex', alignItems: 'center', gap: 12,
    color: C.muted, fontSize: 12.5, textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  dividerRule: { flex: 1, height: 1, background: C.line },
  field: { marginBottom: 16 },
  label: {
    display: 'block', fontSize: 13.5, fontWeight: 600,
    marginBottom: 7, color: C.ink,
  },
  labelRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  forgotLink: {
    color: C.muted, fontWeight: 500, fontSize: 12.5, textDecoration: 'none',
  },
  input: {
    width: '100%', padding: '14px 16px', border: `1.5px solid ${C.line}`,
    borderRadius: 14, background: '#fff', fontSize: 15.5,
    fontFamily: SANS, color: C.ink, outline: 'none',
    boxSizing: 'border-box', transition: 'border .15s, box-shadow .15s',
  },
  authRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    fontSize: 13.5, margin: '4px 0 22px',
  },
  chk: {
    display: 'flex', gap: 8, alignItems: 'center', color: C.muted, cursor: 'pointer',
  },
  checkbox: { width: 16, height: 16, cursor: 'pointer', accentColor: C.terra },
  submit: {
    width: '100%', padding: 15,
    background: `linear-gradient(135deg, ${C.amber}, ${C.terra})`,
    color: '#fff', borderRadius: 999, fontWeight: 700, fontSize: 15,
    border: 'none', cursor: 'pointer', fontFamily: SANS,
    boxShadow: '0 10px 24px -8px rgba(217,86,44,.6)',
    transition: 'transform .12s, box-shadow .15s',
  },
  switch: {
    textAlign: 'center', fontSize: 14, color: C.muted, marginTop: 24,
  },
  switchLink: { color: C.clay, fontWeight: 700, textDecoration: 'none' },
};

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1000);
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 1000);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const id = 'pewil-livingafrica-fonts';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';
    document.head.appendChild(link);
  }, []);

  const fx = e => { e.target.style.borderColor = C.clay; e.target.style.boxShadow = '0 0 0 4px rgba(217,86,44,.1)'; };
  const fb = e => { e.target.style.borderColor = C.line; e.target.style.boxShadow = 'none'; };

  async function handleSubmit(e) {
    e.preventDefault();
    const ok = await login(username, password);
    if (ok) navigate('/app');
  }

  return (
    <div style={isMobile ? S.wrapperMobile : S.wrapper}>
      {/* Left photo side */}
      <aside style={isMobile ? S.sideMobile : S.side}>
        <Link to="/" style={{ ...S.logo, textDecoration: 'none', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="31" height="34" viewBox="0 0 110 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pewil">
              <path d="M 55 4 C 89 4, 105 28, 105 56 C 105 88, 83 108, 55 108 C 27 108, 5 88, 5 56 C 5 28, 21 4, 55 4 Z" fill="#fff7ec" />
              <path d="M 55 34 L 55 86" stroke="#1f3d26" strokeWidth="5" strokeLinecap="round" />
              <path d="M 55 48 C 45 48, 39 40, 39 32" stroke="#1f3d26" strokeWidth="5" strokeLinecap="round" fill="none" />
              <path d="M 55 60 C 67 60, 75 52, 75 44" stroke="#1f3d26" strokeWidth="5" strokeLinecap="round" fill="none" />
            </svg>
            Pewil
          </span>
          <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, fontSize: 14, opacity: 0.88, letterSpacing: '0.01em' }}>
            Rooted in the work.
          </span>
        </Link>
        <div style={S.quoteCard}>
          <div style={S.quoteText}>
            Welcome back. Your fields, your shop, your team — all waiting exactly where you left them.
          </div>
          <div style={{ marginTop: 18, fontSize: 14, opacity: 0.88, lineHeight: 1.55 }}>
            Pewil keeps the numbers quiet so you can hear the work.
          </div>
        </div>
      </aside>

      {/* Right form side */}
      <main style={isMobile ? S.formWrapMobile : S.formWrap}>
        <form style={S.form} onSubmit={handleSubmit}>
          <Link to="/" style={S.back}>← Back to home</Link>
          <h2 style={S.title}>
            Welcome back, <span style={S.titleEm}>friend</span>.
          </h2>
          <p style={S.sub}>Sign in and pick up where the team left off.</p>

          {error && <div style={S.error}>{error}</div>}

          <div style={S.oauth}>
            <button
              type="button"
              style={S.oauthBtn}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.ink; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.line; }}
            >
              <svg width="16" height="16" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.2 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16.2 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.2 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
                <path fill="#4CAF50" d="M24 44c5.4 0 10.3-2.1 14-5.5l-6.5-5.5c-2 1.4-4.6 2.3-7.5 2.3-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.4 16.2 44 24 44z" />
                <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.7l6.5 5.5C41.9 35.9 44 30.3 44 24c0-1.3-.1-2.7-.4-3.9z" />
              </svg>
              Continue with Google
            </button>
          </div>

          <div style={S.dividerLine}>
            <span style={S.dividerRule} />
            <span>OR</span>
            <span style={S.dividerRule} />
          </div>

          <div style={S.field}>
            <label style={S.label} htmlFor="username">Username or email</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onFocus={fx}
              onBlur={fb}
              autoComplete="username"
              required
              style={S.input}
              placeholder="you@farm.co.zw"
            />
          </div>

          <div style={S.field}>
            <div style={S.labelRow}>
              <label style={S.label} htmlFor="password">Password</label>
              <Link to="/forgot-password" style={S.forgotLink}>Forgot?</Link>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={fx}
              onBlur={fb}
              autoComplete="current-password"
              required
              style={S.input}
              placeholder="••••••••"
            />
          </div>

          <div style={S.authRow}>
            <label style={S.chk}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                style={S.checkbox}
              />
              Keep me signed in
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...S.submit,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={e => {
              if (loading) return;
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 14px 30px -8px rgba(217,86,44,.7)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 10px 24px -8px rgba(217,86,44,.6)';
            }}
          >
            {loading ? 'Signing in…' : 'Sign in to Pewil →'}
          </button>

          <div style={S.switch}>
            New to Pewil?{' '}
            <Link to="/register" style={S.switchLink}>Create an account →</Link>
          </div>
        </form>
      </main>
    </div>
  );
}
