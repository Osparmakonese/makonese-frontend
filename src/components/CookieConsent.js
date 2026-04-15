import { useState } from 'react';

const KEY = 'pewil_cookie_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(() => {
    try { return !localStorage.getItem(KEY); } catch { return true; }
  });

  if (!visible) return null;

  const accept = (val) => {
    try { localStorage.setItem(KEY, val); } catch {}
    setVisible(false);
  };

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 99999,
      background: '#111827', color: '#f3f4f6', padding: '16px 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: 12, fontSize: 13, lineHeight: 1.5,
      boxShadow: '0 -2px 12px rgba(0,0,0,0.15)',
    }}>
      <span>
        We use essential cookies to keep you logged in. No tracking cookies are set unless you opt in.{' '}
        <a href="/privacy" style={{ color: '#c97d1a', textDecoration: 'underline' }}>Privacy Policy</a>
      </span>
      <span style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => accept('essential')} style={{
          padding: '8px 18px', background: 'transparent', color: '#9ca3af',
          border: '1px solid #374151', borderRadius: 6, cursor: 'pointer', fontSize: 12,
        }}>Essential only</button>
        <button onClick={() => accept('all')} style={{
          padding: '8px 18px', background: '#1a6b3a', color: '#fff',
          border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600,
        }}>Accept all</button>
      </span>
    </div>
  );
}
