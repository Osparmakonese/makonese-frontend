import { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '../api/authApi';

const S = {
  wrapper: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', padding: 20 },
  card: { background: '#fff', borderRadius: 16, padding: 40, width: 420, maxWidth: '100%', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  logo: { display: 'inline-block', background: '#1a6b3a', color: '#c97d1a', fontWeight: 800, fontSize: 14, padding: '8px 16px', borderRadius: 8, textDecoration: 'none', letterSpacing: 1, marginBottom: 28 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: '#111827', margin: '0 0 8px' },
  sub: { fontSize: 14, color: '#6b7280', marginBottom: 24 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 6 },
  input: { width: '100%', padding: '12px 14px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '12px 0', background: '#1a6b3a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 16 },
  link: { display: 'block', textAlign: 'center', marginTop: 16, fontSize: 13, color: '#1a6b3a', textDecoration: 'none' },
  msg: { padding: '12px 16px', borderRadius: 8, fontSize: 13, marginBottom: 16 },
};

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong.');
    } finally { setLoading(false); }
  };

  return (
    <div style={S.wrapper}>
      <div style={S.card}>
        <Link to="/" style={S.logo}>PEWIL</Link>
        <h1 style={S.title}>Forgot password?</h1>
        <p style={S.sub}>Enter your email and we'll send you a reset link.</p>
        {error && <div style={{ ...S.msg, background: '#fef2f2', color: '#991b1b' }}>{error}</div>}
        {sent ? (
          <div style={{ ...S.msg, background: '#e8f5ee', color: '#1a6b3a' }}>
            If that email is registered, a reset link has been sent. Check your inbox (and spam folder).
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label style={S.label}>Email address</label>
            <input style={S.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            <button style={S.btn} disabled={loading}>{loading ? 'Sending...' : 'Send reset link'}</button>
          </form>
        )}
        <Link to="/login" style={S.link}>{'\u2190'} Back to login</Link>
      </div>
    </div>
  );
}
