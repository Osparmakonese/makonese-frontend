import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDashboard, getLowStock } from '../api/farmApi';
import { fmt, cropEmoji, cropGradient, initials, avatarColor, IMAGES, cropImage } from '../utils/format';
import { useAuth } from '../context/AuthContext';
import FieldModal from '../components/FieldModal';

/* Ã¢â€â‚¬Ã¢â€â‚¬ Skeleton loader Ã¢â€â‚¬Ã¢â€â‚¬ */
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

/* Ã¢â€â‚¬Ã¢â€â‚¬ Styles Ã¢â€â‚¬Ã¢â€â‚¬ */
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
  heroStats: {
    position: 'relative', zIndex: 2, display: 'flex', gap: 24,
  },
  heroStat: { textAlign: 'right' },
  heroStatVal: { fontSize: 18, fontWeight: 700, color: '#fff', fontFamily: "'Playfair Display', serif", textShadow: '0 1px 3px rgba(0,0,0,0.3)' },
  heroStatLabel: { fontSize: 9, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em', textShadow: '0 1px 2px rgba(0,0,0,0.2)' },
  metricsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 18,
  },
  metricCard: {
    background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
    padding: '16px 18px', position: 'relative', overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'box-shadow 0.25s ease, transform 0.25s ease',
  },
  metricIcon: (bg) => ({
    width: 26, height: 26, borderRadius: 6, background: bg,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, marginBottom: 8,
  }),
  metricLabel: { fontSize: 10, color: '#6b7280', fontWeight: 500, marginBottom: 2 },
  metricVal: (color) => ({
    fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700,
    color, lineHeight: 1.2,
  }),
  metricTrend: { fontSize: 10, color: '#6b7280', marginTop: 4 },
  metricBar: (color, pct) => ({
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
    background: '#f3f4f6',
  }),
  metricBarInner: (color, pct) => ({
    height: '100%', width: `${Math.min(pct, 100)}%`, background: color,
    borderRadius: '0 2px 0 0', transition: 'width 0.5s',
  }),
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 310px', gap: 18 },
  sectionTitle: {
    fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 12,
    display: 'flex', alignItems: 'center', gap: 6,
  },
  fieldGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18,
  },
  fcard: {
    background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb',
    overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s',
  },
  fcardImg: (crop) => ({
    height: 100, background: cropGradient(crop), position: 'relative',
    display: 'flex', alignItems: 'flex-end', padding: '0 12px 8px',
  }),
  fcardOverlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.45) 100%)',
  },
  fcardLabel: {
    position: 'relative', zIndex: 2, color: '#fff', fontSize: 13,
    fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4,
    textShadow: '0 1px 3px rgba(0,0,0,0.4)',
  },
  fcardBadge: { position: 'absolute', top: 8, right: 8, zIndex: 2 },
  fcardBody: { padding: '10px 12px' },
  fcardName: { fontWeight: 700, fontSize: 13, color: '#111827' },
  fcardMeta: { fontSize: 10, color: '#9ca3af', marginBottom: 8 },
  fcardStats: {
    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4,
    borderTop: '1px solid #e5e7eb', paddingTop: 8,
  },
  fcardStat: { textAlign: 'center' },
  fcardStatVal: (color) => ({ fontSize: 11, fontWeight: 700, color }),
  fcardStatLabel: { fontSize: 8, color: '#9ca3af', textTransform: 'uppercase' },
  banner: (bg) => ({
    height: 80, borderRadius: 10, background: bg, padding: '16px 20px',
    display: 'flex', alignItems: 'center', marginBottom: 14, position: 'relative',
    overflow: 'hidden',
  }),
  bannerText: { color: '#fff', fontSize: 13, fontWeight: 600, position: 'relative', zIndex: 2, textShadow: '0 1px 3px rgba(0,0,0,0.3)' },
  bannerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 10, position: 'relative', zIndex: 2, textShadow: '0 1px 2px rgba(0,0,0,0.2)' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 11 },
  th: {
    textAlign: 'left', padding: '8px 10px', fontSize: 9, fontWeight: 700,
    color: '#9ca3af', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb',
    background: '#f9fafb',
  },
  td: { padding: '8px 10px', borderBottom: '1px solid #f3f4f6', color: '#374151' },
  rightCard: {
    background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
    padding: '14px 16px', marginBottom: 14,
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },
  barRow: {
    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, fontSize: 11,
  },
  barLabel: { width: 70, color: '#6b7280', fontSize: 10, fontWeight: 500, flexShrink: 0 },
  barTrack: {
    flex: 1, height: 8, background: '#f3f4f6', borderRadius: 4, overflow: 'hidden',
  },
  barFill: (color, pct) => ({
    height: '100%', width: `${Math.min(pct, 100)}%`, background: color, borderRadius: 4,
    transition: 'width 0.4s',
  }),
  barAmt: { width: 70, textAlign: 'right', fontWeight: 600, color: '#374151', fontSize: 11 },
  stockRow: {
    display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
    borderBottom: '1px solid #f3f4f6',
  },
  wageRow: {
    display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
    borderBottom: '1px solid #f3f4f6',
  },
  wageAvatar: (bg) => ({
    width: 28, height: 28, borderRadius: '50%', background: bg,
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 9, fontWeight: 700, flexShrink: 0,
  }),
  errorBox: {
    textAlign: 'center', padding: 40, color: '#6b7280',
  },
};

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedField, setSelectedField] = useState(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboard,
  });
  const { data: lowStock = [] } = useQuery({
    queryKey: ['lowStock'],
    queryFn: getLowStock,
  });

  if (isLoading) return <SkeletonDash />;
  if (error) return (
    <div style={S.errorBox}>
      <p style={{ fontSize: 16, marginBottom: 8 }}>Failed to load dashboard</p>
      <p style={{ fontSize: 12, marginBottom: 16 }}>{error.message}</p>
      <button
        onClick={() => refetch()}
        style={{ background: '#1a6b3a', color: '#fff', border: 'none', borderRadius: 7, padding: '8px 20px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
      >
        Retry
      </button>
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
      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Hero Banner Ã¢â€â‚¬Ã¢â€â‚¬ */}
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

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Metric Cards (desktop) Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <div className="metric-grid-desktop" style={S.metricsGrid}>
        {[
          { label: 'Total Revenue', value: fmt(revenue), color: '#1a6b3a', bg: '#e8f5ee', icon: '-', pct: 100, trend: 'Season total' },
          { label: 'Total Costs', value: fmt(costs), color: '#c0392b', bg: '#fdecea', icon: '-', pct: revenue > 0 ? (costs/revenue)*100 : 0, trend: `${revenue > 0 ? Math.round((costs/revenue)*100) : 0}% of revenue` },
          { label: 'Wages Owed', value: fmt(wages), color: '#c97d1a', bg: '#fef3e2', icon: '-', pct: revenue > 0 ? (wages/revenue)*100 : 0, trend: `${workers.length} workers` },
          { label: 'Net Position', value: fmt(net), color: net >= 0 ? '#1a6b3a' : '#c0392b', bg: net >= 0 ? '#e8f5ee' : '#fdecea', icon: net >= 0 ? 'Ã¢Å“â€œ' : '^', pct: revenue > 0 ? Math.min(Math.abs(net)/revenue*100, 100) : 0, trend: net >= 0 ? 'Profitable' : 'Loss' },
        ].map((m, i) => (
          <div key={i} style={S.metricCard}>
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

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Metric Cards (mobile) Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <div className="metric-grid-mobile">
        {[
          { label: 'Revenue', value: fmt(revenue), color: '#1a6b3a', bg: '#e8f5ee', icon: '-', pct: 100, trend: 'Season total' },
          { label: 'Costs', value: fmt(costs), color: '#c0392b', bg: '#fdecea', icon: '-', pct: revenue > 0 ? (costs/revenue)*100 : 0, trend: `${revenue > 0 ? Math.round((costs/revenue)*100) : 0}% of rev` },
          { label: 'Wages', value: fmt(wages), color: '#c97d1a', bg: '#fef3e2', icon: '-', pct: revenue > 0 ? (wages/revenue)*100 : 0, trend: `${workers.length} workers` },
          { label: 'Net', value: fmt(net), color: net >= 0 ? '#1a6b3a' : '#c0392b', bg: net >= 0 ? '#e8f5ee' : '#fdecea', icon: net >= 0 ? 'Ã¢Å“â€œ' : '^', pct: revenue > 0 ? Math.min(Math.abs(net)/revenue*100, 100) : 0, trend: net >= 0 ? 'Profit' : 'Loss' },
        ].map((m, i) => (
          <div key={i} className="metric-card-mobile">
            <div className="mc-lbl"><div className="mc-ico" style={{ background: m.bg }}>{m.icon}</div> {m.label}</div>
            <div className="mc-val" style={{ color: m.color }}>{m.value}</div>
            <div className="mc-sub">{m.trend}</div>
            <div className="mc-bar"><div style={{ width: `${Math.min(m.pct, 100)}%`, background: m.color }} /></div>
          </div>
        ))}
      </div>

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Two Column Layout Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <div className="two-col-layout content-area" style={S.twoCol}>
        {/* Left */}
        <div>
          <div style={S.sectionTitle}>🌾 Active Fields</div>
          <div className="field-cards-desktop" style={S.fieldGrid}>
            {activeFields.slice(0, 4).map(f => {
              const fRev = f.revenue || 0;
              const fCost = (f.costs || 0) + (f.labour || 0);
              const fNet = fRev - fCost;
              return (
                <div
                  key={f.id}
                  className="fcard"
                  style={S.fcard}
                  onClick={() => setSelectedField(f)}
                >
                  <div className="fcard-img" style={{ position: 'relative', height: 100, overflow: 'hidden' }}>
                    <img src={cropImage(f.crop)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} />
                    <div style={S.fcardOverlay} />
                    <span style={{ ...S.fcardLabel, position: 'absolute', bottom: 8, left: 12 }}>{cropEmoji(f.crop)} {f.name}</span>
                    <span className={`pill-${f.status === 'active' ? 'green' : 'amber'}`} style={S.fcardBadge}>{f.status}</span>
                  </div>
                  <div style={S.fcardBody}>
                    <div style={S.fcardName}>{f.name}</div>
                    <div style={S.fcardMeta}>{f.size_ha || f.hectares || f.size_hectares} ha - {f.plant_date || 'Ã¢â‚¬â€'}</div>
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

          {/* Mobile field cards */}
          <div className="field-cards-mobile">
            {activeFields.slice(0, 6).map(f => {
              const mfRev = f.revenue || 0;
              const mfCost = (f.costs || 0) + (f.labour || 0);
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
                    <div style={{ fontSize: 10, color: '#9ca3af' }}>{f.size_ha || f.hectares || f.size_hectares} ha - {f.crop}</div>
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

          {/* Recent trips */}
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
            <>
              <div className="trips-table" style={{ background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', overflow: 'hidden', marginBottom: 14 }}>
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
                        <td style={S.td}>{t.field_count || t.fields || 'Ã¢â‚¬â€'}</td>
                        <td style={S.td}>{t.total_crates || t.crates || 'Ã¢â‚¬â€'}</td>
                        <td style={{ ...S.td, fontWeight: 700, color: '#1a6b3a' }}>{fmt(t.revenue || t.total_revenue)}</td>
                        <td style={S.td}><span className="pill-green">Done</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="trips-list-mobile" style={{ marginBottom: 14 }}>
                {trips.slice(0, 5).map((t, i) => (
                  <div key={t.id || i} className="trip-item-mobile">
                    <div className="trip-icon-mobile"><img src={IMAGES.truck} alt="" /></div>
                    <div className="trip-info-mobile">
                      <div className="trip-market-mobile">{t.location || t.market}</div>
                      <div className="trip-meta-mobile">{t.total_crates || t.crates || 'Ã¢â‚¬â€'} crates - {t.field_count || t.fields || 'Ã¢â‚¬â€'} fields</div>
                    </div>
                    <div>
                      <div className="trip-rev-mobile">{fmt(t.revenue || t.total_revenue)}</div>
                      <div className="trip-date-mobile">{t.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 14 }}>No trips recorded yet.</p>}
        </div>

        {/* Right Column */}
        <div>
          {/* Dam banner */}
          <div style={{ position: 'relative', height: 130, borderRadius: 10, overflow: 'hidden', marginBottom: 14 }}>
            <img src={IMAGES.dam} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(30,58,95,0.7), rgba(0,0,0,0.2))' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '12px 16px', color: '#fff', zIndex: 1 }}>
              <div style={S.bannerText}>Makonese Dam</div>
              <div style={S.bannerSub}>Primary irrigation source</div>
            </div>
          </div>

          {/* Cost breakdown */}
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

          {/* Stock alerts */}
          <div style={S.rightCard}>
            <div style={{ ...S.sectionTitle, marginBottom: 10 }}>⚠️ Stock Alerts</div>
            {(lowStock.length > 0 ? lowStock : (d.low_stock || [])).slice(0, 3).map((s, i) => {
              const pct = s.opening_qty > 0 ? ((s.remaining ?? 0) / s.opening_qty) * 100 : 0;
              return (
                <div key={s.id || i} style={S.stockRow}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>{s.name}</div>
                    <div style={{ fontSize: 10, color: '#9ca3af' }}>{s.remaining ?? 0} {s.unit} left</div>
                    <div style={{ ...S.barTrack, marginTop: 4 }}>
                      <div style={S.barFill(pct < 25 ? '#c0392b' : '#1a6b3a', pct)} />
                    </div>
                  </div>
                  <span className={pct < 25 ? 'pill-red' : 'pill-amber'}>
                    {pct < 25 ? 'Critical' : 'Low'}
                  </span>
                </div>
              );
            })}
            {(lowStock.length === 0 && (!d.low_stock || d.low_stock.length === 0)) && (
              <p style={{ fontSize: 11, color: '#9ca3af' }}>All stock levels OK.</p>
            )}
          </div>

          {/* Wages owed */}
          <div style={S.rightCard}>
            <div style={{ ...S.sectionTitle, marginBottom: 10 }}>ðŸ’° Wages Owed</div>
            {workers.filter(w => (w.wages_owed || w.owed || 0) > 0).slice(0, 5).map((w, i) => {
              const ac = avatarColor(w.name || '');
              return (
                <div key={w.id || i} style={S.wageRow}>
                  <div style={S.wageAvatar(ac.bg)}>{initials(w.name)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#111827' }}>{w.name}</div>
                    <div style={{ fontSize: 9, color: '#9ca3af' }}>{w.role}</div>
                  </div>
                  <span style={{ fontWeight: 700, color: '#c0392b', fontSize: 12 }}>
                    {fmt(w.wages_owed || w.owed || 0)}
                  </span>
                </div>
              );
            })}
            {workers.filter(w => (w.wages_owed || w.owed || 0) > 0).length === 0 && (
              <p style={{ fontSize: 11, color: '#9ca3af' }}>No wages outstanding.</p>
            )}
          </div>
        </div>
      </div>

      {/* Field modal */}
      <FieldModal field={selectedField} isOpen={!!selectedField} onClose={() => setSelectedField(null)} />
    </>
  );
}
