import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCurrentPlan, getInvoices, getUsage } from '../api/billingApi';
import { useAuth } from '../context/AuthContext';
import { fmt } from '../utils/format';

function Skeleton({ w, h, r, mb }) {
  return <div className="skeleton" style={{ width: w || '100%', height: h || 16, borderRadius: r || 6, marginBottom: mb || 0 }} />;
}

function SkeletonBilling() {
  return (
    <>
      <Skeleton h={160} r={12} mb={16} />
      <Skeleton h={200} r={12} mb={16} />
      <Skeleton h={300} r={12} mb={16} />
      <Skeleton h={100} r={12} />
    </>
  );
}

const card = {
  background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12,
  padding: '16px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
};

const S = {
  /* Cards and layout */
  card,
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 },
  threeCol: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 },

  /* Headings */
  sectionTitle: { fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 16, fontFamily: "'Playfair Display', serif" },
  cardTitle: { fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 8 },

  /* Plan Card Styles */
  planHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 },
  planName: { fontSize: 16, fontWeight: 700, color: '#111827', fontFamily: "'Playfair Display', serif" },
  planPrice: { fontSize: 24, fontWeight: 700, color: '#1a6b3a', fontFamily: "'Playfair Display', serif" },
  planPricePeriod: { fontSize: 12, color: '#6b7280', fontWeight: 400, marginLeft: 4 },
  planSubtext: { fontSize: 12, color: '#6b7280', lineHeight: 1.5, marginBottom: 12 },

  /* Badge styles */
  badge: (bg, color) => ({ display: 'inline-block', background: bg, color, fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 20, marginBottom: 8 }),
  badgeSuccess: { background: '#e8f5ee', color: '#1a6b3a' },
  badgeWarning: { background: '#fef3e2', color: '#c97d1a' },
  badgeError: { background: '#fee8e8', color: '#c0392b' },
  badgeInfo: { background: '#e0f2fe', color: '#0369a1' },

  /* Usage meter */
  meterLabel: { fontSize: 11, fontWeight: 600, color: '#111827', marginBottom: 6, display: 'flex', justifyContent: 'space-between' },
  meterCurrent: { fontSize: 11, fontWeight: 500, color: '#6b7280' },
  meterBar: { width: '100%', height: 8, background: '#f3f4f6', borderRadius: 4, overflow: 'hidden', marginBottom: 12 },
  meterFill: (color, percent) => ({ width: `${Math.min(percent, 100)}%`, height: '100%', background: color, transition: 'width 0.5s ease' }),

  /* Info items */
  infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f3f4f6', fontSize: 12 },
  infoLabel: { color: '#6b7280', fontWeight: 500 },
  infoValue: { color: '#111827', fontWeight: 600 },

  /* Action buttons */
  btnGroup: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 16 },
  btn: { padding: '10px 14px', background: '#1a6b3a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' },
  btnSecondary: { padding: '10px 14px', background: '#f9fafb', color: '#111827', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' },

  /* Invoice table */
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 11 },
  th: { textAlign: 'left', padding: '10px 12px', fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', borderBottom: '2px solid #e5e7eb', background: '#f9fafb' },
  td: { padding: '12px 12px', borderBottom: '1px solid #f3f4f6', color: '#374151' },
  tdStatus: (status) => {
    let bg, color;
    if (status === 'paid') { bg = '#e8f5ee'; color = '#1a6b3a'; }
    else if (status === 'pending') { bg = '#fef3e2'; color = '#c97d1a'; }
    else if (status === 'failed') { bg = '#fee8e8'; color = '#c0392b'; }
    else { bg = '#f3f4f6'; color = '#6b7280'; }
    return { fontSize: 10, fontWeight: 600, color, background: bg, padding: '4px 8px', borderRadius: 4, display: 'inline-block' };
  },

  /* Footer note */
  footerNote: { background: '#e8f5ee', border: '1px solid #d4e8e0', borderRadius: 8, padding: '12px 14px', marginTop: 20, fontSize: 11, color: '#1a6b3a', lineHeight: 1.5 },

  /* Empty state */
  emptyState: { textAlign: 'center', padding: '40px 20px', color: '#6b7280' },
  emptyIcon: { fontSize: 32, marginBottom: 8 },
};

export default function Billing({ onTabChange }) {
  const { user } = useAuth();
  const [activeModal, setActiveModal] = useState(null);

  const { data: currentPlan, isLoading: planLoading, error: planError } = useQuery({
    queryKey: ['currentPlan'],
    queryFn: getCurrentPlan,
  });

  const { data: invoicesData, isLoading: invoicesLoading, error: invoicesError } = useQuery({
    queryKey: ['invoices'],
    queryFn: getInvoices,
  });

  const { data: usageData, isLoading: usageLoading, error: usageError } = useQuery({
    queryKey: ['usage'],
    queryFn: getUsage,
  });

  const invoices = invoicesData?.results || invoicesData || [];
  const usage = usageData || {};

  if (planLoading || invoicesLoading || usageLoading) {
    return <SkeletonBilling />;
  }

  const isPaid = currentPlan?.status === 'active' || currentPlan?.status === 'trial';
  const isTrialing = currentPlan?.status === 'trial';

  return (
    <div>
      {/* CURRENT PLAN CARD */}
      <div style={S.card}>
        <div style={S.planHeader}>
          <div>
            <div style={S.planName}>{currentPlan?.name || 'Standard'} Plan</div>
            <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 4 }}>
              <div style={S.planPrice}>{currentPlan?.currency || '$'}{currentPlan?.price || '0'}</div>
              <div style={S.planPricePeriod}>/month</div>
            </div>
          </div>
          <div>
            {isTrialing ? (
              <div style={S.badge('#fef3e2', '#c97d1a')}>
                Trial Active
              </div>
            ) : isPaid ? (
              <div style={S.badge('#e8f5ee', '#1a6b3a')}>
                Active
              </div>
            ) : (
              <div style={S.badge('#fee8e8', '#c0392b')}>
                Inactive
              </div>
            )}
          </div>
        </div>

        <div style={S.planSubtext}>
          {isTrialing && currentPlan?.trial_end_date && (
            <>
              Trial period ends <strong>{new Date(currentPlan.trial_end_date).toLocaleDateString()}</strong>
            </>
          )}
          {isPaid && !isTrialing && currentPlan?.next_billing_date && (
            <>
              Next billing date: <strong>{new Date(currentPlan.next_billing_date).toLocaleDateString()}</strong>
            </>
          )}
          {!isPaid && (
            <>
              Upgrade to access all features
            </>
          )}
        </div>

        <div style={S.btnGroup}>
          <button style={S.btn} onClick={() => setActiveModal('plan')}>
            \u{1F4CB} Change Plan
          </button>
          <button style={S.btnSecondary} onClick={() => setActiveModal('payment')}>
            \u{1F4B3} Payment Method
          </button>
          <button style={S.btnSecondary} onClick={() => setActiveModal('team')}>
            \u{1F465} Team &amp; Users
          </button>
        </div>
      </div>

      {/* USAGE METERS */}
      <div style={{ ...S.card, marginBottom: 16 }}>
        <div style={S.cardTitle}>Usage &amp; Limits</div>
        <div style={S.threeCol}>
          {/* Users */}
          <div>
            <div style={S.meterLabel}>
              <span>Team Members</span>
              <span style={S.meterCurrent}>
                {usage?.users_used || 0} of {usage?.users_limit || 5}
              </span>
            </div>
            <div style={S.meterBar}>
              <div style={S.meterFill('#1a6b3a', ((usage?.users_used || 0) / (usage?.users_limit || 5)) * 100)} />
            </div>
          </div>

          {/* Fields */}
          <div>
            <div style={S.meterLabel}>
              <span>Fields Tracked</span>
              <span style={S.meterCurrent}>
                {usage?.fields_used || 0} of {usage?.fields_limit || 50}
              </span>
            </div>
            <div style={S.meterBar}>
              <div style={S.meterFill('#2d9e58', ((usage?.fields_used || 0) / (usage?.fields_limit || 50)) * 100)} />
            </div>
          </div>

          {/* Products */}
          <div>
            <div style={S.meterLabel}>
              <span>Product Codes</span>
              <span style={S.meterCurrent}>
                {usage?.products_used || 0} of {usage?.products_limit || 100}
              </span>
            </div>
            <div style={S.meterBar}>
              <div style={S.meterFill('#c97d1a', ((usage?.products_used || 0) / (usage?.products_limit || 100)) * 100)} />
            </div>
          </div>
        </div>
      </div>

      {/* INVOICE HISTORY */}
      <div style={{ ...S.card, marginBottom: 16 }}>
        <div style={S.cardTitle}>Invoice History</div>

        {invoices && invoices.length > 0 ? (
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Date</th>
                <th style={S.th}>Description</th>
                <th style={S.th}>Amount</th>
                <th style={S.th}>Status</th>
                <th style={S.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td style={S.td}>
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td style={S.td}>
                    {invoice.description || 'Invoice'}
                  </td>
                  <td style={S.td}>
                    {currentPlan?.currency || '$'}{typeof invoice.amount === 'number' ? invoice.amount.toFixed(2) : '0.00'}
                  </td>
                  <td style={S.td}>
                    <div style={S.tdStatus(invoice.status)}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </div>
                  </td>
                  <td style={S.td}>
                    {invoice.pdf_url ? (
                      <a
                        href={invoice.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#1a6b3a', fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }}
                      >
                        Download \u{1F4C4}
                      </a>
                    ) : (
                      <span style={{ color: '#9ca3af' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={S.emptyState}>
            <div style={S.emptyIcon}>\u{1F4CA}</div>
            <p>No invoices yet. Your first invoice will appear here.</p>
          </div>
        )}
      </div>

      {/* FOOTER NOTE */}
      <div style={S.footerNote}>
        <strong>\u{1F512} Secure Payments:</strong> All payments are processed securely through Paystack. Your payment information is never stored on our servers. For assistance with billing, contact support@pewil.app
      </div>

      {/* MODALS - Placeholder for future implementation */}
      {activeModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }} onClick={() => setActiveModal(null)}>
          <div style={{
            background: '#fff', borderRadius: 12, padding: '24px', maxWidth: 400,
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 16 }}>
              {activeModal === 'plan' && 'Change Plan'}
              {activeModal === 'payment' && 'Update Payment Method'}
              {activeModal === 'team' && 'Team &amp; Users'}
            </div>
            <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20 }}>
              This feature is coming soon. Thank you for your patience.
            </p>
            <button
              style={S.btn}
              onClick={() => setActiveModal(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
