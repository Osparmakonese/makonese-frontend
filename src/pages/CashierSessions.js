import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCashierSessions, createCashierSession, closeCashierSession } from '../api/retailApi';
import { fmt } from '../utils/format';
import AIInsightCard from '../components/AIInsightCard';

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
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 700, color: '#111827', fontFamily: "'Playfair Display', serif", margin: 0 },
  addBtn: { padding: '10px 18px', background: '#1a6b3a', color: '#fff', border: 'none', borderRadius: 7, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginBottom: 20, overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHead: { background: '#f9fafb' },
  tableHeaderCell: { padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' },
  tableBody: { fontSize: 13, color: '#374151' },
  tableRow: { borderBottom: '1px solid #e5e7eb' },
  tableRowHover: { background: '#f9fafb' },
  tableCell: { padding: '14px 16px', textAlign: 'left' },
  sessionIdCell: { fontFamily: 'monospace', fontWeight: 600, color: '#1a6b3a' },
  cashierCell: { fontWeight: 600 },
  emptyCell: { color: '#9ca3af' },
  pill: (type) => {
    const styles = {
      open: { background: '#e8f5ee', color: '#1a6b3a' },
      balanced: { background: '#e8f5ee', color: '#1a6b3a' },
      variance: { background: '#fef3e2', color: '#92400e' },
    };
    return { display: 'inline-block', padding: '4px 12px', borderRadius: 12, fontSize: 11, fontWeight: 600, ...styles[type] };
  },
  varianceNegative: { color: '#c0392b', fontWeight: 700 },
  varianceZero: { color: '#1a6b3a', fontWeight: 700 },
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

  const handleCloseSession = (id, data) => {
    closeMut.mutate({ id, data });
  };

  // Combine all sessions for table display
  const allSessions = [...sessions].sort((a, b) => {
    // Sort by status (open first), then by opened_at descending
    if (a.status === 'open' && b.status !== 'open') return -1;
    if (a.status !== 'open' && b.status === 'open') return 1;
    return new Date(b.opened_at || 0) - new Date(a.opened_at || 0);
  });

  // Helper to determine status pill
  const getStatusPill = (session) => {
    if (session.status === 'open') {
      return { type: 'open', label: 'Open' };
    }
    if (session.variance === 0) {
      return { type: 'balanced', label: 'Balanced' };
    }
    return { type: 'variance', label: 'Variance' };
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <h1 style={S.title}>Cashier Sessions</h1>
        <button onClick={() => setShowOpenModal(true)} style={S.addBtn}>
          + Open Session
        </button>
      </div>

      {/* Sessions Table */}
      <div style={S.card}>
        {isLoading ? (
          <div style={S.emptyState}>Loading sessions...</div>
        ) : allSessions.length > 0 ? (
          <table style={S.table}>
            <thead style={S.tableHead}>
              <tr style={S.tableRow}>
                <th style={S.tableHeaderCell}>Session</th>
                <th style={S.tableHeaderCell}>Cashier</th>
                <th style={S.tableHeaderCell}>Opened</th>
                <th style={S.tableHeaderCell}>Closed</th>
                <th style={S.tableHeaderCell}>Sales</th>
                <th style={S.tableHeaderCell}>Opening Cash</th>
                <th style={S.tableHeaderCell}>Expected</th>
                <th style={S.tableHeaderCell}>Actual</th>
                <th style={S.tableHeaderCell}>Variance</th>
                <th style={S.tableHeaderCell}>Status</th>
              </tr>
            </thead>
            <tbody style={S.tableBody}>
              {allSessions.map(session => {
                const statusPill = getStatusPill(session);
                const isOpen = session.status === 'open';
                const variance = session.variance;

                return (
                  <tr
                    key={session.id}
                    style={{ ...S.tableRow, cursor: 'pointer' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ ...S.tableCell, ...S.sessionIdCell }}>CS-{String(session.id).padStart(3, '0')}</td>
                    <td style={{ ...S.tableCell, ...S.cashierCell }}>{session.cashier_username}</td>
                    <td style={S.tableCell}>{session.opened_at ? new Date(session.opened_at).toLocaleString() : '—'}</td>
                    <td style={S.tableCell}>{isOpen ? '—' : (session.closed_at ? new Date(session.closed_at).toLocaleString() : '—')}</td>
                    <td style={S.tableCell}>0</td>
                    <td style={S.tableCell}>{fmt(session.opening_float || 0, 'zwd')}</td>
                    <td style={S.tableCell}>{isOpen ? '—' : fmt(session.expected_cash || 0, 'zwd')}</td>
                    <td style={S.tableCell}>{isOpen ? '—' : fmt(session.closing_cash || 0, 'zwd')}</td>
                    <td style={S.tableCell}>
                      {isOpen ? (
                        '—'
                      ) : variance !== null ? (
                        <span style={variance < 0 ? S.varianceNegative : variance === 0 ? S.varianceZero : {}}>
                          {variance >= 0 ? '+' : ''}{fmt(variance, 'zwd')}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td style={S.tableCell}>
                      <div style={S.pill(statusPill.type)}>
                        {statusPill.label}
                      </div>
                      {isOpen && (
                        <button
                          onClick={() => setClosingSession(session)}
                          style={{
                            marginLeft: 8,
                            padding: '4px 12px',
                            background: '#c0392b',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Close
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div style={{ ...S.emptyState, padding: '60px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 10 }}>💳</div>
            <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>No sessions yet</p>
            <p style={{ fontSize: 12, marginTop: 6 }}>Open a cashier session to start processing sales</p>
          </div>
        )}
      </div>

      {/* AI Cashier Monitor */}
      <div style={{ marginTop: 16 }}>
        <AIInsightCard feature="retail_cashier_monitor" title="AI Cashier Analysis" />
      </div>

      <OpenSessionModal isOpen={showOpenModal} onClose={() => setShowOpenModal(false)} onSubmit={data => openMut.mutate(data)} loading={openMut.isPending} />
      <CloseSessionModal isOpen={!!closingSession} onClose={() => setClosingSession(null)} onSubmit={handleCloseSession} session={closingSession} loading={closeMut.isPending} />
    </div>
  );
}
