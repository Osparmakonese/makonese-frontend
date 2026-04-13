import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCashierSessions, createCashierSession, closeCashierSession } from '../api/retailApi';
import { fmt } from '../utils/format';

/* --- Open Session Modal --- */
function OpenSessionModal({ isOpen, onClose, onSubmit, loading }) {
  const [openingFloat, setOpeningFloat] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ opening_float: parseFloat(openingFloat) || 0, notes });
    setOpeningFloat('');
    setNotes('');
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 24, maxWidth: 420, width: '90%' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, fontFamily: "'Playfair Display', serif", color: '#111827' }}>
            {'\u{1F4B5}'} Open New Session
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#9ca3af' }}>{'\u00D7'}</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: '#6b7280', marginBottom: 4, textTransform: 'uppercase' }}>Opening Float (Cash in Drawer)</label>
            <input type="number" step="0.01" value={openingFloat} onChange={e => setOpeningFloat(e.target.value)} required placeholder="0.00" style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 7, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: '#6b7280', marginBottom: 4, textTransform: 'uppercase' }}>Notes (optional)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Any notes for this session..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 7, fontSize: 12, outline: 'none', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' }} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" disabled={loading} style={{ flex: 1, padding: 10, background: '#1a6b3a', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Opening...' : 'Open Session'}
            </button>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: 10, background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* --- Close Session Modal --- */
function CloseSessionModal({ isOpen, onClose, onSubmit, session, loading }) {
  const [closingCash, setClosingCash] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(session.id, { closing_cash: parseFloat(closingCash) || 0 });
    setClosingCash('');
  };

  if (!isOpen || !session) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 24, maxWidth: 420, width: '90%' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, fontFamily: "'Playfair Display', serif", color: '#111827' }}>
            {'\u{1F512}'} Close Session #{session.id}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#9ca3af' }}>{'\u00D7'}</button>
        </div>

        <div style={{ background: '#f9fafb', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 11 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ color: '#6b7280' }}>Cashier:</span>
            <strong>{session.cashier_username}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ color: '#6b7280' }}>Opened:</span>
            <strong>{session.opened_at ? new Date(session.opened_at).toLocaleString() : ''}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#6b7280' }}>Opening Float:</span>
            <strong style={{ color: '#1a6b3a' }}>{fmt(session.opening_float, 'zwd')}</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: '#6b7280', marginBottom: 4, textTransform: 'uppercase' }}>Closing Cash (Count the Drawer)</label>
            <input type="number" step="0.01" value={closingCash} onChange={e => setClosingCash(e.target.value)} required placeholder="0.00" style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 7, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" disabled={loading} style={{ flex: 1, padding: 10, background: '#c0392b', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Closing...' : 'Close Session'}
            </button>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: 10, background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* --- Styles --- */
const S = {
  page: { maxWidth: 1200, margin: '0 auto', padding: 20 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 700, color: '#111827', fontFamily: "'Playfair Display', serif", margin: 0 },
  addBtn: { padding: '10px 18px', background: '#1a6b3a', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 },
  summaryCard: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  summaryLabel: { fontSize: 9, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 },
  summaryValue: { fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: '#1a6b3a' },
  sectionTitle: { fontSize: 13, fontWeight: 700, color: '#111827', margin: '24px 0 12px' },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '16px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginBottom: 20 },
  sessionCard: (isOpen) => ({
    background: '#fff', border: `1px solid ${isOpen ? '#1a6b3a' : '#e5e7eb'}`, borderRadius: 12, padding: '16px 18px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginBottom: 12, borderLeft: `4px solid ${isOpen ? '#1a6b3a' : '#e5e7eb'}`,
  }),
  sessionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sessionId: { fontSize: 13, fontWeight: 700, color: '#111827' },
  badge: (isOpen) => ({
    display: 'inline-block', fontSize: 8, fontWeight: 700, padding: '3px 8px', borderRadius: 10, textTransform: 'uppercase',
    background: isOpen ? '#d1fae5' : '#f3f4f6', color: isOpen ? '#065f46' : '#6b7280',
  }),
  sessionDetails: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, fontSize: 11, color: '#374151' },
  detailLabel: { fontSize: 9, color: '#9ca3af', textTransform: 'uppercase', fontWeight: 600, marginBottom: 2 },
  closeBtn: { padding: '6px 14px', background: '#c0392b', color: '#fff', border: 'none', borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: 'pointer' },
  emptyState: { textAlign: 'center', padding: '40px 20px', color: '#9ca3af' },
};

export default function CashierSessions() {
  const qc = useQueryClient();
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [closingSession, setClosingSession] = useState(null);

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['retail-cashier-sessions-page'],
    queryFn: getCashierSessions,
    staleTime: 30000,
  });

  const openMut = useMutation({
    mutationFn: createCashierSession,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['retail-cashier-sessions-page'] });
      setShowOpenModal(false);
    },
  });

  const closeMut = useMutation({
    mutationFn: ({ id, data }) => closeCashierSession(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['retail-cashier-sessions-page'] });
      setClosingSession(null);
    },
  });

  const activeSessions = sessions.filter(s => s.status === 'open');
  const closedSessions = sessions.filter(s => s.status === 'closed');

  const handleCloseSession = (id, data) => {
    closeMut.mutate({ id, data });
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <h1 style={S.title}>{'\u{1F4B3}'} Cashier Sessions</h1>
        <button onClick={() => setShowOpenModal(true)} style={S.addBtn}>
          {'\u{2795}'} Open Session
        </button>
      </div>

      {/* Summary */}
      <div style={S.summaryGrid}>
        <div style={S.summaryCard}>
          <div style={S.summaryLabel}>{'\u{1F7E2}'} Active Sessions</div>
          <div style={S.summaryValue}>{activeSessions.length}</div>
        </div>
        <div style={S.summaryCard}>
          <div style={S.summaryLabel}>{'\u{1F534}'} Closed Today</div>
          <div style={{ ...S.summaryValue, color: '#6b7280' }}>
            {closedSessions.filter(s => s.closed_at && new Date(s.closed_at).toDateString() === new Date().toDateString()).length}
          </div>
        </div>
        <div style={S.summaryCard}>
          <div style={S.summaryLabel}>{'\u{1F4CA}'} Total Sessions</div>
          <div style={{ ...S.summaryValue, color: '#374151' }}>{sessions.length}</div>
        </div>
      </div>

      {/* Active Sessions */}
      {activeSessions.length > 0 && (
        <>
          <h3 style={S.sectionTitle}>{'\u{1F7E2}'} Active Sessions</h3>
          {activeSessions.map(session => (
            <div key={session.id} style={S.sessionCard(true)}>
              <div style={S.sessionHeader}>
                <div>
                  <span style={S.sessionId}>Session #{session.id}</span>
                  <span style={{ marginLeft: 8, ...S.badge(true) }}>Open</span>
                </div>
                <button onClick={() => setClosingSession(session)} style={S.closeBtn}>Close Session</button>
              </div>
              <div style={S.sessionDetails}>
                <div>
                  <div style={S.detailLabel}>Cashier</div>
                  <strong>{session.cashier_username}</strong>
                </div>
                <div>
                  <div style={S.detailLabel}>Opened</div>
                  <span>{session.opened_at ? new Date(session.opened_at).toLocaleString() : ''}</span>
                </div>
                <div>
                  <div style={S.detailLabel}>Opening Float</div>
                  <strong style={{ color: '#1a6b3a' }}>{fmt(session.opening_float, 'zwd')}</strong>
                </div>
                <div>
                  <div style={S.detailLabel}>Notes</div>
                  <span style={{ color: '#6b7280' }}>{session.notes || '\u2014'}</span>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {/* Closed Sessions */}
      <h3 style={S.sectionTitle}>{'\u{1F4CB}'} Session History</h3>
      {isLoading ? (
        <div style={S.emptyState}>Loading sessions...</div>
      ) : closedSessions.length > 0 ? (
        closedSessions.map(session => {
          const variance = session.variance;
          const varianceColor = variance === null ? '#6b7280' : variance >= 0 ? '#1a6b3a' : '#c0392b';
          return (
            <div key={session.id} style={S.sessionCard(false)}>
              <div style={S.sessionHeader}>
                <div>
                  <span style={S.sessionId}>Session #{session.id}</span>
                  <span style={{ marginLeft: 8, ...S.badge(false) }}>Closed</span>
                </div>
              </div>
              <div style={S.sessionDetails}>
                <div>
                  <div style={S.detailLabel}>Cashier</div>
                  <strong>{session.cashier_username}</strong>
                </div>
                <div>
                  <div style={S.detailLabel}>Duration</div>
                  <span>
                    {session.opened_at ? new Date(session.opened_at).toLocaleDateString() : ''}
                    {session.closed_at ? ` \u2192 ${new Date(session.closed_at).toLocaleTimeString()}` : ''}
                  </span>
                </div>
                <div>
                  <div style={S.detailLabel}>Expected / Actual</div>
                  <span>{fmt(session.expected_cash || 0, 'zwd')} / {fmt(session.closing_cash || 0, 'zwd')}</span>
                </div>
                <div>
                  <div style={S.detailLabel}>Variance</div>
                  <strong style={{ color: varianceColor }}>
                    {variance !== null ? (variance >= 0 ? '+' : '') + fmt(variance, 'zwd') : '\u2014'}
                  </strong>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div style={{ ...S.card, ...S.emptyState }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>{'\u{1F4B3}'}</div>
          <p>No session history yet</p>
          <p style={{ fontSize: 11, marginTop: 6 }}>Open a cashier session to start processing sales</p>
        </div>
      )}

      <OpenSessionModal isOpen={showOpenModal} onClose={() => setShowOpenModal(false)} onSubmit={data => openMut.mutate(data)} loading={openMut.isPending} />
      <CloseSessionModal isOpen={!!closingSession} onClose={() => setClosingSession(null)} onSubmit={handleCloseSession} session={closingSession} loading={closeMut.isPending} />
    </div>
  );
}
