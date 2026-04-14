/**
 * ageVerify.js — age-verification gate for the POS.
 *
 * Two tiers, chosen per-product by the `requires_manager_age_check` flag:
 *   - Cashier-confirm (default): any logged-in staff member can tap
 *     "Confirm customer is 18+" to proceed. Fast, one-tap.
 *   - Manager-approval (opt-in): escalates to the existing
 *     `requireManagerApproval` flow, which returns a signed token we can
 *     attach to the sale for audit.
 *
 * Usage:
 *   const res = await requireAgeVerification({
 *     products: [{ name: 'Whisky', age_restriction_type: 'alcohol', requires_manager_age_check: false }],
 *     cashierUsername: 'alice',
 *   });
 *   // res = { method: 'cashier', verifiedBy: 'alice', approvalToken: null }
 *   // or   { method: 'manager', verifiedBy: 'manager-uid', approvalToken: '...' }
 *
 * Rejects with Error('cancelled') if the cashier declines.
 *
 * The modal batches multiple age-gated items into one prompt so the cashier
 * confirms once per sale, not once per bottle.
 */
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { requireManagerApproval } from './managerApproval';

const TYPE_LABELS = {
  alcohol: 'Alcohol (18+)',
  tobacco: 'Tobacco (18+)',
  lottery: 'Lottery (18+)',
  other_18: '18+ item',
  none: '18+ item',
};

export function requireAgeVerification({ products = [], cashierUsername = '' } = {}) {
  if (!products.length) return Promise.resolve({ skipped: true });

  // If ANY item needs manager approval, escalate — one manager approval
  // covers the whole batch; cashier-only confirms don't suffice.
  const needsManager = products.some((p) => p.requires_manager_age_check);

  return new Promise((resolve, reject) => {
    const host = document.createElement('div');
    host.setAttribute('data-pewil-age-verify', '');
    document.body.appendChild(host);
    const root = ReactDOM.createRoot(host);

    const cleanup = () => {
      try { root.unmount(); } catch (_) {}
      if (host.parentNode) host.parentNode.removeChild(host);
    };

    root.render(
      <AgeVerifyModal
        products={products}
        needsManager={needsManager}
        cashierUsername={cashierUsername}
        onConfirmed={(result) => { cleanup(); resolve(result); }}
        onCancel={() => { cleanup(); reject(new Error('cancelled')); }}
      />
    );
  });
}

function AgeVerifyModal({ products, needsManager, cashierUsername, onConfirmed, onCancel }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const cashierConfirm = () => {
    onConfirmed({
      method: 'cashier',
      verifiedBy: cashierUsername || 'cashier',
      approvalToken: null,
    });
  };

  const managerConfirm = async () => {
    setBusy(true);
    setError('');
    try {
      // Re-use the existing manager-approval plumbing: same modal, same
      // signed-token format, same audit trail.
      const token = await requireManagerApproval('price_override', {
        resourceType: 'age_gate',
        resourceId: products.map((p) => p.id || p.product_id).filter(Boolean).join(','),
        notes: `Age verification for ${products.map((p) => p.name).join(', ')}`,
      });
      onConfirmed({ method: 'manager', verifiedBy: 'manager', approvalToken: token });
    } catch (e) {
      if (e?.message === 'cancelled') {
        setBusy(false);
        return;
      }
      setError(e?.message || 'Manager approval failed.');
      setBusy(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10001,
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 12, width: '92%', maxWidth: 460,
          boxShadow: '0 24px 60px rgba(0,0,0,0.3)', overflow: 'hidden',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div style={{ padding: '18px 20px 12px', borderBottom: '1px solid #e5e7eb', background: '#fffbeb' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Age Verification Required
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginTop: 4 }}>
            Confirm the customer is 18 or older
          </div>
        </div>

        <div style={{ padding: 20 }}>
          <div style={{ fontSize: 13, color: '#334155', marginBottom: 12 }}>
            The following {products.length === 1 ? 'item requires' : 'items require'} age verification:
          </div>
          <ul style={{ margin: 0, padding: '0 0 0 18px', color: '#0f172a', fontSize: 13 }}>
            {products.map((p, i) => (
              <li key={i} style={{ marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>{p.name}</span>
                <span style={{ color: '#6b7280', marginLeft: 6 }}>
                  · {TYPE_LABELS[p.age_restriction_type] || '18+ item'}
                </span>
              </li>
            ))}
          </ul>

          {needsManager ? (
            <div style={{ marginTop: 16, padding: '10px 12px', background: '#fef2f2', color: '#991b1b', borderRadius: 8, fontSize: 12 }}>
              One or more items require <strong>manager approval</strong>. A manager must authenticate before this sale can proceed.
            </div>
          ) : (
            <div style={{ marginTop: 16, padding: '10px 12px', background: '#f0fdf4', color: '#166534', borderRadius: 8, fontSize: 12 }}>
              Check the customer&rsquo;s ID, confirm they are 18 or older, then tap <strong>Confirm</strong>.
            </div>
          )}

          {error && (
            <div style={{ marginTop: 12, padding: '8px 10px', background: '#fef2f2', color: '#b91c1c', borderRadius: 6, fontSize: 12 }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onCancel} style={cancelBtn} disabled={busy}>
              Cancel sale
            </button>
            {needsManager ? (
              <button
                type="button"
                onClick={managerConfirm}
                disabled={busy}
                style={{ ...approveBtn, background: '#b91c1c', opacity: busy ? 0.6 : 1 }}
              >
                {busy ? 'Waiting…' : '🔐 Get manager approval'}
              </button>
            ) : (
              <button
                type="button"
                onClick={cashierConfirm}
                style={approveBtn}
                autoFocus
              >
                ✅ Confirm customer is 18+
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const cancelBtn = {
  padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0',
  background: '#fff', color: '#334155', fontSize: 13, fontWeight: 600, cursor: 'pointer',
};
const approveBtn = {
  padding: '10px 18px', borderRadius: 8, border: 'none',
  background: '#1a6b3a', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
};

export default requireAgeVerification;
