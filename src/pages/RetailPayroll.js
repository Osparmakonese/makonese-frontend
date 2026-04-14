import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getPayrollRuns, createPayrollRun, approvePayrollRun, markPayrollPaid } from '../api/retailApi';

const styles = {
  page: { maxWidth: 1200, margin: '0 auto', padding: 20 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 700, color: '#111827', fontFamily: "'Playfair Display', serif", margin: 0 },
  addBtn: { padding: '10px 18px', background: '#1a6b3a', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  infoBanner: { background: '#fef3e2', border: '1px solid #c97d1a', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 12, color: '#c97d1a', fontWeight: 600 },
  placeholderCard: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '60px 20px', textAlign: 'center', marginBottom: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  placeholderIcon: { fontSize: 48, marginBottom: 16 },
  placeholderTitle: { fontSize: 18, fontWeight: 700, color: '#111827', fontFamily: "'Playfair Display', serif", marginBottom: 8 },
  placeholderDesc: { fontSize: 12, color: '#6b7280', marginBottom: 4 },
  placeholderSub: { fontSize: 11, color: '#9ca3af' },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '10px 12px', fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' },
  td: { padding: '12px 12px', fontSize: 12, color: '#374151', borderBottom: '1px solid #e5e7eb' },
  monospaceCell: { fontFamily: 'monospace' },
  statusPill: (status) => ({
    fontSize: 8,
    fontWeight: 700,
    padding: '2px 7px',
    borderRadius: 20,
    display: 'inline-block',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    background: status === 'Paid' ? '#e8f5ee' : '#fef3e2',
    color: status === 'Paid' ? '#1a6b3a' : '#c97d1a',
  }),
};

export default function RetailPayroll({ onTabChange }) {
  useAuth();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    period_start: new Date().toISOString().split('T')[0],
    period_end: new Date().toISOString().split('T')[0],
  });

  const { data: payrollData, isLoading } = useQuery({
    queryKey: ['retail-payroll-runs'],
    queryFn: getPayrollRuns,
    staleTime: 30000
  });

  const createRunMutation = useMutation({
    mutationFn: createPayrollRun,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['retail-payroll-runs'] });
      setShowModal(false);
      setForm({
        period_start: new Date().toISOString().split('T')[0],
        period_end: new Date().toISOString().split('T')[0],
      });
    }
  });

  const payrollRuns = payrollData?.map(run => ({
    runNum: run.id,
    period: `${new Date(run.period_start).toLocaleDateString()} - ${new Date(run.period_end).toLocaleDateString()}`,
    employees: (run.lines?.length || 0).toString(),
    gross: `$${run.total_gross.toFixed(2)}`,
    paye: `$${run.total_paye.toFixed(2)}`,
    nssa: `$${run.total_nssa.toFixed(2)}`,
    net: `$${run.total_net.toFixed(2)}`,
    status: run.status,
    id: run.id
  })) || [];

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Payroll</h1>
        <button
          onClick={() => setShowModal(true)}
          style={styles.addBtn}
        >
          {'\u002B'} New Run
        </button>
      </div>

      {/* New Run Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: '24px',
              maxWidth: 400,
              width: '90%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 16px 0' }}>
              New Payroll Run
            </h2>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: '#6b7280', marginBottom: 4, textTransform: 'uppercase' }}>
                Period Start
              </label>
              <input
                type="date"
                value={form.period_start}
                onChange={(e) => setForm({ ...form, period_start: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  border: '1px solid #e5e7eb',
                  borderRadius: 7,
                  fontSize: 12,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: '#6b7280', marginBottom: 4, textTransform: 'uppercase' }}>
                Period End
              </label>
              <input
                type="date"
                value={form.period_end}
                onChange={(e) => setForm({ ...form, period_end: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  border: '1px solid #e5e7eb',
                  borderRadius: 7,
                  fontSize: 12,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => createRunMutation.mutate(form)}
                disabled={createRunMutation.isPending}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#1a6b3a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 7,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  opacity: createRunMutation.isPending ? 0.6 : 1,
                }}
              >
                {createRunMutation.isPending ? 'Creating...' : 'Create'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: 7,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.infoBanner}>
        {'\u26A0\uFE0F'} PAYE + NSSA — Zimbabwe payroll compliance
      </div>

      {/* Placeholder Card */}
      <div style={styles.placeholderCard}>
        <div style={styles.placeholderIcon}>{'\u{1F4B5}'}</div>
        <div style={styles.placeholderTitle}>Payroll</div>
        <div style={styles.placeholderDesc}>PAYE + NSSA — Zimbabwe payroll</div>
        <div style={styles.placeholderSub}>Full page with data tables, forms, and actions</div>
      </div>

      {/* Payroll Runs Table */}
      <div style={styles.card}>
        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Loading payroll runs...</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={styles.th}>Run #</th>
                <th style={styles.th}>Period</th>
                <th style={styles.th}>Employees</th>
                <th style={styles.th}>Gross</th>
                <th style={styles.th}>PAYE</th>
                <th style={styles.th}>NSSA</th>
                <th style={styles.th}>Net</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {payrollRuns.map((run, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: idx < payrollRuns.length - 1 ? '1px solid #e5e7eb' : 'none',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={styles.td}>{run.runNum}</td>
                  <td style={styles.td}>{run.period}</td>
                  <td style={styles.td}>{run.employees}</td>
                  <td style={{ ...styles.td, ...styles.monospaceCell }}>{run.gross}</td>
                  <td style={{ ...styles.td, ...styles.monospaceCell }}>{run.paye}</td>
                  <td style={{ ...styles.td, ...styles.monospaceCell }}>{run.nssa}</td>
                  <td style={{ ...styles.td, ...styles.monospaceCell }}>{run.net}</td>
                  <td style={styles.td}>
                    <span style={styles.statusPill(run.status)}>{run.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
