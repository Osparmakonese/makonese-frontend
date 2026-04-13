import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRetailReport } from '../api/retailApi';
import { useAuth } from '../context/AuthContext';

const fmt = (v) => {
  const n = parseFloat(v) || 0;
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
const pct = (v) => (parseFloat(v) || 0).toFixed(1) + '%';
const num = (v) => (parseInt(v) || 0).toLocaleString();

const S = {
  page: { maxWidth: 1100, margin: '0 auto' },
  /* Hero banner */
  hero: {
    background: 'linear-gradient(135deg, #1a6b3a 0%, #2d9e58 100%)',
    borderRadius: 12, padding: '20px 24px', marginBottom: 16,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#fff',
  },
  heroSub: { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  /* Date range */
  dateRow: {
    display: 'flex', alignItems: 'center', gap: 8,
  },
  dateInput: {
    padding: '6px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.35)',
    background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 11, fontWeight: 600,
    outline: 'none', cursor: 'pointer',
  },
  dateLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 600 },
  applyBtn: {
    padding: '6px 14px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.4)',
    background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 11, fontWeight: 700,
    cursor: 'pointer',
  },
  /* Summary cards row */
  summaryRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 },
  summaryCard: (accent) => ({
    background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
    padding: '14px 16px', borderTop: `3px solid ${accent}`,
  }),
  summaryLabel: { fontSize: 9, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em' },
  summaryVal: (color) => ({
    fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color, marginTop: 4,
  }),
  summaryMeta: { fontSize: 10, color: '#9ca3af', marginTop: 2 },
  /* Two column layout */
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 },
  /* Cards */
  card: {
    background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
    padding: '16px 18px', marginBottom: 14,
  },
  plCard: {
    background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
    padding: '18px 20px', marginBottom: 14, borderLeft: '4px solid #1a6b3a',
  },
  lossCard: {
    background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
    padding: '18px 20px', marginBottom: 14, borderLeft: '4px solid #c0392b',
  },
  invCard: {
    background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
    padding: '18px 20px', marginBottom: 14, borderLeft: '4px solid #c97d1a',
  },
  /* Section title */
  sTitle: { fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 },
  sMicro: { fontSize: 9, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 },
  /* P&L rows */
  row: { display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #f3f4f6', fontSize: 12 },
  rowLabel: { color: '#6b7280' },
  rowVal: (c) => ({ fontWeight: 600, color: c }),
  totalRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: 13, fontWeight: 700, borderTop: '2px solid #e5e7eb', marginTop: 4 },
  netBox: (pos) => ({
    background: pos ? '#e8f5ee' : '#fdecea', borderRadius: 8, padding: '14px 18px',
    textAlign: 'center', marginTop: 10,
  }),
  netVal: (pos) => ({
    fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700,
    color: pos ? '#1a6b3a' : '#c0392b',
  }),
  netLabel: { fontSize: 10, color: '#6b7280', marginBottom: 4, fontWeight: 600 },
  /* Table */
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 11 },
  th: {
    textAlign: 'left', padding: '8px 10px', fontSize: 9, fontWeight: 700, color: '#9ca3af',
    textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb', background: '#f9fafb',
  },
  td: { padding: '8px 10px', borderBottom: '1px solid #f3f4f6', color: '#374151' },
  /* Bar chart */
  barOuter: { height: 6, background: '#f3f4f6', borderRadius: 3, overflow: 'hidden', marginTop: 4 },
  barInner: (w, c) => ({ height: '100%', width: `${Math.min(w, 100)}%`, background: c, borderRadius: 3, transition: 'width 0.4s ease' }),
  /* Payment badge */
  badge: (bg) => ({
    display: 'inline-block', padding: '2px 8px', borderRadius: 10,
    fontSize: 9, fontWeight: 700, color: '#fff', background: bg,
  }),
  /* Trend mini chart */
  trendRow: { display: 'flex', alignItems: 'flex-end', gap: 2, height: 60, marginTop: 8 },
  trendBar: (h, c) => ({
    flex: 1, height: `${h}%`, background: c, borderRadius: '3px 3px 0 0',
    minHeight: 2, transition: 'height 0.3s ease',
  }),
  trendLabels: { display: 'flex', gap: 2, marginTop: 3 },
  trendLabel: { flex: 1, fontSize: 7, color: '#9ca3af', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  /* Locked */
  locked: { textAlign: 'center', padding: 60, color: '#6b7280' },
  lockIcon: { fontSize: 40, marginBottom: 12 },
};

const PAYMENT_COLORS = { cash: '#1a6b3a', card: '#2563eb', mobile_money: '#c97d1a', mixed: '#7c3aed' };

export default function RetailReport() {
  const { user } = useAuth();
  const role = user?.role || 'worker';

  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const [startDate, setStartDate] = useState(thirtyDaysAgo.toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(today.toISOString().slice(0, 10));
  const [appliedStart, setAppliedStart] = useState(startDate);
  const [appliedEnd, setAppliedEnd] = useState(endDate);

  const { data: report, isLoading } = useQuery({
    queryKey: ['retailReport', appliedStart, appliedEnd],
    queryFn: () => getRetailReport({ start_date: appliedStart, end_date: appliedEnd }),
    staleTime: 60000,
  });

  const handleApply = () => {
    setAppliedStart(startDate);
    setAppliedEnd(endDate);
  };

  // Owner-only gate
  if (role !== 'owner') {
    return (
      <div style={S.locked}>
        <div style={S.lockIcon}>{'\u{1F512}'}</div>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Owner Access Only</div>
        <div style={{ fontSize: 12 }}>The Retail Report is available to store owners only.</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>{'\u{1F4CA}'}</div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>Generating retail report...</div>
      </div>
    );
  }

  const r = report || {};
  const rev = r.revenue || {};
  const pl = r.profit_loss || {};
  const inv = r.inventory || {};
  const sm = r.stock_movement || {};
  const topProducts = r.top_products || [];
  const paymentBreakdown = r.payment_breakdown || [];
  const dailyTrend = r.daily_trend || [];
  const cashierPerf = r.cashier_performance || [];
  const categoryBreakdown = r.category_breakdown || [];

  const maxDailyTotal = Math.max(...dailyTrend.map(d => d.total), 1);
  const maxProductRev = topProducts.length > 0 ? topProducts[0].revenue : 1;
  const maxCatRev = categoryBreakdown.length > 0 ? categoryBreakdown[0].revenue : 1;

  const netPositive = pl.net_profit >= 0;

  return (
    <div style={S.page}>
      {/* ── Hero Banner ── */}
      <div style={S.hero}>
        <div>
          <div style={S.heroTitle}>{'\u{1F4CA}'} Retail Report</div>
          <div style={S.heroSub}>
            {new Date(appliedStart).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            {' \u2014 '}
            {new Date(appliedEnd).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>
        <div style={S.dateRow}>
          <div>
            <div style={S.dateLabel}>From</div>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={S.dateInput} />
          </div>
          <div>
            <div style={S.dateLabel}>To</div>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={S.dateInput} />
          </div>
          <button style={S.applyBtn} onClick={handleApply}>Apply</button>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div style={S.summaryRow}>
        <div style={S.summaryCard('#1a6b3a')}>
          <div style={S.summaryLabel}>{'\u{1F4B0}'} Total Revenue</div>
          <div style={S.summaryVal('#1a6b3a')}>{fmt(rev.total_revenue)}</div>
          <div style={S.summaryMeta}>{num(rev.transaction_count)} transactions</div>
        </div>
        <div style={S.summaryCard('#2563eb')}>
          <div style={S.summaryLabel}>{'\u{1F4C8}'} Gross Profit</div>
          <div style={S.summaryVal(pl.gross_profit >= 0 ? '#1a6b3a' : '#c0392b')}>{fmt(pl.gross_profit)}</div>
          <div style={S.summaryMeta}>{pct(pl.gross_margin)} margin</div>
        </div>
        <div style={S.summaryCard('#c97d1a')}>
          <div style={S.summaryLabel}>{'\u{1F4E6}'} Inventory Value</div>
          <div style={S.summaryVal('#c97d1a')}>{fmt(inv.value_at_cost)}</div>
          <div style={S.summaryMeta}>{num(inv.total_units)} units in stock</div>
        </div>
        <div style={S.summaryCard(netPositive ? '#1a6b3a' : '#c0392b')}>
          <div style={S.summaryLabel}>{'\u2705'} Net Profit</div>
          <div style={S.summaryVal(netPositive ? '#1a6b3a' : '#c0392b')}>{fmt(pl.net_profit)}</div>
          <div style={S.summaryMeta}>After losses & shrinkage</div>
        </div>
      </div>

      {/* ── Two Column Layout ── */}
      <div style={S.twoCol}>
        {/* LEFT COLUMN */}
        <div>
          {/* P&L Statement */}
          <div style={S.plCard}>
            <div style={S.sTitle}>{'\u{1F4B5}'} Profit & Loss Statement</div>
            <div style={S.sMicro}>Revenue</div>
            <div style={S.row}>
              <span style={S.rowLabel}>Gross Sales (Subtotal)</span>
              <span style={S.rowVal('#1a6b3a')}>{fmt(pl.revenue)}</span>
            </div>
            <div style={S.row}>
              <span style={S.rowLabel}>Less: Discounts Given</span>
              <span style={S.rowVal('#c0392b')}>-{fmt(pl.discounts)}</span>
            </div>
            <div style={S.row}>
              <span style={S.rowLabel}>Tax Collected</span>
              <span style={S.rowVal('#6b7280')}>{fmt(pl.tax_collected)}</span>
            </div>

            <div style={{ ...S.sMicro, marginTop: 14 }}>Cost of Goods Sold</div>
            <div style={S.row}>
              <span style={S.rowLabel}>COGS (Purchase Cost)</span>
              <span style={S.rowVal('#c0392b')}>-{fmt(pl.cogs)}</span>
            </div>
            <div style={S.totalRow}>
              <span>Gross Profit</span>
              <span style={{ color: pl.gross_profit >= 0 ? '#1a6b3a' : '#c0392b' }}>{fmt(pl.gross_profit)}</span>
            </div>

            <div style={{ ...S.sMicro, marginTop: 14 }}>Losses & Shrinkage</div>
            <div style={S.row}>
              <span style={S.rowLabel}>Stock Losses (Stolen/Damaged/Expired)</span>
              <span style={S.rowVal('#c0392b')}>-{fmt(pl.stock_losses)}</span>
            </div>

            {/* Net Profit Box */}
            <div style={S.netBox(netPositive)}>
              <div style={S.netLabel}>NET PROFIT</div>
              <div style={S.netVal(netPositive)}>{fmt(pl.net_profit)}</div>
            </div>
          </div>

          {/* Daily Sales Trend */}
          {dailyTrend.length > 0 && (
            <div style={S.card}>
              <div style={S.sTitle}>{'\u{1F4C5}'} Daily Sales Trend</div>
              <div style={S.trendRow}>
                {dailyTrend.map((d, i) => (
                  <div
                    key={i}
                    style={S.trendBar(Math.max((d.total / maxDailyTotal) * 100, 3), '#2d9e58')}
                    title={`${d.date}: ${fmt(d.total)} (${d.count} sales)`}
                  />
                ))}
              </div>
              <div style={S.trendLabels}>
                {dailyTrend.map((d, i) => (
                  <div key={i} style={S.trendLabel}>
                    {new Date(d.date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10, color: '#6b7280' }}>
                <span>Avg: {fmt(rev.avg_transaction)}/sale</span>
                <span>Peak: {fmt(Math.max(...dailyTrend.map(d => d.total)))}</span>
              </div>
            </div>
          )}

          {/* Top Selling Products */}
          {topProducts.length > 0 && (
            <div style={S.card}>
              <div style={S.sTitle}>{'\u{1F3C6}'} Top Products by Revenue</div>
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.th}>#</th>
                    <th style={S.th}>Product</th>
                    <th style={{ ...S.th, textAlign: 'right' }}>Qty Sold</th>
                    <th style={{ ...S.th, textAlign: 'right' }}>Revenue</th>
                    <th style={{ ...S.th, width: 100 }}>Share</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p, i) => (
                    <tr key={i}>
                      <td style={{ ...S.td, fontWeight: 700, color: '#9ca3af', width: 30 }}>{i + 1}</td>
                      <td style={{ ...S.td, fontWeight: 600 }}>{p.name}</td>
                      <td style={{ ...S.td, textAlign: 'right' }}>{num(p.qty)}</td>
                      <td style={{ ...S.td, textAlign: 'right', fontWeight: 600, color: '#1a6b3a' }}>{fmt(p.revenue)}</td>
                      <td style={S.td}>
                        <div style={S.barOuter}>
                          <div style={S.barInner((p.revenue / maxProductRev) * 100, '#2d9e58')} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Category Breakdown */}
          {categoryBreakdown.length > 0 && (
            <div style={S.card}>
              <div style={S.sTitle}>{'\u{1F5C2}'} Sales by Category</div>
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.th}>Category</th>
                    <th style={{ ...S.th, textAlign: 'right' }}>Items Sold</th>
                    <th style={{ ...S.th, textAlign: 'right' }}>Revenue</th>
                    <th style={{ ...S.th, width: 100 }}>Share</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryBreakdown.map((c, i) => (
                    <tr key={i}>
                      <td style={{ ...S.td, fontWeight: 600 }}>{c.name}</td>
                      <td style={{ ...S.td, textAlign: 'right' }}>{num(c.qty)}</td>
                      <td style={{ ...S.td, textAlign: 'right', fontWeight: 600, color: '#1a6b3a' }}>{fmt(c.revenue)}</td>
                      <td style={S.td}>
                        <div style={S.barOuter}>
                          <div style={S.barInner((c.revenue / maxCatRev) * 100, '#c97d1a')} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div>
          {/* Payment Methods */}
          <div style={S.card}>
            <div style={S.sTitle}>{'\u{1F4B3}'} Payment Methods</div>
            {paymentBreakdown.length === 0 && (
              <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: 11, padding: 16 }}>No sales in this period</div>
            )}
            {paymentBreakdown.map((p, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={S.badge(PAYMENT_COLORS[p.method] || '#6b7280')}>{p.label}</span>
                    <span style={{ fontSize: 10, color: '#9ca3af' }}>{p.count} txns</span>
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>{fmt(p.total)}</span>
                </div>
                <div style={S.barOuter}>
                  <div style={S.barInner(p.percentage, PAYMENT_COLORS[p.method] || '#6b7280')} />
                </div>
                <div style={{ fontSize: 9, color: '#9ca3af', marginTop: 2, textAlign: 'right' }}>{pct(p.percentage)}</div>
              </div>
            ))}
          </div>

          {/* Inventory Snapshot */}
          <div style={S.invCard}>
            <div style={S.sTitle}>{'\u{1F4E6}'} Inventory Snapshot</div>
            <div style={S.row}>
              <span style={S.rowLabel}>Total Products</span>
              <span style={S.rowVal('#111827')}>{num(inv.total_products)}</span>
            </div>
            <div style={S.row}>
              <span style={S.rowLabel}>Total Units in Stock</span>
              <span style={S.rowVal('#111827')}>{num(inv.total_units)}</span>
            </div>
            <div style={S.row}>
              <span style={S.rowLabel}>Value at Cost</span>
              <span style={S.rowVal('#c97d1a')}>{fmt(inv.value_at_cost)}</span>
            </div>
            <div style={S.row}>
              <span style={S.rowLabel}>Value at Retail</span>
              <span style={S.rowVal('#1a6b3a')}>{fmt(inv.value_at_retail)}</span>
            </div>
            <div style={S.row}>
              <span style={S.rowLabel}>Potential Profit</span>
              <span style={S.rowVal('#1a6b3a')}>{fmt(inv.potential_profit)}</span>
            </div>
            {inv.low_stock_count > 0 && (
              <div style={{ marginTop: 8, background: '#fef3cd', borderRadius: 6, padding: '8px 12px', fontSize: 11, color: '#856404' }}>
                {'\u26A0\uFE0F'} {inv.low_stock_count} product{inv.low_stock_count > 1 ? 's' : ''} below reorder level
              </div>
            )}
          </div>

          {/* Stock Losses */}
          <div style={S.lossCard}>
            <div style={S.sTitle}>{'\u{1F4C9}'} Stock Losses & Shrinkage</div>
            <div style={S.row}>
              <span style={S.rowLabel}>Loss Incidents</span>
              <span style={S.rowVal('#c0392b')}>{num(sm.loss_incidents)}</span>
            </div>
            <div style={S.row}>
              <span style={S.rowLabel}>Units Lost</span>
              <span style={S.rowVal('#c0392b')}>{num(sm.units_lost)}</span>
            </div>
            <div style={S.row}>
              <span style={S.rowLabel}>Loss Value (at Cost)</span>
              <span style={S.rowVal('#c0392b')}>{fmt(sm.loss_value)}</span>
            </div>
            <div style={{ ...S.row, borderBottom: 'none' }}>
              <span style={S.rowLabel}>Units Restocked</span>
              <span style={S.rowVal('#1a6b3a')}>+{num(sm.units_restocked)}</span>
            </div>
          </div>

          {/* Cashier Performance */}
          {cashierPerf.length > 0 && (
            <div style={S.card}>
              <div style={S.sTitle}>{'\u{1F9D1}'} Cashier Performance</div>
              {cashierPerf.map((c, i) => (
                <div key={i} style={{ marginBottom: i < cashierPerf.length - 1 ? 10 : 0, paddingBottom: i < cashierPerf.length - 1 ? 10 : 0, borderBottom: i < cashierPerf.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span style={{ fontWeight: 700, fontSize: 12, color: '#111827' }}>{c.cashier}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#1a6b3a' }}>{fmt(c.total_sales)}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, fontSize: 10, color: '#6b7280' }}>
                    <span>{c.sessions_count} session{c.sessions_count !== 1 ? 's' : ''}</span>
                    <span style={{ color: c.total_variance >= 0 ? '#1a6b3a' : '#c0392b', fontWeight: 600 }}>
                      Variance: {c.total_variance >= 0 ? '+' : ''}{fmt(c.total_variance)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Stats */}
          <div style={{ ...S.card, background: '#f9fafb' }}>
            <div style={S.sTitle}>{'\u{1F4CA}'} Quick Stats</div>
            <div style={S.row}>
              <span style={S.rowLabel}>Avg Transaction Value</span>
              <span style={S.rowVal('#111827')}>{fmt(rev.avg_transaction)}</span>
            </div>
            <div style={S.row}>
              <span style={S.rowLabel}>Total Transactions</span>
              <span style={S.rowVal('#111827')}>{num(rev.transaction_count)}</span>
            </div>
            <div style={S.row}>
              <span style={S.rowLabel}>Revenue per Day</span>
              <span style={S.rowVal('#111827')}>
                {dailyTrend.length > 0 ? fmt(rev.total_revenue / dailyTrend.length) : '$0.00'}
              </span>
            </div>
            <div style={{ ...S.row, borderBottom: 'none' }}>
              <span style={S.rowLabel}>Transactions per Day</span>
              <span style={S.rowVal('#111827')}>
                {dailyTrend.length > 0 ? (rev.transaction_count / dailyTrend.length).toFixed(1) : '0'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
