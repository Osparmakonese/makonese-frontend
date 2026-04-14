import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

/**
 * promptDiscountReason({ current, max }) → Promise<{amount, reason}|null>
 * Pops a modal asking the cashier to pick a reason and confirm the discount amount.
 * Resolves null on cancel.
 */
const REASONS = [
  { code: 'markdown', label: 'Markdown / Clearance' },
  { code: 'staff', label: 'Staff discount' },
  { code: 'loyalty', label: 'Loyalty reward' },
  { code: 'damaged', label: 'Damaged goods' },
  { code: 'price_match', label: 'Price match' },
  { code: 'promo', label: 'Promotion' },
  { code: 'other', label: 'Other (notes required)' },
];

export function promptDiscountReason(opts = {}) {
  const { current = '', max = 0 } = opts;
  return new Promise((resolve) => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = ReactDOM.createRoot(host);
    const cleanup = () => {
      try { root.unmount(); } catch (_) {}
      if (host.parentNode) host.parentNode.removeChild(host);
    };
    root.render(
      <DiscountReasonModal
        current={current} max={max}
        onConfirm={(v) => { cleanup(); resolve(v); }}
        onCancel={() => { cleanup(); resolve(null); }}
      />
    );
  });
}

function DiscountReasonModal({ current, max, onConfirm, onCancel }) {
  const [amount, setAmount] = useState(current || '');
  const [reason, setReason] = useState('markdown');
  const [notes, setNotes] = useState('');
  const [err, setErr] = useState('');

  const submit = () => {
    const n = parseFloat(amount);
    if (isNaN(n) || n <= 0) return setErr('Enter a valid amount.');
    if (max && n > max) return setErr(`Cannot exceed subtotal (${max}).`);
    if (reason === 'other' && !notes.trim()) return setErr('Notes required for "Other".');
    onConfirm({ amount: n, reason, notes: notes.trim() });
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', zIndex: 10002,
               display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') onCancel(); }}
        style={{ background: '#fff', borderRadius: 12, width: '92%', maxWidth: 440,
                 boxShadow: '0 24px 60px rgba(0,0,0,0.3)', overflow: 'hidden' }}
      >
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#b45309', textTransform: 'uppercase' }}>Discount</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginTop: 4 }}>
            Reason &amp; amount
          </div>
        </div>
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <label style={{ fontSize: 11, color: '#6b7280', fontWeight: 600 }}>Amount</label>
            <input
              autoFocus type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db',
                       borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 11, color: '#6b7280', fontWeight: 600 }}>Reason</label>
            <select value={reason} onChange={(e) => setReason(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db',
                       borderRadius: 8, fontSize: 14, boxSizing: 'border-box', background: '#fff' }}
            >
              {REASONS.map((r) => <option key={r.code} value={r.code}>{r.label}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: '#6b7280', fontWeight: 600 }}>
              Notes {reason === 'other' && <span style={{ color: '#dc2626' }}>*</span>}
            </label>
            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional…"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db',
                       borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
            />
          </div>
          {err && (
            <div style={{ padding: '8px 10px', background: '#fef2f2', color: '#b91c1c',
                          borderRadius: 6, fontSize: 12 }}>{err}</div>
          )}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" onClick={onCancel}
              style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0',
                       background: '#fff', color: '#334155', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="button" onClick={submit}
              style={{ padding: '8px 16px', borderRadius: 8, border: 'none',
                       background: '#1a6b3a', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
