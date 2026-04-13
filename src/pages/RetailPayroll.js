import React from 'react';
import { useAuth } from '../context/AuthContext';

const SAMPLE_RUNS = [
  { runNum: 'PR-003', period: '1-15 Apr 2026', employees: '3', gross: '$420.00', paye: '$42.00', nssa: '$14.70', net: '$363.30', status: 'Paid' },
  { runNum: 'PR-002', period: '16-31 Mar 2026', employees: '3', gross: '$420.00', paye: '$42.00', nssa: '$14.70', net: '$363.30', status: 'Paid' },
  { runNum: 'PR-001', period: '1-15 Mar 2026', employees: '2', gross: '$280.00', paye: '$28.00', nssa: '$9.80', net: '$242.20', status: 'Paid' },
];

const styles = {
  page: { maxWidth: 1200, margin: '0 auto', padding: 20 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 700, color: '#111827', fontFamily: "'Playfair Display', serif", margin: 0 },
  addBtn: { padding: '10px 18px', background: '#1a6b3a', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  infoBanner: { background: '#fef3e2', border: '1px solid #c97d1a', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 12, color: '#c97d1a', fontWeight: 600 },
  placeholderCard: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '60px 20px', textAlign: 'center', marginBottom: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  placeholderIcon: { fontSize: 48, marginBottom: 16 },
  placeholderTitle: { fontSize: 18, fontWeight: 700, color: '#111827', fontFamily: "'Playfair Display', serif", marginBottom: 8 },
  placeholderDesc: { fontSize: 12, color: '#6b7280', marginBottom: 4 },
  placeholderSub: { fontSize: 11, color: '#9ca3af' },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '10px 12px', fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' },
  td: { padding: '12px 12px', fontSize: 12, color: '#374151', borderBottom: '1px solid #e5e7eb' },
  monospaceCell: { fontFamily: 'monospace' },
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

export default function RetailPayroll({ onTabChange }) {
  useAuth();

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Payroll</h1>
        <button style={styles.addBtn}>
          {'\u002B'} New Run
        </button>
      </div>

      <div style={styles.infoBanner}>
        {'\u26A0\uFE0F'} PAYE + NSSA — Zimbabwe payroll compliance
      </div>

      {/* Placeholder Card */}
      <div style={styles.placeholderCard}>
        <div style={styles.placeholderIcon}>{'\u{1F4B5}'}</div>
        <div style={styles.placeholderTitle}>Payroll</div>
        <div style={styles.placeholderDesc}>PAYE + NSSA — Zimbabwe payroll</div>
        <div style={styles.placeholderSub}>Full page with data tables, forms, and actions</div>
      </div>

      {/* Payroll Runs Table */}
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={styles.th}>Run #</th>
              <th style={styles.th}>Period</th>
              <th style={styles.th}>Employees</th>
              <th style={styles.th}>Gross</th>
              <th style={styles.th}>PAYE</th>
              <th style={styles.th}>NSSA</th>
              <th style={styles.th}>Net</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_RUNS.map((run, idx) => (
              <tr
                key={idx}
                style={{
                  borderBottom: idx < SAMPLE_RUNS.length - 1 ? '1px solid #e5e7eb' : 'none',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={styles.td}>{run.runNum}</td>
                <td style={styles.td}>{run.period}</td>
                <td style={styles.td}>{run.employees}</td>
                <td style={{ ...styles.td, ...styles.monospaceCell }}>{run.gross}</td>
                <td style={{ ...styles.td, ...styles.monospaceCell }}>{run.paye}</td>
                <td style={{ ...styles.td, ...styles.monospaceCell }}>{run.nssa}</td>
                <td style={{ ...styles.td, ...styles.monospaceCell }}>{run.net}</td>
                <td style={styles.td}>
                  <span style={styles.statusPill(run.status)}>{run.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
