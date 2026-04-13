import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Customers({ onTabChange }) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const isOwnerOrManager = user?.role === 'owner' || user?.role === 'manager';

  const customers = [
    {
      id: 'CUS-001',
      name: 'Mary Banda',
      phone: '+263 77 123 4567',
      email: 'mary@email.com',
      purchases: 24,
      spent: '$1,240.00',
      lastVisit: '12 Apr',
      status: 'Active'
    },
    {
      id: 'CUS-002',
      name: 'Peter Ncube',
      phone: '+263 71 234 5678',
      email: 'peter@email.com',
      purchases: 18,
      spent: '$890.00',
      lastVisit: '11 Apr',
      status: 'Active'
    },
    {
      id: 'CUS-003',
      name: 'James Moyo',
      phone: '+263 78 345 6789',
      email: 'james@email.com',
      purchases: 15,
      spent: '$720.50',
      lastVisit: '10 Apr',
      status: 'Active'
    },
    {
      id: 'CUS-004',
      name: 'Sarah Dube',
      phone: '+263 77 456 7890',
      email: 'sarah@email.com',
      purchases: 12,
      spent: '$560.00',
      lastVisit: '8 Apr',
      status: 'Active'
    },
    {
      id: 'CUS-005',
      name: 'Grace Mutasa',
      phone: '+263 71 567 8901',
      email: 'grace@email.com',
      purchases: 8,
      spent: '$340.00',
      lastVisit: '5 Apr',
      status: 'Active'
    },
    {
      id: 'CUS-006',
      name: 'Thomas Nyathi',
      phone: '+263 78 678 9012',
      email: 'thomas@email.com',
      purchases: 5,
      spent: '$180.00',
      lastVisit: '1 Apr',
      status: 'Inactive'
    },
    {
      id: 'CUS-007',
      name: 'Ruth Sibanda',
      phone: '+263 77 789 0123',
      email: 'ruth@email.com',
      purchases: 3,
      spent: '$95.00',
      lastVisit: '25 Mar',
      status: 'Inactive'
    },
    {
      id: 'CUS-008',
      name: 'David Chirwa',
      phone: '+263 71 890 1234',
      email: '-',
      purchases: 2,
      spent: '$45.00',
      lastVisit: '20 Mar',
      status: 'New'
    }
  ];

  const topCustomers = [
    { name: 'Mary Banda', amount: '$320', percentage: 100 },
    { name: 'Peter Ncube', amount: '$280', percentage: 87 },
    { name: 'James Moyo', amount: '$195', percentage: 60 },
    { name: 'Sarah Dube', amount: '$160', percentage: 50 },
    { name: 'Grace Mutasa', amount: '$120', percentage: 37 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return { bg: '#e8f5ee', color: '#1a6b3a', text: 'Active' };
      case 'Inactive':
        return { bg: '#f3f4f6', color: '#6b7280', text: 'Inactive' };
      case 'New':
        return { bg: '#EFF6FF', color: '#1e3a5f', text: 'New' };
      default:
        return { bg: '#fff', color: '#111827', text: status };
    }
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const colors = ['#1e3a5f', '#1a6b3a', '#c97d1a', '#7c3aed', '#c0392b'];

  return (
    <div style={{ padding: 24, fontFamily: "'Inter', sans-serif", backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Playfair Display', serif", margin: 0, color: '#111827' }}>
          Customers
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
            + Add Customer
          </button>
        )}
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 24 }}>
        {/* Total Customers */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20
              }}
            >
              👥
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: '#6b7280', fontWeight: 500, marginBottom: 4 }}>
                TOTAL CUSTOMERS
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Playfair Display', serif", color: '#1e3a5f', marginBottom: 2 }}>
                156
              </div>
              <div style={{ fontSize: 9, color: '#9ca3af' }}>All time</div>
            </div>
          </div>
        </div>

        {/* Active This Month */}
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
                fontSize: 20
              }}
            >
              ✓
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: '#6b7280', fontWeight: 500, marginBottom: 4 }}>
                ACTIVE THIS MONTH
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Playfair Display', serif", color: '#1a6b3a', marginBottom: 2 }}>
                42
              </div>
              <div style={{ fontSize: 9, color: '#9ca3af' }}>Last 30 days</div>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
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
                fontSize: 20
              }}
            >
              $
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: '#6b7280', fontWeight: 500, marginBottom: 4 }}>
                TOTAL REVENUE
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Playfair Display', serif", color: '#1a6b3a', marginBottom: 2 }}>
                $8,420
              </div>
              <div style={{ fontSize: 9, color: '#9ca3af' }}>All sales</div>
            </div>
          </div>
        </div>

        {/* Average Spend */}
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
              ≈
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: '#6b7280', fontWeight: 500, marginBottom: 4 }}>
                AVG. SPEND
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Playfair Display', serif", color: '#c97d1a', marginBottom: 2 }}>
                $54.00
              </div>
              <div style={{ fontSize: 9, color: '#9ca3af' }}>Per customer</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
        {/* Customer Table Card */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 16 }}>
          <input
            type="text"
            placeholder="Search by name, phone, or customer ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: 7,
              fontSize: 11,
              marginBottom: 16,
              fontFamily: "'Inter', sans-serif",
              boxSizing: 'border-box'
            }}
          />

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>ID</th>
                <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Name</th>
                <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Phone</th>
                <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Email</th>
                <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>Purchases</th>
                <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>Total Spent</th>
                <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Last Visit</th>
                <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer, idx) => {
                const statusColors = getStatusColor(customer.status);
                return (
                  <tr key={idx}>
                    <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#1a6b3a', fontFamily: 'monospace', fontWeight: 600 }}>{customer.id}</td>
                    <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#111827', fontWeight: 600 }}>{customer.name}</td>
                    <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#374151' }}>{customer.phone}</td>
                    <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#374151', fontSize: 10 }}>{customer.email}</td>
                    <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#374151', textAlign: 'right' }}>{customer.purchases}</td>
                    <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#111827', fontWeight: 600, textAlign: 'right' }}>{customer.spent}</td>
                    <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#374151' }}>{customer.lastVisit}</td>
                    <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6' }}>
                      <span style={{ fontSize: 8, fontWeight: 700, padding: '2px 7px', borderRadius: 20, textTransform: 'uppercase', background: statusColors.bg, color: statusColors.color }}>
                        {statusColors.text}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Top Customers Card */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 16 }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, fontFamily: "'Inter', sans-serif", margin: '0 0 16px 0', color: '#111827' }}>
            Top Customers This Month
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {topCustomers.map((customer, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: colors[idx],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 700,
                    flexShrink: 0
                  }}
                >
                  {idx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#111827', marginBottom: 4 }}>
                    {customer.name}
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: 6,
                      background: '#f3f4f6',
                      borderRadius: 3,
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        background: '#1a6b3a',
                        width: `${customer.percentage}%`
                      }}
                    />
                  </div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#111827', textAlign: 'right', minWidth: 50 }}>
                  {customer.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
