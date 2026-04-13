import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getDailySummary,
  getProducts,
  getLowStockProducts,
  getCashierSessions,
  getSales,
} from '../api/retailApi';
import { fmt } from '../utils/format';

/* ─── Skeleton Loader ─── */
function Skeleton({ w, h, r, mb }) {
  return (
    <div
      className="skeleton"
      style={{
        width: w || '100%',
        height: h || 16,
        borderRadius: r || 6,
        marginBottom: mb || 0,
      }}
    />
  );
}

/* ─── Styles ─── */
const S = {
  page: { maxWidth: 1200, margin: '0 auto', padding: '20px' },
  banner: {
    height: 110,
    borderRadius: 14,
    padding: '0 28px',
    marginBottom: 20,
    background: 'linear-gradient(135deg, rgba(26,107,58,0.8) 0%, rgba(45,158,88,0.6) 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  bannerTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 28,
    fontWeight: 700,
    color: '#fff',
    textShadow: '0 1px 3px rgba(0,0,0,0.3)',
    margin: 0,
  },
  bannerSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
    marginTop: 2,
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 12,
    marginBottom: 20,
  },
  card: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    padding: '16px 18px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },
  metricCard: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    padding: '16px 18px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    position: 'relative',
    overflow: 'hidden',
  },
  metricLabel: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: 600,
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: '0.05em',
  },
  metricValue: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 24,
    fontWeight: 700,
    color: '#1a6b3a',
    lineHeight: 1.2,
  },
  metricTrend: {
    fontSize: 9,
    color: '#9ca3af',
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: '#111827',
    marginBottom: 12,
    marginTop: 0,
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20,
    marginBottom: 20,
  },
  threeCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 12,
    marginBottom: 20,
  },
  chartBar: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 140,
    gap: 8,
    padding: '12px 0',
  },
  barColumn: (height, label) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  }),
  bar: (h, color) => ({
    width: 30,
    height: h,
    background: color || '#1a6b3a',
    borderRadius: '4px 4px 0 0',
  }),
  barLabel: {
    fontSize: 9,
    color: '#6b7280',
    textAlign: 'center',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 11,
  },
  th: {
    textAlign: 'left',
    padding: '8px 10px',
    fontSize: 9,
    fontWeight: 700,
    color: '#9ca3af',
    textTransform: 'uppercase',
    borderBottom: '1px solid #e5e7eb',
    background: '#f9fafb',
  },
  td: {
    padding: '8px 10px',
    borderBottom: '1px solid #f3f4f6',
    color: '#374151',
  },
  alertRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    background: '#fff5f5',
    borderLeft: '3px solid #c0392b',
    borderRadius: 6,
    marginBottom: 8,
  },
  alertLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: '#7f1d1d',
  },
  alertQty: {
    fontSize: 10,
    color: '#9ca3af',
  },
  badge: (color) => ({
    display: 'inline-block',
    fontSize: 8,
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: 10,
    textTransform: 'uppercase',
    background: color === 'red' ? '#fee2e2' : '#fef3c7',
    color: color === 'red' ? '#7f1d1d' : '#92400e',
  }),
};

export default function RetailDashboard() {
  const { data: summary, isLoading: sumLoading } = useQuery({
    queryKey: ['retail-summary'],
    queryFn: getDailySummary,
  });

  const { data: products = [] } = useQuery({
    queryKey: ['retail-products'],
    queryFn: getProducts,
  });

  const { data: lowStock = [] } = useQuery({
    queryKey: ['retail-low-stock'],
    queryFn: getLowStockProducts,
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ['retail-cashier-sessions'],
    queryFn: getCashierSessions,
  });

  const { data: sales = [] } = useQuery({
    queryKey: ['retail-sales-recent'],
    queryFn: getSales,
  });

  const openSessions = sessions.filter((s) => !s.closed_at);
  const productCount = products.length;
  const recentSales = sales.slice(0, 10);

  // Build weekly chart from actual sales data
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const chartData = (() => {
    const now = new Date();
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayTotal = sales
        .filter(s => s.created_at && s.created_at.startsWith(dateStr))
        .reduce((sum, s) => sum + parseFloat(s.total || 0), 0);
      days.push({ day: dayNames[d.getDay()], amount: dayTotal });
    }
    return days;
  })();
  const maxAmount = Math.max(...chartData.map((d) => d.amount), 1);

  if (sumLoading) {
    return (
      <div style={S.page}>
        <Skeleton h={110} r={14} mb={20} />
        <div style={S.metricsGrid}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} h={90} r={12} mb={0} />
          ))}
        </div>
        <Skeleton h={200} r={12} mb={20} />
        <Skeleton h={250} r={12} mb={0} />
      </div>
    );
  }

  return (
    <div style={S.page}>
      {/* Hero Banner */}
      <div style={S.banner}>
        <h1 style={S.bannerTitle}>Retail Hub</h1>
        <p style={S.bannerSub}>
          {'\u{1F4B5}'} Sales & Inventory Management
        </p>
      </div>

      {/* Metrics Cards */}
      <div style={S.metricsGrid}>
        <div style={S.metricCard}>
          <div style={S.metricLabel}>
            {'\u{1F4B0}'} Today's Sales
          </div>
          <div style={S.metricValue}>
            {fmt(summary?.total_sales || 0, 'zwd')}
          </div>
          <div style={S.metricTrend}>
            {summary?.transaction_count || 0} transactions
          </div>
        </div>

        <div style={S.metricCard}>
          <div style={S.metricLabel}>
            {'\u{1F4E6}'} Products
          </div>
          <div style={S.metricValue}>{productCount}</div>
          <div style={S.metricTrend}>
            {lowStock.length} low stock alerts
          </div>
        </div>

        <div style={S.metricCard}>
          <div style={S.metricLabel}>
            {'\u{26A0}'} Low Stock Alerts
          </div>
          <div style={{ ...S.metricValue, color: '#c0392b' }}>
            {lowStock.length}
          </div>
          <div style={S.metricTrend}>
            Need reordering
          </div>
        </div>

        <div style={S.metricCard}>
          <div style={S.metricLabel}>
            {'\u{1F4B3}'} Open Sessions
          </div>
          <div style={S.metricValue}>{openSessions.length}</div>
          <div style={S.metricTrend}>
            Active cashiers
          </div>
        </div>
      </div>

      {/* Two-column layout: Chart + Low Stock */}
      <div style={S.twoCol}>
        {/* Sales Chart */}
        <div style={S.card}>
          <h3 style={S.sectionTitle}>Weekly Sales Trend</h3>
          <div style={S.chartBar}>
            {chartData.map((item, idx) => (
              <div key={idx} style={S.barColumn(item.amount, item.day)}>
                <div
                  style={S.bar(
                    (item.amount / maxAmount) * 120,
                    '#2d9e58'
                  )}
                />
                <div style={S.barLabel}>{item.day}</div>
              </div>
            ))}
          </div>
          <div
            style={{
              fontSize: 9,
              color: '#9ca3af',
              textAlign: 'center',
              marginTop: 8,
            }}
          >
            Last 7 days
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div style={S.card}>
          <h3 style={S.sectionTitle}>Low Stock Alerts</h3>
          {lowStock.length > 0 ? (
            <div>
              {lowStock.slice(0, 5).map((item) => (
                <div key={item.id} style={S.alertRow}>
                  <div>
                    <div style={S.alertLabel}>{item.name}</div>
                    <div style={S.alertQty}>
                      Stock: {item.quantity_in_stock} / Reorder: {item.reorder_level}
                    </div>
                  </div>
                  <span style={S.badge('red')}>Critical</span>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: '20px',
                textAlign: 'center',
                color: '#9ca3af',
                fontSize: 12,
              }}
            >
              All stock levels are healthy
            </div>
          )}
        </div>
      </div>

      {/* Recent Sales */}
      <div style={S.card}>
        <h3 style={S.sectionTitle}>Recent Transactions</h3>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Transaction ID</th>
              <th style={S.th}>Items</th>
              <th style={S.th}>Amount</th>
              <th style={S.th}>Payment</th>
              <th style={S.th}>Time</th>
            </tr>
          </thead>
          <tbody>
            {recentSales.map((sale) => (
              <tr key={sale.id}>
                <td style={S.td}>
                  <strong>{sale.receipt_number}</strong>
                </td>
                <td style={S.td}>{(sale.items_data || []).length}</td>
                <td style={S.td}>
                  <strong>{fmt(sale.total, 'zwd')}</strong>
                </td>
                <td style={S.td}>
                  <span style={S.badge('amber')}>
                    {sale.payment_method === 'cash'
                      ? 'Cash'
                      : sale.payment_method === 'card'
                        ? 'Card'
                        : sale.payment_method === 'mobile_money'
                          ? 'Mobile'
                          : 'Mixed'}
                  </span>
                </td>
                <td style={S.td}>{sale.created_at ? new Date(sale.created_at).toLocaleString() : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
