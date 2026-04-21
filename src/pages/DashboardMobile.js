import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDashboard, getLowStock, getHealthScore, getBriefing, getAchievements, getSeasonalComparison } from '../api/farmApi';
import { fmt, qty, cropEmoji, initials, avatarColor, cropImage, HERO_IMAGES } from '../utils/format';
import { useAuth } from '../context/AuthContext';
import FieldModal from '../components/FieldModal';
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

function Skeleton({ w, h, r, mb }) {
  return <div className="skeleton" style={{ width: w || '100%', height: h || 16, borderRadius: r || 6, marginBottom: mb || 0 }} />;
}
function SkeletonDash() {
  return (
    <>
      <Skeleton h={64} r={10} mb={18} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 18 }}>
        {[1,2,3,4].map(i => <Skeleton key={i} h={92} r={10} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
        <Skeleton h={220} r={10} /><Skeleton h={220} r={10} />
      </div>
      <Skeleton h={180} r={10} />
    </>
  );
}

/* ─── Shared styles ─── */
const card = {
  background: '#fff',
  border: `1px solid ${T.line}`,
  borderRadius: 14,
  padding: '18px 20px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
};

const S = {
  /* Greeting band — replaces old photo hero */
  greet: {
    background: `linear-gradient(135deg, ${T.sand} 0%, ${T.sand2} 100%)`,
    borderRadius: 16,
    padding: '22px 26px 24px',
    marginBottom: 18,
    position: 'relative',
    overflow: 'hidden',
    border: `1px solid ${T.line}`,
  },
  greetHead: {
    fontFamily: SERIF,
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: '-0.025em',
    lineHeight: 1.05,
    color: T.ink,
    marginBottom: 4,
  },
  greetMeta: {
    fontSize: 12,
    color: T.muted,
    fontFamily: SANS,
  },
  greetKicker: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 10.5,
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: T.clay,
    marginBottom: 10,
  },

  /* Metric cards — cleaner than v1 */
  mGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 10,
    marginBottom: 18,
  },
  mCard: {
    background: '#fff',
    border: `1px solid ${T.line}`,
    borderRadius: 12,
    padding: '14px 16px',
  },
  mLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: T.muted,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 6,
    fontFamily: SANS,
  },
  mVal: (color) => ({
    fontFamily: SERIF,
    fontSize: 24,
    fontWeight: 700,
    color,
    letterSpacing: '-0.02em',
    lineHeight: 1,
    marginBottom: 6,
  }),
  mDelta: (good) => ({
    fontSize: 11,
    color: good ? T.forest : T.clay,
    fontWeight: 600,
    fontFamily: SANS,
  }),

  /* Two-col main area: Fields + Briefing */
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1.45fr 1fr',
    gap: 14,
    marginBottom: 18,
  },

  /* Section headers */
  secHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  secTitle: {
    fontFamily: SERIF,
    fontSize: 18,
    fontWeight: 700,
    color: T.ink,
    letterSpacing: '-0.015em',
    margin: 0,
  },
  secLink: {
    fontSize: 11,
    fontWeight: 700,
    color: T.clay,
    textDecoration: 'none',
    cursor: 'pointer',
    fontFamily: SANS,
  },

  /* Field cards */
  fGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
  },
  fCard: {
    background: '#fff',
    border: `1px solid ${T.line}`,
    borderRadius: 14,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'box-shadow .2s, transform .15s',
  },
  fPhoto: {
    width: '100%',
    height: 110,
    objectFit: 'cover',
    display: 'block',
  },
  fBody: { padding: '12px 14px 14px' },
  fName: {
    fontFamily: SERIF,
    fontWeight: 700,
    fontSize: 15,
    color: T.ink,
    letterSpacing: '-0.01em',
    lineHeight: 1.2,
    marginBottom: 2,
  },
  fStage: {
    fontSize: 10.5,
    fontWeight: 600,
    color: T.clay,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontFamily: SANS,
    marginBottom: 10,
  },
  fStats: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 6,
    paddingTop: 8,
    borderTop: `1px solid ${T.line}`,
  },
  fStat: { },
  fStatVal: (color) => ({
    fontFamily: SERIF,
    fontSize: 13,
    fontWeight: 700,
    color,
    letterSpacing: '-0.01em',
    lineHeight: 1.1,
  }),
  fStatLabel: {
    fontSize: 9,
    color: T.muted,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    fontFamily: SANS,
    marginTop: 1,
  },

  /* Today's Briefing */
  brief: {
    background: '#fff',
    border: `1px solid ${T.line}`,
    borderRadius: 14,
    padding: '18px 20px',
  },
  briefItem: {
    display: 'flex',
    gap: 10,
    alignItems: 'flex-start',
    padding: '10px 0',
    borderBottom: `1px solid ${T.line2}`,
  },
  briefDot: (color) => ({
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: color,
    flexShrink: 0,
    marginTop: 7,
  }),
  briefTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: T.ink,
    fontFamily: SANS,
    lineHeight: 1.3,
  },
  briefDetail: {
    fontSize: 11,
    color: T.muted,
    fontFamily: SANS,
    marginTop: 2,
    lineHeight: 1.4,
  },

  /* Detailed insights — below the fold */
  detailsToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 16px',
    background: 'transparent',
    border: `1px dashed ${T.line}`,
    borderRadius: 10,
    color: T.muted,
    fontFamily: SANS,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    width: '100%',
    marginBottom: 14,
  },
  detailsInner: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    marginBottom: 14,
  },

  /* Sidebar items (stock, wages) */
  rowItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 0',
    borderBottom: `1px solid ${T.line2}`,
  },
  avatar: (bg) => ({
    width: 30,
    height: 30,
    borderRadius: '50%',
    background: bg,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 10,
    fontWeight: 700,
    flexShrink: 0,
    fontFamily: SANS,
  }),

  errorBox: {
    textAlign: 'center',
    padding: 40,
    color: T.muted,
    fontFamily: SANS,
  },
};

function stageLabel(f) {
  const stage = f.stage || f.growth_stage || f.status || '';
  if (stage && stage !== 'active') return stage;
  if (f.plant_date) return 'In field';
  return 'Active';
}

function severityColor(type) {
  if (type === 'danger') return T.clay;
  if (type === 'warning') return T.terra;
  if (type === 'success') return T.forest;
  return T.forest2;
}

export default function DashboardMobile({ activeModule = 'farm' }) {
  const { user } = useAuth();
  const [selectedField, setSelectedField] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

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
      <button onClick={() => refetch()} style={{
        background: `linear-gradient(135deg, ${T.amber}, ${T.terra})`,
        color: '#fff', border: 'none', borderRadius: 999,
        padding: '8px 20px', cursor: 'pointer', fontSize: 12, fontWeight: 700,
        fontFamily: SANS, boxShadow: '0 6px 14px -6px rgba(217,86,44,.55)'
      }}>Retry</button>
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
  const dateStr = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  const BREAKDOWN_COLORS = [T.forest, T.amber, T.terra, T.clay, T.forest2, '#7a5230'];

  const costPct = revenue > 0 ? Math.round((costs / revenue) * 100) : 0;
  const wagesPct = revenue > 0 ? Math.round((wages / revenue) * 100) : 0;

  return (
    <>
      {/* ═══ GREETING BAND ═══ */}
      <div style={S.greet}>
        <div style={S.greetKicker}>
          <span style={{ width: 22, height: 2, background: T.clay, borderRadius: 2 }} />
          Pewil · Farm
        </div>
        <div style={S.greetHead}>{greeting}, {user?.username || 'there'}.</div>
        <div style={S.greetMeta}>
          {dateStr} · {activeFields.length} active field{activeFields.length !== 1 ? 's' : ''}
          {d.worker_count ? ` · ${d.worker_count} workers` : ''}
        </div>
      </div>

      {/* ═══ METRIC CARDS ═══ */}
      <div className="metric-grid-desktop" style={S.mGrid}>
        <div style={S.mCard}>
          <div style={S.mLabel}>Revenue</div>
          <div style={S.mVal(T.forest)}>{fmt(revenue)}</div>
          <div style={S.mDelta(true)}>Season total</div>
        </div>
        <div style={S.mCard}>
          <div style={S.mLabel}>Costs</div>
          <div style={S.mVal(T.clay)}>{fmt(costs)}</div>
          <div style={S.mDelta(costPct < 60)}>{costPct}% of revenue</div>
        </div>
        <div style={S.mCard}>
          <div style={S.mLabel}>Wages owed</div>
          <div style={S.mVal(T.terra)}>{fmt(wages)}</div>
          <div style={S.mDelta(wages === 0)}>Across {workers.length} worker{workers.length !== 1 ? 's' : ''}</div>
        </div>
        <div style={{ ...S.mCard, background: net >= 0 ? T.sand : T.sand2, border: `2px solid ${net >= 0 ? T.forest : T.clay}` }}>
          <div style={S.mLabel}>Net position</div>
          <div style={S.mVal(net >= 0 ? T.forest : T.clay)}>{fmt(net)}</div>
          <div style={S.mDelta(net >= 0)}>{net >= 0 ? 'Profitable' : 'Review costs'}</div>
        </div>
      </div>

      {/* Mobile metrics — CSS takes over below 768px */}
      <div className="metric-grid-mobile">
        {[
          { label: 'Revenue', value: fmt(revenue), color: T.forest, trend: 'Season total' },
          { label: 'Costs', value: fmt(costs), color: T.clay, trend: `${costPct}% of rev` },
          { label: 'Wages', value: fmt(wages), color: T.terra, trend: `${workers.length} workers` },
          { label: 'Net', value: fmt(net), color: net >= 0 ? T.forest : T.clay, trend: net >= 0 ? 'Profit' : 'Review' },
        ].map((m, i) => (
          <div key={i} className="metric-card-mobile">
            <div className="mc-lbl">{m.label}</div>
            <div className="mc-val" style={{ color: m.color, fontFamily: SERIF, fontSize: 20 }}>{m.value}</div>
            <div className="mc-sub">{m.trend}</div>
          </div>
        ))}
      </div>

      {/* ═══ MAIN: ACTIVE FIELDS + TODAY'S BRIEFING ═══ */}
      <div className="two-col-layout" style={S.mainGrid}>
        {/* Active Fields */}
        <div>
          <div style={S.secHead}>
            <h3 style={S.secTitle}>Active fields</h3>
            {activeFields.length > 4 && <span style={S.secLink}>See all →</span>}
          </div>
          {activeFields.length > 0 ? (
            <div className="field-cards-desktop" style={S.fGrid}>
              {activeFields.slice(0, 4).map(f => {
                const fRev = f.total_revenue || 0;
                const fCost = (f.total_costs || 0) + (f.total_labour || 0);
                const fNet = fRev - fCost;
                return (
                  <div
                    key={f.id}
                    className="fcard"
                    style={S.fCard}
                    onClick={() => setSelectedField(f)}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px -12px rgba(31,61,38,0.22)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}
                  >
                    <img src={cropImage(f.crop)} alt={f.name} style={S.fPhoto} />
                    <div style={S.fBody}>
                      <div style={S.fName}>{cropEmoji(f.crop)} {f.name} · {qty(f.size_ha || f.size_hectares || f.hectares)} ha</div>
                      <div style={S.fStage}>{stageLabel(f)}</div>
                      <div style={S.fStats}>
                        <div style={S.fStat}>
                          <div style={S.fStatVal(T.forest)}>{fmt(fRev)}</div>
                          <div style={S.fStatLabel}>Revenue</div>
                        </div>
                        <div style={S.fStat}>
                          <div style={S.fStatVal(T.clay)}>{fmt(fCost)}</div>
                          <div style={S.fStatLabel}>Spent</div>
                        </div>
                        <div style={S.fStat}>
                          <div style={S.fStatVal(fNet >= 0 ? T.forest : T.clay)}>{fmt(fNet)}</div>
                          <div style={S.fStatLabel}>Net</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ ...card, textAlign: 'center', padding: 30, color: T.muted, fontSize: 13, fontFamily: SANS }}>
              No active fields yet. Open a new field to get started.
            </div>
          )}

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
                    <span className="fcm-badge" style={{ color: T.forest }}>{stageLabel(f)}</span>
                  </div>
                  <div className="fcm-body">
                    <div style={{ fontSize: 10, color: T.muted, fontFamily: SANS }}>{qty(f.size_ha || f.size_hectares || f.hectares)} ha · {f.crop}</div>
                    <div className="fcm-stats">
                      <div className="fcm-stat"><div className="fv" style={{ color: T.forest, fontFamily: SERIF }}>{fmt(mfRev)}</div><div className="fl">Rev</div></div>
                      <div className="fcm-stat"><div className="fv" style={{ color: T.clay, fontFamily: SERIF }}>{fmt(mfCost)}</div><div className="fl">Spent</div></div>
                      <div className="fcm-stat"><div className="fv" style={{ color: mfNet >= 0 ? T.forest : T.clay, fontFamily: SERIF }}>{fmt(mfNet)}</div><div className="fl">Net</div></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's Briefing */}
        <div>
          <div style={S.secHead}>
            <h3 style={S.secTitle}>Today's briefing</h3>
            {briefing?.total_alerts > 0 && (
              <span style={{
                background: T.sand2, color: T.clay,
                fontSize: 10, fontWeight: 700, padding: '2px 8px',
                borderRadius: 10, fontFamily: SANS,
              }}>{briefing.total_alerts}</span>
            )}
          </div>
          <div style={S.brief}>
            {briefing?.insights?.length > 0 ? (
              briefing.insights.slice(0, 5).map((ins, i) => (
                <div key={i} style={{ ...S.briefItem, borderBottom: i === briefing.insights.length - 1 ? 'none' : S.briefItem.borderBottom }}>
                  <div style={S.briefDot(severityColor(ins.type))} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={S.briefTitle}>{ins.title}</div>
                    {ins.detail && <div style={S.briefDetail}>{ins.detail}</div>}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '20px 0', textAlign: 'center', color: T.muted, fontSize: 13, fontFamily: SANS }}>
                All clear — no urgent items today.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══ DETAILED INSIGHTS — collapsed by default ═══ */}
      <button
        onClick={() => setShowDetails(v => !v)}
        style={S.detailsToggle}
        onMouseEnter={e => { e.currentTarget.style.background = T.cream; e.currentTarget.style.borderColor = T.clay; e.currentTarget.style.color = T.clay; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = T.line; e.currentTarget.style.color = T.muted; }}
      >
        <span>{showDetails ? '▾' : '▸'}</span>
        {showDetails ? 'Hide detailed insights' : 'More insights — health score, seasonal comparison, stock, wages, trips'}
      </button>

      {showDetails && (
        <>
          {/* Health Score + Achievements + Seasonal — compact row */}
          <div style={S.detailsInner}>
            {/* Farm Health */}
            {healthScore && (
              <div style={card}>
                <div style={{ ...S.secHead, marginBottom: 12 }}>
                  <h4 style={{ ...S.secTitle, fontSize: 15 }}>Farm health</h4>
                  <span style={{ fontSize: 11, color: T.muted, fontFamily: SANS }}>{healthScore.grade}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{
                    width: 72, height: 72, flexShrink: 0, borderRadius: '50%',
                    background: `conic-gradient(${healthScore.score >= 65 ? T.forest : healthScore.score >= 50 ? T.terra : T.clay} 0deg ${(healthScore.score / 100) * 360}deg, ${T.line2} ${(healthScore.score / 100) * 360}deg 360deg)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative',
                  }}>
                    <div style={{ position: 'absolute', width: 58, height: 58, background: '#fff', borderRadius: '50%' }} />
                    <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700, color: T.ink, position: 'relative', zIndex: 2, letterSpacing: '-0.01em', lineHeight: 1 }}>
                      {healthScore.score}
                    </div>
                  </div>
                  {healthScore.breakdown && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px', flex: 1 }}>
                      {Object.entries(healthScore.breakdown).slice(0, 6).map(([k, v]) => {
                        const max = healthScore.max_scores?.[k] || 20;
                        const pct = (v / max) * 100;
                        const color = pct >= 70 ? T.forest : pct >= 40 ? T.terra : T.clay;
                        const labels = { debt_ratio: 'Debt', field_utilization: 'Fields', profitability: 'Profit', record_keeping: 'Records', water_consistency: 'Water', budget_discipline: 'Budget', diversification: 'Diversity' };
                        return (
                          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: T.muted, fontFamily: SANS }}>
                            <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }} />
                            <span>{labels[k] || k}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Achievements */}
            {achievementsData?.achievements?.length > 0 && (
              <div style={card}>
                <div style={{ ...S.secHead, marginBottom: 10 }}>
                  <h4 style={{ ...S.secTitle, fontSize: 15 }}>Achievements</h4>
                  <span style={{ fontSize: 11, color: T.muted, fontFamily: SANS }}>{achievementsData.total_earned} earned</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {achievementsData.achievements.slice(0, 6).map(a => {
                    const badgeIcons = { revenue: '💰', profit: '✅', harvest: '🌾', debt: '🔓', diverse: '🌱', livestock: '🐄', active: '🔥', water: '💧', field: '🏞️' };
                    return (
                      <div key={a.key} style={{ background: T.cream, borderRadius: 8, padding: '8px 4px', textAlign: 'center', border: `1px solid ${T.line}` }}>
                        <div style={{ fontSize: 20, marginBottom: 2 }}>{badgeIcons[a.icon] || '🏆'}</div>
                        <div style={{ fontSize: 9, fontWeight: 700, color: T.ink, lineHeight: 1.2, fontFamily: SANS }}>{a.title}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Seasonal comparison */}
          {seasonal?.metrics && (
            <div style={{ ...card, marginBottom: 14 }}>
              <div style={S.secHead}>
                <h4 style={{ ...S.secTitle, fontSize: 15 }}>Season vs season</h4>
                <span style={{ fontSize: 11, color: T.muted, fontFamily: SANS }}>{seasonal.current_period} vs {seasonal.previous_period}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
                {seasonal.metrics.map(m => {
                  const isGood = m.invert ? m.change <= 0 : m.change >= 0;
                  const arrow = m.change >= 0 ? '\u25B2' : '\u25BC';
                  const changeColor = isGood ? T.forest : T.clay;
                  const fmtVal = (v) => m.format === 'currency' ? `$${Math.abs(v).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : m.format === 'kg' ? `${v.toLocaleString()} kg` : `${v.toLocaleString()} L`;
                  return (
                    <div key={m.key} style={{
                      background: m.key === 'net' ? (m.current >= 0 ? T.sand : T.sand2) : T.cream,
                      borderRadius: 8, padding: '10px 8px', textAlign: 'center',
                      border: m.key === 'net' ? `2px solid ${m.current >= 0 ? T.forest : T.clay}` : `1px solid ${T.line}`,
                    }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: T.muted, textTransform: 'uppercase', marginBottom: 4, fontFamily: SANS, letterSpacing: '0.04em' }}>{m.label}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: m.key === 'net' ? (m.current >= 0 ? T.forest : T.clay) : T.ink, fontFamily: SERIF, letterSpacing: '-0.01em' }}>
                        {m.key === 'net' && m.current < 0 ? '-' : ''}{fmtVal(m.current)}
                      </div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: changeColor, marginTop: 3, fontFamily: SANS }}>{arrow} {Math.abs(m.change)}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stock + Wages + Cost breakdown + Livestock + Trips — 2-col grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            {/* Cost breakdown */}
            {Object.keys(breakdown).length > 0 && (
              <div style={card}>
                <h4 style={{ ...S.secTitle, fontSize: 15, marginBottom: 12 }}>Cost breakdown</h4>
                {Object.entries(breakdown).map(([cat, val], i) => (
                  <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ width: 80, fontSize: 11, color: T.muted, fontWeight: 600, fontFamily: SANS }}>{cat}</span>
                    <div style={{ flex: 1, height: 6, background: T.line2, borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(val / totalBreakdown) * 100}%`, background: BREAKDOWN_COLORS[i % BREAKDOWN_COLORS.length], borderRadius: 3 }} />
                    </div>
                    <span style={{ width: 72, textAlign: 'right', fontFamily: SERIF, fontWeight: 700, color: T.ink, fontSize: 13 }}>{fmt(val)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Stock alerts */}
            <div style={card}>
              <h4 style={{ ...S.secTitle, fontSize: 15, marginBottom: 10 }}>Stock alerts</h4>
              {(lowStock.length > 0 ? lowStock : (d.low_stock || [])).slice(0, 4).map((s, i) => {
                const pct = s.opening_qty > 0 ? ((s.remaining ?? 0) / s.opening_qty) * 100 : 0;
                const alertColor = pct < 25 ? T.clay : T.terra;
                return (
                  <div key={s.id || i} style={S.rowItem}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, fontFamily: SANS }}>{s.name}</div>
                      <div style={{ fontSize: 10, color: T.muted, fontFamily: SANS }}>{qty(s.remaining ?? 0)} {s.unit} left</div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: alertColor, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: SANS }}>
                      {pct < 25 ? 'Critical' : 'Low'}
                    </span>
                  </div>
                );
              })}
              {(lowStock.length === 0 && (!d.low_stock || d.low_stock.length === 0)) && (
                <div style={{ fontSize: 12, color: T.muted, fontFamily: SANS, padding: '8px 0' }}>All stock levels OK.</div>
              )}
            </div>

            {/* Wages owed */}
            <div style={card}>
              <h4 style={{ ...S.secTitle, fontSize: 15, marginBottom: 10 }}>Wages owed</h4>
              {workers.filter(w => (w.wages_owed || w.owed || 0) > 0).slice(0, 4).map((w, i) => {
                const ac = avatarColor(w.name || '');
                return (
                  <div key={w.id || i} style={S.rowItem}>
                    <div style={S.avatar(ac.bg)}>{initials(w.name)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, fontFamily: SANS }}>{w.name}</div>
                      <div style={{ fontSize: 10, color: T.muted, fontFamily: SANS }}>{w.role}</div>
                    </div>
                    <span style={{ fontFamily: SERIF, fontWeight: 700, color: T.clay, fontSize: 14 }}>{fmt(w.wages_owed || w.owed || 0)}</span>
                  </div>
                );
              })}
              {workers.filter(w => (w.wages_owed || w.owed || 0) > 0).length === 0 && (
                <div style={{ fontSize: 12, color: T.muted, fontFamily: SANS, padding: '8px 0' }}>No wages outstanding.</div>
              )}
            </div>

            {/* Livestock */}
            {d.livestock && d.livestock.total_animals > 0 && (
              <div style={card}>
                <h4 style={{ ...S.secTitle, fontSize: 15, marginBottom: 10 }}>Livestock</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 10 }}>
                  {[
                    { label: 'Cattle', val: d.livestock.cattle, emoji: '🐄' },
                    { label: 'Goats', val: d.livestock.goats, emoji: '🐐' },
                    { label: 'Sheep', val: d.livestock.sheep, emoji: '🐑' },
                    { label: 'Pigs', val: d.livestock.pigs, emoji: '🐗' },
                    { label: 'Broilers', val: d.livestock.broilers, emoji: '🐔' },
                    { label: 'Layers', val: d.livestock.layers, emoji: '🥚' },
                  ].filter(a => a.val > 0).map((a, i) => (
                    <div key={i} style={{ textAlign: 'center', background: T.cream, borderRadius: 8, padding: '6px 4px', border: `1px solid ${T.line}` }}>
                      <div style={{ fontSize: 16 }}>{a.emoji}</div>
                      <div style={{ fontFamily: SERIF, fontSize: 14, fontWeight: 700, color: T.ink, letterSpacing: '-0.01em' }}>{a.val}</div>
                      <div style={{ fontSize: 8, color: T.muted, textTransform: 'uppercase', fontFamily: SANS, letterSpacing: '0.04em' }}>{a.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '4px 0', borderTop: `1px solid ${T.line2}`, fontFamily: SANS }}>
                  <span style={{ color: T.muted }}>Sales revenue</span>
                  <span style={{ fontFamily: SERIF, fontWeight: 700, color: T.forest }}>{fmt(d.livestock.sales_revenue)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '4px 0', fontFamily: SANS }}>
                  <span style={{ color: T.muted }}>Health & feed</span>
                  <span style={{ fontFamily: SERIF, fontWeight: 700, color: T.clay }}>{fmt(d.livestock.total_costs)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Recent trips */}
          {trips.length > 0 && (
            <div style={{ ...card, marginBottom: 14 }}>
              <h4 style={{ ...S.secTitle, fontSize: 15, marginBottom: 10 }}>Recent market trips</h4>
              <div style={{ overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: SANS }}>
                  <thead>
                    <tr>
                      {['Market', 'Date', 'Fields', 'Crates', 'Revenue'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '8px 10px', fontSize: 9, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `1px solid ${T.line}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {trips.slice(0, 5).map((t, i) => (
                      <tr key={t.id || i}>
                        <td style={{ padding: '8px 10px', borderBottom: `1px solid ${T.line2}`, color: T.ink, fontWeight: 600 }}>{t.location || t.market}</td>
                        <td style={{ padding: '8px 10px', borderBottom: `1px solid ${T.line2}`, color: T.muted }}>{t.date}</td>
                        <td style={{ padding: '8px 10px', borderBottom: `1px solid ${T.line2}`, color: T.muted }}>{t.field_count || t.fields || '-'}</td>
                        <td style={{ padding: '8px 10px', borderBottom: `1px solid ${T.line2}`, color: T.muted }}>{t.total_crates || t.crates || '-'}</td>
                        <td style={{ padding: '8px 10px', borderBottom: `1px solid ${T.line2}`, fontFamily: SERIF, fontWeight: 700, color: T.forest }}>{fmt(t.revenue || t.total_revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* AI insight */}
          <div style={{ marginBottom: 14 }}>
            <AIInsightCard feature="farm_seasonal_planner" title="AI seasonal planner" />
          </div>
        </>
      )}

      <FieldModal field={selectedField} isOpen={!!selectedField} onClose={() => setSelectedField(null)} />
    </>
  );
}
