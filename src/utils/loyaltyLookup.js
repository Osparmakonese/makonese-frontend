import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import api from '../api/axios';

/**
 * promptLoyaltyMember() → Promise<member|null>
 * Opens a modal to search loyalty members by phone, card number, or name.
 * Resolves with the selected member object, or null if cancelled.
 */
export function promptLoyaltyMember() {
  return new Promise((resolve) => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = ReactDOM.createRoot(host);
    const cleanup = () => {
      try { root.unmount(); } catch (_) {}
      if (host.parentNode) host.parentNode.removeChild(host);
    };
    root.render(
      <LoyaltyLookupModal
        onPick={(m) => { cleanup(); resolve(m); }}
        onCancel={() => { cleanup(); resolve(null); }}
      />
    );
  });
}

function LoyaltyLookupModal({ onPick, onCancel }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(async () => {
      const query = q.trim();
      if (!query) { setResults([]); return; }
      setLoading(true);
      try {
        const r = await api.get('/retail/loyalty-members/', { params: { search: query } });
        setResults(Array.isArray(r.data) ? r.data : (r.data.results || []));
      } catch (_) { setResults([]); }
      setLoading(false);
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', zIndex: 10002,
               display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: '#fff', borderRadius: 12, width: '92%', maxWidth: 520,
                 boxShadow: '0 24px 60px rgba(0,0,0,0.3)', overflow: 'hidden' }}
      >
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#1a6b3a', textTransform: 'uppercase' }}>
            Loyalty lookup
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginTop: 4 }}>
            Scan card, enter phone, or type a name
          </div>
        </div>
        <div style={{ padding: 16 }}>
          <input
            autoFocus type="text" value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Card # / phone / name"
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db',
                     borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
          />
          <div style={{ maxHeight: 260, overflowY: 'auto', marginTop: 10 }}>
            {loading && <div style={{ color: '#6b7280', fontSize: 12, padding: 8 }}>Searching…</div>}
            {!loading && q && results.length === 0 && (
              <div style={{ color: '#6b7280', fontSize: 12, padding: 8 }}>No match.</div>
            )}
            {results.map((m) => (
              <button key={m.id} type="button" onClick={() => onPick(m)}
                style={{ width: '100%', textAlign: 'left', padding: '10px 12px',
                         background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8,
                         marginBottom: 6, cursor: 'pointer' }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                  {m.first_name || m.last_name ? `${m.first_name || ''} ${m.last_name || ''}`.trim() : (m.phone || m.card_number || `Member #${m.id}`)}
                </div>
                <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
                  {m.card_number && <>Card {m.card_number} · </>}
                  {m.phone && <>{m.phone} · </>}
                  <b style={{ color: '#1a6b3a' }}>{m.points_balance ?? 0} pts</b>
                </div>
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
            <button type="button" onClick={onCancel}
              style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0',
                       background: '#fff', color: '#334155', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
