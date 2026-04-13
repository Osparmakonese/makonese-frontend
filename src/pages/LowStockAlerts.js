import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getLowStockProducts, getProducts } from '../api/retailApi';

const S = {
  page: { maxWidth: 1200, margin: '0 auto', padding: 20 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 13, fontWeight: 700, color: '#111827', fontFamily: "'Playfair Display', serif", margin: 0 },
  headerBtn: { background: '#fff', color: '#1a6b3a', border: '1px solid #1a6b3a', padding: '6px 12px', borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: 'pointer' },
  alertBanner: { background: '#fdecea', border: '1px solid #c0392b', borderRadius: 8, padding: '8px 12px', marginBottom: 16, color: '#c0392b', fontSize: 11, fontWeight: 600 },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 },
  metricCard: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 16 },
  metricLabel: { fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: 8 },
  metricValue: { fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, marginBottom: 12 },
  metricIcon: { width: 48, height: 48, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 16, marginBottom: 16 },
  cardTitle: { fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 12 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 11 },
  th: { fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', textAlign: 'left' },
  td: { padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#374151' },
  skuId: { fontFamily: 'monospace', color: '#1a6b3a', fontWeight: 600 },
  badge: { display: 'inline-block', fontSize: 8, fontWeight: 700, padding: '2px 7px', borderRadius: 20, textTransform: 'uppercase', marginRight: 6 },
  badgeRed: { background: '#fdecea', color: '#c0392b' },
  badgeAmber: { background: '#fef3e2', color: '#c97d1a' },
  badgeGreen: { background: '#e8f5ee', color: '#1a6b3a' },
  progressBar: { width: '100%', height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden', marginTop: 4 },
  progressFill: { height: '100%', borderRadius: 3, transition: 'width 0.2s' },
  createPoBtn: { background: 'none', color: '#1a6b3a', border: '1px solid #1a6b3a', padding: '4px 8px', borderRadius: 5, fontSize: 10, fontWeight: 600, cursor: 'pointer' },
  infoBox: { background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, marginTop: 12, fontSize: 11, color: '#6b7280', lineHeight: 1.5 },
  toggleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #e5e7eb' },
  toggleLabel: { fontSize: 11, fontWeight: 500, color: '#374151' },
};

export default function LowStockAlerts({ onTabChange }) {
  useAuth();

  const { data: lowStockProducts = [], isLoading: lowStockLoading } = useQuery({
    queryKey: ['retail-low-stock'],
    queryFn: getLowStockProducts,
    staleTime: 30000
  });

  const { data: allProducts = [], isLoading: productsLoading } = useQuery({
    queryKey: ['retail-products'],
    queryFn: getProducts,
    staleTime: 30000
  });

  const stockData = useMemo(() => {
    return lowStockProducts.map(product => {
      const percentage = product.quantity_in_stock / product.reorder_level;
      let status = 'Low';
      if (percentage < 0.25) {
        status = 'Critical';
      }

      return {
        id: product.id,
        sku: product.sku || `SKU-${product.id}`,
        name: product.name,
        current: product.quantity_in_stock,
        reorder: product.reorder_level,
        status,
        order: Math.ceil(product.reorder_level * 1.2),
        supplier: product.supplier || 'N/A',
        category: product.category || 'N/A'
      };
    });
  }, [lowStockProducts]);

  const getStockPercentage = (current, reorder) => Math.min((current / reorder) * 100, 100);
  const getProgressColor = (status) => {
    if (status === 'Critical') return '#c0392b';
    if (status === 'Low') return '#c97d1a';
    return '#1a6b3a';
  };

  const criticalCount = stockData.filter(s => s.status === 'Critical').length;
  const lowCount = stockData.filter(s => s.status === 'Low').length;
  const healthyCount = useMemo(() => {
    if (allProducts.length === 0) return 0;
    const lowStockIds = new Set(lowStockProducts.map(p => p.id));
    return allProducts.filter(p => !lowStockIds.has(p.id)).length;
  }, [allProducts, lowStockProducts]);

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <h1 style={S.title}>Low Stock Alerts</h1>
        <button style={S.headerBtn}>Configure Alerts</button>
      </div>

      {/* Alert Banner */}
      {criticalCount > 0 && (
        <div style={S.alertBanner}>
          {criticalCount} product{criticalCount > 1 ? 's' : ''} critically low — below 25% of reorder point. Action required.
        </div>
      )}

      {/* Metrics */}
      <div style={S.metricsGrid}>
        <div style={S.metricCard}>
          <div style={S.metricLabel}>Critical (&lt; 25%)</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ ...S.metricValue, color: '#c0392b' }}>{criticalCount}</div>
            <div style={{ ...S.metricIcon, background: '#fdecea' }}>⚠️</div>
          </div>
          <div style={{ ...S.progressBar, background: '#fdecea' }}>
            <div style={{ ...S.progressFill, background: '#c0392b', width: '30%' }}></div>
          </div>
        </div>
        <div style={S.metricCard}>
          <div style={S.metricLabel}>Low Stock (25-50%)</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ ...S.metricValue, color: '#c97d1a' }}>{lowCount}</div>
            <div style={{ ...S.metricIcon, background: '#fef3e2' }}>📦</div>
          </div>
          <div style={{ ...S.progressBar, background: '#fef3e2' }}>
            <div style={{ ...S.progressFill, background: '#c97d1a', width: '50%' }}></div>
          </div>
        </div>
        <div style={S.metricCard}>
          <div style={S.metricLabel}>Healthy (> 50%)</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ ...S.metricValue, color: '#1a6b3a' }}>{healthyCount}</div>
            <div style={{ ...S.metricIcon, background: '#e8f5ee' }}>✓</div>
          </div>
          <div style={{ ...S.progressBar, background: '#e8f5ee' }}>
            <div style={{ ...S.progressFill, background: '#1a6b3a', width: '75%' }}></div>
          </div>
        </div>
      </div>

      {/* Products Below Reorder Point */}
      <div style={S.card}>
        <h2 style={S.cardTitle}>Products Below Reorder Point</h2>
        {lowStockLoading ? (
          <div style={{ padding: 20, textAlign: 'center', color: '#6b7280' }}>Loading low stock products...</div>
        ) : stockData.length === 0 ? (
          <div style={{ padding: 20, textAlign: 'center', color: '#6b7280' }}>No low stock products</div>
        ) : (
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>SKU</th>
                <th style={S.th}>Product</th>
                <th style={S.th}>Current Stock</th>
                <th style={S.th}>Reorder Point</th>
                <th style={S.th}>Status</th>
                <th style={S.th}>Suggested Order</th>
                <th style={S.th}>Supplier</th>
              </tr>
            </thead>
            <tbody>
              {stockData.map((item) => {
                const percentage = getStockPercentage(item.current, item.reorder);
                const badgeClass = item.status === 'Critical' ? S.badgeRed : S.badgeAmber;
                return (
                  <tr key={item.id}>
                    <td style={{ ...S.td, ...S.skuId }}>{item.sku}</td>
                    <td style={S.td}>{item.name}</td>
                    <td style={S.td}>{item.current} units</td>
                    <td style={S.td}>{item.reorder} units</td>
                    <td style={S.td}>
                      <span style={{ ...S.badge, ...badgeClass, fontWeight: 700 }}>
                        {item.status}
                      </span>
                      <div style={S.progressBar}>
                        <div style={{ ...S.progressFill, background: getProgressColor(item.status), width: `${percentage}%` }}></div>
                      </div>
                    </td>
                    <td style={S.td}>{item.order} units</td>
                    <td style={S.td}>{item.supplier}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Reorder Settings */}
      <div style={S.card}>
        <h2 style={S.cardTitle}>Reorder Settings</h2>
        <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 16 }}>
          Default reorder point: 20 units. Configure per-product thresholds in Products page.
        </div>
        <div style={S.toggleRow}>
          <span style={S.toggleLabel}>Email daily low stock summary</span>
          <input type="checkbox" defaultChecked style={{ width: 18, height: 18, cursor: 'pointer' }} />
        </div>
        <div style={S.toggleRow}>
          <span style={S.toggleLabel}>WhatsApp critical alerts</span>
          <input type="checkbox" defaultChecked style={{ width: 18, height: 18, cursor: 'pointer' }} />
        </div>
      </div>
    </div>
  );
}
