import React from 'react';
import { useAuth } from '../context/AuthContext';

const S = {
  page: { maxWidth: 1200, margin: '0 auto', padding: 20 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 13, fontWeight: 700, color: '#111827', fontFamily: "'Playfair Display', serif", margin: 0 },
  headerBtn: { background: '#1a6b3a', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: 'pointer' },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 },
  metricCard: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 16 },
  metricLabel: { fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: 8 },
  metricValue: { fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, marginBottom: 12 },
  metricIcon: { width: 48, height: 48, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 16, marginBottom: 16 },
  cardTitle: { fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 12 },
  promoGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 },
  promoCard: { border: '1px solid #e5e7eb', borderRadius: 8, padding: 14, borderLeft: '4px solid', position: 'relative' },
  promoName: { fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 4 },
  promoDesc: { fontSize: 11, color: '#6b7280', marginBottom: 8 },
  promoMeta: { fontSize: 10, color: '#9ca3af', marginBottom: 8 },
  badge: { display: 'inline-block', fontSize: 8, fontWeight: 700, padding: '2px 7px', borderRadius: 20, textTransform: 'uppercase', marginRight: 6 },
  badgeGreen: { background: '#e8f5ee', color: '#1a6b3a' },
  badgeBlue: { background: '#EFF6FF', color: '#2563eb' },
  badgePurple: { background: '#f3e8ff', color: '#7c3aed' },
  badgeAmber: { background: '#fef3e2', color: '#c97d1a' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 11 },
  th: { fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', textAlign: 'left' },
  td: { padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#374151' },
};

export default function Discounts({ onTabChange }) {
  const { user } = useAuth();
  const isOwnerOrManager = user?.role === 'owner' || user?.role === 'manager';

  const activePromotions = [
    {
      id: 1,
      name: 'Weekend Sale',
      description: '10% off all accessories',
      runs: 'Every Sat-Sun',
      type: 'Percentage',
      borderColor: '#1a6b3a',
      badgeClass: 'badgeGreen',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Buy 2 Get 1 Free',
      description: 'Lightning cables only',
      runs: '10 Apr – 20 Apr',
      type: 'BOGO',
      borderColor: '#2563eb',
      badgeClass: 'badgeBlue',
      status: 'Active',
    },
    {
      id: 3,
      name: 'New Customer Welcome',
      description: '$5 off first purchase over $20',
      runs: 'Ongoing',
      type: 'Fixed Amount',
      borderColor: '#7c3aed',
      badgeClass: 'badgePurple',
      status: 'Active',
    },
    {
      id: 4,
      name: 'Easter Special',
      description: '15% off power banks',
      runs: '18 Apr – 21 Apr',
      type: 'Percentage',
      borderColor: '#c97d1a',
      badgeClass: 'badgeAmber',
      status: 'Scheduled',
    },
  ];

  const pastPromotions = [
    { name: 'March Madness', type: '20% off', period: '1-7 Mar', timesUsed: 45, discounted: '$312.00', impact: '+$840 revenue' },
    { name: 'Valentine\'s Bundle', type: 'BOGO', period: '12-14 Feb', timesUsed: 28, discounted: '$196.00', impact: '+$520 revenue' },
    { name: 'New Year Sale', type: '15% off', period: '1-3 Jan', timesUsed: 62, discounted: '$445.00', impact: '+$1,200 revenue' },
    { name: 'Black Friday ZW', type: '25% off', period: '29 Nov', timesUsed: 89, discounted: '$680.00', impact: '+$1,800 revenue' },
  ];

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <h1 style={S.title}>Discounts & Promotions</h1>
        {isOwnerOrManager && (
          <button style={S.headerBtn}>+ Create Discount</button>
        )}
      </div>

      {/* Metrics */}
      <div style={S.metricsGrid}>
        <div style={S.metricCard}>
          <div style={S.metricLabel}>Active Promotions</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ ...S.metricValue, color: '#1a6b3a' }}>4</div>
            <div style={{ ...S.metricIcon, background: '#e8f5ee' }}>🎯</div>
          </div>
        </div>
        <div style={S.metricCard}>
          <div style={S.metricLabel}>Total Discount Given (MTD)</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ ...S.metricValue, color: '#c97d1a' }}>$186.50</div>
            <div style={{ ...S.metricIcon, background: '#fef3e2' }}>💰</div>
          </div>
        </div>
        <div style={S.metricCard}>
          <div style={S.metricLabel}>Avg. Discount Rate</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ ...S.metricValue, color: '#2563eb' }}>5.2%</div>
            <div style={{ ...S.metricIcon, background: '#EFF6FF' }}>📊</div>
          </div>
        </div>
      </div>

      {/* Active Promotions */}
      <div style={S.card}>
        <h2 style={S.cardTitle}>Active Promotions</h2>
        <div style={S.promoGrid}>
          {activePromotions.map(promo => (
            <div key={promo.id} style={{ ...S.promoCard, borderLeftColor: promo.borderColor }}>
              <div style={S.promoName}>{promo.name}</div>
              <div style={S.promoDesc}>{promo.description}</div>
              <div style={S.promoMeta}>Runs: {promo.runs}</div>
              <div>
                <span style={{ ...S.badge, ...S[promo.badgeClass] }}>{promo.type}</span>
                <span style={{ ...S.badge, background: '#e8f5ee', color: '#1a6b3a' }}>
                  {promo.status === 'Active' ? '✓' : '◯'} {promo.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Promotions Table */}
      <div style={S.card}>
        <h2 style={S.cardTitle}>Past Promotions</h2>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Name</th>
              <th style={S.th}>Type</th>
              <th style={S.th}>Period</th>
              <th style={S.th}>Times Used</th>
              <th style={S.th}>Total Discounted</th>
              <th style={S.th}>Revenue Impact</th>
            </tr>
          </thead>
          <tbody>
            {pastPromotions.map((promo, idx) => (
              <tr key={idx}>
                <td style={S.td}>{promo.name}</td>
                <td style={S.td}>{promo.type}</td>
                <td style={S.td}>{promo.period}</td>
                <td style={S.td}>{promo.timesUsed}</td>
                <td style={S.td}>{promo.discounted}</td>
                <td style={{ ...S.td, color: '#1a6b3a', fontWeight: 600 }}>{promo.impact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
