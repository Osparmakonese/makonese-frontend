import React from 'react';
import { useAuth } from '../context/AuthContext';

const SAMPLE_DATA = [
  { date: '10 Apr', ref: 'JE-0045', description: 'Stock purchase — accessories', debit: '$124.00', credit: '$124.00', status: 'Posted' },
  { date: '9 Apr', ref: 'JE-0044', description: 'Daily sales revenue', debit: '$310.00', credit: '$310.00', status: 'Posted' },
  { date: '8 Apr', ref: 'JE-0043', description: 'Rent — April', debit: '$200.00', credit: '$200.00', status: 'Posted' },
  { date: '7 Apr', ref: 'JE-0042', description: 'EcoCash settlement', debit: '$180.00', credit: '$180.00', status: 'Posted' },
  { date: '5 Apr', ref: 'JE-0041', description: 'Staff wages — week 14', debit: '$85.00', credit: '$85.00', status: 'Posted' },
  { date: '3 Apr', ref: 'JE-0040', description: 'Utilities — electricity', debit: '$45.00', credit: '$45.00', status: 'Draft' },
];

const styles = {
  page: { maxWidth: 1200, margin: '0 auto', padding: 20 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 700, color: '#111827', fontFamily: "'Playfair Display', serif", margin: 0 },
  addBtn: { padding: '10px 18px', background: '#1a6b3a', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  summaryRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 },
  summaryCard: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  summaryLabel: { fontSize: 9, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 },
  summaryValue: { fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: '#1a6b3a' },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '10px 12px', fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' },
  td: { padding: '12px 12px', fontSize: 12, color: '#374151', borderBottom: '1px solid #e5e7eb' },
  refCell: { fontFamily: 'monospace', color: '#1a6b3a', fontWeight: 600 },
  monospaceCell: { fontFamily: 'monospace' },
  statusPill: (status) => ({
    fontSize: 8,
    fontWeight: 700,
    padding: '2px 7px',
    borderRadius: 20,
    display: 'inline-block',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    background: status === 'Posted' ? '#e8f5ee' : '#f3f4f6',
    color: status === 'Posted' ? '#1a6b3a' : '#6b7280',
  }),
  trHover: { background: '#f9fafb' },
};

export default function JournalEntries({ onTabChange }) {
  const { user } = useAuth();
  const canCreate = user?.role === 'owner' || user?.role === 'manager';

  const calculateTotals = () => {
    const debits = SAMPLE_DATA.reduce((sum, row) => {
      const val = parseFloat(row.debit.replace('$', ''));
      return sum + (isNaN(val) ? 0 : val);
    }, 0);

    const credits = SAMPLE_DATA.reduce((sum, row) => {
      const val = parseFloat(row.credit.replace('$', ''));
      return sum + (isNaN(val) ? 0 : val);
    }, 0);

    const balance = debits - credits;

    return {
      debits: `$${debits.toFixed(2)}`,
      credits: `$${credits.toFixed(2)}`,
      balance: `$${Math.abs(balance).toFixed(2)}`,
      isBalanced: Math.abs(balance) < 0.01,
    };
  };

  const totals = calculateTotals();

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Journal Entries</h1>
        {canCreate && (
          <button style={styles.addBtn}>
            {'\u002B'} New Entry
          </button>
        )}
      </div>

      {/* Summary */}
      <div style={styles.summaryRow}>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Total Debits</div>
          <div style={styles.summaryValue}>{totals.debits}</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Total Credits</div>
          <div style={styles.summaryValue}>{totals.credits}</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Balance</div>
          <div style={{ ...styles.summaryValue, color: totals.isBalanced ? '#1a6b3a' : '#c0392b' }}>
            {totals.balance}
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Ref</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Debit</th>
              <th style={styles.th}>Credit</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_DATA.map((row, idx) => (
              <tr
                key={idx}
                style={{
                  borderBottom: idx < SAMPLE_DATA.length - 1 ? '1px solid #e5e7eb' : 'none',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={styles.td}>{row.date}</td>
                <td style={{ ...styles.td, ...styles.refCell }}>{row.ref}</td>
                <td style={styles.td}>{row.description}</td>
                <td style={{ ...styles.td, ...styles.monospaceCell }}>{row.debit}</td>
                <td style={{ ...styles.td, ...styles.monospaceCell }}>{row.credit}</td>
                <td style={styles.td}>
                  <span style={styles.statusPill(row.status)}>{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
