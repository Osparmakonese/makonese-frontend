import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRetailDashboard } from '../api/retailApi';
import { fmt } from '../utils/format';
import { useAuth } from '../context/AuthContext';
import AIInsightCard from '../components/AIInsightCard';

/* ─── Design A — Terra Pro tokens ─── */
const T = {
  amber: '#f4a743', terra: '#d9562c', clay: '#b13b17',
  forest: '#1f3d26', forest2: '#2d5a37',
  sand: '#fff7ec', sand2: '#fdeedd', cream: '#fffcf7',
  ink: '#1b1b1b', muted: '#6b5d50',
  line: 'rgba(27,27,27,.10)', line2: 'rgba(27,27,27,.06)',
};
const SERIF = "'Fraunces', Georgia, serif";
const SANS = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";

/* Approximate emoji for common retail categories */
const productEmoji = (name) => {
  const n = String(name || '').toLowerCase();
  if (n.includes('maize') || n.includes('mealie')) return '\u{1F33D}';
  if (n.includes('oil') || n.includes('olive')) return '\u{1FAD2}';
  if (n.includes('sugar') || n.includes('salt')) return '\u{1F9C2}';
  if (n.includes('bread') || n.includes('loaf')) return '\u{1F35E}';
  if (n.includes('rice')) return '\u{1F35A}';
  if (n.includes('soap') || n.includes('dish')) return '\u{1F9F4}';
  if (n.includes('milk')) return '\u{1F95B}';
  if (n.includes('tea')) return '\u{1F375}';
  if (n.includes('coffee')) return '\u{2615}';
  if (n.includes('egg')) return '\u{1F95A}';
  if (n.includes('meat') || n.includes('beef') || n.includes('chicken')) return '\u{1F357}';
  if (n.includes('tomato')) return '\u{1F345}';
  if (n.includes('onion')) return '\u{1F9C5}';
  if (n.includes('banana')) return '\u{1F34C}';
  if (n.includes('apple')) return '\u{1F34F}';
  if (n.includes('soda') || n.includes('drink') || n.includes('cola')) return '\u{1F964}';
  if (n.includes('water')) return '\u{1F4A7}';
  return '\u{1F6D2}';
};

const methodLabel = (m) => {
  if (m === 'cash') return 'Cash';
  if (m === 'card') return 'Card';
  if (m === 'mobile_money') return 'EcoCash';
  if (m === 'mixed') return 'Mixed';
  return 'Cash';
};

/* ─── Skeleton ─── */
function Skeleton({ h = 100, r = 12, mb = 12 }) {
  return (
    <div
      style={{
        width: '100%',
        height: h,
        borderRadius: r,
        marginBottom: mb,
        background: 'linear-gradient(90deg,#f5eee2 0%,#efe5d2 40%,#f5eee2 100%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.2s infinite',
      }}
    />
  );
}

export default function RetailDashboardMobile() {
  const { user } = useAuth() || {};

  const {
    data: dashboard,
    isLoading,
    error: dashboardError,
  } = useQuery({
    queryKey: ['retail-dashboard'],
    queryFn: getRetailDashboard,
    staleTime: 30000,
  });

  const username =
    user?.first_name || user?.username || 'there';
  const tenantName = user?.tenant_name || 'Retail';

  /* Safely extract fields the backend now returns */
  const today_revenue = Number(dashboard?.today_revenue || 0);
  const today_tx = Number(dashboard?.today_tx_count || 0);
  const today_avg = Number(dashboard?.today_avg_ticket || 0);
  const split = dashboard?.payment_split || { cash: 0, mobile_money: 0, card: 0, mixed: 0 };
  const topSellers = dashboard?.top_sellers || [];
  const weekRev = Number(dashboard?.week_revenue || 0);
  const weekChange = Number(dashboard?.week_change_pct || 0);
  const products_count = Number(dashboard?.products_count || 0);
  const low_stock = Number(dashboard?.low_stock_alerts || 0);
  const active_sessions = Number(dashboard?.active_sessions || 0);
  const recentActivityData = dashboard?.recent_activity || [];

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Strong morning' : hour < 18 ? 'Strong day' : 'Strong evening';
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  /* ─── Shared styles ─── */
  const S = {
    page: {
      maxWidth: 1180,
      margin: '0 auto',
      padding: '16px 18px 40px',
      fontFamily: SANS,
      color: T.ink,
    },
    /* Greeting band */
    greet: {
      background: `linear-gradient(135deg, ${T.sand} 0%, ${T.sand2} 100%)`,
      border: `1px solid ${T.line}`,
      borderRadius: 16,
      padding: '20px 22px',
      marginBottom: 14,
    },
    greetKicker: {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: T.clay,
      marginBottom: 8,
    },
    greetTitle: {
      fontFamily: SERIF,
      fontWeight: 700,
      fontSize: 30,
      lineHeight: 1.04,
      letterSpacing: '-0.015em',
      margin: 0,
      color: T.ink,
    },
    greetMeta: {
      marginTop: 10,
      fontSize: 13,
      color: T.muted,
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    greetPill: {
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: 99,
      fontSize: 11,
      fontWeight: 700,
      background: T.cream,
      border: `1px solid ${T.line}`,
      color: T.clay,
    },

    /* Today's sales — big amber card */
    salesCard: {
      position: 'relative',
      overflow: 'hidden',
      background: `linear-gradient(135deg, ${T.amber} 0%, #eb8f2c 100%)`,
      borderRadius: 16,
      padding: '22px 24px',
      color: T.ink,
      marginBottom: 14,
      boxShadow: '0 10px 28px rgba(244,167,67,0.22)',
    },
    salesDecor: {
      position: 'absolute',
      top: -60, right: -40,
      width: 220, height: 220,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.18)',
      pointerEvents: 'none',
    },
    salesEye: {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'rgba(27,27,27,.72)',
      marginBottom: 4,
    },
    salesValue: {
      fontFamily: SERIF,
      fontWeight: 700,
      fontSize: 40,
      letterSpacing: '-0.02em',
      lineHeight: 1.05,
      margin: 0,
    },
    salesSub: {
      marginTop: 6,
      fontSize: 13,
      color: 'rgba(27,27,27,.78)',
      fontWeight: 500,
    },
    splitRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 10,
      marginTop: 16,
      paddingTop: 16,
      borderTop: '1px solid rgba(255,255,255,.35)',
      position: 'relative',
    },
    splitCell: {},
    splitLabel: {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'rgba(27,27,27,.72)',
      marginBottom: 4,
    },
    splitValue: {
      fontFamily: SERIF,
      fontSize: 20,
      fontWeight: 700,
      color: T.ink,
    },

    /* Metric cards row */
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 10,
      marginBottom: 16,
    },
    mcard: {
      background: T.cream,
      border: `1px solid ${T.line}`,
      borderRadius: 12,
      padding: '14px 16px',
    },
    mlabel: {
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.10em',
      textTransform: 'uppercase',
      color: T.muted,
      marginBottom: 6,
    },
    mval: {
      fontFamily: SERIF,
      fontSize: 24,
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    mdelta: (tone) => ({
      fontSize: 11,
      fontWeight: 600,
      marginTop: 6,
      color:
        tone === 'up' ? '#0f7a3a' :
        tone === 'dn' ? T.clay :
        T.muted,
    }),

    /* Section heading row */
    sectionHead: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
      marginBottom: 10,
    },
    sectionTitle: {
      fontFamily: SERIF,
      fontSize: 20,
      fontWeight: 700,
      letterSpacing: '-0.01em',
      color: T.ink,
      margin: 0,
    },
    sectionMore: {
      fontSize: 12,
      fontWeight: 700,
      color: T.clay,
      cursor: 'pointer',
      border: 'none',
      background: 'transparent',
    },

    /* Top sellers list */
    topList: {
      background: T.cream,
      border: `1px solid ${T.line}`,
      borderRadius: 12,
      padding: '6px 0',
      marginBottom: 16,
    },
    tp: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      borderBottom: `1px solid ${T.line2}`,
    },
    tpLast: { borderBottom: 'none' },
    tpL: { display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 },
    tpThumb: {
      width: 42, height: 42,
      borderRadius: 10,
      background: T.sand,
      border: `1px solid ${T.line}`,
      display: 'grid',
      placeItems: 'center',
      fontSize: 22,
      flexShrink: 0,
    },
    tpName: {
      fontSize: 14,
      fontWeight: 600,
      color: T.ink,
      marginBottom: 2,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    tpSub: {
      fontSize: 12,
      color: T.muted,
    },
    tpR: {
      fontFamily: SERIF,
      fontSize: 17,
      fontWeight: 700,
      color: T.ink,
      flexShrink: 0,
      marginLeft: 12,
    },

    /* Recent transactions card */
    card: {
      background: T.cream,
      border: `1px solid ${T.line}`,
      borderRadius: 12,
      padding: '16px 18px',
      marginBottom: 14,
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: 13,
    },
    th: {
      textAlign: 'left',
      padding: '8px 10px',
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.10em',
      textTransform: 'uppercase',
      color: T.muted,
      borderBottom: `1px solid ${T.line}`,
    },
    td: {
      padding: '10px',
      borderBottom: `1px solid ${T.line2}`,
      color: T.ink,
    },
    methodPill: {
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: 99,
      fontSize: 10,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      background: T.sand2,
      color: T.clay,
      border: `1px solid ${T.line}`,
    },

    /* Empty state */
    empty: {
      padding: '28px 20px',
      textAlign: 'center',
      color: T.muted,
      fontSize: 13,
    },
  };

  /* Loading state */
  if (isLoading) {
    return (
      <div style={S.page}>
        <Skeleton h={92} r={16} />
        <Skeleton h={170} r={16} />
        <div style={S.metricsGrid}>
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} h={88} r={12} mb={0} />)}
        </div>
        <Skeleton h={260} r={12} />
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div style={S.page}>
        <div
          style={{
            padding: 20, borderRadius: 12,
            background: '#fde8e3', color: T.clay, fontSize: 13,
          }}
        >
          We couldn{'\u2019'}t load your retail dashboard. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      {/* ─── Greeting band ─── */}
      <div style={S.greet}>
        <div style={S.greetKicker}>Pewil {'\u00B7'} Retail</div>
        <h1 style={S.greetTitle}>
          {greeting}, {username}.
        </h1>
        <div style={S.greetMeta}>
          <span>{today}</span>
          {active_sessions > 0 ? (
            <span style={S.greetPill}>
              Till open {'\u00B7'} {active_sessions} cashier{active_sessions === 1 ? '' : 's'}
            </span>
          ) : (
            <span style={{ ...S.greetPill, color: T.muted }}>
              No open tills
            </span>
          )}
          <span style={{ ...S.greetPill, color: T.muted }}>{tenantName}</span>
        </div>
      </div>

      {/* ─── Today's sales — amber card with 3-col split ─── */}
      <div style={S.salesCard}>
        <div style={S.salesDecor} />
        <div style={{ position: 'relative' }}>
          <div style={S.salesEye}>Today{'\u2019'}s sales</div>
          <div style={S.salesValue}>{fmt(today_revenue, 'zwd')}</div>
          <div style={S.salesSub}>
            {today_tx} transaction{today_tx === 1 ? '' : 's'}
            {today_tx > 0 ? ` \u00B7 avg ${fmt(today_avg, 'zwd')}` : ''}
          </div>
          <div style={S.splitRow}>
            <div style={S.splitCell}>
              <div style={S.splitLabel}>Cash</div>
              <div style={S.splitValue}>{fmt(split.cash || 0, 'zwd')}</div>
            </div>
            <div style={S.splitCell}>
              <div style={S.splitLabel}>EcoCash</div>
              <div style={S.splitValue}>{fmt(split.mobile_money || 0, 'zwd')}</div>
            </div>
            <div style={S.splitCell}>
              <div style={S.splitLabel}>Card</div>
              <div style={S.splitValue}>{fmt(split.card || 0, 'zwd')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 4 metric cards: Week sales / Margin / Low stock / Products ─── */}
      <div style={S.metricsGrid}>
        <div style={S.mcard}>
          <div style={S.mlabel}>Week sales</div>
          <div style={S.mval}>{fmt(weekRev, 'zwd')}</div>
          <div style={S.mdelta(weekChange > 0 ? 'up' : weekChange < 0 ? 'dn' : '')}>
            {weekChange > 0 ? `\u2191 ${Math.abs(weekChange).toFixed(0)}%` :
             weekChange < 0 ? `\u2193 ${Math.abs(weekChange).toFixed(0)}%` :
             'vs last 7 days'}
          </div>
        </div>

        <div style={S.mcard}>
          <div style={S.mlabel}>Transactions</div>
          <div style={S.mval}>{today_tx}</div>
          <div style={S.mdelta('')}>Today so far</div>
        </div>

        <div style={S.mcard}>
          <div style={S.mlabel}>Low stock</div>
          <div style={{ ...S.mval, color: low_stock > 0 ? T.clay : T.ink }}>
            {low_stock}
          </div>
          <div style={S.mdelta(low_stock > 0 ? 'dn' : 'up')}>
            {low_stock > 0 ? 'Review today' : 'All clear'}
          </div>
        </div>

        <div style={S.mcard}>
          <div style={S.mlabel}>Products</div>
          <div style={S.mval}>{products_count}</div>
          <div style={S.mdelta('')}>
            {products_count > 0 ? 'Active SKUs' : 'None added yet'}
          </div>
        </div>
      </div>

      {/* ─── Top sellers today ─── */}
      <div style={S.sectionHead}>
        <h3 style={S.sectionTitle}>Top sellers today</h3>
        <button
          type="button"
          style={S.sectionMore}
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent('pewil:navigate', { detail: { tab: 'products' } })
            )
          }
        >
          All products {'\u2192'}
        </button>
      </div>
      <div style={S.topList}>
        {topSellers.length === 0 ? (
          <div style={S.empty}>
            No sales yet today {'\u2014'} ring up a sale in POS to see your bestsellers here.
          </div>
        ) : (
          topSellers.map((p, idx) => (
            <div
              key={p.name + idx}
              style={{
                ...S.tp,
                ...(idx === topSellers.length - 1 ? S.tpLast : {}),
              }}
            >
              <div style={S.tpL}>
                <div style={S.tpThumb}>{productEmoji(p.name)}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={S.tpName}>{p.name}</div>
                  <div style={S.tpSub}>
                    {Number(p.qty).toFixed(0)} unit{Number(p.qty) === 1 ? '' : 's'}
                  </div>
                </div>
              </div>
              <div style={S.tpR}>{fmt(p.revenue, 'zwd')}</div>
            </div>
          ))
        )}
      </div>

      {/* ─── Recent transactions ─── */}
      <div style={S.sectionHead}>
        <h3 style={S.sectionTitle}>Recent transactions</h3>
        <button
          type="button"
          style={S.sectionMore}
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent('pewil:navigate', { detail: { tab: 'sales-history' } })
            )
          }
        >
          All sales {'\u2192'}
        </button>
      </div>
      <div style={S.card}>
        {recentActivityData.length === 0 ? (
          <div style={S.empty}>No transactions yet.</div>
        ) : (
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Receipt</th>
                <th style={S.th}>Customer</th>
                <th style={S.th}>Amount</th>
                <th style={S.th}>Method</th>
                <th style={S.th}>Time</th>
              </tr>
            </thead>
            <tbody>
              {recentActivityData.slice(0, 8).map((a) => (
                <tr key={a.id}>
                  <td style={S.td}>
                    <strong>{a.receipt || '\u2014'}</strong>
                  </td>
                  <td style={S.td}>{a.customer || 'Walk-in'}</td>
                  <td style={{ ...S.td, fontFamily: SERIF, fontWeight: 700 }}>
                    {fmt(a.total, 'zwd')}
                  </td>
                  <td style={S.td}>
                    <span style={S.methodPill}>{methodLabel(a.method)}</span>
                  </td>
                  <td style={S.td}>{a.time || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ─── AI daily summary ─── */}
      <div style={{ marginTop: 16 }}>
        <AIInsightCard feature="retail_dashboard_summary" title="AI daily summary" />
      </div>
    </div>
  );
}
