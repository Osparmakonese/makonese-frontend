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
  headerRight: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
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
  dateInput: {
    padding: '6px 8px',
    border: '1px solid #e5e7eb',
    borderRadius: 6,
    fontSize: 11,
  },
  heroBar: {
    background: 'linear-gradient(135deg, #1a6b3a, #2d9e58)',
    borderRadius: 14,
    padding: '20px 24px',
    color: '#fff',
    marginBottom: 14,
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 16,
    fontWeight: 700,
    margin: '0 0 12px 0',
  },
  heroStats: {
    display: 'flex',
    gap: 24,
    fontSize: 11,
  },
  heroStat: {
    display: 'flex',
    flexDirection: 'column',
  },
  heroStatLabel: {
    fontSize: 10,
    opacity: 0.85,
  },
  heroStatValue: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 14,
    fontWeight: 700,
  },
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
    fontSize: 22,
    fontWeight: 700,
    color: '#111827',
  },
  greenValue: {
    color: '#1a6b3a',
  },
  redValue: {
    color: '#c0392b',
  },
  amberValue: {
    color: '#c97d1a',
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
  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    marginBottom: 20,
  },
  paymentMethodRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  paymentMethodLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: '#111827',
  },
  paymentMethodAmount: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 13,
    fontWeight: 700,
    color: '#111827',
  },
  paymentMethodPercent: {
    fontSize: 10,
    color: '#6b7280',
    marginLeft: 8,
  },
  progressBar: {
    width: '100%',
    height: 6,
    background: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 6,
  },
  progressFill: (percent, color) => ({
    height: '100%',
    width: `${percent}%`,
    background: color,
    borderRadius: 3,
  }),
  cashDrawerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 11,
    marginBottom: 8,
    paddingBottom: 8,
    borderBottom: '1px solid #f3f4f6',
  },
  cashDrawerLabel: {
    color: '#6b7280',
  },
  cashDrawerValue: {
    fontWeight: 600,
    color: '#111827',
  },
  varianceNegative: {
    color: '#c0392b',
  },
  variancePositive: {
    color: '#1a6b3a',
  },
  varianceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 11,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottom: '1px solid #f3f4f6',
    fontWeight: 700,
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
  }),
  hourlyChart: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 160,
    gap: 4,
    paddingBottom: 12,
    position: 'relative',
  },
  hourlyBar: (height) => ({
    flex: 1,
    height: `${height}px`,
    background: height > 0 ? 'linear-gradient(180deg, #2563eb, #1e3a5f)' : '#e5e7eb',
    borderRadius: '2px 2px 0 0',
    minHeight: 2,
  }),
  peakInfo: {
    fontSize: 11,
    color: '#374151',
    marginTop: 12,
    fontWeight: 600,
  },
};

export default function EndOfDayReport({ onTabChange }) {
  useAuth();
  const [reportDate, setReportDate] = useState('2026-04-12');

  // Static data for the report
  const data = {
    grossSales: 1240.00,
    returns: 55.00,
    discounts: 32.50,
    netRevenue: 1152.50,
    transactions: 38,
    avgTransaction: 32.63,
    paymentMethods: [
      { name: 'Cash', amount: 520.00, percent: 42 },
      { name: 'EcoCash', amount: 480.00, percent: 39 },
      { name: 'Card', amount: 185.00, percent: 15 },
      { name: 'Store Credit', amount: 55.00, percent: 4 },
    ],
    cashDrawer: {
      opening: 100.00,
      sales: 520.00,
      returns: 15.00,
      payouts: 0.00,
      expected: 605.00,
      actual: 601.00,
      variance: -4.00,
    },
    hourlySales: [
      0, 0, 0, 0, 0, 0, 0, 0, 45, 65, 120, 185, 95, 80, 70, 60, 45, 35, 20, 15, 5, 0, 0, 0,
    ],
  };

  const maxHourly = Math.max(...data.hourlySales);

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <h1 style={S.headerTitle}>End of Day Report</h1>
        <div style={S.headerRight}>
          <input
            type="date"
            value={reportDate}
            onChange={(e) => setReportDate(e.target.value)}
            style={S.dateInput}
          />
          <button style={S.button}>Generate Report</button>
        </div>
      </div>

      {/* Green Hero Bar */}
      <div style={S.heroBar}>
        <div style={S.heroTitle}>Daily Summary — 12 April 2026</div>
        <div style={S.heroStats}>
          <div style={S.heroStat}>
            <div style={S.heroStatLabel}>Total Sales</div>
            <div style={S.heroStatValue}>${data.grossSales.toFixed(2)}</div>
          </div>
          <div style={S.heroStat}>
            <div style={S.heroStatLabel}>Transactions</div>
            <div style={S.heroStatValue}>{data.transactions}</div>
          </div>
          <div style={S.heroStat}>
            <div style={S.heroStatLabel}>Avg. Transaction</div>
            <div style={S.heroStatValue}>${data.avgTransaction.toFixed(2)}</div>
          </div>
          <div style={S.heroStat}>
            <div style={S.heroStatLabel}>Returns</div>
            <div style={S.heroStatValue}>{data.transactions - 36}</div>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div style={S.metricsGrid}>
        <div style={S.metricCard}>
          <div style={S.metricLabel}>Gross Sales</div>
          <div style={{ ...S.metricValue, ...S.greenValue }}>
            ${data.grossSales.toFixed(2)}
          </div>
        </div>
        <div style={S.metricCard}>
          <div style={S.metricLabel}>Returns/Refunds</div>
          <div style={{ ...S.metricValue, ...S.redValue }}>
            -${data.returns.toFixed(2)}
          </div>
        </div>
        <div style={S.metricCard}>
          <div style={S.metricLabel}>Discounts Given</div>
          <div style={{ ...S.metricValue, ...S.amberValue }}>
            -${data.discounts.toFixed(2)}
          </div>
        </div>
        <div style={S.metricCard}>
          <div style={S.metricLabel}>Net Revenue</div>
          <div style={{ ...S.metricValue, ...S.greenValue }}>
            ${data.netRevenue.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Two-column Layout */}
      <div style={S.twoCol}>
        {/* Payment Method Breakdown */}
        <div style={S.card}>
          <h3 style={S.sectionTitle}>Payment Method Breakdown</h3>
          {data.paymentMethods.map((method, idx) => (
            <div key={idx}>
              <div style={S.paymentMethodRow}>
                <span style={S.paymentMethodLabel}>{method.name}</span>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={S.paymentMethodAmount}>
                    ${method.amount.toFixed(2)}
                  </span>
                  <span style={S.paymentMethodPercent}>({method.percent}%)</span>
                </div>
              </div>
              <div style={S.progressBar}>
                <div
                  style={S.progressFill(
                    method.percent,
                    method.name === 'Cash'
                      ? '#1a6b3a'
                      : method.name === 'EcoCash'
                        ? '#2563eb'
                        : method.name === 'Card'
                          ? '#7c3aed'
                          : '#9ca3af'
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Cash Drawer Reconciliation */}
        <div style={S.card}>
          <h3 style={S.sectionTitle}>Cash Drawer</h3>
          <div style={S.cashDrawerRow}>
            <span style={S.cashDrawerLabel}>Opening Float</span>
            <span style={S.cashDrawerValue}>${data.cashDrawer.opening.toFixed(2)}</span>
          </div>
          <div style={S.cashDrawerRow}>
            <span style={S.cashDrawerLabel}>+ Cash Sales</span>
            <span style={S.cashDrawerValue}>${data.cashDrawer.sales.toFixed(2)}</span>
          </div>
          <div style={S.cashDrawerRow}>
            <span style={S.cashDrawerLabel}>- Cash Returns</span>
            <span style={S.cashDrawerValue}>-${data.cashDrawer.returns.toFixed(2)}</span>
          </div>
          <div style={S.cashDrawerRow}>
            <span style={S.cashDrawerLabel}>- Cash Payouts</span>
            <span style={S.cashDrawerValue}>-${data.cashDrawer.payouts.toFixed(2)}</span>
          </div>
          <div style={S.varianceRow}>
            <span>= Expected</span>
            <span>${data.cashDrawer.expected.toFixed(2)}</span>
          </div>
          <div style={S.cashDrawerRow}>
            <span style={S.cashDrawerLabel}>Actual Count</span>
            <span style={S.cashDrawerValue}>${data.cashDrawer.actual.toFixed(2)}</span>
          </div>
          <div style={S.varianceRow}>
            <span>Variance</span>
            <span style={data.cashDrawer.variance < 0 ? S.varianceNegative : S.variancePositive}>
              ${data.cashDrawer.variance.toFixed(2)}
            </span>
          </div>
          <div style={{ marginTop: 8 }}>
            {data.cashDrawer.variance !== 0 ? (
              <span style={S.pill('#fef3e2', '#b45309')}>Variance</span>
            ) : (
              <span style={S.pill('#e8f5ee', '#1a6b3a')}>Balanced</span>
            )}
          </div>
        </div>
      </div>

      {/* Hourly Sales Breakdown */}
      <div style={S.card}>
        <h3 style={S.sectionTitle}>Hourly Sales Breakdown</h3>
        <div style={S.hourlyChart}>
          {data.hourlySales.map((amount, idx) => {
            const height = amount > 0 ? (amount / maxHourly) * 140 : 0;
            const active = idx >= 8 && idx <= 18;
            return (
              <div
                key={idx}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  height: 160,
                  gap: 4,
                }}
              >
                <div style={{ ...S.hourlyBar(height), opacity: active ? 1 : 0.4 }} />
                <span style={{ fontSize: 8, color: '#6b7280' }}>
                  {idx.toString().padStart(2, '0')}
                </span>
              </div>
            );
          })}
        </div>
        <div style={S.peakInfo}>Peak: 12:00-13:00 ($185.00)</div>
      </div>
    </div>
  );
}
