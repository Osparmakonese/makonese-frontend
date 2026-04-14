/**
 * ScannerLanePOS.js — Pick n Pay / SAP CAR scanner-lane render for POS.
 *
 * This is the visual layout the owner approved in v3 mockup:
 *   - Red Pick n Pay header (MAKONESE RETAIL · lane info)
 *   - Center: scrolling receipt-style line list (monospace, ALL-CAPS descriptions,
 *     columns: SKU / Description / Qty / Unit / Line total)
 *   - Scan bar at bottom (blue border) + online status pill
 *   - Black totals panel with big yellow TOTAL DUE
 *   - Right rail: DynaKey function strip (Line actions, Sale, Payment, Keypad)
 *     plus a big green FINALISE SALE button at the bottom
 *
 * All cart state & handlers are passed in as props so this view shares the same
 * business logic as the default layout.
 */
import React from 'react';
import { fmt } from '../utils/format';

const K = (label, sub, variant, onClick) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      padding: variant === 'big' ? '20px 10px' : '12px 10px',
      border: '1px solid ' +
        (variant === 'blue' ? '#1a56db'
        : variant === 'red' ? '#b91c1c'
        : variant === 'green' ? '#15803d'
        : '#cbd5e1'),
      borderRadius: 6,
      background:
        variant === 'blue' ? '#1a56db'
        : variant === 'red' ? '#e31e24'
        : variant === 'green' ? '#16a34a'
        : '#fff',
      color: (variant === 'blue' || variant === 'red' || variant === 'green') ? '#fff' : '#0f172a',
      fontSize: variant === 'big' ? 16 : 12,
      fontWeight: 700,
      textAlign: 'center',
      cursor: 'pointer',
      marginBottom: 6,
      boxShadow: '0 1px 0 #e2e8f0',
      width: '100%',
      lineHeight: 1.2,
    }}
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
        marginTop: 2,
      }}>
        {sub}
      </div>
    )}
  </button>
);

export default function ScannerLanePOS({
  // cart + products
  cart, removeFromCart, updateCartQty,
  // barcode / scan
  barcode, setBarcode, handleBarcodeSubmit, barcodeInputRef,
  // totals
  subtotal, discountAmount, taxAmount, grandTotal,
  // actions
  handleCompleteSale, handleSuspendSale,
  priceCheckMode, setPriceCheckMode,
  // status
  offline, pendingCount,
  // user / session
  user, laneLabel,
  // tenant name for header
  brandName,
}) {
  const itemCount = cart.reduce((n, i) => n + (i.quantity || 0), 0);
  // VAT 15% shown as information only; your tax logic stays in handleCompleteSale.
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
            <div style={{ fontSize: 14, fontWeight: 700 }}>{laneLabel || 'Lane 01'}</div>
            <div style={{ fontSize: 11, opacity: 0.9 }}>
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

        {/* Line items — receipt style */}
        <div style={styles.lines}>
          {cart.length === 0 ? (
            <div style={styles.emptyHint}>
              <div style={{ fontSize: 40, opacity: 0.3 }}>⌨</div>
              <div style={{ marginTop: 8, fontSize: 13, color: '#64748b' }}>
                Waiting for first scan…
              </div>
              <div style={{ marginTop: 4, fontSize: 11, color: '#94a3b8' }}>
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
                  <span style={{ ...styles.num, fontWeight: 700 }}>{fmt(lineTotal)}</span>
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

        {/* Totals panel — big yellow TOTAL DUE */}
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
    gridTemplateColumns: '1fr 260px',
    height: '100%',
    background: '#fff',
    border: '1px solid #cbd5e1',
    borderRadius: 10,
    overflow: 'hidden',
    margin: 8,
    boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
    fontFamily: "'Segoe UI', Tahoma, sans-serif",
  },
  main: { display: 'flex', flexDirection: 'column', background: '#fff', minWidth: 0 },
  head: {
    background: 'linear-gradient(#e31e24, #b91c1c)',
    color: '#fff',
    padding: '10px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '3px solid #1a56db',
  },
  brand: { fontWeight: 800, fontSize: 16, letterSpacing: '0.04em' },
  branch: { fontWeight: 400, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#fecaca', marginTop: 2 },
  laneBox: { fontSize: 12, textAlign: 'right', lineHeight: 1.4 },
  gridHead: {
    display: 'grid',
    gridTemplateColumns: '70px 1fr 70px 90px 110px',
    background: '#1e293b',
    color: '#fff',
    fontSize: 11,
    fontWeight: 700,
    padding: '6px 12px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  lines: { flex: 1, overflow: 'auto', background: '#fff', padding: '2px 0', minHeight: 0 },
  row: {
    display: 'grid',
    gridTemplateColumns: '70px 1fr 70px 90px 110px',
    padding: '7px 12px',
    fontFamily: "'Consolas', 'Courier New', monospace",
    fontSize: 14,
    borderBottom: '1px dotted #e2e8f0',
    color: '#0f172a',
    cursor: 'pointer',
  },
  sku: { color: '#64748b' },
  desc: { fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  num: { textAlign: 'right' },
  tag: {
    display: 'inline-block', fontSize: 10, padding: '1px 5px', borderRadius: 3,
    marginLeft: 8, verticalAlign: 'middle', fontFamily: 'sans-serif', fontWeight: 700,
  },
  tagAge: { background: '#fee2e2', color: '#991b1b' },
  tagW: { background: '#d1fae5', color: '#065f46' },
  emptyHint: { textAlign: 'center', padding: '40px 20px', color: '#64748b' },
  scanBar: {
    padding: '8px 12px',
    background: '#e2e8f0',
    borderTop: '1px solid #cbd5e1',
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  scanLbl: { fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' },
  scanInput: {
    flex: 1,
    padding: '10px 12px',
    border: '2px solid #1a56db',
    borderRadius: 4,
    fontFamily: "'Consolas', monospace",
    fontSize: 16,
    outline: 'none',
    background: '#fff',
    color: '#0f172a',
  },
  statusPill: {
    fontSize: 11, padding: '4px 8px', borderRadius: 4, background: '#16a34a', color: '#fff', fontWeight: 700,
  },
  totals: {
    background: '#0f172a',
    color: '#fff',
    padding: '14px 18px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1.4fr',
    gap: 16,
    borderTop: '3px solid #e31e24',
  },
  cell: { textAlign: 'right' },
  cellLbl: { fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', fontWeight: 700 },
  cellVal: { fontSize: 18, fontWeight: 700, fontFamily: "'Consolas', monospace", marginTop: 2 },
  cellTotal: {},
  cellTotalVal: { fontSize: 34, color: '#facc15', fontWeight: 900, letterSpacing: '0.02em', fontFamily: "'Consolas', monospace", marginTop: 2 },
  dyn: {
    background: '#f1f5f9',
    borderLeft: '1px solid #cbd5e1',
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    overflowY: 'auto',
  },
  sec: { fontSize: 10, color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '8px 4px 6px' },
};
