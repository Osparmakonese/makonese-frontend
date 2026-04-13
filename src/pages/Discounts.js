import React, { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getDiscounts, createDiscount, deleteDiscount } from '../api/retailApi';

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
  const queryClient = useQueryClient();
  const isOwnerOrManager = user?.role === 'owner' || user?.role === 'manager';

  const { data: allDiscounts = [], isLoading } = useQuery({
    queryKey: ['retail-discounts'],
    queryFn: getDiscounts,
    staleTime: 30000
  });

  const createDiscountMutation = useMutation({
    mutationFn: createDiscount,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['retail-discounts'] })
  });

  const deleteDiscountMutation = useMutation({
    mutationFn: deleteDiscount,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['retail-discounts'] })
  });

  const getBorderColor = (type) => {
    const typeMap = {
      'percentage': '#1a6b3a',
      'fixed': '#2563eb',
      'bogo': '#7c3aed',
      'bundle': '#c97d1a'
    };
    return typeMap[type?.toLowerCase()] || '#1a6b3a';
  };

  const getBadgeClass = (type) => {
    const typeMap = {
      'percentage': 'badgeGreen',
      'fixed': 'badgeBlue',
      'bogo': 'badgePurple',
      'bundle': 'badgeAmber'
    };
    return typeMap[type?.toLowerCase()] || 'badgeGreen';
  };

  const activePromotions = useMemo(() =>
    allDiscounts.filter(d => d.is_current === true).map(d => ({
      id: d.id,
      name: d.name,
      description: d.code ? `Code: ${d.code}` : d.name,
      runs: d.start_date && d.end_date ? `${d.start_date} – ${d.end_date}` : 'Ongoing',
      type: d.discount_type,
      borderColor: getBorderColor(d.discount_type),
      badgeClass: getBadgeClass(d.discount_type),
      status: 'Active'
    }))
  , [allDiscounts]);

  const pastPromotions = useMemo(() =>
    allDiscounts.filter(d => d.is_expired === true).map(d => ({
      id: d.id,
      name: d.name,
      type: d.discount_type,
      period: d.start_date && d.end_date ? `${d.start_date} – ${d.end_date}` : 'N/A',
      timesUsed: d.times_used || 0,
      discounted: `$${(d.value || 0).toFixed(2)}`,
      impact: `${d.times_used > 0 ? '+' : ''}${(d.value * d.times_used).toFixed(2)}`
    }))
  , [allDiscounts]);

  const totalDiscounted = allDiscounts.reduce((sum, d) => sum + (d.times_used * d.value || 0), 0);
  const avgRate = allDiscounts.length > 0
    ? (allDiscounts.reduce((sum, d) => sum + (d.discount_type === 'percentage' ? d.value : 0), 0) / allDiscounts.length)
    : 0;

  const handleCreateDiscount = () => {
    createDiscountMutation.mutate({
      name: 'New Discount',
      discount_type: 'percentage',
      value: 10,
      min_purchase: 0,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      usage_limit: 100,
      code: 'NEWDISCOUNT'
    });
  };

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <h1 style={S.title}>Discounts & Promotions</h1>
        {isOwnerOrManager && (
          <button
            onClick={handleCreateDiscount}
            disabled={createDiscountMutation.isPending}
            style={{
              ...S.headerBtn,
              opacity: createDiscountMutation.isPending ? 0.6 : 1,
              cursor: createDiscountMutation.isPending ? 'not-allowed' : 'pointer'
            }}
          >
            + Create Discount
          </button>
        )}
      </div>

      {/* Metrics */}
      <div style={S.metricsGrid}>
        <div style={S.metricCard}>
          <div style={S.metricLabel}>Active Promotions</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ ...S.metricValue, color: '#1a6b3a' }}>{activePromotions.length}</div>
            <div style={{ ...S.metricIcon, background: '#e8f5ee' }}>🎯</div>
          </div>
        </div>
        <div style={S.metricCard}>
          <div style={S.metricLabel}>Total Discount Given</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ ...S.metricValue, color: '#c97d1a' }}>${totalDiscounted.toFixed(2)}</div>
            <div style={{ ...S.metricIcon, background: '#fef3e2' }}>💰</div>
          </div>
        </div>
        <div style={S.metricCard}>
          <div style={S.metricLabel}>Avg. Discount Rate</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ ...S.metricValue, color: '#2563eb' }}>{avgRate.toFixed(1)}%</div>
            <div style={{ ...S.metricIcon, background: '#EFF6FF' }}>📊</div>
          </div>
        </div>
      </div>

      {/* Active Promotions */}
      <div style={S.card}>
        <h2 style={S.cardTitle}>Active Promotions</h2>
        {isLoading ? (
          <div style={{ padding: 20, textAlign: 'center', color: '#6b7280' }}>Loading promotions...</div>
        ) : activePromotions.length === 0 ? (
          <div style={{ padding: 20, textAlign: 'center', color: '#6b7280' }}>No active promotions</div>
        ) : (
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
        )}
      </div>

      {/* Past Promotions Table */}
      <div style={S.card}>
        <h2 style={S.cardTitle}>Past Promotions</h2>
        {pastPromotions.length === 0 ? (
          <div style={{ padding: 20, textAlign: 'center', color: '#6b7280' }}>No past promotions</div>
        ) : (
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
              {pastPromotions.map((promo) => (
                <tr key={promo.id}>
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
        )}
      </div>
    </div>
  );
}
