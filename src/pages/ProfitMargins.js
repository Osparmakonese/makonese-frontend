import { useAuth } from '../context/AuthContext';

export default function ProfitMargins({ onTabChange }) {
  const { user } = useAuth();

  const isOwner = user?.role === 'owner';

  const marginData = [
    { sku: 'CABLE-LN', product: 'Lightning Cable', cost: '$2.00', sell: '$5.00', margin: '$3.00', marginPercent: 60.0, unitsSold: 45, totalProfit: '$135.00', status: 'Excellent' },
    { sku: 'CASE-IP15', product: 'iPhone 15 Case', cost: '$3.50', sell: '$8.00', margin: '$4.50', marginPercent: 56.3, unitsSold: 38, totalProfit: '$171.00', status: 'Excellent' },
    { sku: 'SCR-PRO', product: 'Screen Protector', cost: '$1.20', sell: '$3.00', margin: '$1.80', marginPercent: 60.0, unitsSold: 62, totalProfit: '$111.60', status: 'Excellent' },
    { sku: 'CHAR-USB', product: 'USB-C Charger', cost: '$8.00', sell: '$15.00', margin: '$7.00', marginPercent: 46.7, unitsSold: 28, totalProfit: '$196.00', status: 'Good' },
    { sku: 'EAR-BT', product: 'BT Earbuds', cost: '$12.00', sell: '$25.00', margin: '$13.00', marginPercent: 52.0, unitsSold: 15, totalProfit: '$195.00', status: 'Good' },
    { sku: 'CAR-CHR', product: 'Car Charger', cost: '$6.00', sell: '$12.00', margin: '$6.00', marginPercent: 50.0, unitsSold: 20, totalProfit: '$120.00', status: 'Good' },
    { sku: 'PWR-10K', product: 'Power Bank 10000mAh', cost: '$15.00', sell: '$30.00', margin: '$15.00', marginPercent: 50.0, unitsSold: 12, totalProfit: '$180.00', status: 'Good' },
    { sku: 'SPK-BT', product: 'BT Speaker Mini', cost: '$18.00', sell: '$35.00', margin: '$17.00', marginPercent: 48.6, unitsSold: 8, totalProfit: '$136.00', status: 'Good' },
    { sku: 'HDMI-1M', product: 'HDMI Cable', cost: '$3.00', sell: '$8.00', margin: '$5.00', marginPercent: 62.5, unitsSold: 22, totalProfit: '$110.00', status: 'Excellent' }
  ];

  const getMarginColor = (percent) => {
    if (percent > 50) return '#1a6b3a';
    if (percent >= 30) return '#2563eb';
    return '#c0392b';
  };

  const getStatusColor = (status) => {
    return status === 'Excellent' ? '#1a6b3a' : '#2563eb';
  };

  const getStatusBg = (status) => {
    return status === 'Excellent' ? '#e8f5ee' : '#EFF6FF';
  };

  const insights = [
    {
      color: '#1a6b3a',
      text: 'Lightning Cable has 60% margin with strong demand (45 units). Consider bundling with chargers.'
    },
    {
      color: '#2563eb',
      text: 'BT Speaker margin at 48.6% could improve by negotiating bulk pricing with AudioTech SA.'
    },
    {
      color: '#c97d1a',
      text: 'Screen Protectors have highest volume (62 units). Small price increase of $0.50 would add $31/month profit.'
    }
  ];

  const marginRanges = [
    { label: 'Excellent (>50%)', count: 5, color: '#1a6b3a' },
    { label: 'Good (30-50%)', count: 4, color: '#2563eb' },
    { label: 'Below Target (<30%)', count: 0, color: '#c0392b' }
  ];

  const totalProducts = marginRanges.reduce((sum, range) => sum + range.count, 0);

  return (
    <div style={{ padding: 24, fontFamily: "'Inter', sans-serif", backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Playfair Display', serif", margin: 0, color: '#111827' }}>
          Profit Margins
        </h1>
        {isOwner && (
          <button
            style={{
              background: '#fff',
              color: '#1a6b3a',
              border: '2px solid #1a6b3a',
              padding: '8px 16px',
              borderRadius: 7,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Export CSV
          </button>
        )}
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 24 }}>
        {/* Avg. Margin */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#e8f5ee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18
              }}
            >
              📊
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: '#6b7280', fontWeight: 500, marginBottom: 4 }}>
                AVG. MARGIN
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Playfair Display', serif", color: '#1a6b3a', marginBottom: 2 }}>
                46.2%
              </div>
              <div style={{ fontSize: 9, color: '#9ca3af' }}>All products</div>
            </div>
          </div>
        </div>

        {/* Highest Margin */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#e8f5ee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18
              }}
            >
              ⬆️
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: '#6b7280', fontWeight: 500, marginBottom: 4 }}>
                HIGHEST MARGIN
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1a6b3a', marginBottom: 2, lineHeight: 1.3 }}>
                60.0%
              </div>
              <div style={{ fontSize: 8, color: '#9ca3af' }}>Lightning Cable</div>
            </div>
          </div>
        </div>

        {/* Lowest Margin */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#fdecea',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18
              }}
            >
              ⬇️
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: '#6b7280', fontWeight: 500, marginBottom: 4 }}>
                LOWEST MARGIN
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#c0392b', marginBottom: 2, lineHeight: 1.3 }}>
                22.9%
              </div>
              <div style={{ fontSize: 8, color: '#9ca3af' }}>BT Speaker</div>
            </div>
          </div>
        </div>

        {/* Below Target */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#fef3e2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18
              }}
            >
              ⚠️
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: '#6b7280', fontWeight: 500, marginBottom: 4 }}>
                BELOW TARGET (&lt;30%)
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Playfair Display', serif", color: '#c97d1a', marginBottom: 2 }}>
                2
              </div>
              <div style={{ fontSize: 9, color: '#9ca3af' }}>products</div>
            </div>
          </div>
        </div>
      </div>

      {/* Margin Analysis Table */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 16, marginBottom: 24 }}>
        <h3 style={{ fontSize: 12, fontWeight: 700, margin: '0 0 16px 0', color: '#111827' }}>
          Margin Analysis by Product
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, minWidth: 800 }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>SKU</th>
                <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Product</th>
                <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>Cost</th>
                <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>Sell</th>
                <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>Margin $</th>
                <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>Margin %</th>
                <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>Units Sold</th>
                <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>Total Profit</th>
                <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {marginData.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#1a6b3a', fontFamily: 'monospace', fontWeight: 600, fontSize: 10 }}>
                    {item.sku}
                  </td>
                  <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#111827', fontWeight: 600 }}>
                    {item.product}
                  </td>
                  <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#374151', textAlign: 'right' }}>
                    {item.cost}
                  </td>
                  <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#374151', textAlign: 'right' }}>
                    {item.sell}
                  </td>
                  <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#374151', textAlign: 'right' }}>
                    {item.margin}
                  </td>
                  <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: getMarginColor(item.marginPercent), fontWeight: 600, textAlign: 'right' }}>
                    {item.marginPercent.toFixed(1)}%
                  </td>
                  <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#374151', textAlign: 'right' }}>
                    {item.unitsSold}
                  </td>
                  <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#111827', fontWeight: 700, textAlign: 'right' }}>
                    {item.totalProfit}
                  </td>
                  <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6' }}>
                    <span style={{ fontSize: 8, fontWeight: 700, padding: '2px 7px', borderRadius: 20, textTransform: 'uppercase', background: getStatusBg(item.status), color: getStatusColor(item.status) }}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {/* Margin Distribution */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 16 }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, margin: '0 0 16px 0', color: '#111827' }}>
            Products by Margin Range
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {marginRanges.map((range, idx) => {
              const percentage = (range.count / totalProducts) * 100;
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ minWidth: 140, fontSize: 10, fontWeight: 600, color: '#374151' }}>
                    {range.label}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      height: 8,
                      background: '#f3f4f6',
                      borderRadius: 4,
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        background: range.color,
                        width: `${percentage}%`,
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                  <div style={{ minWidth: 35, fontSize: 10, fontWeight: 700, color: '#111827', textAlign: 'right' }}>
                    {range.count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pricing Recommendations */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 16 }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, margin: '0 0 16px 0', color: '#111827', display: 'flex', alignItems: 'center', gap: 8 }}>
            AI Pricing Insights
            <span style={{ fontSize: 8, fontWeight: 700, padding: '2px 7px', borderRadius: 20, textTransform: 'uppercase', background: '#f3e8ff', color: '#7c3aed' }}>
              AI
            </span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {insights.map((insight, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 10 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: insight.color,
                    marginTop: 4,
                    flexShrink: 0
                  }}
                />
                <div style={{ fontSize: 10, color: '#374151', lineHeight: 1.5 }}>
                  {insight.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
