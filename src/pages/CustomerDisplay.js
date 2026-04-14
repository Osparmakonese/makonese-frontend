import React, { useEffect, useRef, useState } from 'react';
import { fmt } from '../utils/format';

/**
 * Customer-facing display. Open at /customer-display on a second monitor.
 * Receives live cart/total updates from POS.js via BroadcastChannel('pewil-pos').
 */
export default function CustomerDisplay() {
  const [state, setState] = useState({
    items: [], subtotal: 0, discount: 0, tax: 0, total: 0,
    change: 0, tendered: 0, member: null, message: '',
    storeName: 'Makonese Farm', lastUpdate: 0,
  });
  const lastItemRef = useRef(null);

  useEffect(() => {
    let ch;
    try {
      ch = new BroadcastChannel('pewil-pos');
      ch.onmessage = (ev) => {
        if (ev.data?.type === 'state') {
          setState((prev) => ({ ...prev, ...ev.data.payload, lastUpdate: Date.now() }));
          const items = ev.data.payload.items || [];
          if (items.length > 0) lastItemRef.current = items[items.length - 1];
        }
      };
    } catch (_) {}
    return () => { try { ch?.close(); } catch (_) {} };
  }, []);

  const recent = state.items.slice(-6).reverse();

  return (
    <div style={{
      minHeight: '100vh', background: '#0b132b', color: '#fff', padding: 32,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.03em' }}>{state.storeName}</div>
        {state.member && (
          <div style={{ fontSize: 16, color: '#86efac', fontWeight: 600 }}>
            👋 {state.member.name || state.member.phone || 'Member'} · {state.member.points_balance ?? 0} pts
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 28, marginTop: 28 }}>
        {/* Running list */}
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: 20, minHeight: 520 }}>
          <div style={{ fontSize: 12, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
            Your items ({state.items.length})
          </div>
          {lastItemRef.current && (
            <div style={{ marginTop: 14, padding: 14, background: 'rgba(34,197,94,0.12)',
                          border: '1px solid rgba(34,197,94,0.4)', borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: '#86efac', fontWeight: 600, textTransform: 'uppercase' }}>Last scanned</div>
              <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>{lastItemRef.current.name}</div>
              <div style={{ fontSize: 15, color: '#cbd5e1', marginTop: 4 }}>
                {lastItemRef.current.quantity} × {fmt(lastItemRef.current.unit_price, 'zwd')}
              </div>
            </div>
          )}
          <div style={{ marginTop: 16 }}>
            {recent.length === 0 ? (
              <div style={{ color: '#64748b', padding: 40, textAlign: 'center', fontSize: 15 }}>
                Welcome — please wait for the cashier to begin.
              </div>
            ) : recent.map((it, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between',
                                       padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: 15 }}>{it.quantity} × {it.name}</div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{fmt(it.unit_price * it.quantity, 'zwd')}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals panel */}
        <div style={{ background: 'linear-gradient(135deg,#1a6b3a,#064e3b)', borderRadius: 16, padding: 24 }}>
          <Row label="Subtotal" value={fmt(state.subtotal || 0, 'zwd')} />
          {state.discount > 0 && <Row label="Discount" value={'− ' + fmt(state.discount, 'zwd')} />}
          {state.tax > 0 && <Row label="Tax" value={fmt(state.tax, 'zwd')} />}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.3)', margin: '16px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontSize: 18, fontWeight: 600 }}>Total</div>
            <div style={{ fontSize: 42, fontWeight: 800, letterSpacing: '-0.02em' }}>
              {fmt(state.total || 0, 'zwd')}
            </div>
          </div>
          {state.tendered > 0 && (
            <>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.2)', margin: '16px 0' }} />
              <Row label="Tendered" value={fmt(state.tendered, 'zwd')} />
              {state.change > 0 && <Row label="Change" value={fmt(state.change, 'zwd')} big />}
            </>
          )}
          {state.message && (
            <div style={{ marginTop: 20, padding: 14, background: 'rgba(255,255,255,0.12)',
                          borderRadius: 10, fontSize: 15, fontWeight: 600, textAlign: 'center' }}>
              {state.message}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 28, textAlign: 'center', fontSize: 13, color: '#64748b' }}>
        Thank you for shopping with us.
      </div>
    </div>
  );
}

function Row({ label, value, big }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between',
                  padding: '6px 0', fontSize: big ? 24 : 16, fontWeight: big ? 800 : 500 }}>
      <div>{label}</div>
      <div>{value}</div>
    </div>
  );
}
