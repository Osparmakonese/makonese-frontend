import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getDailySummary,
  getProducts,
  getLowStockProducts,
  getCashierSessions,
  getSales,
} from '../api/retailApi';
import { fmt } from '../utils/format';
import { useAuth } from '../context/AuthContext';

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
    height: 120,
    borderRadius: 14,
    padding: '0 28px',
    marginBottom: 20,
    background: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  },
  bannerLeft: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
  },
  bannerTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 26,
    fontWeight: 700,
    color: '#fff',
    margin: '0 0 4px 0',
  },
  bannerSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    margin: 0,
    display: 'flex',
    gap: 16,
  },
  bannerSubItem: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
  },
  bannerIcon: {
    fontSize: 48,
    opacity: 0.25,
    marginLeft: 'auto',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
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
    display: 'flex',
    flexDirection: 'column',
  },
  iconCircle: (bgColor) => ({
    width: 44,
    height: 44,
    borderRadius: '50%',
    background: bgColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24,
    marginBottom: 12,
  }),
  metricLabel: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: 600,
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: '0.05em',
  },
  metricValue: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 24,
    fontWeight: 700,
    color: '#111827',
    lineHeight: 1.2,
    marginBottom: 4,
  },
  metricTrend: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 12,
  },
  progressBar: {
    width: '100%',
    height: 4,
    background: '#e5e7eb',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 'auto',
  },
  progressFill: (percent, color) => ({
    height: '100%',
    width: `${percent}%`,
    background: color,
    borderRadius: 2,
  }),
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: '#111827',
    marginBottom: 16,
    marginTop: 0,
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20,
    marginBottom: 20,
  },
  chartBar: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 180,
    gap: 8,
    padding: '12px 0',
    position: 'relative',
  },
  barColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  bar: (h) => ({
    width: '100%',
    height: h,
    background: 'linear-gradient(180deg, #1e3a5f, #2563eb)',
    borderRadius: '4px 4px 0 0',
    position: 'relative',
  }),
  barValue: {
    fontSize: 9,
    fontWeight: 600,
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
    minHeight: 12,
  },
  barLabel: {
    fontSize: 9,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: 500,
  },
  activityFeed: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  activityItem: {
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
    paddingBottom: 12,
    borderBottom: '1px solid #f3f4f6',
  },
  activityItem_last: {
    borderBottom: 'none',
  },
  activityDot: (color) => ({
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: color,
    flexShrink: 0,
    marginTop: 4,
  }),
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: '#111827',
    margin: '0 0 2px 0',
  },
  activityDesc: {
    fontSize: 11,
    color: '#6b7280',
    margin: '0 0 4px 0',
  },
  activityTime: {
    fontSize: 9,
    color: '#9ca3af',
    margin: 0,
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
  const { user } = useAuth() || {};

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
  const username = user?.first_name || 'User';

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
      days.push({ day: dayNames[d.getDay()], amount: dayTotal, date: dateStr });
    }
    return days;
  })();
  const maxAmount = Math.max(...chartData.map((d) => d.amount), 1);

  // Build recent activity feed from sales, products, sessions
  const getActivityItems = () => {
    const items = [];

    // Add recent sales
    sales.slice(0, 5).forEach((sale) => {
      items.push({
        id: `sale-${sale.id}`,
        type: 'sale',
        dot: '#2d9e58',
        title: `Sale #${sale.receipt_number}`,
        desc: `${(sale.items_data || []).length} items • ${fmt(sale.total, 'zwd')}`,
        time: sale.created_at,
      });
    });

    // Add product updates
    lowStock.slice(0, 2).forEach((product) => {
      items.push({
        id: `product-${product.id}`,
        type: 'product',
        dot: '#2563eb',
        title: `${product.name}`,
        desc: `Low stock: ${product.quantity_in_stock} units`,
        time: product.updated_at || new Date().toISOString(),
      });
    });

    // Add session activity
    openSessions.slice(0, 2).forEach((session) => {
      items.push({
        id: `session-${session.id}`,
        type: 'session',
        dot: '#ec4899',
        title: `Cashier ${session.cashier_name || 'Active'}`,
        desc: 'Session started',
        time: session.opened_at,
      });
    });

    // Sort by time, most recent first
    items.sort((a, b) => {
      const timeA = new Date(a.time || 0).getTime();
      const timeB = new Date(b.time || 0).getTime();
      return timeB - timeA;
    });

    return items.slice(0, 6);
  };

  const activityItems = getActivityItems();

  // Format time ago
  const timeAgo = (dateStr) => {
    if (!dateStr) return 'Recently';
    const date = new Date(dateStr);
    const now = new Date();
    const secondsAgo = Math.floor((now - date) / 1000);
    if (secondsAgo < 60) return 'Just now';
    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) return `${minutesAgo}m ago`;
    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) return `${hoursAgo}h ago`;
    const daysAgo = Math.floor(hoursAgo / 24);
    return `${daysAgo}d ago`;
  };

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
        <div style={S.bannerLeft}>
          <h1 style={S.bannerTitle}>Good morning, {username}</h1>
          <div style={S.bannerSub}>
            <span style={S.bannerSubItem}>Makonese Farm</span>
            <span style={S.bannerSubItem}>{productCount} products</span>
            <span style={S.bannerSubItem}>{openSessions.length} active sessions</span>
          </div>
        </div>
        <div style={S.bannerIcon}>{'\u{1F6D2}'}</div>
      </div>

      {/* Metrics Cards */}
      <div style={S.metricsGrid}>
        {/* Revenue Card */}
        <div style={S.metricCard}>
          <div style={S.iconCircle('#2d9e58')}>
            {'\u{1F4B5}'}
          </div>
          <div style={S.metricLabel}>Revenue</div>
          <div style={S.metricValue}>
            {fmt(summary?.total_sales || 0, 'zwd')}
          </div>
          <div style={S.metricTrend}>↑ 8.2%</div>
          <div style={S.progressBar}>
            <div style={S.progressFill(65, '#2d9e58')} />
          </div>
        </div>

        {/* Products Card */}
        <div style={S.metricCard}>
          <div style={S.iconCircle('#2563eb')}>
            {'\u{1F4E6}'}
          </div>
          <div style={S.metricLabel}>Products</div>
          <div style={S.metricValue}>{productCount}</div>
          <div style={S.metricTrend}>↑ 2.1%</div>
          <div style={S.progressBar}>
            <div style={S.progressFill(42, '#2563eb')} />
          </div>
        </div>

        {/* Active Sessions Card */}
        <div style={S.metricCard}>
          <div style={S.iconCircle('#c97d1a')}>
            {'\u{1F4B3}'}
          </div>
          <div style={S.metricLabel}>Sessions</div>
          <div style={S.metricValue}>{openSessions.length}</div>
          <div style={S.metricTrend}>↑ 1.8%</div>
          <div style={S.progressBar}>
            <div style={S.progressFill(38, '#c97d1a')} />
          </div>
        </div>

        {/* Expenses/Alerts Card */}
        <div style={S.metricCard}>
          <div style={S.iconCircle('#c0392b')}>
            {'\u{26A0}'}
          </div>
          <div style={S.metricLabel}>Alerts</div>
          <div style={S.metricValue}>{lowStock.length}</div>
          <div style={S.metricTrend}>↓ 3.2%</div>
          <div style={S.progressBar}>
            <div style={S.progressFill(28, '#c0392b')} />
          </div>
        </div>
      </div>

      {/* Two-column layout: Chart + Activity Feed */}
      <div style={S.twoCol}>
        {/* Revenue This Week Chart */}
        <div style={S.card}>
          <h3 style={S.sectionTitle}>Revenue This Week</h3>
          <div style={S.chartBar}>
            {chartData.map((item, idx) => (
              <div key={idx} style={S.barColumn}>
                <div style={S.barValue}>
                  {item.amount > 0 ? fmt(item.amount, 'zwd').replace('ZWD', '').trim() : '-'}
                </div>
                <div style={S.bar((item.amount / maxAmount) * 140)} />
                <div style={S.barLabel}>{item.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div style={S.card}>
          <h3 style={S.sectionTitle}>Recent Activity</h3>
          <div style={S.activityFeed}>
            {activityItems.length > 0 ? (
              activityItems.map((item, idx) => (
                <div
                  key={item.id}
                  style={{
                    ...S.activityItem,
                    ...(idx === activityItems.length - 1 ? S.activityItem_last : {}),
                  }}
                >
                  <div style={S.activityDot(item.dot)} />
                  <div style={S.activityContent}>
                    <h4 style={S.activityTitle}>{item.title}</h4>
                    <p style={S.activityDesc}>{item.desc}</p>
                    <p style={S.activityTime}>{timeAgo(item.time)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  padding: '20px',
                  textAlign: 'center',
                  color: '#9ca3af',
                  fontSize: 12,
                }}
              >
                No recent activity
              </div>
            )}
          </div>
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
