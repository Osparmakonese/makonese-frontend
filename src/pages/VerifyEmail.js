import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { verifyEmailConfirm } from '../api/authApi';

const S = {
  wrapper: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', padding: 20 },
  card: { background: '#fff', borderRadius: 16, padding: 40, width: 420, maxWidth: '100%', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', textAlign: 'center' },
  logo: { display: 'inline-block', background: '#1a6b3a', color: '#c97d1a', fontWeight: 800, fontSize: 14, padding: '8px 16px', borderRadius: 8, textDecoration: 'none', letterSpacing: 1, marginBottom: 28 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: '#111827', margin: '0 0 12px' },
};

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!token) { setStatus('error'); setMsg('No verification token found.'); return; }
    verifyEmailConfirm(token)
      .then(() => { setStatus('success'); setMsg('Your email has been verified!'); })
      .catch(err => { setStatus('error'); setMsg(err.response?.data?.detail || 'Invalid or expired link.'); });
  }, [token]);

  return (
    <div style={S.wrapper}>
      <div style={S.card}>
        <Link to="/" style={S.logo}>PEWIL</Link>
        <h1 style={S.title}>{status === 'loading' ? 'Verifying...' : status === 'success' ? 'Email verified!' : 'Verification failed'}</h1>
        <p style={{ fontSize: 15, color: status === 'success' ? '#1a6b3a' : '#991b1b', marginBottom: 24 }}>{msg}</p>
        {status !== 'loading' && (
          <Link to="/app" style={{ display: 'inline-block', padding: '12px 28px', background: '#1a6b3a', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
            Go to Dashboard
          </Link>
        )}
      </div>
    </div>
  );
}
