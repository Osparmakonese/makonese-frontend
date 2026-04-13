import React from 'react';

const SAMPLE_INVOICES = [
  { date: '1 Apr 2026', amount: '$10.00', status: 'Paid' },
  { date: '1 Mar 2026', amount: '$10.00', status: 'Paid' },
  { date: '1 Feb 2026', amount: '$10.00', status: 'Paid' },
];

const styles = {
  page: { maxWidth: 1200, margin: '0 auto', padding: 20 },
  hero: {
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    borderRadius: 14,
    padding: '0 24px',
    height: 90,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    overflow: 'hidden',
  },
  heroLeft: {},
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 15,
    fontWeight: 700,
    color: '#fff',
    textShadow: '0 1px 3px rgba(0,0,0,0.3)',
    margin: 0,
  },
  heroSub: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 3,
    margin: 0,
  },
  heroIcon: { fontSize: 48, opacity: 0.2 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 14, fontWeight: 700, color: '#111827', margin: 0 },
  cardSub: { fontSize: 10, color: '#6b7280', marginTop: 2 },
  greenPill: {
    fontSize: 8,
    fontWeight: 700,
    padding: '2px 7px',
    borderRadius: 20,
    display: 'inline-block',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    background: '#e8f5ee',
    color: '#1a6b3a',
  },
  priceSection: { marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #e5e7eb' },
  priceRow: { display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 },
  priceMain: { fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: '#1a6b3a' },
  pricePeriod: { fontSize: 11, color: '#6b7280' },
  nextBillingText: { fontSize: 11, color: '#6b7280' },
  buttonRow: { display: 'flex', gap: 8 },
  outlineBtn: {
    flex: 1,
    padding: '8px 12px',
    background: '#fff',
    border: '1px solid #1a6b3a',
    color: '#1a6b3a',
    borderRadius: 7,
    fontSize: 11,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '8px 10px', fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' },
  td: { padding: '10px 10px', fontSize: 11, color: '#374151', borderBottom: '1px solid #e5e7eb' },
  statusPill: (status) => ({
    fontSize: 8,
    fontWeight: 700,
    padding: '2px 7px',
    borderRadius: 20,
    display: 'inline-block',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    background: status === 'Paid' ? '#e8f5ee' : '#fef3e2',
    color: status === 'Paid' ? '#1a6b3a' : '#c97d1a',
  }),
};

export default function RetailBilling({ onTabChange }) {
  return (
    <div style={styles.page}>
      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroLeft}>
          <h2 style={styles.heroTitle}>Billing & Subscription</h2>
          <p style={styles.heroSub}>Manage your Pewil plan and payments</p>
        </div>
        <div style={styles.heroIcon}>{'\u{1F4B3}'}</div>
      </div>

      {/* Grid: Current Plan + Recent Invoices */}
      <div style={styles.grid}>
        {/* LEFT: Current Plan */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <div style={styles.cardTitle}>Starter Plan</div>
              <div style={styles.cardSub}>Retail + Accounting modules</div>
            </div>
            <span style={styles.greenPill}>ACTIVE</span>
          </div>

          <div style={styles.priceSection}>
            <div style={styles.priceRow}>
              <span style={styles.priceMain}>$10</span>
              <span style={styles.pricePeriod}>/month</span>
            </div>
            <div style={styles.nextBillingText}>
              Next billing: 1 May 2026 • Paystack
            </div>
          </div>

          <div style={styles.buttonRow}>
            <button style={styles.outlineBtn}>Upgrade Plan</button>
            <button style={styles.outlineBtn}>Update Payment</button>
          </div>
        </div>

        {/* RIGHT: Recent Invoices */}
        <div style={styles.card}>
          <div style={{ marginBottom: 14 }}>
            <div style={styles.cardTitle}>Recent Invoices</div>
          </div>

          <table style={styles.table}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_INVOICES.map((invoice, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: idx < SAMPLE_INVOICES.length - 1 ? '1px solid #e5e7eb' : 'none',
                  }}
                >
                  <td style={styles.td}>{invoice.date}</td>
                  <td style={styles.td}>{invoice.amount}</td>
                  <td style={styles.td}>
                    <span style={styles.statusPill(invoice.status)}>{invoice.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
