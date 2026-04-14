/**
 * ScannerLanePOS.js — Pick n Pay / SAP CAR scanner-lane render for POS.
 *
 * Full-viewport, premium UI fidelity to the v3 HTML mockup:
 *   - Red Pick n Pay header (MAKONESE RETAIL · lane info)
 *   - Receipt-style line list (monospace, ALL-CAPS descriptions)
 *   - Scan bar (blue border) + online status pill
 *   - Black totals panel with big yellow TOTAL DUE
 *   - Right rail: DynaKey function strip (300px) with big green FINALISE SALE
 *
 * Designed to fill the entire viewport when the POS theme is "pnp".
 */
import React from 'react';
import { fmt } from '../utils/format';

const K = (label, sub, variant, onClick) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      padding: variant === 'big' ? '22px 12px' : '14px 10px',
      border: '1px solid ' +
        (variant === 'blue' ? '#1a56db'
        : variant === 'red' ? '#b91c1c'
        : variant === 'green' ? '#15803d'
        : '#cbd5e1'),
      borderRadius: 8,
      background:
        variant === 'blue' ? '#1a56db'
        : variant === 'red' ? '#e31e24'
        : variant === 'green' ? '#16a34a'
        : '#fff',
      color: (variant === 'blue' || variant === 'red' || variant === 'green') ? '#fff' : '#0f172a',
      fontSize: variant === 'big' ? 18 : 13,
      fontWeight: 800,
      textAlign: 'center',
      cursor: 'pointer',
      marginBottom: 8,
      boxShadow: '0 2px 4px rgba(15,23,42,0.08)',
      width: '100%',
      lineHeight: 1.25,
      letterSpacing: '0.03em',
      transition: 'transform 0.05s ease, box-shadow 0.15s ease',
    }}
    onMouseDown={(e) => (e.currentTarget.style.transform = 'translateY(1px)')}
    onMouseUp={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
  >
    {label}
    {sub && (
      <div style={{
        fontWeight: 500,
        color: variant === 'blue' ? '#bfdbfe'
              : variant === 'red' ? '#fecaca'
              : variant === 'green' ? '#bbf7d0'
              : '#64748b',
        fontSize: 10,
        marginTop: 3,
        letterSpacing: '0.05em',
      }}>
        {sub}
      </div>
    )}
  </button>
);

export default function ScannerLanePOS({
  cart, removeFromCart, updateCartQty,
  barcode, setBarcode, handleBarcodeSubmit, barcodeInputRef,
  subtotal, discountAmount, taxAmount, grandTotal,
  handleCompleteSale, handleSuspendSale,
  priceCheckMode, setPriceCheckMode,
  offline, pendingCount,
  user, laneLabel,
  brandName,
}) {
  const itemCount = cart.reduce((n, i) => n + (i.quantity || 0), 0);
  const vatShown = taxAmount || subtotal * 0.15 / 1.15;

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div style={styles.shell}>
      <div style={styles.main}>
        {/* Red Pick n Pay header */}
        <div style={styles.head}>
          <div>
            <div style={styles.brand}>{(brandName || 'MAKONESE RETAIL').toUpperCase()}</div>
            <div style={styles.branch}>Retail POS · Scanner Lane</div>
          </div>
          <div style={styles.laneBox}>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '0.04em' }}>{laneLabel || 'Lane 01'}</div>
            <div style={{ fontSize: 12, opacity: 0.92, marginTop: 2 }}>
              {(user?.username || 'Cashier')} · {dateStr} · {timeStr}
            </div>
          </div>
        </div>

        {/* Column headers */}
        <div style={styles.gridHead}>
          <span>SKU</span>
          <span>Description</span>
          <span style={{ textAlign: 'right' }}>Qty</span>
          <span style={{ textAlign: 'right' }}>Unit</span>
          <span style={{ textAlign: 'right' }}>Line total</span>
        </div>

        {/* Line items */}
        <div style={styles.lines}>
          {cart.length === 0 ? (
            <div style={styles.emptyHint}>
              <div style={{ fontSize: 64, opacity: 0.25 }}>⌨</div>
              <div style={{ marginTop: 12, fontSize: 16, color: '#475569', fontWeight: 600 }}>
                Waiting for first scan…
              </div>
              <div style={{ marginTop: 6, fontSize: 13, color: '#94a3b8' }}>
                Scan a barcode or tap a DynaKey on the right.
              </div>
            </div>
          ) : (
            cart.map((item, idx) => {
              const lineTotal = item.unit_price * item.quantity;
              const ageTag = item.product?.is_age_restricted;
              const weighTag = item.product?.is_weighable;
              return (
                <div
                  key={item.product_id}
                  style={{
                    ...styles.row,
                    background: idx % 2 === 1 ? '#f8fafc' : '#fff',
                  }}
                  onDoubleClick={() => removeFromCart(item.product_id)}
                  title="Double-click to remove line"
                >
                  <span style={styles.sku}>{item.product_id}</span>
                  <span style={styles.desc}>
                    {(item.name || '').toUpperCase()}
                    {weighTag && (
                      <span style={{ ...styles.tag, ...styles.tagW }}>
                        ⚖ {Number(item.quantity).toFixed(3)} KG
                      </span>
                    )}
                    {ageTag && (
                      <span style={{ ...styles.tag, ...styles.tagAge }}>18+ VERIFIED</span>
                    )}
                  </span>
                  <span style={styles.num}>
                    {weighTag ? Number(item.quantity).toFixed(3) : item.quantity}
                  </span>
                  <span style={styles.num}>{fmt(item.unit_price)}</span>
                  <span style={{ ...styles.num, fontWeight: 800, color: '#0f172a' }}>{fmt(lineTotal)}</span>
                </div>
              );
            })
          )}
        </div>

        {/* Scan bar */}
        <div style={styles.scanBar}>
          <span style={styles.scanLbl}>Scan / SKU:</span>
          <input
            ref={barcodeInputRef}
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyDown={handleBarcodeSubmit}
            placeholder={priceCheckMode ? '🔍 Price check — scan without adding…' : 'Waiting for scan…'}
            style={styles.scanInput}
            autoFocus
          />
          <span style={{
            ...styles.statusPill,
            background: offline ? '#b91c1c' : '#16a34a',
          }}>
            ● {offline ? 'OFFLINE' : 'ONLINE'}
            {pendingCount > 0 ? ` · ${pendingCount}` : ''}
          </span>
        </div>

        {/* Totals panel */}
        <div style={styles.totals}>
          <div style={styles.cell}>
            <div style={styles.cellLbl}>Items</div>
            <div style={styles.cellVal}>{itemCount}</div>
          </div>
          <div style={styles.cell}>
            <div style={styles.cellLbl}>VAT 15%</div>
            <div style={styles.cellVal}>{fmt(vatShown)}</div>
          </div>
          <div style={{ ...styles.cell, ...styles.cellTotal }}>
            <div style={{ ...styles.cellLbl, color: '#fde68a' }}>TOTAL DUE</div>
            <div style={styles.cellTotalVal}>${fmt(grandTotal)}</div>
          </div>
        </div>
      </div>

      {/* Right rail: DynaKey function strip */}
      <div style={styles.dyn}>
        <div style={styles.sec}>Line actions</div>
        {K('QTY', 'F3 — change line qty', null, () => {
          if (cart.length === 0) return;
          const last = cart[cart.length - 1];
          const raw = window.prompt(`Quantity for ${last.name}:`, String(last.quantity));
          if (raw == null) return;
          const n = parseInt(raw, 10);
          if (Number.isFinite(n) && n > 0) updateCartQty(last.product_id, n);
        })}
        {K(priceCheckMode ? '✓ PRICE CHECK ON' : 'PRICE CHECK', 'F6', null, () => setPriceCheckMode((v) => !v))}
        {K('VOID LINE', 'F7', 'red', () => {
          if (cart.length > 0) removeFromCart(cart[cart.length - 1].product_id);
        })}

        <div style={styles.sec}>Sale</div>
        {K('% DISCOUNT', 'F4 — needs mgr', null, () => {
          window.dispatchEvent(new CustomEvent('pewil-pos-discount'));
        })}
        {K('SUSPEND', 'F8 — park sale', null, handleSuspendSale)}
        {K('MANAGER', 'F9 — override', null, () => {
          window.dispatchEvent(new CustomEvent('pewil-pos-manager'));
        })}

        <div style={styles.sec}>Payment</div>
        {K('CASH', 'F10', 'blue', () => { handleCompleteSale(); })}
        {K('CARD', 'F11', 'blue', () => { handleCompleteSale(); })}
        {K('ECOCASH', 'F12', 'blue', () => { handleCompleteSale(); })}

        <div style={{ flex: 1 }} />
        {K('✓ FINALISE SALE', null, 'green', handleCompleteSale)}
      </div>
    </div>
  );
}

const styles = {
  shell: {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    height: '100%',
    width: '100%',
    background: '#fff',
    overflow: 'hidden',
    fontFamily: "'Segoe UI', Tahoma, sans-serif",
  },
  main: { display: 'flex', flexDirection: 'column', background: '#fff', minWidth: 0 },
  head: {
    background: 'linear-gradient(#e31e24, #b91c1c)',
    color: '#fff',
    padding: '16px 28px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '4px solid #1a56db',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
  },
  brand: { fontWeight: 900, fontSize: 22, letterSpacing: '0.06em' },
  branch: { fontWeight: 500, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#fecaca', marginTop: 3 },
  laneBox: { fontSize: 12, textAlign: 'right', lineHeight: 1.4 },
  gridHead: {
    display: 'grid',
    gridTemplateColumns: '90px 1fr 90px 120px 140px',
    background: '#1e293b',
    color: '#fff',
    fontSize: 12,
    fontWeight: 800,
    padding: '10px 24px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  lines: { flex: 1, overflow: 'auto', background: '#fff', padding: '4px 0', minHeight: 0 },
  row: {
    display: 'grid',
    gridTemplateColumns: '90px 1fr 90px 120px 140px',
    padding: '12px 24px',
    fontFamily: "'Consolas', 'Courier New', monospace",
    fontSize: 17,
    borderBottom: '1px dotted #e2e8f0',
    color: '#0f172a',
    cursor: 'pointer',
  },
  sku: { color: '#64748b', fontWeight: 600 },
  desc: { fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  num: { textAlign: 'right' },
  tag: {
    display: 'inline-block', fontSize: 11, padding: '2px 7px', borderRadius: 3,
    marginLeft: 10, verticalAlign: 'middle', fontFamily: 'sans-serif', fontWeight: 800,
    letterSpacing: '0.04em',
  },
  tagAge: { background: '#fee2e2', color: '#991b1b' },
  tagW: { background: '#d1fae5', color: '#065f46' },
  emptyHint: { textAlign: 'center', padding: '80px 20px', color: '#64748b' },
  scanBar: {
    padding: '14px 24px',
    background: '#e2e8f0',
    borderTop: '1px solid #cbd5e1',
    display: 'flex',
    gap: 12,
    alignItems: 'center',
  },
  scanLbl: { fontSize: 12, color: '#475569', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' },
  scanInput: {
    flex: 1,
    padding: '14px 16px',
    border: '2px solid #1a56db',
    borderRadius: 6,
    fontFamily: "'Consolas', monospace",
    fontSize: 20,
    outline: 'none',
    background: '#fff',
    color: '#0f172a',
    fontWeight: 600,
  },
  statusPill: {
    fontSize: 12, padding: '6px 12px', borderRadius: 4, background: '#16a34a', color: '#fff', fontWeight: 800,
    letterSpacing: '0.04em',
  },
  totals: {
    background: '#0f172a',
    color: '#fff',
    padding: '20px 28px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1.6fr',
    gap: 24,
    borderTop: '4px solid #e31e24',
  },
  cell: { textAlign: 'right' },
  cellLbl: { fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', fontWeight: 800 },
  cellVal: { fontSize: 22, fontWeight: 800, fontFamily: "'Consolas', monospace", marginTop: 4 },
  cellTotal: {},
  cellTotalVal: { fontSize: 52, color: '#facc15', fontWeight: 900, letterSpacing: '0.02em', fontFamily: "'Consolas', monospace", marginTop: 2, lineHeight: 1 },
  dyn: {
    background: '#f1f5f9',
    borderLeft: '1px solid #cbd5e1',
    display: 'flex',
    flexDirection: 'column',
    padding: 14,
    overflowY: 'auto',
  },
  sec: { fontSize: 10, color: '#64748b', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', padding: '10px 4px 8px' },
};
