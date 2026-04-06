import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDashboard, getLowStock, getHealthScore, getBriefing, getAchievements, getSeasonalComparison } from '../api/farmApi';
import { fmt, qty, cropEmoji, cropGradient, initials, avatarColor, IMAGES, cropImage } from '../utils/format';
import { useAuth } from '../context/AuthContext';
import FieldModal from '../components/FieldModal';

function Skeleton({ w, h, r, mb }) {
  return <div className="skeleton" style={{ width: w || '100%', height: h || 16, borderRadius: r || 6, marginBottom: mb || 0 }} />;
}
function SkeletonDash() {
  return (
    <>
      <Skeleton h={170} r={14} mb={18} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 18 }}>
        {[1,2,3,4].map(i => <Skeleton key={i} h={100} r={10} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 310px', gap: 18 }}>
        <div><Skeleton h={300} r={10} mb={14} /><Skeleton h={140} r={10} /></div>
        <div><Skeleton h={160} r={10} mb={14} /><Skeleton h={200} r={10} /></div>
      </div>
    </>
  );
}

const S = {
  hero: {
    height: 170, borderRadius: 14,
    position: 'relative', display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', padding: '0 28px', marginBottom: 20,
    overflow: 'hidden',
  },
  heroOverlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(135deg, rgba(26,107,58,0.55) 0%, rgba(0,0,0,0.15) 100%)',
  },
  heroLeft: { position: 'relative', zIndex: 2 },
  heroGreet: {
    fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700,
    color: '#fff', marginBottom: 4, textShadow: '0 1px 3px rgba(0,0,0,0.3)',
  },
  heroSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', textShadow: '0 1px 2px rgba(0,0,0,0.2)' },
  heroStats: { position: 'relative', zIndex: 2, display: 'flex', gap: 24 },
  heroStat: { textAlign: 'right' },
  heroStatVal: { fontSize: 18, fontWeight: 700, color: '#fff', fontFamily: "'Playfair Display', serif", textShadow: '0 1px 3px rgba(0,0,0,0.3)' },
  heroStatLabel: { fontSize: 9, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 18 },
  metricCard: {
    background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
    padding: '16px 18px', position: 'relative', overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },
  /* Von Restorff Effect: Net Position card stands out from the other 3 */
  metricCardHighlight: (isPositive) => ({
    background: isPositive ? '#f0faf4' : '#fff5f5',
    border: `2px solid ${isPositive ? '#1a6b3a' : '#c0392b'}`,
    borderRadius: 10, padding: '16px 18px', position: 'relative', overflow: 'hidden',
    boxShadow: isPositive ? '0 2px 8px rgba(26,107,58,0.15)' : '0 2px 8px rgba(192,57,43,0.15)',
  }),
  metricIcon: (bg) => ({ width: 26, height: 26, borderRadius: 6, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, marginBottom: 8 }),
  metricLabel: { fontSize: 10, color: '#6b7280', fontWeight: 500, marginBottom: 2 },
  metricVal: (color) => ({ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color, lineHeight: 1.2 }),
  metricTrend: { fontSize: 10, color: '#6b7280', marginTop: 4 },
  metricBar: () => ({ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: '#f3f4f6' }),
  metricBarInner: (color, pct) => ({ height: '100%', width: `${Math.min(pct, 100)}%`, background: color, borderRadius: '0 2px 0 0', transition: 'width 0.5s' }),
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 310px', gap: 18 },
  sectionTitle: { fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 },
  fieldGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 },
  fcard: { background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', overflow: 'hidden', cursor: 'pointer' },
  fcardOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.45) 100%)' },
  fcardLabel: { position: 'relative', zIndex: 2, color: '#fff', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, textShadow: '0 1px 3px rgba(0,0,0,0.4)' },
  fcardBadge: { position: 'absolute', top: 8, right: 8, zIndex: 2 },
  fcardBody: { padding: '10px 12px' },
  fcardName: { fontWeight: 700, fontSize: 13, color: '#111827' },
  fcardMeta: { fontSize: 10, color: '#9ca3af', marginBottom: 8 },
  fcardStats: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4, borderTop: '1px solid #e5e7eb', paddingTop: 8 },
  fcardStat: { textAlign: 'center' },
  fcardStatVal: (color) => ({ fontSize: 11, fontWeight: 700, color }),
  fcardStatLabel: { fontSize: 8, color: '#9ca3af', textTransform: 'uppercase' },
  bannerText: { color: '#fff', fontSize: 13, fontWeight: 600, position: 'relative', zIndex: 2, textShadow: '0 1px 3px rgba(0,0,0,0.3)' },
  bannerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 10, position: 'relative', zIndex: 2 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 11 },
  th: { textAlign: 'left', padding: '8px 10px', fontSize: 9, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' },
  td: { padding: '8px 10px', borderBottom: '1px solid #f3f4f6', color: '#374151' },
  rightCard: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px 16px', marginBottom: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  barRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, fontSize: 11 },
  barLabel: { width: 70, color: '#6b7280', fontSize: 10, fontWeight: 500, flexShrink: 0 },
  barTrack: { flex: 1, height: 8, background: '#f3f4f6', borderRadius: 4, overflow: 'hidden' },
  barFill: (color, pct) => ({ height: '100%', width: `${Math.min(pct, 100)}%`, background: color, borderRadius: 4, transition: 'width 0.4s' }),
  barAmt: { width: 70, textAlign: 'right', fontWeight: 600, color: '#374151', fontSize: 11 },
  stockRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #f3f4f6' },
  wageRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #f3f4f6' },
  wageAvatar: (bg) => ({ width: 28, height: 28, borderRadius: '50%', background: bg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, flexShrink: 0 }),
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

  return (
    <>
      <div className="hero-banner" style={S.hero}>
        <img src={IMAGES.dam} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={S.heroOverlay} />
        <div style={{ ...S.heroLeft, position: 'relative', zIndex: 1 }}>
          <div style={S.heroGreet}>{greeting}, {user?.username}</div>
          <div style={S.heroSub}>{activeFields.length} active field{activeFields.length !== 1 ? 's' : ''} - {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
        </div>
        <div style={S.heroStats}>
          <div style={S.heroStat}><div style={S.heroStatVal}>{fmt(revenue)}</div><div style={S.heroStatLabel}>Total Revenue</div></div>
          <div style={S.heroStat}><div style={S.heroStatVal}>{activeFields.length}</div><div style={S.heroStatLabel}>Active Fields</div></div>
          <div style={S.heroStat}><div style={S.heroStatVal}>{d.worker_count || workers.length || 0}</div><div style={S.heroStatLabel}>Workers</div></div>
          <div style={S.heroStat}><div style={S.heroStatVal}>{fmt(wages)}</div><div style={S.heroStatLabel}>Wages Owed</div></div>
        </div>
      </div>

      <div className="metric-grid-desktop" style={S.metricsGrid}>
        {[
          { label: 'Total Revenue', value: fmt(revenue), color: '#1a6b3a', bg: '#e8f5ee', icon: '💰', pct: 100, trend: 'Season total' },
          { label: 'Total Costs', value: fmt(costs), color: '#c0392b', bg: '#fdecea', icon: '📉', pct: revenue > 0 ? (costs/revenue)*100 : 0, trend: `${revenue > 0 ? Math.round((costs/revenue)*100) : 0}% of revenue` },
          { label: 'Wages Owed', value: fmt(wages), color: '#c97d1a', bg: '#fef3e2', icon: '👷', pct: revenue > 0 ? (wages/revenue)*100 : 0, trend: `${workers.length} workers` },
          { label: 'Net Position', value: fmt(net), color: net >= 0 ? '#1a6b3a' : '#c0392b', bg: net >= 0 ? '#e8f5ee' : '#fdecea', icon: net >= 0 ? '✔' : '↓', pct: revenue > 0 ? Math.min(Math.abs(net)/revenue*100, 100) : 0, trend: net >= 0 ? 'Profitable' : 'Loss', isNet: true },
        ].map((m, i) => (
          /* Von Restorff: Net Position card uses distinct style to isolate it */
          <div key={i} style={m.isNet ? S.metricCardHighlight(net >= 0) : S.metricCard}>
            <div style={S.metricIcon(m.bg)}>{m.icon}</div>
            <div style={S.metricLabel}>{m.label}</div>
            <div style={S.metricVal(m.color)}>{m.value}</div>
            <div style={S.metricTrend}>{m.trend}</div>
            <div style={S.metricBar(m.color, m.pct)}>
              <div style={S.metricBarInner(m.color, m.pct)} />
            </div>
          </div>
        ))}
      </div>

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

      {/* === FARM HEALTH SCORE + AI BRIEFING + ACHIEVEMENTS === */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 16, marginBottom: 18 }}>
        {/* Farm Health Score Gauge */}
        {healthScore && (
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px 16px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Farm Health Score</div>
            {/* SVG Gauge */}
            <div style={{ position: 'relative', width: 130, height: 80, margin: '0 auto 8px' }}>
              <svg viewBox="0 0 130 80" style={{ width: '100%', height: '100%' }}>
                {/* Background arc */}
                <path d="M 15 75 A 55 55 0 0 1 115 75" fill="none" stroke="#f3f4f6" strokeWidth="10" strokeLinecap="round" />
                {/* Score arc */}
                <path d="M 15 75 A 55 55 0 0 1 115 75" fill="none"
                  stroke={healthScore.score >= 65 ? '#1a6b3a' : healthScore.score >= 50 ? '#c97d1a' : '#c0392b'}
                  strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${(healthScore.score / 100) * 157} 157`}
                />
              </svg>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, textAlign: 'center' }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: healthScore.score >= 65 ? '#1a6b3a' : healthScore.score >= 50 ? '#c97d1a' : '#c0392b', lineHeight: 1 }}>
                  {healthScore.score}
                </div>
              </div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: healthScore.score >= 65 ? '#1a6b3a' : healthScore.score >= 50 ? '#c97d1a' : '#c0392b', marginBottom: 8 }}>
              {healthScore.grade}
            </div>
            {/* Score breakdown bars */}
            <div style={{ textAlign: 'left' }}>
              {healthScore.breakdown && Object.entries(healthScore.breakdown).map(([key, val]) => {
                const max = healthScore.max_scores?.[key] || 20;
                const pct = (val / max) * 100;
                const labels = { debt_ratio: 'Debt', field_utilization: 'Fields', profitability: 'Profit', record_keeping: 'Records', water_consistency: 'Water', budget_discipline: 'Budget', diversification: 'Diverse' };
                return (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
                    <span style={{ fontSize: 8, color: '#9ca3af', width: 40, flexShrink: 0 }}>{labels[key] || key}</span>
                    <div style={{ flex: 1, height: 4, background: '#f3f4f6', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: pct >= 70 ? '#1a6b3a' : pct >= 40 ? '#c97d1a' : '#c0392b', borderRadius: 2, transition: 'width 0.4s' }} />
                    </div>
                    <span style={{ fontSize: 8, color: '#6b7280', width: 20, textAlign: 'right' }}>{Math.round(val)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* AI Morning Briefing */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '16px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            {'\u{1F4A1}'} Today's Briefing
            {briefing?.total_alerts > 0 && (
              <span style={{ background: '#fef3e2', color: '#92400e', fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 8 }}>
                {briefing.total_alerts} alert{briefing.total_alerts !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          {briefing?.insights?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {briefing.insights.slice(0, 5).map((insight, i) => {
                const colors = { danger: '#c0392b', warning: '#c97d1a', success: '#1a6b3a', info: '#0369a1' };
                const bgs = { danger: '#fdecea', warning: '#fef3e2', success: '#e8f5ee', info: '#eff6ff' };
                const icons = { loan: '\u{1F3E6}', overdue: '\u26A0\uFE0F', water: '\u{1F4A7}', budget: '\u{1F4CB}', price: '\u{1F4C8}', wages: '\u{1F477}', stock: '\u{1F4E6}', health: '\u{1F489}' };
                return (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 10px', background: bgs[insight.type] || '#f9fafb', borderRadius: 8, borderLeft: `3px solid ${colors[insight.type] || '#6b7280'}` }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{icons[insight.icon] || '\u{1F4CC}'}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>{insight.title}</div>
                      <div style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>{insight.detail}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#9ca3af', fontSize: 12 }}>
              {'\u2705'} All clear — no urgent items today
            </div>
          )}
        </div>
      </div>

      {/* Achievement Milestones */}
      {achievementsData?.achievements?.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            {'\u{1F3C6}'} Achievements ({achievementsData.total_earned})
          </div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {achievementsData.achievements.map(a => {
              const badgeIcons = { revenue: '\u{1F4B0}', profit: '\u2705', harvest: '\u{1F33E}', debt: '\u{1F513}', diverse: '\u{1F331}', livestock: '\u{1F404}', active: '\u{1F525}', water: '\u{1F4A7}', field: '\u{1F3DE}\uFE0F' };
              return (
                <div key={a.key} style={{ flexShrink: 0, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '10px 14px', textAlign: 'center', minWidth: 90, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{badgeIcons[a.icon] || '\u{1F3C6}'}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>{a.title}</div>
                  <div style={{ fontSize: 8, color: '#9ca3af', marginTop: 2 }}>{a.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Seasonal Comparison */}
      {seasonal?.metrics && (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '16px 18px', marginBottom: 18, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: 6 }}>
                {'\u{1F4C5}'} Season vs Season
              </div>
              <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>
                Current: {seasonal.current_period} vs Previous: {seasonal.previous_period}
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }} className="seasonal-grid">
            {seasonal.metrics.map(m => {
              const isGood = m.invert ? m.change <= 0 : m.change >= 0;
              const arrow = m.change >= 0 ? '\u25B2' : '\u25BC';
              const changeColor = isGood ? '#1a6b3a' : '#c0392b';
              const fmtVal = (v) => m.format === 'currency' ? `$${Math.abs(v).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : m.format === 'kg' ? `${v.toLocaleString()} kg` : `${v.toLocaleString()} L`;
              const barMax = Math.max(m.current, m.previous) || 1;
              return (
                <div key={m.key} style={{ background: '#f9fafb', borderRadius: 10, padding: '12px 14px', border: m.key === 'net' ? `2px solid ${m.current >= 0 ? '#1a6b3a' : '#c0392b'}` : '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>{m.label}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: changeColor }}>{arrow} {Math.abs(m.change)}%</span>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: m.key === 'net' ? (m.current >= 0 ? '#1a6b3a' : '#c0392b') : '#111827', fontFamily: "'Playfair Display', serif", marginBottom: 8 }}>
                    {m.key === 'net' && m.current < 0 ? '-' : ''}{fmtVal(m.current)}
                  </div>
                  {/* Comparison bars */}
                  <div style={{ marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      <span style={{ fontSize: 8, color: '#6b7280', width: 36 }}>Now</span>
                      <div style={{ flex: 1, height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(Math.abs(m.current) / barMax) * 100}%`, background: '#1a6b3a', borderRadius: 3 }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 8, color: '#6b7280', width: 36 }}>Before</span>
                      <div style={{ flex: 1, height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(Math.abs(m.previous) / barMax) * 100}%`, background: '#9ca3af', borderRadius: 3 }} />
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 8, color: '#9ca3af', textAlign: 'right' }}>
                    Prev: {m.key === 'net' && m.previous < 0 ? '-' : ''}{fmtVal(m.previous)}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Monthly trend mini-chart */}
          {seasonal.monthly_trend && (
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', marginBottom: 8 }}>
                Monthly Trend (6 months)
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 60 }}>
                {seasonal.monthly_trend.map((m, i) => {
                  const maxVal = Math.max(...seasonal.monthly_trend.map(x => Math.max(x.revenue, x.costs))) || 1;
                  const revH = (m.revenue / maxVal) * 50;
                  const costH = (m.costs / maxVal) * 50;
                  return (
                    <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 2, height: 50 }}>
                        <div style={{ width: 8, height: Math.max(revH, 2), background: '#1a6b3a', borderRadius: '2px 2px 0 0' }} title={`Rev: $${m.revenue.toFixed(0)}`} />
                        <div style={{ width: 8, height: Math.max(costH, 2), background: '#c0392b', borderRadius: '2px 2px 0 0' }} title={`Cost: $${m.costs.toFixed(0)}`} />
                      </div>
                      <div style={{ fontSize: 8, color: '#9ca3af', marginTop: 3 }}>{m.month}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 6 }}>
                <span style={{ fontSize: 8, color: '#1a6b3a', display: 'flex', alignItems: 'center', gap: 3 }}>
                  <span style={{ width: 8, height: 4, background: '#1a6b3a', borderRadius: 1, display: 'inline-block' }} /> Revenue
                </span>
                <span style={{ fontSize: 8, color: '#c0392b', display: 'flex', alignItems: 'center', gap: 3 }}>
                  <span style={{ width: 8, height: 4, background: '#c0392b', borderRadius: 1, display: 'inline-block' }} /> Costs
                </span>
              </div>
            </div>
          )}
        </div>
      )}

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
                  <div className="fcard-img" style={{ position: 'relative', height: 100, overflow: 'hidden' }}>
                    <img src={cropImage(f.crop)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={S.fcardOverlay} />
                    <span style={{ ...S.fcardLabel, position: 'absolute', bottom: 8, left: 12 }}>{cropEmoji(f.crop)} {f.name}</span>
                    <span className={`pill-${f.status === 'active' ? 'green' : 'amber'}`} style={S.fcardBadge}>{f.status}</span>
                  </div>
                  <div style={S.fcardBody}>
                    <div style={S.fcardName}>{f.name}</div>
                    <div style={S.fcardMeta}>{qty(f.size_ha || f.size_hectares || f.hectares)} ha - {f.plant_date || '-'}</div>
                    <div className={`pill-${f.status === 'active' ? 'green' : 'amber'}`} style={{ marginBottom: 8 }}>{f.status}</div>
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
          {activeFields.length === 0 && <p style={{ fontSize: 12, color: '#9ca3af' }}>No active fields. Open a new field to get started.</p>}

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
                    <div style={{ fontSize: 10, color: '#9ca3af' }}>{qty(f.size_ha || f.size_hectares || f.hectares)} ha - {f.crop}</div>
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

          <div style={S.sectionTitle}>🚛 Recent Market Trips</div>
          <div style={{ position: 'relative', height: 80, borderRadius: 10, overflow: 'hidden', marginBottom: 14 }}>
            <img src={IMAGES.truck} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(180,40,0,0.78), rgba(0,0,0,0.2))' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '12px 16px', color: '#fff', zIndex: 1 }}>
              <div style={S.bannerText}>Tomato crates ready for market</div>
              <div style={S.bannerSub}>Track your sales and trip expenses</div>
            </div>
          </div>
          {trips.length > 0 ? (
            <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', overflow: 'hidden', marginBottom: 14 }}>
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
          ) : <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 14 }}>No trips recorded yet.</p>}
        </div>

        <div>
          <div style={{ position: 'relative', height: 130, borderRadius: 10, overflow: 'hidden', marginBottom: 14 }}>
            <img src={IMAGES.dam} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(30,58,95,0.7), rgba(0,0,0,0.2))' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '12px 16px', color: '#fff', zIndex: 1 }}>
              <div style={S.bannerText}>Makonese Dam</div>
              <div style={S.bannerSub}>Primary irrigation source</div>
            </div>
          </div>

          <div style={S.rightCard}>
            <div style={{ ...S.sectionTitle, marginBottom: 14 }}>📊 Cost Breakdown</div>
            {Object.entries(breakdown).map(([cat, val], i) => (
              <div key={cat} style={S.barRow}>
                <span style={S.barLabel}>{cat}</span>
                <div style={S.barTrack}>
                  <div style={S.barFill(BREAKDOWN_COLORS[i % BREAKDOWN_COLORS.length], (val / totalBreakdown) * 100)} />
                </div>
                <span style={S.barAmt}>{fmt(val)}</span>
              </div>
            ))}
            {Object.keys(breakdown).length === 0 && <p style={{ fontSize: 11, color: '#9ca3af' }}>No costs recorded yet.</p>}
          </div>

          <div style={S.rightCard}>
            <div style={{ ...S.sectionTitle, marginBottom: 10 }}>⚠️ Stock Alerts</div>
            {(lowStock.length > 0 ? lowStock : (d.low_stock || [])).slice(0, 3).map((s, i) => {
              const pct = s.opening_qty > 0 ? ((s.remaining ?? 0) / s.opening_qty) * 100 : 0;
              return (
                <div key={s.id || i} style={S.stockRow}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>{s.name}</div>
                    <div style={{ fontSize: 10, color: '#9ca3af' }}>{qty(s.remaining ?? 0)} {s.unit} left</div>
                    <div style={{ ...S.barTrack, marginTop: 4 }}>
                      <div style={S.barFill(pct < 25 ? '#c0392b' : '#1a6b3a', pct)} />
                    </div>
                  </div>
                  <span className={pct < 25 ? 'pill-red' : 'pill-amber'}>{pct < 25 ? 'Critical' : 'Low'}</span>
                </div>
              );
            })}
            {(lowStock.length === 0 && (!d.low_stock || d.low_stock.length === 0)) && (
              <p style={{ fontSize: 11, color: '#9ca3af' }}>All stock levels OK.</p>
            )}
          </div>

          {/* Livestock Summary */}
          {d.livestock && d.livestock.total_animals > 0 && (
            <div style={S.rightCard}>
              <div style={{ ...S.sectionTitle, marginBottom: 10 }}>🐄 Livestock Overview</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 10 }}>
                {[
                  { label: 'Cattle', val: d.livestock.cattle, emoji: '🐄' },
                  { label: 'Goats', val: d.livestock.goats, emoji: '🐐' },
                  { label: 'Sheep', val: d.livestock.sheep, emoji: '🐑' },
                  { label: 'Pigs', val: d.livestock.pigs, emoji: '🐷' },
                  { label: 'Broilers', val: d.livestock.broilers, emoji: '🐔' },
                  { label: 'Layers', val: d.livestock.layers, emoji: '🥚' },
                ].filter(a => a.val > 0).map((a, i) => (
                  <div key={i} style={{ textAlign: 'center', background: '#f9fafb', borderRadius: 6, padding: '6px 4px' }}>
                    <div style={{ fontSize: 16 }}>{a.emoji}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{a.val}</div>
                    <div style={{ fontSize: 8, color: '#9ca3af', textTransform: 'uppercase' }}>{a.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '6px 0', borderTop: '1px solid #f3f4f6' }}>
                <span style={{ color: '#6b7280' }}>Sales Revenue</span>
                <span style={{ fontWeight: 700, color: '#1a6b3a' }}>{fmt(d.livestock.sales_revenue)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '6px 0', borderBottom: '1px solid #f3f4f6' }}>
                <span style={{ color: '#6b7280' }}>Health & Feed Costs</span>
                <span style={{ fontWeight: 700, color: '#c0392b' }}>{fmt(d.livestock.total_costs)}</span>
              </div>
              {d.livestock.total_eggs > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '6px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ color: '#6b7280' }}>Total Eggs Collected</span>
                  <span style={{ fontWeight: 700, color: '#c97d1a' }}>{d.livestock.total_eggs}</span>
                </div>
              )}
              {d.livestock.recent_health && d.livestock.recent_health.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 4 }}>Recent Health</div>
                  {d.livestock.recent_health.slice(0, 3).map((h, i) => (
                    <div key={i} style={{ fontSize: 10, color: '#6b7280', marginBottom: 2 }}>
                      {h.date}: {h.animal} - {h.desc} {h.cost > 0 && <span style={{ color: '#c0392b' }}>({fmt(h.cost)})</span>}
                    </div>
                  ))}
                </div>
              )}
              {d.livestock.upcoming_vaccinations && d.livestock.upcoming_vaccinations.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: '#c97d1a', textTransform: 'uppercase', marginBottom: 4 }}>Upcoming Vaccinations</div>
                  {d.livestock.upcoming_vaccinations.slice(0, 3).map((v, i) => (
                    <div key={i} style={{ fontSize: 10, color: '#6b7280', marginBottom: 2 }}>
                      {v.due}: {v.animal} - {v.desc}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div style={S.rightCard}>
            <div style={{ ...S.sectionTitle, marginBottom: 10 }}>💰 Wages Owed</div>
            {workers.filter(w => (w.wages_owed || w.owed || 0) > 0).slice(0, 5).map((w, i) => {
              const ac = avatarColor(w.name || '');
              return (
                <div key={w.id || i} style={S.wageRow}>
                  <div style={S.wageAvatar(ac.bg)}>{initials(w.name)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#111827' }}>{w.name}</div>
                    <div style={{ fontSize: 9, color: '#9ca3af' }}>{w.role}</div>
                  </div>
                  <span style={{ fontWeight: 700, color: '#c0392b', fontSize: 12 }}>{fmt(w.wages_owed || w.owed || 0)}</span>
                </div>
              );
            })}
            {workers.filter(w => (w.wages_owed || w.owed || 0) > 0).length === 0 && (
              <p style={{ fontSize: 11, color: '#9ca3af' }}>No wages outstanding.</p>
            )}
          </div>
        </div>
      </div>

      <FieldModal field={selectedField} isOpen={!!selectedField} onClose={() => setSelectedField(null)} />
    </>
  );
}
