import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import api from '../api/axios';
import { requireManagerApproval } from './managerApproval';

const REASONS = [
  { key: 'bank_drop',        label: 'Bank drop' },
  { key: 'supplier_payment', label: 'Supplier payment' },
  { key: 'petty_cash',       label: 'Petty cash / expense' },
  { key: 'float_adjustment', label: 'Float adjustment' },
  { key: 'other',            label: 'Other' },
];

/**
 * promptCashDrop({ sessionId }) → Promise<{amount, reason, notes}|null>
 * Shows a cash-drop dialog. Does NOT submit — caller is responsible for
 * obtaining manager approval + POSTing to /retail/cash-drops/.
 */
export function promptCashDrop({ sessionId } = {}) {
  return new Promise((resolve) => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = ReactDOM.createRoot(host);
    const cleanup = () => {
      try { root.unmount(); } catch (_) {}
      if (host.parentNode) host.parentNode.removeChild(host);
    };
    root.render(
      <CashDropModal
        sessionId={sessionId}
        onSubmit={(v) => { cleanup(); resolve(v); }}
        onCancel={() => { cleanup(); resolve(null); }}
      />
    );
  });
}

/**
 * submitCashDrop({ sessionId, amount, reason, notes }) → Promise<saved|throws>
 * Full flow: prompts manager approval, then POSTs. Throws on failure.
 */
export async function submitCashDrop({ sessionId, amount, reason, notes }) {
  const token = await requireManagerApproval('cash_drop', {
    resourceType: 'cashier_session',
    resourceId: String(sessionId),
    notes: `Cash drop ${amount} (${reason})`,
  });
  const res = await api.post('/retail/cash-drops/', {
    session: sessionId,
    amount,
    reason,
    notes: notes || '',
  }, { headers: { 'X-Manager-Approval': token } });
  return res.data;
}

function CashDropModal({ sessionId, onSubmit, onCancel }) {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('bank_drop');
  const [notes, setNotes] = useState('');
  const [err, setErr] = useState('');

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    const n = parseFloat(amount);
    if (!n || n <= 0) { setErr('Enter an amount greater than zero.'); return; }
    if (reason === 'other' && !notes.trim()) { setErr('Notes required when reason is Other.'); return; }
    onSubmit({ amount: n, reason, notes: notes.trim() });
  };

  const onKeyDown = (e) => {
    if (e.key === 'Escape') onCancel();
    if (e.key === 'Enter' && (e.target.tagName !== 'TEXTAREA')) handleSubmit(e);
  };

  return (
    <div
      onClick={onCancel}
      style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', zIndex: 10002,
               display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <form
        onClick={(e) => e.stopPropagation()} onKeyDown={onKeyDown} onSubmit={handleSubmit}
        style={{ background: '#fff', borderRadius: 12, width: '92%', maxWidth: 460,
                 boxShadow: '0 24px 60px rgba(0,0,0,0.3)', overflow: 'hidden' }}
      >
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb',
                      background: 'linear-gradient(135deg,#fef3c7,#fde68a)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#92400e', textTransform: 'uppercase' }}>
            Cash drop
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginTop: 4 }}>
            Remove cash from the till
          </div>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
            Session #{sessionId || '—'} · Manager approval required
          </div>
        </div>
        <div style={{ padding: 16 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151',
                           textTransform: 'uppercase', marginBottom: 4 }}>
            Amount
          </label>
          <input
            autoFocus type="number" step="0.01" min="0" value={amount}
            onChange={(e) => setAmount(e.target.value)} placeholder="0.00"
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db',
                     borderRadius: 8, fontSize: 18, fontWeight: 700, boxSizing: 'border-box' }}
          />

          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151',
                           textTransform: 'uppercase', marginTop: 14, marginBottom: 6 }}>
            Reason
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {REASONS.map((r) => (
              <button key={r.key} type="button" onClick={() => setReason(r.key)}
                style={{ padding: '8px 10px', border: '1px solid ' + (reason === r.key ? '#1a6b3a' : '#e5e7eb'),
                         background: reason === r.key ? '#ecfdf5' : '#fff',
                         color: reason === r.key ? '#064e3b' : '#374151',
                         fontSize: 12, fontWeight: 600, borderRadius: 8, cursor: 'pointer' }}
              >{r.label}</button>
            ))}
          </div>

          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151',
                           textTransform: 'uppercase', marginTop: 14, marginBottom: 4 }}>
            Notes {reason === 'other' && <span style={{ color: '#b91c1c' }}>(required)</span>}
          </label>
          <textarea
            value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
            placeholder="e.g. Bank deposit slip #1024"
            style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db',
                     borderRadius: 8, fontSize: 13, resize: 'vertical', boxSizing: 'border-box' }}
          />

          {err && (
            <div style={{ marginTop: 10, padding: '8px 10px', background: '#fee2e2',
                          color: '#b91c1c', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
              {err}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
            <button type="button" onClick={onCancel}
              style={{ padding: '9px 16px', borderRadius: 8, border: '1px solid #e2e8f0',
                       background: '#fff', color: '#334155', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit"
              style={{ padding: '9px 16px', borderRadius: 8, border: 0,
                       background: '#1a6b3a', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              Request approval &amp; drop
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default promptCashDrop;
