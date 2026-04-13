import { useAuth } from '../context/AuthContext';

export default function Returns({ onTabChange }) {
  const { user } = useAuth();

  const isOwnerOrManager = user?.role === 'owner' || user?.role === 'manager';

  const returns = [
    {
      id: 'RET-008',
      date: '12 Apr',
      originalSale: 'SAL-0108',
      customer: 'Mary Banda',
      items: 1,
      amount: '$15.00',
      method: 'Cash',
      reason: 'Defective',
      status: 'Completed'
    },
    {
      id: 'RET-007',
      date: '10 Apr',
      originalSale: 'SAL-0095',
      customer: 'Peter Ncube',
      items: 2,
      amount: '$40.00',
      method: 'EcoCash',
      reason: 'Wrong item',
      status: 'Completed'
    },
    {
      id: 'RET-006',
      date: '8 Apr',
      originalSale: 'SAL-0089',
      customer: '-',
      items: 1,
      amount: '$8.00',
      method: 'Store Credit',
      reason: 'Changed mind',
      status: 'Completed'
    },
    {
      id: 'RET-005',
      date: '5 Apr',
      originalSale: 'SAL-0076',
      customer: 'James Moyo',
      items: 1,
      amount: '$25.00',
      method: 'Cash',
      reason: 'Defective',
      status: 'Completed'
    },
    {
      id: 'RET-004',
      date: '3 Apr',
      originalSale: 'SAL-0062',
      customer: 'Sarah Dube',
      items: 3,
      amount: '$42.00',
      method: 'EcoCash',
      reason: 'Damaged',
      status: 'Completed'
    },
    {
      id: 'RET-003',
      date: '1 Apr',
      originalSale: 'SAL-0051',
      customer: 'Grace Mutasa',
      items: 1,
      amount: '$5.00',
      method: 'Cash',
      reason: 'Wrong item',
      status: 'Pending'
    }
  ];

  const getReasonColor = (reason) => {
    switch (reason) {
      case 'Defective':
        return { bg: '#fdecea', color: '#c0392b' };
      case 'Wrong item':
        return { bg: '#EFF6FF', color: '#1d4ed8' };
      case 'Changed mind':
        return { bg: '#f3f4f6', color: '#6b7280' };
      case 'Damaged':
        return { bg: '#fef3e2', color: '#c97d1a' };
      default:
        return { bg: '#fff', color: '#111827' };
    }
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'Cash':
        return '#1a6b3a';
      case 'EcoCash':
        return '#2563eb';
      case 'Store Credit':
        return '#7c3aed';
      case 'Card':
        return '#6b7280';
      default:
        return '#374151';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return { bg: '#e8f5ee', color: '#1a6b3a' };
      case 'Pending':
        return { bg: '#fef3e2', color: '#c97d1a' };
      default:
        return { bg: '#f3f4f6', color: '#6b7280' };
    }
  };

  return (
    <div style={{ padding: 24, fontFamily: "'Inter', sans-serif", backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Playfair Display', serif", margin: 0, color: '#111827' }}>
          Returns & Refunds
        </h1>
        {isOwnerOrManager && (
          <button
            style={{
              background: '#1a6b3a',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: 7,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            + Process Return
          </button>
        )}
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 24 }}>
        {/* Returns This Month */}
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
                fontSize: 20
              }}
            >
              ↩
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: '#6b7280', fontWeight: 500, marginBottom: 4 }}>
                RETURNS THIS MONTH
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Playfair Display', serif", color: '#c0392b', marginBottom: 2 }}>
                8
              </div>
              <div style={{ fontSize: 9, color: '#9ca3af' }}>Last 30 days</div>
            </div>
          </div>
        </div>

        {/* Total Refunded */}
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
                fontSize: 20
              }}
            >
              💰
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: '#6b7280', fontWeight: 500, marginBottom: 4 }}>
                TOTAL REFUNDED
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Playfair Display', serif", color: '#c0392b', marginBottom: 2 }}>
                $245.00
              </div>
              <div style={{ fontSize: 9, color: '#9ca3af' }}>This month</div>
            </div>
          </div>
        </div>

        {/* Return Rate */}
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
                fontSize: 20
              }}
            >
              %
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: '#6b7280', fontWeight: 500, marginBottom: 4 }}>
                RETURN RATE
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Playfair Display', serif", color: '#c97d1a', marginBottom: 2 }}>
                2.3%
              </div>
              <div style={{ fontSize: 9, color: '#9ca3af' }}>Of all sales</div>
            </div>
          </div>
        </div>
      </div>

      {/* Returns Table Card */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 16, marginBottom: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Return #</th>
              <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Date</th>
              <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Original Sale</th>
              <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Customer</th>
              <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>Items</th>
              <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>Refund Amount</th>
              <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Method</th>
              <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Reason</th>
              <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {returns.map((ret, idx) => {
              const reasonColors = getReasonColor(ret.reason);
              const methodColor = getMethodColor(ret.method);
              const statusColors = getStatusColor(ret.status);
              return (
                <tr key={idx}>
                  <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#1a6b3a', fontFamily: 'monospace', fontWeight: 600 }}>{ret.id}</td>
                  <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#374151' }}>{ret.date}</td>
                  <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#1a6b3a', fontFamily: 'monospace', fontWeight: 600 }}>{ret.originalSale}</td>
                  <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#374151' }}>{ret.customer}</td>
                  <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#374151', textAlign: 'right' }}>{ret.items}</td>
                  <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#111827', fontWeight: 600, textAlign: 'right' }}>{ret.amount}</td>
                  <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: methodColor, fontWeight: 500 }}>{ret.method}</td>
                  <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6' }}>
                    <span style={{ fontSize: 8, fontWeight: 700, padding: '2px 7px', borderRadius: 20, textTransform: 'uppercase', background: reasonColors.bg, color: reasonColors.color }}>
                      {ret.reason}
                    </span>
                  </td>
                  <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6' }}>
                    <span style={{ fontSize: 8, fontWeight: 700, padding: '2px 7px', borderRadius: 20, textTransform: 'uppercase', background: statusColors.bg, color: statusColors.color }}>
                      {ret.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Return Policy Info Card */}
      <div
        style={{
          background: '#EFF6FF',
          border: '1px solid #d0e5ff',
          borderRadius: 10,
          padding: 16,
          fontSize: 11,
          color: '#1e3a5f',
          lineHeight: '1.6'
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Return Policy</div>
        <div>
          Returns accepted within 7 days of purchase. Items must be in original condition. Refunds processed to original payment method.
        </div>
      </div>
    </div>
  );
}
