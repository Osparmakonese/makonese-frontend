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
  buttonGroup: {
    display: 'flex',
    gap: 6,
    background: '#f3f4f6',
    borderRadius: 6,
    padding: 4,
  },
  buttonGroupItem: (isActive) => ({
    padding: '6px 12px',
    border: 'none',
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 600,
    background: isActive ? '#1a6b3a' : 'transparent',
    color: isActive ? '#fff' : '#6b7280',
    cursor: 'pointer',
  }),
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 8,
    marginBottom: 20,
  },
  metricCard: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 10,
    padding: 16,
  },
  metricLabel: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: 600,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  metricValue: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 24,
    fontWeight: 700,
    color: '#111827',
  },
  redValue: {
    color: '#c0392b',
  },
  card: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: '#111827',
    marginTop: 0,
    marginBottom: 16,
  },
  leaderboardCard: (borderColor, rank) => ({
    background: '#fff',
    border: `1px solid #e5e7eb`,
    borderLeft: `4px solid ${borderColor}`,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  }),
  leaderboardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  rankBadge: (bgColor) => ({
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: bgColor,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 700,
    flexShrink: 0,
  }),
  cashierName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 13,
    fontWeight: 700,
    color: '#111827',
  },
  cashierRole: {
    fontSize: 8,
    fontWeight: 700,
    padding: '2px 7px',
    borderRadius: 20,
    textTransform: 'uppercase',
    background: '#fef3e2',
    color: '#b45309',
    marginLeft: 8,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 8,
    marginBottom: 12,
  },
  statItem: {
    textAlign: 'center',
      },
  statValue: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 13,
    fontWeight: 700,
    color: '#111827',
  },
  statLabel: {
    fontSize: 8,
    color: '#6b7280',
    fontWeight: 600,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  progressBar: {
    width: '100%',
    height: 6,
    background: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: (percent, color) => ({
    height: '100%',
    width: `${percent}%`,
    background: color,
    borderRadius: 3,
  }),
  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
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
  greenText: {
    color: '#1a6b3a',
    fontWeight: 600,
  },
  redText: {
    color: '#c0392b',
    fontWeight: 600,
  },
};

export default function CashierPerformance({ onTabChange }) {
  useAuth();
  const [period, setPeriod] = useState('week');

  const cashiers = [
    {
      rank: 1,
      name: 'Mary Banda',
      borderColor: '#c97d1a',
      rankColor: '#c97d1a',
      sales: 124,
      revenue: 1580.00,
      avgValue: 12.74,
      itemsPerSale: 2.8,
      variance: 0.00,
      percent: 100,
    },
    {
      rank: 2,
      name: 'Peter Ncube',
      borderColor: '#9ca3af',
      rankColor: '#9ca3af',
      sales: 98,
      revenue: 1240.00,
      avgValue: 12.65,
      itemsPerSale: 2.4,
      variance: -4.00,
      percent: 78,
    },
    {
      rank: 3,
      name: 'Grace Mutasa',
      borderColor: '#b45309',
      rankColor: '#b45309',
      sales: 48,
      revenue: 600.00,
      avgValue: 12.50,
      itemsPerSale: 2.1,
      variance: 0.00,
      percent: 38,
    },
  ];

  const sessionsData = [
    {
      cashier: 'Mary Banda',
      sessions: 5,
      hours: '45h',
      salesPerHour: 35.11,
      variance: 0.00,
      isVariancePositive: true,
    },
    {
      cashier: 'Peter Ncube',
      sessions: 5,
      hours: '42h',
      salesPerHour: 29.52,
      variance: -4.00,
      isVariancePositive: false,
    },
    {
      cashier: 'Grace Mutasa',
      sessions: 3,
      hours: '24h',
      salesPerHour: 25.00,
      variance: 0.00,
      isVariancePositive: true,
    },
  ];

  const varianceHistoryData = [
    {
      date: '10 Apr',
      cashier: 'Peter Ncube',
      session: 'CS-040',
      expected: 456.00,
      actual: 452.00,
      variance: -4.00,
      isPositive: false,
    },
    {
      date: '5 Apr',
      cashier: 'Mary Banda',
      session: 'CS-035',
      expected: 380.00,
      actual: 380.00,
      variance: 0.00,
      isPositive: true,
    },
    {
      date: '3 Apr',
      cashier: 'Grace Mutasa',
      session: 'CS-032',
      expected: 210.00,
      actual: 210.00,
      variance: 0.00,
      isPositive: true,
    },
    {
      date: '1 Apr',
      cashier: 'Peter Ncube',
      session: 'CS-028',
      expected: 290.00,
      actual: 288.00,
      variance: -2.00,
      isPositive: false,
    },
  ];

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <h1 style={S.headerTitle}>Cashier Performance</h1>
        <div style={S.buttonGroup}>
          {['week', 'month', 'quarter'].map((p) => (
            <button
              key={p}
              style={S.buttonGroupItem(period === p)}
              onClick={() => setPeriod(p)}
            >
              {p === 'week' ? 'This Week' : p === 'month' ? 'This Month' : 'This Quarter'}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Cards */}
      <div style={S.metricsGrid}>
        <div style={S.metricCard}>
          <div style={S.metricLabel}>Total Cashiers</div>
          <div style={S.metricValue}>3</div>
        </div>
        <div style={S.metricCard}>
          <div style={S.metricLabel}>Total Sales</div>
          <div style={S.metricValue}>$3,420.00</div>
        </div>
        <div style={S.metricCard}>
          <div style={S.metricLabel}>Avg Transaction</div>
          <div style={S.metricValue}>$28.50</div>
        </div>
        <div style={S.metricCard}>
          <div style={S.metricLabel}>Variance Rate</div>
          <div style={{ ...S.metricValue, ...S.redValue }}>1.2%</div>
        </div>
      </div>

      {/* Cashier Leaderboard */}
      <h3 style={S.sectionTitle}>Cashier Leaderboard</h3>
      {cashiers.map((cashier) => (
        <div
          key={cashier.rank}
          style={S.leaderboardCard(cashier.borderColor, cashier.rank)}
        >
          <div style={S.leaderboardHeader}>
            <div style={S.rankBadge(cashier.rankColor)}>#{cashier.rank}</div>
            <div style={S.cashierName}>{cashier.name}</div>
            <div style={S.cashierRole}>Cashier</div>
          </div>

          <div style={S.statsGrid}>
            <div style={S.statItem}>
              <div style={S.statValue}>{cashier.sales}</div>
              <div style={S.statLabel}>Sales</div>
            </div>
            <div style={S.statItem}>
              <div style={S.statValue}>${cashier.revenue.toFixed(2)}</div>
              <div style={S.statLabel}>Revenue</div>
            </div>
            <div style={S.statItem}>
              <div style={S.statValue}>${cashier.avgValue.toFixed(2)}</div>
              <div style={S.statLabel}>Avg. Value</div>
            </div>
            <div style={S.statItem}>
              <div style={S.statValue}>{cashier.itemsPerSale.toFixed(1)}</div>
              <div style={S.statLabel}>Items/Sale</div>
            </div>
            <div style={S.statItem}>
              <div
                style={{
                  ...S.statValue,
                  ...(cashier.variance === 0 ? S.greenText : S.redText),
                }}
              >
                ${cashier.variance.toFixed(2)}
              </div>
              <div style={S.statLabel}>Variance</div>
            </div>
          </div>

          <div style={S.progressBar}>
            <div
              style={S.progressFill(
                cashier.percent,
                cashier.percent === 100 ? '#2563eb' : '#2563eb'
              )}
            />
          </div>
        </div>
      ))}

      {/* Two-column Layout */}
      <h3 style={S.sectionTitle}>Analytics</h3>
      <div style={S.twoCol}>
        {/* Sessions This Week */}
        <div style={S.card}>
          <h4 style={{ fontSize: 12, fontWeight: 700, color: '#111827', marginTop: 0, marginBottom: 12 }}>
            Sessions This Week
          </h4>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Cashier</th>
                <th style={S.th}>Sessions</th>
                <th style={S.th}>Hours</th>
                <th style={S.th}>Sales/Hour</th>
                <th style={S.th}>Variance Total</th>
              </tr>
            </thead>
            <tbody>
              {sessionsData.map((row, idx) => (
                <tr key={idx}>
                  <td style={S.td}>{row.cashier}</td>
                  <td style={S.td}>{row.sessions}</td>
                  <td style={S.td}>{row.hours}</td>
                  <td style={S.td}>${row.salesPerHour.toFixed(2)}</td>
                  <td
                    style={{
                      ...S.td,
                      ...(row.isVariancePositive ? S.greenText : S.redText),
                    }}
                  >
                    ${row.variance.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Variance History */}
        <div style={S.card}>
          <h4 style={{ fontSize: 12, fontWeight: 700, color: '#111827', marginTop: 0, marginBottom: 12 }}>
            Variance History
          </h4>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Date</th>
                <th style={S.th}>Cashier</th>
                <th style={S.th}>Session</th>
                <th style={S.th}>Expected</th>
                <th style={S.th}>Actual</th>
                <th style={S.th}>Variance</th>
              </tr>
            </thead>
            <tbody>
              {varianceHistoryData.map((row, idx) => (
                <tr key={idx}>
                  <td style={S.td}>{row.date}</td>
                  <td style={S.td}>{row.cashier}</td>
                  <td style={S.td}>{row.session}</td>
                  <td style={S.td}>${row.expected.toFixed(2)}</td>
                  <td style={S.td}>${row.actual.toFixed(2)}</td>
                  <td
                    style={{
                      ...S.td,
                      ...(row.isPositive ? S.greenText : S.redText),
                      fontWeight: 700,
                    }}
                  >
                    ${row.variance.toFixed(2)}
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
