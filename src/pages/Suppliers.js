import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getSuppliers, createSupplier, getPurchaseOrders, createPurchaseOrder, receivePurchaseOrder } from '../api/retailApi';

export default function Suppliers({ onTabChange }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('Suppliers');

  const isOwnerOrManager = user?.role === 'owner' || user?.role === 'manager';

  // Suppliers Query
  const { data: suppliers = [], isLoading: suppliersLoading } = useQuery({
    queryKey: ['retail-suppliers'],
    queryFn: getSuppliers,
    staleTime: 30000
  });

  // Purchase Orders Query
  const { data: purchaseOrders = [], isLoading: posLoading } = useQuery({
    queryKey: ['retail-purchase-orders'],
    queryFn: getPurchaseOrders,
    staleTime: 30000
  });

  // Create Supplier Mutation
  const createSupplierMutation = useMutation({
    mutationFn: createSupplier,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['retail-suppliers'] })
  });

  // Create Purchase Order Mutation
  const createPOMutation = useMutation({
    mutationFn: createPurchaseOrder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['retail-purchase-orders'] })
  });

  // Receive Purchase Order Mutation
  const receivePOMutation = useMutation({
    mutationFn: receivePurchaseOrder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['retail-purchase-orders'] })
  });

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

  const handleAddSupplier = () => {
    createSupplierMutation.mutate({
      name: 'New Supplier',
      contact_person: '',
      phone: '',
      email: '',
      payment_terms: 'Net 30'
    });
  };

  const handleNewPO = () => {
    createPOMutation.mutate({
      supplier: 1,
      order_date: new Date().toISOString().split('T')[0],
      expected_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items_data: [],
      total: 0
    });
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
              onClick={handleAddSupplier}
              disabled={createSupplierMutation.isPending}
              style={{
                background: '#fff',
                color: '#1a6b3a',
                border: '1px solid #1a6b3a',
                padding: '8px 16px',
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 600,
                cursor: createSupplierMutation.isPending ? 'not-allowed' : 'pointer',
                opacity: createSupplierMutation.isPending ? 0.6 : 1
              }}
            >
              + Add Supplier
            </button>
            <button
              onClick={handleNewPO}
              disabled={createPOMutation.isPending}
              style={{
                background: '#1a6b3a',
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 600,
                cursor: createPOMutation.isPending ? 'not-allowed' : 'pointer',
                opacity: createPOMutation.isPending ? 0.6 : 1
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
          {suppliersLoading ? (
            <div style={{ padding: 20, textAlign: 'center', color: '#6b7280' }}>Loading suppliers...</div>
          ) : suppliers.length === 0 ? (
            <div style={{ padding: 20, textAlign: 'center', color: '#6b7280' }}>No suppliers found</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>ID</th>
                  <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Name</th>
                  <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Contact Person</th>
                  <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Phone</th>
                  <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Email</th>
                  <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Payment Terms</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => (
                  <tr key={supplier.id}>
                    <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#1a6b3a', fontFamily: 'monospace', fontWeight: 600 }}>{supplier.id}</td>
                    <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#111827', fontWeight: 600 }}>{supplier.name}</td>
                    <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#374151' }}>{supplier.contact_person || '-'}</td>
                    <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#374151' }}>{supplier.phone || '-'}</td>
                    <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#374151', fontSize: 10 }}>{supplier.email || '-'}</td>
                    <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#374151' }}>{supplier.payment_terms || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Purchase Orders Tab */}
      {activeTab === 'Purchase Orders' && (
        <div>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 16, marginBottom: 16 }}>
            {posLoading ? (
              <div style={{ padding: 20, textAlign: 'center', color: '#6b7280' }}>Loading purchase orders...</div>
            ) : purchaseOrders.length === 0 ? (
              <div style={{ padding: 20, textAlign: 'center', color: '#6b7280' }}>No purchase orders found</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                <thead>
                  <tr style={{ background: '#f9fafb' }}>
                    <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>ID</th>
                    <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Order Date</th>
                    <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Supplier</th>
                    <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>Total</th>
                    <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Expected Date</th>
                    <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Status</th>
                    <th style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '7px 8px', borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseOrders.map((po) => {
                    const statusColors = getStatusColor(po.status);
                    return (
                      <tr key={po.id}>
                        <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#1a6b3a', fontFamily: 'monospace', fontWeight: 600 }}>{po.id}</td>
                        <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#374151' }}>{po.order_date}</td>
                        <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#111827', fontWeight: 500 }}>{po.supplier_name || 'N/A'}</td>
                        <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#111827', fontWeight: 600, textAlign: 'right' }}>${po.total?.toFixed(2) || '0.00'}</td>
                        <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', color: '#374151' }}>{po.expected_date}</td>
                        <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6' }}>
                          <span style={{ fontSize: 8, fontWeight: 700, padding: '2px 7px', borderRadius: 20, textTransform: 'uppercase', background: statusColors.bg, color: statusColors.color }}>
                            {po.status}
                          </span>
                        </td>
                        <td style={{ padding: '7px 8px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>
                          {po.status !== 'Received' && (
                            <button
                              onClick={() => receivePOMutation.mutate(po.id)}
                              disabled={receivePOMutation.isPending}
                              style={{
                                background: '#1a6b3a',
                                color: '#fff',
                                border: 'none',
                                padding: '4px 10px',
                                borderRadius: 4,
                                fontSize: 9,
                                fontWeight: 600,
                                cursor: receivePOMutation.isPending ? 'not-allowed' : 'pointer',
                                opacity: receivePOMutation.isPending ? 0.6 : 1
                              }}
                            >
                              {receivePOMutation.isPending ? 'Receiving...' : 'Receive'}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
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
              <span style={{ color: '#6b7280', fontWeight: 500 }}>Total POs:</span> <span style={{ color: '#111827', fontWeight: 700 }}>{purchaseOrders.length}</span>
            </div>
            <div style={{ borderLeft: '1px solid #e5e7eb', paddingLeft: 16 }}>
              <span style={{ color: '#6b7280', fontWeight: 500 }}>Pending:</span> <span style={{ color: '#111827', fontWeight: 700 }}>{purchaseOrders.filter(po => po.status === 'Pending').length}</span>
            </div>
            <div style={{ borderLeft: '1px solid #e5e7eb', paddingLeft: 16 }}>
              <span style={{ color: '#6b7280', fontWeight: 500 }}>Total Value:</span> <span style={{ color: '#111827', fontWeight: 700 }}>${purchaseOrders.reduce((sum, po) => sum + (po.total || 0), 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
