import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

/* ─── Styles ─── */
const S = {
  page: { maxWidth: 1200, margin: '0 auto', padding: '20px' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 24,
    fontWeight: 700,
    color: '#111827',
    margin: 0,
  },
  button: {
    background: '#1a6b3a',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '8px 16px',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
  banner: {
    background: '#EFF6FF',
    border: '1px solid #93c5fd',
    borderRadius: 8,
    padding: '8px 12px',
    fontSize: 10,
    color: '#1e3a5f',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: '#111827',
    marginBottom: 12,
    marginTop: 20,
  },
  currencyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 10,
    marginBottom: 20,
  },
  currencyCard: (borderColor) => ({
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 10,
    padding: 16,
    borderLeft: `4px solid ${borderColor}`,
  }),
  currencyHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  currencyFlag: {
    fontSize: 20,
  },
  currencyName: {
    fontSize: 12,
    fontWeight: 600,
    color: '#111827',
  },
  currencyLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
  pill: (bgColor, textColor) => ({
    display: 'inline-block',
    fontSize: 8,
    fontWeight: 700,
    padding: '2px 7px',
    borderRadius: 20,
    textTransform: 'uppercase',
    background: bgColor,
    color: textColor,
    marginLeft: 'auto',
  }),
  currencyRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    fontSize: 11,
  },
  currencyValue: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 16,
    fontWeight: 700,
    color: '#111827',
  },
  card: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 11,
  },
  th: {
    textAlign: 'left',
    padding: '7px 8px',
    fontSize: 8,
    fontWeight: 700,
    color: '#9ca3af',
    textTransform: 'uppercase',
    borderBottom: '1px solid #e5e7eb',
    background: '#f9fafb',
  },
  td: {
    padding: '7px 8px',
    borderBottom: '1px solid #f3f4f6',
    color: '#374151',
    fontSize: 11,
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: 600,
    color: '#111827',
    marginBottom: 6,
    display: 'block',
  },
  select: {
    width: '100%',
    padding: '6px 8px',
    border: '1px solid #e5e7eb',
    borderRadius: 6,
    fontSize: 11,
    marginBottom: 12,
  },
  toggle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottom: '1px solid #f3f4f6',
  },
  toggleLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: '#111827',
  },
  toggleSwitch: {
    width: 40,
    height: 22,
    borderRadius: 11,
    background: '#e5e7eb',
    cursor: 'pointer',
    position: 'relative',
    border: 'none',
    transition: 'background 0.2s',
  },
  toggleSwitchOn: {
    background: '#1a6b3a',
  },
  toggleSlider: (isOn) => ({
    position: 'absolute',
    top: 2,
    left: isOn ? 20 : 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    background: '#fff',
    transition: 'left 0.2s',
  }),
  infoText: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 8,
    lineHeight: 1.4,
  },
  infoBox: {
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: 6,
    padding: 8,
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.4,
  },
};

export default function MultiCurrency({ onTabChange }) {
  const { user } = useAuth() || {};
  const [defaultCurrency, setDefaultCurrency] = useState('USD');
  const [acceptZiG, setAcceptZiG] = useState(true);
  const [acceptBondNotes, setAcceptBondNotes] = useState(true);
  const [dualPricing, setDualPricing] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [roundingRule, setRoundingRule] = useState('0.05');
  const [tolerance, setTolerance] = useState('2');

  const isOwner = user?.role === 'owner';

  const ToggleSwitch = ({ value, onChange }) => (
    <button
      style={{
        ...S.toggleSwitch,
        ...(value ? S.toggleSwitchOn : {}),
      }}
      onClick={() => onChange(!value)}
    >
      <div style={S.toggleSlider(value)} />
    </button>
  );

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <h1 style={S.headerTitle}>Currency Management</h1>
        {isOwner && <button style={S.button}>Update Rates</button>}
      </div>

      {/* Info Banner */}
      <div style={S.banner}>
        Zimbabwe operates a multi-currency system. Configure exchange rates to accept payments in USD, ZiG, and other currencies. Base currency: USD.
      </div>

      {/* Active Currencies */}
      <h3 style={S.sectionTitle}>Active Currencies</h3>
      <div style={S.currencyGrid}>
        {/* USD Card */}
        <div style={S.currencyCard('#1a6b3a')}>
          <div style={S.currencyHeader}>
            <span style={S.currencyFlag}>🇺🇸</span>
            <div>
              <div style={S.currencyName}>USD</div>
              <div style={S.currencyLabel}>United States Dollar</div>
            </div>
            <div style={S.pill('#e8f5ee', '#1a6b3a')}>Base Currency</div>
          </div>
          <div style={S.currencyRow}>
            <span>Rate:</span>
            <span style={S.currencyValue}>1.00</span>
          </div>
          <div style={S.currencyRow}>
            <span>Today's Sales:</span>
            <span style={S.currencyValue}>$1,240.00</span>
          </div>
        </div>

        {/* ZiG Card */}
        <div style={S.currencyCard('#c97d1a')}>
          <div style={S.currencyHeader}>
            <span style={S.currencyFlag}>🇿🇼</span>
            <div>
              <div style={S.currencyName}>ZiG</div>
              <div style={S.currencyLabel}>Zimbabwe Gold</div>
            </div>
            <div style={S.pill('#e8f5ee', '#1a6b3a')}>Active</div>
          </div>
          <div style={S.currencyRow}>
            <span>Rate:</span>
            <span style={S.currencyValue}>13.56</span>
          </div>
          <div style={S.currencyRow}>
            <span>Today's Sales:</span>
            <span style={S.currencyValue}>ZiG 4,820.00</span>
          </div>
          <div style={{ fontSize: 10, color: '#6b7280' }}>($355.46 USD)</div>
        </div>

        {/* Bond Notes Card */}
        <div style={S.currencyCard('#9ca3af')}>
          <div style={S.currencyHeader}>
            <span style={S.currencyFlag}>📄</span>
            <div>
              <div style={S.currencyName}>Bond Notes</div>
              <div style={S.currencyLabel}>Legacy Currency</div>
            </div>
            <div style={S.pill('#fef3e2', '#b45309')}>Limited</div>
          </div>
          <div style={S.currencyRow}>
            <span>Rate:</span>
            <span style={S.currencyValue}>1.00</span>
          </div>
          <div style={S.currencyRow}>
            <span>Today's Sales:</span>
            <span style={S.currencyValue}>$0.00</span>
          </div>
        </div>
      </div>

      {/* Exchange Rate History */}
      <h3 style={S.sectionTitle}>Exchange Rate History</h3>
      <div style={S.card}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Date</th>
              <th style={S.th}>USD/ZiG Rate</th>
              <th style={S.th}>Source</th>
              <th style={S.th}>Updated By</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={S.td}>12 Apr 2026</td>
              <td style={S.td}>13.56</td>
              <td style={S.td}>RBZ Official</td>
              <td style={S.td}>System</td>
            </tr>
            <tr>
              <td style={S.td}>11 Apr 2026</td>
              <td style={S.td}>13.52</td>
              <td style={S.td}>RBZ Official</td>
              <td style={S.td}>System</td>
            </tr>
            <tr>
              <td style={S.td}>10 Apr 2026</td>
              <td style={S.td}>13.48</td>
              <td style={S.td}>RBZ Official</td>
              <td style={S.td}>System</td>
            </tr>
            <tr>
              <td style={S.td}>9 Apr 2026</td>
              <td style={S.td}>13.45</td>
              <td style={S.td}>Manual</td>
              <td style={S.td}>James (Owner)</td>
            </tr>
            <tr>
              <td style={S.td}>8 Apr 2026</td>
              <td style={S.td}>13.42</td>
              <td style={S.td}>RBZ Official</td>
              <td style={S.td}>System</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Two-column Settings */}
      <h3 style={S.sectionTitle}>Settings</h3>
      <div style={S.twoCol}>
        {/* POS Currency Settings */}
        <div style={S.card}>
          <h4 style={{ fontSize: 12, fontWeight: 700, color: '#111827', marginTop: 0, marginBottom: 12 }}>
            POS Currency Settings
          </h4>

          <label style={S.label}>Default POS Currency</label>
          <select
            style={S.select}
            value={defaultCurrency}
            onChange={(e) => setDefaultCurrency(e.target.value)}
          >
            <option>USD</option>
            <option>ZiG</option>
            <option>Bond Notes</option>
          </select>

          <div style={S.toggle}>
            <span style={S.toggleLabel}>Accept ZiG payments</span>
            <ToggleSwitch value={acceptZiG} onChange={setAcceptZiG} />
          </div>

          <div style={S.toggle}>
            <span style={S.toggleLabel}>Accept Bond Notes</span>
            <ToggleSwitch value={acceptBondNotes} onChange={setAcceptBondNotes} />
          </div>

          <div style={S.toggle}>
            <span style={S.toggleLabel}>Show dual pricing on receipts</span>
            <ToggleSwitch value={dualPricing} onChange={setDualPricing} />
          </div>

          <div style={{ ...S.toggle, borderBottom: 'none' }}>
            <span style={S.toggleLabel}>Auto-update rates from RBZ</span>
            <ToggleSwitch value={autoUpdate} onChange={setAutoUpdate} />
          </div>
        </div>

        {/* Settlement Rules */}
        <div style={S.card}>
          <h4 style={{ fontSize: 12, fontWeight: 700, color: '#111827', marginTop: 0, marginBottom: 12 }}>
            Settlement Rules
          </h4>

          <div style={S.infoText}>All settlements in base currency (USD)</div>
          <div style={S.infoText}>ZiG payments converted at daily rate</div>

          <label style={S.label}>Rounding Rule</label>
          <select
            style={S.select}
            value={roundingRule}
            onChange={(e) => setRoundingRule(e.target.value)}
          >
            <option value="0.05">Round to nearest $0.05</option>
            <option value="0.01">Round to nearest $0.01</option>
            <option value="0.10">Round to nearest $0.10</option>
          </select>

          <label style={S.label}>Currency Mismatch Tolerance</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <input
              type="text"
              value={tolerance}
              onChange={(e) => setTolerance(e.target.value)}
              style={{ ...S.select, marginBottom: 0, flex: 1 }}
            />
            <span style={{ fontSize: 11, color: '#6b7280' }}>%</span>
          </div>

          <div style={S.infoBox}>
            EcoCash transactions settle in ZiG at daily rate. Cash and card transactions settle in the currency received.
          </div>
        </div>
      </div>
    </div>
  );
}
