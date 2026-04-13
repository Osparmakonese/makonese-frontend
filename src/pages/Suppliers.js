import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Suppliers({ onTabChange }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Suppliers');

  const isOwnerOrManager = user?.role === 'owner' || user?.role === 'manager';

  const suppliers = [
    {
      id: 'SUP-001',
      company: 'TechZim Distributors',
      contact: 'John Murimi',
      phone: '+263 77 111 2222',
      email: 'orders@techzim.co.zw',
      products: 18,
      leadTime: '3 days',
      status: 'Active'
    },
    {
      id: 'SUP-002',
      company: 'CableCo Zimbabwe',
      contact: 'Sarah Mutendi',
      phone: '+263 71 222 3333',
      email: 'sales@cableco.zw',
      products: 12,
      leadTime: '5 days',
      status: 'Active'
    },
    {
      id: 'SUP-003',
      company: 'PowerPlus Imports',
      contact: 'David Chuma',
      phone: '+263 78 333 4444',
      email: 'info@powerplus.co.zw',
      products: 8,
      leadTime: '7 days',
      status: 'Active'
    },
    {
      id: 'SUP-004',
      company: 'AccessoryHub',
      contact: 'Grace Nkomo',
      phone: '+263 77 444 5555',
      email: 'grace@ahub.co.zw',
      products: 6,
      leadTime: '2 days',
      status: 'Active'
    },
    {
      id: 'SUP-005',
      company: 'AudioTech SA',
      contact: 'Mark van der Berg',
      phone: '+27 82 555 6666',
      email: 'mark@audiotech.co.za',
      products: 4,
      leadTime: '14 days',
      status: 'International'
    }
  ];

  const purchaseOrders = [
    {
      id: 'PO-015',
      date: '11 Apr',
      supplier: 'TechZim Distributors',
      items: 5,
      total: '$480.00',
      expected: '14 Apr',
      status: 'Pending'
    },
    {
      id: 'PO-014',
      date: '8 Apr',
      supplier: 'CableCo Zimbabwe',
      items: 3,
      total: '$120.00',
      expected: '13 Apr',
      status: 'In Transit'
    },
    {
      id: 'PO-013',
      date: '5 Apr',
      supplier: 'PowerPlus Imports',
      items: 8,
      total: '$750.00',
      expected: '12 Apr',
      status: 'Received'
    },
    {
      id: 'PO-012',
      date: '1 Apr',
      supplier: 'AccessoryHub',
      items: 4,
      total: '$95.00',
      expected: '3 Apr',
      status: 'Received'
    },
    {
      id: 'PO-011',
      date: '28 Mar',
      supplier: 'AudioTech SA',
      items: 2,
      total: '$360.00',
      expected: '11 Apr',
      status: 'Received'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return { bg: '#e8f5ee', color: '#1a6b3a' };
      case 'International':
        return { bg: '#EFF6FF', color: '#1e3a5f' };
      case 'Pending':
        return { bg: '#fef3e2', color: '#c97d1a' };
      case 'In Transit':
        return { bg: '#EFF6FF', color: '#1e3a5f' };
      case 'Received':
        return { bg: '#e8f5ee', color: '#1a6b3a' };
      default:
        return { bg: '#f3f4f6', color: '#6b7280' };
    }
  };

  return (
    <div style={{ padding: 24, fontFamily: "'Inter', sans-serif", backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Playfair Display', serif", margin: 0, color: '#111827' }}>
          Suppliers & Purchase Orders
        </h1>
        {isOwnerOrManager && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              style={{
                background: '#fff',
                color: '#1a6b3a',
                border: '1px solid #1a6b3a',
                padding: '8px 16px',
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              + Add Supplier
            </button>
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
              + New Purchase Order
            </button>
          </div>
        )}
      </div>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['Suppliers', 'Purchase Orders'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: activeTab === tab ? '#1a6b3a' : '#fff',
              color: activeTab === tab ? '#fff' : '#374151',
              border: activeTab === tab ? 'none' : '1px solid #e5e7eb',
              padding: '8px 16px',
              borderRadius: 7,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Suppliers Tab */}
      {activeTab === 'Suppliers' && (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 16 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Code</th>
                <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Company</th>
                <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Contact Person</th>
                <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Phone</th>
                <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Email</th>
                <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>Products</th>
                <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Lead Time</th>
                <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier, idx) => {
                const statusColors = getStatusColor(supplier.status);
                return (
                  <tr key={idx}>
                    <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#1a6b3a', fontFamily: 'monospace', fontWeight: 600 }}>{supplier.id}</td>
                    <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#111827', fontWeight: 600 }}>{supplier.company}</td>
                    <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#374151' }}>{supplier.contact}</td>
                    <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#374151' }}>{supplier.phone}</td>
                    <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#374151', fontSize: 10 }}>{supplier.email}</td>
                    <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#374151', textAlign: 'right' }}>{supplier.products}</td>
                    <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#374151' }}>{supplier.leadTime}</td>
                    <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6' }}>
                      <span style={{ fontSize: 8, fontWeight: 700, padding: '2px 7px', borderRadius: 20, textTransform: 'uppercase', background: statusColors.bg, color: statusColors.color }}>
                        {supplier.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Purchase Orders Tab */}
      {activeTab === 'Purchase Orders' && (
        <div>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 16, marginBottom: 16 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>PO #</th>
                  <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Date</th>
                  <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Supplier</th>
                  <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>Items</th>
                  <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>Total</th>
                  <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Expected</th>
                  <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrders.map((po, idx) => {
                  const statusColors = getStatusColor(po.status);
                  return (
                    <tr key={idx}>
                      <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#1a6b3a', fontFamily: 'monospace', fontWeight: 600 }}>{po.id}</td>
                      <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#374151' }}>{po.date}</td>
                      <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#111827', fontWeight: 500 }}>{po.supplier}</td>
                      <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#374151', textAlign: 'right' }}>{po.items}</td>
                      <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#111827', fontWeight: 600, textAlign: 'right' }}>{po.total}</td>
                      <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#374151' }}>{po.expected}</td>
                      <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6' }}>
                        <span style={{ fontSize: 8, fontWeight: 700, padding: '2px 7px', borderRadius: 20, textTransform: 'uppercase', background: statusColors.bg, color: statusColors.color }}>
                          {po.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary Strip */}
          <div
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 10,
              padding: 16,
              display: 'flex',
              justifyContent: 'space-around',
              fontSize: 12,
              fontWeight: 600,
              color: '#111827'
            }}
          >
            <div>
              <span style={{ color: '#6b7280', fontWeight: 500 }}>Open POs:</span> <span style={{ color: '#111827', fontWeight: 700 }}>2</span>
            </div>
            <div style={{ borderLeft: '1px solid #e5e7eb', paddingLeft: 16 }}>
              <span style={{ color: '#6b7280', fontWeight: 500 }}>In Transit:</span> <span style={{ color: '#111827', fontWeight: 700 }}>1</span>
            </div>
            <div style={{ borderLeft: '1px solid #e5e7eb', paddingLeft: 16 }}>
              <span style={{ color: '#6b7280', fontWeight: 500 }}>This Month:</span> <span style={{ color: '#111827', fontWeight: 700 }}>$1,445.00</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
