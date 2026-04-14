/**
 * ScannerLanePOS.js — modern scanner-lane POS layout.
 *
 * Design language: Stripe Terminal × Toast × Square. Clean neutral canvas,
 * system font stack, soft shadows, generous whitespace, one accent color
 * (emerald). No gradients, no monospace ALL-CAPS. Feels like premium
 * 2025-era retail software, not 2006-era Pick n Pay CAR.
 *
 *   - Slim light header with brand wordmark + live lane status chip
 *   - Line items as spaced rows with quiet SKU chip + readable product name
 *   - Floating scan bar with focus ring
 *   - Totals summary card (right rail top): subtotal / VAT / TOTAL stacked
 *   - Action pad (right rail bottom): grouped secondary actions + primary
 *     payment buttons (emerald) and a big primary "Complete sale" CTA
 */
import React from 'react';
import { fmt } from '../utils/format';

const C = {
  bg: '#f7f8fa',
  card: '#ffffff',
  border: '#e5e7eb',
  border2: '#d1d5db',
  text: '#0f172a',
  textMuted: '#64748b',
  textFaint: '#94a3b8',
  accent: '#059669',        // emerald 600 — single accent
  accentHover: '#047857',   // emerald 700
  accentSoft: '#ecfdf5',    // emerald 50
  danger: '#dc2626',
  dangerSoft: '#fef2f2',
  warn: '#d97706',
  warnSoft: '#fffbeb',
  info: '#2563eb',
  infoSoft: '#eff6ff',
};

/* ── reusable button ────────────────────────────────────────────── */
function Btn({ children, kind = 'ghost', size = 'md', onClick, title, icon, full = false }) {
  const palette = {
    ghost:   { bg: '#fff',         fg: C.text,      bd: C.border,   hoverBg: '#f3f4f6' },
    soft:    { bg: '#f3f4f6',      fg: C.text,      bd: 'transparent', hoverBg: '#e5e7eb' },
    danger:  { bg: C.dangerSoft,   fg: C.danger,    bd: '#fecaca',  hoverBg: '#fee2e2' },
    primary: { bg: C.accent,       fg: '#fff',      bd: C.accent,   hoverBg: C.accentHover },
    info:    { bg: C.infoSoft,     fg: C.info,      bd: '#bfdbfe',  hoverBg: '#dbeafe' },
    warn:    { bg: C.warnSoft,     fg: C.warn,      bd: '#fde68a',  hoverBg: '#fef3c7' },
  }[kind];
  const pad = size === 'lg' ? '14px 16px' : size === 'sm' ? '8px 10px' : '11px 14px';
  const fs  = size === 'lg' ? 15 : size === 'sm' ? 12 : 13;
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={{
        padding: pad,
        border: `1px solid ${palette.bd}`,
        borderRadius: 10,
        background: palette.bg,
        color: palette.fg,
        fontSize: fs,
        fontWeight: 600,
        cursor: 'pointer',
        width: full ? '100%' : undefined,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        transition: 'background 0.12s, border-color 0.12s, transform 0.05s',
        letterSpacing: '0.01em',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = palette.hoverBg)}
      onMouseLeave={(e) => (e.currentTarget.style.background = palette.bg)}
      onMouseDown={(e) => (e.currentTarget.style.transform = 'translateY(1px)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      {icon && <span style={{ fontSize: fs + 2, lineHeight: 1 }}>{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

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
      {/* ========== LEFT column ========== */}
      <div style={styles.main}>
        {/* Header */}
        <header style={styles.head}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={styles.logoMark}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>
                {(brandName || 'M')[0]}
              </span>
            </div>
            <div>
              <div style={styles.brandName}>{brandName || 'Makonese Retail'}</div>
              <div style={styles.brandSub}>Point of Sale · Scanner Lane</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              ...styles.statusChip,
              background: offline ? C.dangerSoft : C.accentSoft,
              color: offline ? C.danger : C.accent,
              borderColor: offline ? '#fecaca' : '#a7f3d0',
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: offline ? C.danger : C.accent,
                boxShadow: offline ? 'none' : `0 0 0 3px ${C.accentSoft}`,
              }} />
              {offline ? 'Offline' : 'Online'}
              {pendingCount > 0 && (
                <span style={{ marginLeft: 4, opacity: 0.7 }}>· {pendingCount} queued</span>
              )}
            </div>
            <div style={styles.laneChip}>
              <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{laneLabel || 'Lane 01'}</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 1 }}>
                {user?.username || 'Cashier'} · {dateStr} · {timeStr}
              </div>
            </div>
          </div>
        </header>

        {/* Line items list */}
        <div style={styles.listWrap}>
          <div style={styles.listHeadRow}>
            <span style={{ width: 70 }}>Item</span>
            <span style={{ flex: 1, marginLeft: 12 }}>Product</span>
            <span style={{ width: 90, textAlign: 'right' }}>Qty</span>
            <span style={{ width: 100, textAlign: 'right' }}>Unit</span>
            <span style={{ width: 110, textAlign: 'right' }}>Amount</span>
            <span style={{ width: 36 }} />
          </div>

          <div style={styles.list}>
            {cart.length === 0 ? (
              <div style={styles.empty}>
                <div style={styles.emptyIcon}>
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: C.textFaint }}>
                    <path d="M3 5h18M6 5v14a2 2 0 002 2h8a2 2 0 002-2V5M9 5V3a1 1 0 011-1h4a1 1 0 011 1v2" />
                  </svg>
                </div>
                <div style={styles.emptyTitle}>Ready to scan</div>
                <div style={styles.emptySub}>
                  Scan a barcode or use the action pad on the right to start a sale.
                </div>
              </div>
            ) : (
              cart.map((item) => {
                const lineTotal = item.unit_price * item.quantity;
                const ageTag = item.product?.is_age_restricted;
                const weighTag = item.product?.is_weighable;
                return (
                  <div
                    key={item.product_id}
                    style={styles.row}
                    onDoubleClick={() => removeFromCart(item.product_id)}
                    title="Double-click to remove"
                  >
                    <span style={styles.skuChip}>{item.product_id}</span>
                    <span style={styles.desc}>
                      <span style={styles.descName}>{item.name}</span>
                      <span style={styles.tagRow}>
                        {weighTag && (
                          <span style={{ ...styles.tag, ...styles.tagW }}>
                            ⚖ {Number(item.quantity).toFixed(3)} kg
                          </span>
                        )}
                        {ageTag && (
                          <span style={{ ...styles.tag, ...styles.tagAge }}>18+ Verified</span>
                        )}
                      </span>
                    </span>
                    <span style={styles.qtyCell}>
                      <button
                        type="button"
                        style={styles.qtyBtn}
                        onClick={() => updateCartQty(item.product_id, Math.max(1, (item.quantity | 0) - 1))}
                        disabled={weighTag}
                      >−</button>
                      <span style={styles.qtyVal}>
                        {weighTag ? Number(item.quantity).toFixed(3) : item.quantity}
                      </span>
                      <button
                        type="button"
                        style={styles.qtyBtn}
                        onClick={() => updateCartQty(item.product_id, (item.quantity | 0) + 1)}
                        disabled={weighTag}
                      >+</button>
                    </span>
                    <span style={styles.num}>${fmt(item.unit_price)}</span>
                    <span style={{ ...styles.num, ...styles.lineTotal }}>${fmt(lineTotal)}</span>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product_id)}
                      style={styles.removeBtn}
                      title="Remove line"
                    >×</button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Scan bar */}
        <div style={styles.scanBar}>
          <div style={styles.scanIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2M7 8v8M11 8v8M15 8v8M19 8v8" />
            </svg>
          </div>
          <input
            ref={barcodeInputRef}
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyDown={handleBarcodeSubmit}
            placeholder={priceCheckMode ? 'Price check — scan without adding to sale…' : 'Scan barcode or type SKU and press Enter'}
            style={styles.scanInput}
            autoFocus
          />
          {priceCheckMode && (
            <span style={styles.priceCheckBadge}>Price check</span>
          )}
        </div>
      </div>

      {/* ========== RIGHT column ========== */}
      <aside style={styles.rail}>
        {/* Totals card */}
        <div style={styles.totalsCard}>
          <div style={styles.totalsRow}>
            <span style={styles.totalsLbl}>Items</span>
            <span style={styles.totalsVal}>{itemCount}</span>
          </div>
          <div style={styles.totalsRow}>
            <span style={styles.totalsLbl}>Subtotal</span>
            <span style={styles.totalsVal}>${fmt(subtotal)}</span>
          </div>
          {discountAmount > 0 && (
            <div style={styles.totalsRow}>
              <span style={{ ...styles.totalsLbl, color: C.warn }}>Discount</span>
              <span style={{ ...styles.totalsVal, color: C.warn }}>−${fmt(discountAmount)}</span>
            </div>
          )}
          <div style={styles.totalsRow}>
            <span style={styles.totalsLbl}>VAT 15%</span>
            <span style={styles.totalsVal}>${fmt(vatShown)}</span>
          </div>
          <div style={styles.divider} />
          <div style={styles.grandRow}>
            <span style={styles.grandLbl}>Total due</span>
            <span style={styles.grandVal}>${fmt(grandTotal)}</span>
          </div>
        </div>

        {/* Actions */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Line actions</div>
          <div style={styles.grid2}>
            <Btn
              kind="ghost"
              icon="⋯"
              onClick={() => {
                if (cart.length === 0) return;
                const last = cart[cart.length - 1];
                const raw = window.prompt(`Quantity for ${last.name}:`, String(last.quantity));
                if (raw == null) return;
                const n = parseInt(raw, 10);
                if (Number.isFinite(n) && n > 0) updateCartQty(last.product_id, n);
              }}
              full
            >Change qty</Btn>
            <Btn
              kind={priceCheckMode ? 'info' : 'ghost'}
              icon="🔍"
              onClick={() => setPriceCheckMode((v) => !v)}
              full
            >{priceCheckMode ? 'Price check on' : 'Price check'}</Btn>
            <Btn
              kind="danger"
              icon="⌫"
              onClick={() => { if (cart.length > 0) removeFromCart(cart[cart.length - 1].product_id); }}
              full
            >Void line</Btn>
            <Btn
              kind="warn"
              icon="%"
              onClick={() => window.dispatchEvent(new CustomEvent('pewil-pos-discount'))}
              full
            >Discount</Btn>
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>Sale</div>
          <div style={styles.grid2}>
            <Btn
              kind="soft"
              icon="⏸"
              onClick={handleSuspendSale}
              full
            >Suspend</Btn>
            <Btn
              kind="soft"
              icon="🔐"
              onClick={() => window.dispatchEvent(new CustomEvent('pewil-pos-manager'))}
              full
            >Manager</Btn>
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>Payment</div>
          <div style={styles.grid3}>
            <Btn kind="ghost" icon="💵" onClick={handleCompleteSale} full>Cash</Btn>
            <Btn kind="ghost" icon="💳" onClick={handleCompleteSale} full>Card</Btn>
            <Btn kind="ghost" icon="📱" onClick={handleCompleteSale} full>EcoCash</Btn>
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 0 }} />

        {/* Primary CTA */}
        <button
          type="button"
          onClick={handleCompleteSale}
          disabled={cart.length === 0}
          style={{
            ...styles.cta,
            opacity: cart.length === 0 ? 0.5 : 1,
            cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
          }}
          onMouseEnter={(e) => { if (cart.length > 0) e.currentTarget.style.background = C.accentHover; }}
          onMouseLeave={(e) => (e.currentTarget.style.background = C.accent)}
        >
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '0.02em' }}>
            Complete sale
          </span>
          <span style={{ fontSize: 22, fontWeight: 800, marginLeft: 12 }}>
            ${fmt(grandTotal)}
          </span>
        </button>
      </aside>
    </div>
  );
}

/* ─────────────────────────── styles ─────────────────────────── */
const fontStack = "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, system-ui, sans-serif";

const styles = {
  shell: {
    display: 'grid',
    gridTemplateColumns: '1fr 360px',
    gap: 18,
    height: '100%',
    width: '100%',
    background: C.bg,
    padding: 18,
    fontFamily: fontStack,
    color: C.text,
    overflow: 'hidden',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    background: C.card,
    borderRadius: 16,
    border: `1px solid ${C.border}`,
    boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
    minWidth: 0,
    overflow: 'hidden',
  },
  head: {
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `1px solid ${C.border}`,
    background: C.card,
  },
  logoMark: {
    width: 36, height: 36, borderRadius: 10,
    background: `linear-gradient(135deg, ${C.accent}, ${C.accentHover})`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 10px rgba(5,150,105,0.25)',
  },
  brandName: { fontWeight: 700, fontSize: 15, color: C.text, letterSpacing: '-0.01em' },
  brandSub: { fontSize: 11.5, color: C.textMuted, marginTop: 1 },
  statusChip: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '5px 10px',
    border: '1px solid',
    borderRadius: 999,
    fontSize: 11.5, fontWeight: 600,
    letterSpacing: '0.02em',
  },
  laneChip: {
    padding: '6px 12px',
    background: '#f8fafc',
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    textAlign: 'right',
    lineHeight: 1.3,
  },

  listWrap: { flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' },
  listHeadRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    fontSize: 11,
    fontWeight: 700,
    color: C.textMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    borderBottom: `1px solid ${C.border}`,
    background: '#fafbfc',
  },
  list: { flex: 1, overflow: 'auto', padding: '4px 0' },
  row: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 20px',
    borderBottom: `1px solid #f1f5f9`,
    transition: 'background 0.12s',
    cursor: 'pointer',
  },
  skuChip: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 62, padding: '3px 0',
    fontSize: 11, fontFamily: "'SF Mono', 'Menlo', ui-monospace, monospace",
    color: C.textMuted, background: '#f3f4f6',
    borderRadius: 6, fontWeight: 600,
  },
  desc: { flex: 1, marginLeft: 12, display: 'flex', flexDirection: 'column', minWidth: 0 },
  descName: {
    fontSize: 14.5, fontWeight: 600, color: C.text,
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
    letterSpacing: '-0.005em',
  },
  tagRow: { display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' },
  tag: {
    display: 'inline-flex', alignItems: 'center', gap: 3,
    fontSize: 10.5, padding: '2px 8px', borderRadius: 999,
    fontWeight: 600, letterSpacing: '0.01em',
  },
  tagAge: { background: C.dangerSoft, color: C.danger },
  tagW: { background: C.accentSoft, color: C.accent },
  qtyCell: {
    width: 90, display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4,
  },
  qtyBtn: {
    width: 26, height: 26, border: `1px solid ${C.border}`, borderRadius: 6,
    background: '#fff', color: C.text, fontSize: 14, fontWeight: 700,
    cursor: 'pointer', lineHeight: 1,
  },
  qtyVal: {
    minWidth: 24, textAlign: 'center',
    fontSize: 14, fontWeight: 600, color: C.text, fontVariantNumeric: 'tabular-nums',
  },
  num: {
    width: 100, textAlign: 'right',
    fontSize: 14, fontWeight: 500, color: C.textMuted,
    fontVariantNumeric: 'tabular-nums',
  },
  lineTotal: { width: 110, color: C.text, fontWeight: 700 },
  removeBtn: {
    width: 28, height: 28, marginLeft: 8,
    border: 'none', borderRadius: 8, background: 'transparent',
    color: C.textFaint, fontSize: 18, cursor: 'pointer', lineHeight: 1,
  },

  empty: { textAlign: 'center', padding: '80px 20px' },
  emptyIcon: { display: 'flex', justifyContent: 'center', marginBottom: 14 },
  emptyTitle: { fontSize: 16, fontWeight: 700, color: C.text, letterSpacing: '-0.01em' },
  emptySub: { fontSize: 13, color: C.textMuted, marginTop: 6, maxWidth: 320, margin: '6px auto 0' },

  scanBar: {
    padding: '14px 18px',
    borderTop: `1px solid ${C.border}`,
    background: '#fafbfc',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  scanIcon: {
    width: 38, height: 38,
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: C.textMuted,
  },
  scanInput: {
    flex: 1,
    padding: '12px 14px',
    border: `1px solid ${C.border2}`,
    borderRadius: 10,
    fontFamily: fontStack,
    fontSize: 15,
    outline: 'none',
    background: C.card,
    color: C.text,
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },
  priceCheckBadge: {
    fontSize: 11, fontWeight: 700, padding: '5px 10px', borderRadius: 999,
    background: C.infoSoft, color: C.info, letterSpacing: '0.02em',
  },

  /* right rail */
  rail: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    minWidth: 0,
    overflow: 'auto',
  },
  totalsCard: {
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 16,
    padding: 18,
    boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
  },
  totalsRow: {
    display: 'flex', justifyContent: 'space-between',
    padding: '6px 0', fontSize: 13,
  },
  totalsLbl: { color: C.textMuted, fontWeight: 500 },
  totalsVal: { color: C.text, fontWeight: 600, fontVariantNumeric: 'tabular-nums' },
  divider: { height: 1, background: C.border, margin: '10px 0' },
  grandRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' },
  grandLbl: { fontSize: 13, color: C.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' },
  grandVal: {
    fontSize: 32, fontWeight: 800, color: C.text,
    letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums',
  },

  section: {
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 14,
    padding: 14,
    boxShadow: '0 1px 3px rgba(15,23,42,0.03)',
  },
  sectionTitle: {
    fontSize: 11, fontWeight: 700, color: C.textMuted,
    textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10,
  },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 },

  cta: {
    padding: '18px 20px',
    border: 'none',
    borderRadius: 14,
    background: C.accent,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 6px 16px rgba(5,150,105,0.28)',
    transition: 'background 0.15s, transform 0.08s',
    fontFamily: fontStack,
    width: '100%',
  },
};
