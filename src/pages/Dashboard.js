import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDashboard, getLowStock, getHealthScore, getBriefing, getAchievements, getSeasonalComparison } from '../api/farmApi';
import { fmt, qty, cropEmoji, cropGradient, initials, avatarColor, IMAGES, cropImage } from '../utils/format';
import { useAuth } from '../context/AuthContext';
import FieldModal from '../components/FieldModal';
import AIInsightCard from '../components/AIInsightCard';

function Skeleton({ w, h, r, mb }) {
  return <div className="skeleton" style={{ width: w || '100%', height: h || 16, borderRadius: r || 6, marginBottom: mb || 0 }} />;
}
function SkeletonDash() {
  return (
    <>
      <Skeleton h={140} r={14} mb={16} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
        {[1,2,3,4].map(i => <Skeleton key={i} h={90} r={10} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <Skeleton h={200} r={10} /><Skeleton h={200} r={10} /><Skeleton h={200} r={10} />
      </div>
    </>
  );
}

/* ─── Shared card style ─── */
const card = {
  background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12,
  padding: '16px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
};
const sectionLabel = {
  fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase',
  letterSpacing: '0.05em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6,
};

const S = {
  /* Hero — compact, less height wasted */
  hero: {
    height: 130, borderRadius: 14,
    position: 'relative', display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', padding: '0 28px', marginBottom: 16,
    overflow: 'hidden',
  },
  heroOverlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(135deg, rgba(26,107,58,0.6) 0%, rgba(0,0,0,0.18) 100%)',
  },
  heroGreet: {
    fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700,
    color: '#fff', marginBottom: 2, textShadow: '0 1px 3px rgba(0,0,0,0.3)',
  },
  heroSub: { fontSize: 11, color: 'rgba(255,255,255,0.8)', textShadow: '0 1px 2px rgba(0,0,0,0.2)' },
  heroStats: { position: 'relative', zIndex: 2, display: 'flex', gap: 20 },
  heroStat: { textAlign: 'right' },
  heroStatVal: { fontSize: 16, fontWeight: 700, color: '#fff', fontFamily: "'Playfair Display', serif", textShadow: '0 1px 3px rgba(0,0,0,0.3)' },
  heroStatLabel: { fontSize: 8, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' },

  /* Metrics row */
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 },
  metricCard: {
    ...card, padding: '14px 16px',
    position: 'relative', overflow: 'hidden',
  },
  metricCardHighlight: (isPositive) => ({
    ...card, padding: '14px 16px',
    background: isPositive ? '#f0faf4' : '#fff5f5',
    border: `2px solid ${isPositive ? '#1a6b3a' : '#c0392b'}`,
    boxShadow: isPositive ? '0 2px 8px rgba(26,107,58,0.12)' : '0 2px 8px rgba(192,57,43,0.12)',
    position: 'relative', overflow: 'hidden',
  }),
  metricIcon: (bg) => ({ width: 24, height: 24, borderRadius: 6, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, marginBottom: 6 }),
  metricLabel: { fontSize: 10, color: '#6b7280', fontWeight: 500, marginBottom: 2 },
  metricVal: (color) => ({ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color, lineHeight: 1.2 }),
  metricTrend: { fontSize: 9, color: '#9ca3af', marginTop: 4 },
  metricBar: () => ({ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: '#f3f4f6' }),
  metricBarInner: (color, pct) => ({ height: '100%', width: `${Math.min(pct, 100)}%`, background: color, borderRadius: '0 2px 0 0', transition: 'width 0.5s' }),

  /* Three-column insight strip */
  insightStrip: { display: 'grid', gridTemplateColumns: '200px 1fr 1fr', gap: 12, marginBottom: 16 },

  /* Two-column main layout */
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 },
  sectionTitle: { fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 },
  fieldGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 },
  fcard: { background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  fcardOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.45) 100%)' },
  fcardLabel: { position: 'relative', zIndex: 2, color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, textShadow: '0 1px 3px rgba(0,0,0,0.4)' },
  fcardBadge: { position: 'absolute', top: 6, right: 6, zIndex: 2 },
  fcardBody: { padding: '8px 10px' },
  fcardName: { fontWeight: 700, fontSize: 12, color: '#111827' },
  fcardMeta: { fontSize: 9, color: '#9ca3af', marginBottom: 6 },
  fcardStats: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4, borderTop: '1px solid #e5e7eb', paddingTop: 6 },
  fcardStat: { textAlign: 'center' },
  fcardStatVal: (color) => ({ fontSize: 10, fontWeight: 700, color }),
  fcardStatLabel: { fontSize: 7, color: '#9ca3af', textTransform: 'uppercase' },
  bannerText: { color: '#fff', fontSize: 12, fontWeight: 600, position: 'relative', zIndex: 2, textShadow: '0 1px 3px rgba(0,0,0,0.3)' },
  bannerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 9, position: 'relative', zIndex: 2 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 10 },
  th: { textAlign: 'left', padding: '6px 8px', fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' },
  td: { padding: '6px 8px', borderBottom: '1px solid #f3f4f6', color: '#374151' },
  rightCard: { ...card, marginBottom: 12 },
  barRow: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontSize: 10 },
  barLabel: { width: 65, color: '#6b7280', fontSize: 9, fontWeight: 500, flexShrink: 0 },
  barTrack: { flex: 1, height: 6, background: '#f3f4f6', borderRadius: 3, overflow: 'hidden' },
  barFill: (color, pct) => ({ height: '100%', width: `${Math.min(pct, 100)}%`, background: color, borderRadius: 3, transition: 'width 0.4s' }),
  barAmt: { width: 60, textAlign: 'right', fontWeight: 600, color: '#374151', fontSize: 10 },
  stockRow: { display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid #f3f4f6' },
  wageRow: { display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid #f3f4f6' },
  wageAvatar: (bg) => ({ width: 26, height: 26, borderRadius: '50%', background: bg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, flexShrink: 0 }),
  errorBox: { textAlign: 'center', padding: 40, color: '#6b7280' },
};

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedField, setSelectedField] = useState(null);
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ['dashboard'], queryFn: getDashboard });
  const { data: lowStock = [] } = useQuery({ queryKey: ['lowStock'], queryFn: getLowStock });
  const { data: healthScore } = useQuery({ queryKey: ['healthScore'], queryFn: getHealthScore, staleTime: 60000 });
  const { data: briefing } = useQuery({ queryKey: ['briefing'], queryFn: getBriefing, staleTime: 60000 });
  const { data: achievementsData } = useQuery({ queryKey: ['achievements'], queryFn: getAchievements, staleTime: 60000 });
  const { data: seasonal } = useQuery({ queryKey: ['seasonalComparison'], queryFn: getSeasonalComparison, staleTime: 60000 });

  if (isLoading) return <SkeletonDash />;
  if (error) return (
    <div style={S.errorBox}>
      <p style={{ fontSize: 16, marginBottom: 8 }}>Failed to load dashboard</p>
      <p style={{ fontSize: 12, marginBottom: 16 }}>{error.message}</p>
      <button onClick={() => refetch()} style={{ background: '#1a6b3a', color: '#fff', border: 'none', borderRadius: 7, padding: '8px 20px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Retry</button>
    </div>
  );

  const d = data || {};
  const revenue = d.total_revenue || 0;
  const costs = d.total_costs || 0;
  const wages = d.wages_owed || 0;
  const net = revenue - costs - wages;
  const fields = d.active_fields || d.fields || [];
  const activeFields = fields.filter(f => f.status === 'active');
  const breakdown = d.cost_breakdown || {};
  const trips = d.recent_trips || [];
  const workers = d.workers_with_wages || [];
  const totalBreakdown = Object.values(breakdown).reduce((a, b) => a + b, 0) || 1;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const BREAKDOWN_COLORS = ['#1a6b3a', '#c97d1a', '#c0392b', '#6c5ce7', '#0984e3', '#e17055'];
  const hsColor = healthScore ? (healthScore.score >= 65 ? '#1a6b3a' : healthScore.score >= 50 ? '#c97d1a' : '#c0392b') : '#6b7280';

  return (
    <>
      {/* ═══ ROW 1: HERO BANNER ═══ */}
      <div className="hero-banner" style={S.hero}>
        <img src={IMAGES.dam} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={S.heroOverlay} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={S.heroGreet}>{greeting}, {user?.username}</div>
          <div style={S.heroSub}>{activeFields.length} active field{activeFields.length !== 1 ? 's' : ''} &middot; {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
        </div>
        <div style={S.heroStats}>
          <div style={S.heroStat}><div style={S.heroStatVal}>{fmt(revenue)}</div><div style={S.heroStatLabel}>Revenue</div></div>
          <div style={S.heroStat}><div style={S.heroStatVal}>{activeFields.length}</div><div style={S.heroStatLabel}>Fields</div></div>
          <div style={S.heroStat}><div style={S.heroStatVal}>{d.worker_count || workers.length || 0}</div><div style={S.heroStatLabel}>Workers</div></div>
          <div style={S.heroStat}><div style={S.heroStatVal}>{fmt(wages)}</div><div style={S.heroStatLabel}>Wages</div></div>
        </div>
      </div>

      {/* ═══ ROW 2: METRIC CARDS ═══ */}
      <div className="metric-grid-desktop" style={S.metricsGrid}>
        {[
          { label: 'Total Revenue', value: fmt(revenue), color: '#1a6b3a', bg: '#e8f5ee', icon: '💰', pct: 100, trend: 'Season total' },
          { label: 'Total Costs', value: fmt(costs), color: '#c0392b', bg: '#fdecea', icon: '📉', pct: revenue > 0 ? (costs/revenue)*100 : 0, trend: `${revenue > 0 ? Math.round((costs/revenue)*100) : 0}% of revenue` },
          { label: 'Wages Owed', value: fmt(wages), color: '#c97d1a', bg: '#fef3e2', icon: '👷', pct: revenue > 0 ? (wages/revenue)*100 : 0, trend: `${workers.length} workers` },
          { label: 'Net Position', value: fmt(net), color: net >= 0 ? '#1a6b3a' : '#c0392b', bg: net >= 0 ? '#e8f5ee' : '#fdecea', icon: net >= 0 ? '✔' : '↓', pct: revenue > 0 ? Math.min(Math.abs(net)/revenue*100, 100) : 0, trend: net >= 0 ? 'Profitable' : 'Loss', isNet: true },
        ].map((m, i) => (
          <div key={i} style={m.isNet ? S.metricCardHighlight(net >= 0) : S.metricCard}>
            <div style={S.metricIcon(m.bg)}>{m.icon}</div>
            <div style={S.metricLabel}>{m.label}</div>
            <div style={S.metricVal(m.color)}>{m.value}</div>
            <div style={S.metricTrend}>{m.trend}</div>
            <div style={S.metricBar()}><div style={S.metricBarInner(m.color, m.pct)} /></div>
          </div>
        ))}
      </div>

      {/* Mobile metrics */}
      <div className="metric-grid-mobile">
        {[
          { label: 'Revenue', value: fmt(revenue), color: '#1a6b3a', bg: '#e8f5ee', icon: '💰', pct: 100, trend: 'Season total' },
          { label: 'Costs', value: fmt(costs), color: '#c0392b', bg: '#fdecea', icon: '📉', pct: revenue > 0 ? (costs/revenue)*100 : 0, trend: `${revenue > 0 ? Math.round((costs/revenue)*100) : 0}% of rev` },
          { label: 'Wages', value: fmt(wages), color: '#c97d1a', bg: '#fef3e2', icon: '👷', pct: revenue > 0 ? (wages/revenue)*100 : 0, trend: `${workers.length} workers` },
          { label: 'Net', value: fmt(net), color: net >= 0 ? '#1a6b3a' : '#c0392b', bg: net >= 0 ? '#e8f5ee' : '#fdecea', icon: net >= 0 ? '✔' : '↓', pct: revenue > 0 ? Math.min(Math.abs(net)/revenue*100, 100) : 0, trend: net >= 0 ? 'Profit' : 'Loss' },
        ].map((m, i) => (
          <div key={i} className="metric-card-mobile">
            <div className="mc-lbl"><div className="mc-ico" style={{ background: m.bg }}>{m.icon}</div> {m.label}</div>
            <div className="mc-val" style={{ color: m.color }}>{m.value}</div>
            <div className="mc-sub">{m.trend}</div>
            <div className="mc-bar"><div style={{ width: `${Math.min(m.pct, 100)}%`, background: m.color }} /></div>
          </div>
        ))}
      </div>

      {/* ═══ ROW 3: INSIGHT STRIP — Health Score | Briefing | Achievements ═══ */}
      <div style={S.insightStrip} className="insight-strip">
        {/* Farm Health Score */}
        {healthScore && (
          <div style={{ ...card, padding: '14px 12px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={sectionLabel}>Farm Health</div>
            <div style={{ position: 'relative', width: 110, height: 65, margin: '0 auto 6px' }}>
              <svg viewBox="0 0 130 80" style={{ width: '100%', height: '100%' }}>
                <path d="M 15 75 A 55 55 0 0 1 115 75" fill="none" stroke="#f3f4f6" strokeWidth="10" strokeLinecap="round" />
                <path d="M 15 75 A 55 55 0 0 1 115 75" fill="none"
                  stroke={hsColor} strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${(healthScore.score / 100) * 157} 157`}
                />
              </svg>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, textAlign: 'center' }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: hsColor, lineHeight: 1 }}>
                  {healthScore.score}
                </div>
              </div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: hsColor, marginBottom: 8 }}>
              {healthScore.grade}
            </div>
            {healthScore.breakdown && Object.entries(healthScore.breakdown).map(([key, val]) => {
              const max = healthScore.max_scores?.[key] || 20;
              const pct = (val / max) * 100;
              const labels = { debt_ratio: 'Debt', field_utilization: 'Fields', profitability: 'Profit', record_keeping: 'Records', water_consistency: 'Water', budget_discipline: 'Budget', diversification: 'Diverse' };
              return (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                  <span style={{ fontSize: 7, color: '#9ca3af', width: 36, flexShrink: 0, textAlign: 'left' }}>{labels[key] || key}</span>
                  <div style={{ flex: 1, height: 3, background: '#f3f4f6', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: pct >= 70 ? '#1a6b3a' : pct >= 40 ? '#c97d1a' : '#c0392b', borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: 7, color: '#6b7280', width: 16, textAlign: 'right' }}>{Math.round(val)}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* AI Morning Briefing */}
        <div style={{ ...card, display: 'flex', flexDirection: 'column' }}>
          <div style={{ ...sectionLabel, marginBottom: 8 }}>
            💡 Today's Briefing
            {briefing?.total_alerts > 0 && (
              <span style={{ background: '#fef3e2', color: '#92400e', fontSize: 8, fontWeight: 700, padding: '1px 6px', borderRadius: 8, marginLeft: 4 }}>
                {briefing.total_alerts}
              </span>
            )}
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {briefing?.insights?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {briefing.insights.slice(0, 4).map((insight, i) => {
                  const colors = { danger: '#c0392b', warning: '#c97d1a', success: '#1a6b3a', info: '#0369a1' };
                  const bgs = { danger: '#fdecea', warning: '#fef3e2', success: '#e8f5ee', info: '#eff6ff' };
                  const icons = { loan: '🏢', overdue: '⚠️', water: '💧', budget: '📋', price: '📈', wages: '👷', stock: '📦', health: '💉' };
                  return (
                    <div key={i} style={{ display: 'flex', gap: 8, padding: '6px 8px', background: bgs[insight.type] || '#f9fafb', borderRadius: 6, borderLeft: `3px solid ${colors[insight.type] || '#6b7280'}` }}>
                      <span style={{ fontSize: 14, flexShrink: 0 }}>{icons[insight.icon] || '📌'}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: '#111827' }}>{insight.title}</div>
                        <div style={{ fontSize: 9, color: '#6b7280', marginTop: 1 }}>{insight.detail}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '16px 0', color: '#9ca3af', fontSize: 11 }}>
                ✅ All clear — no urgent items today
              </div>
            )}
          </div>
        </div>

        {/* Achievements + Quick Stats */}
        <div style={{ ...card, display: 'flex', flexDirection: 'column' }}>
          <div style={sectionLabel}>
            🏆 Achievements{achievementsData?.total_earned > 0 && ` (${achievementsData.total_earned})`}
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {achievementsData?.achievements?.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                {achievementsData.achievements.slice(0, 6).map(a => {
                  const badgeIcons = { revenue: '💰', profit: '✅', harvest: '🌾', debt: '🔓', diverse: '🌱', livestock: '🐄', active: '🔥', water: '💧', field: '🏞️' };
                  return (
                    <div key={a.key} style={{ background: '#f9fafb', borderRadius: 8, padding: '8px 4px', textAlign: 'center', border: '1px solid #e5e7eb' }}>
                      <div style={{ fontSize: 18, marginBottom: 2 }}>{badgeIcons[a.icon] || '🏆'}</div>
                      <div style={{ fontSize: 8, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>{a.title}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '16px 0', color: '#9ca3af', fontSize: 11 }}>
                No milestones earned yet. Keep going!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══ ROW 4: SEASONAL COMPARISON (full width) ═══ */}
      {seasonal?.metrics && (
        <div style={{ ...card, marginBottom: 16, padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={sectionLabel}>📅 Season vs Season</div>
            <div style={{ fontSize: 9, color: '#9ca3af' }}>
              {seasonal.current_period} vs {seasonal.previous_period}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
            {/* Metric cards — left side */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }} className="seasonal-grid">
              {seasonal.metrics.map(m => {
                const isGood = m.invert ? m.change <= 0 : m.change >= 0;
                const arrow = m.change >= 0 ? '\u25B2' : '\u25BC';
                const changeColor = isGood ? '#1a6b3a' : '#c0392b';
                const fmtVal = (v) => m.format === 'currency' ? `$${Math.abs(v).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : m.format === 'kg' ? `${v.toLocaleString()} kg` : `${v.toLocaleString()} L`;
                const barMax = Math.max(Math.abs(m.current), Math.abs(m.previous)) || 1;
                return (
                  <div key={m.key} style={{
                    background: m.key === 'net' ? (m.current >= 0 ? '#f0faf4' : '#fff5f5') : '#f9fafb',
                    borderRadius: 8, padding: '10px 8px', textAlign: 'center',
                    border: m.key === 'net' ? `2px solid ${m.current >= 0 ? '#1a6b3a' : '#c0392b'}` : '1px solid #e5e7eb',
                  }}>
                    <div style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 4 }}>{m.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: m.key === 'net' ? (m.current >= 0 ? '#1a6b3a' : '#c0392b') : '#111827', fontFamily: "'Playfair Display', serif", marginBottom: 4 }}>
                      {m.key === 'net' && m.current < 0 ? '-' : ''}{fmtVal(m.current)}
                    </div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: changeColor, marginBottom: 6 }}>{arrow} {Math.abs(m.change)}%</div>
                    {/* Mini comparison bars */}
                    <div>
                      <div style={{ height: 3, background: '#e5e7eb', borderRadius: 2, overflow: 'hidden', marginBottom: 2 }}>
                        <div style={{ height: '100%', width: `${(Math.abs(m.current) / barMax) * 100}%`, background: '#1a6b3a', borderRadius: 2 }} />
                      </div>
                      <div style={{ height: 3, background: '#e5e7eb', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(Math.abs(m.previous) / barMax) * 100}%`, background: '#9ca3af', borderRadius: 2 }} />
                      </div>
                    </div>
                    <div style={{ fontSize: 7, color: '#9ca3af', marginTop: 3 }}>Prev: {m.key === 'net' && m.previous < 0 ? '-' : ''}{fmtVal(m.previous)}</div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Monthly trend mini-chart */}
          {seasonal.monthly_trend && (
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #e5e7eb', display: 'flex', alignItems: 'flex-end', gap: 0 }}>
              <div style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', writingMode: 'vertical-lr', transform: 'rotate(180deg)', marginRight: 6 }}>Trend</div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 4, height: 40 }}>
                {seasonal.monthly_trend.map((m, i) => {
                  const maxVal = Math.max(...seasonal.monthly_trend.map(x => Math.max(x.revenue, x.costs))) || 1;
                  const revH = (m.revenue / maxVal) * 34;
                  const costH = (m.costs / maxVal) * 34;
                  return (
                    <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 1, height: 34 }}>
                        <div style={{ width: 6, height: Math.max(revH, 2), background: '#1a6b3a', borderRadius: '2px 2px 0 0' }} title={`Rev: $${m.revenue.toFixed(0)}`} />
                        <div style={{ width: 6, height: Math.max(costH, 2), background: '#c0392b', borderRadius: '2px 2px 0 0' }} title={`Cost: $${m.costs.toFixed(0)}`} />
                      </div>
                      <div style={{ fontSize: 7, color: '#9ca3af', marginTop: 2 }}>{m.month}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginLeft: 10, justifyContent: 'center' }}>
                <span style={{ fontSize: 7, color: '#1a6b3a', display: 'flex', alignItems: 'center', gap: 3 }}>
                  <span style={{ width: 6, height: 3, background: '#1a6b3a', borderRadius: 1, display: 'inline-block' }} /> Revenue
                </span>
                <span style={{ fontSize: 7, color: '#c0392b', display: 'flex', alignItems: 'center', gap: 3 }}>
                  <span style={{ width: 6, height: 3, background: '#c0392b', borderRadius: 1, display: 'inline-block' }} /> Costs
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ ROW 5: MAIN CONTENT — Fields + Trips | Sidebar ═══ */}
      <div className="two-col-layout content-area" style={S.twoCol}>
        <div>
          <div style={S.sectionTitle}>🌾 Active Fields</div>
          <div className="field-cards-desktop" style={S.fieldGrid}>
            {activeFields.slice(0, 4).map(f => {
              const fRev = f.total_revenue || 0;
              const fCost = (f.total_costs || 0) + (f.total_labour || 0);
              const fNet = fRev - fCost;
              return (
                <div key={f.id} className="fcard" style={S.fcard} onClick={() => setSelectedField(f)}>
                  <div className="fcard-img" style={{ position: 'relative', height: 85, overflow: 'hidden' }}>
                    <img src={cropImage(f.crop)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={S.fcardOverlay} />
                    <span style={{ ...S.fcardLabel, position: 'absolute', bottom: 6, left: 10 }}>{cropEmoji(f.crop)} {f.name}</span>
                    <span className={`pill-${f.status === 'active' ? 'green' : 'amber'}`} style={S.fcardBadge}>{f.status}</span>
                  </div>
                  <div style={S.fcardBody}>
                    <div style={S.fcardName}>{f.name}</div>
                    <div style={S.fcardMeta}>{qty(f.size_ha || f.size_hectares || f.hectares)} ha &middot; {f.plant_date || '-'}</div>
                    <div style={S.fcardStats}>
                      <div style={S.fcardStat}><div style={S.fcardStatVal('#1a6b3a')}>{fmt(fRev)}</div><div style={S.fcardStatLabel}>Revenue</div></div>
                      <div style={S.fcardStat}><div style={S.fcardStatVal('#c0392b')}>{fmt(fCost)}</div><div style={S.fcardStatLabel}>Costs</div></div>
                      <div style={S.fcardStat}><div style={S.fcardStatVal(fNet >= 0 ? '#1a6b3a' : '#c0392b')}>{fmt(fNet)}</div><div style={S.fcardStatLabel}>Net</div></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {activeFields.length === 0 && <p style={{ fontSize: 11, color: '#9ca3af' }}>No active fields. Open a new field to get started.</p>}

          {/* Mobile field cards */}
          <div className="field-cards-mobile">
            {activeFields.slice(0, 6).map(f => {
              const mfRev = f.total_revenue || 0;
              const mfCost = (f.total_costs || 0) + (f.total_labour || 0);
              const mfNet = mfRev - mfCost;
              return (
                <div key={f.id} className="field-card-mobile" onClick={() => setSelectedField(f)}>
                  <div className="fcm-img">
                    <img src={cropImage(f.crop)} alt="" />
                    <div className="fcm-overlay" />
                    <span className="fcm-label">{cropEmoji(f.crop)} {f.name}</span>
                    <span className="fcm-badge" style={{ color: f.status === 'active' ? '#1a6b3a' : '#c97d1a' }}>{f.status}</span>
                  </div>
                  <div className="fcm-body">
                    <div style={{ fontSize: 9, color: '#9ca3af' }}>{qty(f.size_ha || f.size_hectares || f.hectares)} ha &middot; {f.crop}</div>
                    <div className="fcm-stats">
                      <div className="fcm-stat"><div className="fv" style={{ color: '#1a6b3a' }}>{fmt(mfRev)}</div><div className="fl">Rev</div></div>
                      <div className="fcm-stat"><div className="fv" style={{ color: '#c0392b' }}>{fmt(mfCost)}</div><div className="fl">Cost</div></div>
                      <div className="fcm-stat"><div className="fv" style={{ color: mfNet >= 0 ? '#1a6b3a' : '#c0392b' }}>{fmt(mfNet)}</div><div className="fl">Net</div></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Market Trips */}
          <div style={S.sectionTitle}>🚛 Recent Market Trips</div>
          <div style={{ position: 'relative', height: 65, borderRadius: 10, overflow: 'hidden', marginBottom: 12 }}>
            <img src={IMAGES.truck} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(180,40,0,0.78), rgba(0,0,0,0.2))' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '10px 14px', color: '#fff', zIndex: 1 }}>
              <div style={S.bannerText}>Tomato crates ready for market</div>
              <div style={S.bannerSub}>Track your sales and trip expenses</div>
            </div>
          </div>
          {trips.length > 0 ? (
            <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', overflow: 'hidden', marginBottom: 12 }}>
              <table style={S.table}>
                <thead><tr>
                  <th style={S.th}>Market</th><th style={S.th}>Date</th><th style={S.th}>Fields</th>
                  <th style={S.th}>Crates</th><th style={S.th}>Revenue</th><th style={S.th}>Status</th>
                </tr></thead>
                <tbody>
                  {trips.slice(0, 3).map((t, i) => (
                    <tr key={t.id || i}>
                      <td style={S.td}>{t.location || t.market}</td>
                      <td style={S.td}>{t.date}</td>
                      <td style={S.td}>{t.field_count || t.fields || '-'}</td>
                      <td style={S.td}>{t.total_crates || t.crates || '-'}</td>
                      <td style={{ ...S.td, fontWeight: 700, color: '#1a6b3a' }}>{fmt(t.revenue || t.total_revenue)}</td>
                      <td style={S.td}><span className="pill-green">Done</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 12 }}>No trips recorded yet.</p>}
        </div>

        {/* RIGHT SIDEBAR */}
        <div>
          {/* Dam banner */}
          <div style={{ position: 'relative', height: 100, borderRadius: 10, overflow: 'hidden', marginBottom: 12 }}>
            <img src={IMAGES.dam} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(30,58,95,0.7), rgba(0,0,0,0.2))' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '10px 14px', color: '#fff', zIndex: 1 }}>
              <div style={S.bannerText}>Makonese Dam</div>
              <div style={S.bannerSub}>Primary irrigation source</div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div style={S.rightCard}>
            <div style={{ ...S.sectionTitle, marginBottom: 10 }}>📊 Cost Breakdown</div>
            {Object.entries(breakdown).map(([cat, val], i) => (
              <div key={cat} style={S.barRow}>
                <span style={S.barLabel}>{cat}</span>
                <div style={S.barTrack}>
                  <div style={S.barFill(BREAKDOWN_COLORS[i % BREAKDOWN_COLORS.length], (val / totalBreakdown) * 100)} />
                </div>
                <span style={S.barAmt}>{fmt(val)}</span>
              </div>
            ))}
            {Object.keys(breakdown).length === 0 && <p style={{ fontSize: 10, color: '#9ca3af' }}>No costs recorded yet.</p>}
          </div>

          {/* Stock Alerts */}
          <div style={S.rightCard}>
            <div style={{ ...S.sectionTitle, marginBottom: 8 }}>{'\u26A0\uFE0F'} Stock Alerts</div>
            {(lowStock.length > 0 ? lowStock : (d.low_stock || [])).slice(0, 3).map((s, i) => {
              const pct = s.opening_qty > 0 ? ((s.remaining ?? 0) / s.opening_qty) * 100 : 0;
              return (
                <div key={s.id || i} style={S.stockRow}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#111827' }}>{s.name}</div>
                    <div style={{ fontSize: 9, color: '#9ca3af' }}>{qty(s.remaining ?? 0)} {s.unit} left</div>
                    <div style={{ ...S.barTrack, marginTop: 3 }}>
                      <div style={S.barFill(pct < 25 ? '#c0392b' : '#1a6b3a', pct)} />
                    </div>
                  </div>
                  <span className={pct < 25 ? 'pill-red' : 'pill-amber'}>{pct < 25 ? 'Critical' : 'Low'}</span>
                </div>
              );
            })}
            {(lowStock.length === 0 && (!d.low_stock || d.low_stock.length === 0)) && (
              <p style={{ fontSize: 10, color: '#9ca3af' }}>All stock levels OK.</p>
            )}
          </div>

          {/* Livestock Summary */}
          {d.livestock && d.livestock.total_animals > 0 && (
            <div style={S.rightCard}>
              <div style={{ ...S.sectionTitle, marginBottom: 8 }}>🐄 Livestock</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4, marginBottom: 8 }}>
                {[
                  { label: 'Cattle', val: d.livestock.cattle, emoji: '🐄' },
                  { label: 'Goats', val: d.livestock.goats, emoji: '🐐' },
                  { label: 'Sheep', val: d.livestock.sheep, emoji: '🐑' },
                  { label: 'Pigs', val: d.livestock.pigs, emoji: '🐗' },
                  { label: 'Broilers', val: d.livestock.broilers, emoji: '🐔' },
                  { label: 'Layers', val: d.livestock.layers, emoji: '🥚' },
                ].filter(a => a.val > 0).map((a, i) => (
                  <div key={i} style={{ textAlign: 'center', background: '#f9fafb', borderRadius: 6, padding: '4px 2px' }}>
                    <div style={{ fontSize: 14 }}>{a.emoji}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>{a.val}</div>
                    <div style={{ fontSize: 7, color: '#9ca3af', textTransform: 'uppercase' }}>{a.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, padding: '4px 0', borderTop: '1px solid #f3f4f6' }}>
                <span style={{ color: '#6b7280' }}>Sales Revenue</span>
                <span style={{ fontWeight: 700, color: '#1a6b3a' }}>{fmt(d.livestock.sales_revenue)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, padding: '4px 0', borderBottom: '1px solid #f3f4f6' }}>
                <span style={{ color: '#6b7280' }}>Health & Feed</span>
                <span style={{ fontWeight: 700, color: '#c0392b' }}>{fmt(d.livestock.total_costs)}</span>
              </div>
              {d.livestock.total_eggs > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, padding: '4px 0' }}>
                  <span style={{ color: '#6b7280' }}>Eggs Collected</span>
                  <span style={{ fontWeight: 700, color: '#c97d1a' }}>{d.livestock.total_eggs}</span>
                </div>
              )}
            </div>
          )}

          {/* Wages Owed */}
          <div style={S.rightCard}>
            <div style={{ ...S.sectionTitle, marginBottom: 8 }}>💰 Wages Owed</div>
            {workers.filter(w => (w.wages_owed || w.owed || 0) > 0).slice(0, 4).map((w, i) => {
              const ac = avatarColor(w.name || '');
              return (
                <div key={w.id || i} style={S.wageRow}>
                  <div style={S.wageAvatar(ac.bg)}>{initials(w.name)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: '#111827' }}>{w.name}</div>
                    <div style={{ fontSize: 8, color: '#9ca3af' }}>{w.role}</div>
                  </div>
                  <span style={{ fontWeight: 700, color: '#c0392b', fontSize: 11 }}>{fmt(w.wages_owed || w.owed || 0)}</span>
                </div>
              );
            })}
            {workers.filter(w => (w.wages_owed || w.owed || 0) > 0).length === 0 && (
              <p style={{ fontSize: 10, color: '#9ca3af' }}>No wages outstanding.</p>
            )}
          </div>
        </div>
      </div>

      {/* AI Farm Summary */}
      <div style={{ marginTop: 16 }}>
        <AIInsightCard feature="farm_seasonal_planner" title="AI Seasonal Planner" />
      </div>

      <FieldModal field={selectedField} isOpen={!!selectedField} onClose={() => setSelectedField(null)} />
    </>
  );
}
