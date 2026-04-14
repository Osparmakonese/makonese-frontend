import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCurrentPlan, getPlans, getInvoices, getUsage, changePlan, initializePayment, verifyPayment, getPaymentMethods } from '../api/billingApi';
import { useAuth } from '../context/AuthContext';

const card = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '16px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' };
const pill = (bg, color) => ({ fontSize: 8, fontWeight: 700, padding: '2px 7px', borderRadius: 20, display: 'inline-block', letterSpacing: '0.02em', textTransform: 'uppercase', background: bg, color });
const sLabel = { fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 };
const btnS = (primary) => ({ padding: '6px 12px', borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: primary ? 'none' : '1px solid #1a6b3a', background: primary ? '#1a6b3a' : '#fff', color: primary ? '#fff' : '#1a6b3a', display: 'inline-flex', alignItems: 'center', gap: 5, transition: 'all 0.15s' });
const thS = { textAlign: 'left', padding: '7px 8px', fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', background: '#f9fafb' };

const PLAN_DATA = [
  { key: 'starter', name: 'Starter', price: 15, users: 3, modules: '1 module', ai: false, desc: 'For focused operations' },
  { key: 'growth', name: 'Growth', price: 25, users: 10, modules: '2 modules', ai: true, desc: 'Full power for growth' },
  { key: 'enterprise', name: 'Enterprise', price: 89, users: 999, modules: 'All modules', ai: true, desc: 'Multiple locations' },
];

const COMPARISON = [
  { feature: 'Farm Module', starter: '\u2713', growth: '\u2713', enterprise: '\u2713' },
  { feature: 'Retail Module', starter: '1 only', growth: '\u2713', enterprise: '\u2713' },
  { feature: 'Accounting', starter: '\u2717', growth: '\u2713', enterprise: '\u2713' },
  { feature: 'Users Included', starter: '3', growth: '10', enterprise: 'Unlimited' },
  { feature: 'AI Farm Analysis', starter: '+$10/mo', growth: '\u2713', enterprise: '\u2713' },
  { feature: 'WhatsApp Alerts', starter: '\u2717', growth: '\u2717', enterprise: '\u2713' },
  { feature: 'PDF/Excel Reports', starter: '\u2713', growth: '\u2713', enterprise: '\u2713' },
  { feature: 'White-label', starter: '\u2717', growth: '\u2717', enterprise: '\u2713' },
  { feature: 'Extra Seat Cost', starter: '$5/user', growth: '$5/user', enterprise: 'Free' },
  { feature: 'Support', starter: 'Email', growth: 'Priority', enterprise: 'Dedicated' },
];

export default function Billing() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('overview');
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [payMethod, setPayMethod] = useState('card');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [payStatus, setPayStatus] = useState(null); // null | 'loading' | 'pending' | 'success' | 'error'
  const [payMessage, setPayMessage] = useState('');
  const [payReference, setPayReference] = useState('');
  const [payProvider, setPayProvider] = useState('');

  const currentPlan = user?.plan || 'free';
  const planObj = PLAN_DATA.find(p => p.key === currentPlan) || PLAN_DATA[0];

  const { data: plans } = useQuery({ queryKey: ['plans'], queryFn: getPlans, staleTime: 300000 });
  const { data: invoices } = useQuery({ queryKey: ['invoices'], queryFn: getInvoices, staleTime: 60000 });
  const { data: usage } = useQuery({ queryKey: ['usage'], queryFn: getUsage, staleTime: 60000 });

  const changePlanMut = useMutation({
    mutationFn: changePlan,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['currentPlan'] }),
  });

  // ─── PAYMENT FLOW ──────────────────────────────────────
  const handleUpgrade = (planKey) => {
    const plan = PLAN_DATA.find(p => p.key === planKey);
    if (!plan || planKey === currentPlan) return;
    setSelectedPlan(plan);
    setPayMethod('card');
    setPhoneNumber('');
    setPayStatus(null);
    setPayMessage('');
    setShowPayModal(true);
  };

  const handlePay = async () => {
    if (!selectedPlan) return;
    if (payMethod === 'ecocash' && !phoneNumber.trim()) {
      setPayMessage('Please enter your EcoCash phone number.');
      setPayStatus('error');
      return;
    }
    if (payMethod === 'onemoney' && !phoneNumber.trim()) {
      setPayMessage('Please enter your OneMoney phone number.');
      setPayStatus('error');
      return;
    }

    setPayStatus('loading');
    setPayMessage('');

    try {
      const data = {
        plan_slug: selectedPlan.key,
        payment_method: payMethod,
      };
      if (payMethod === 'ecocash' || payMethod === 'onemoney') {
        data.phone_number = phoneNumber.trim();
      }

      const result = await initializePayment(data);

      if (result.redirect_url) {
        // Pesepay/Paynow web: redirect to hosted checkout
        window.location.href = result.redirect_url;
        return;
      }

      if (result.instructions) {
        // Paynow: mobile money prompt sent, show instructions and poll
        setPayStatus('pending');
        setPayMessage(result.instructions);
        setPayReference(result.reference);
        setPayProvider(result.provider);
      }
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Payment failed. Please try again.';
      setPayStatus('error');
      setPayMessage(msg);
    }
  };

  // ─── POLL MOBILE MONEY STATUS ──────────────────────────
  const pollPayment = useCallback(async () => {
    if (!payReference || !payProvider) return;

    try {
      const result = await verifyPayment({
        reference: payReference,
        provider: payProvider,
      });

      if (result.status === 'paid') {
        setPayStatus('success');
        setPayMessage('Payment confirmed! Your plan is now active.');
        queryClient.invalidateQueries({ queryKey: ['currentPlan'] });
        queryClient.invalidateQueries({ queryKey: ['usage'] });
        queryClient.invalidateQueries({ queryKey: ['invoices'] });
      } else if (result.status === 'failed') {
        setPayStatus('error');
        setPayMessage('Payment failed. Please try again.');
      }
      // If still pending, keep polling
    } catch {
      // Silently retry
    }
  }, [payReference, payProvider, queryClient]);

  useEffect(() => {
    if (payStatus !== 'pending') return;
    const interval = setInterval(pollPayment, 5000);
    return () => clearInterval(interval);
  }, [payStatus, pollPayment]);

  // ─── CHECK URL PARAMS (Pesepay redirect callback) ──────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentResult = params.get('payment');
    if (paymentResult === 'success') {
      setPayStatus('success');
      setPayMessage('Payment confirmed! Your plan is now active.');
      // Clean up URL
      window.history.replaceState({}, '', '/billing');
      queryClient.invalidateQueries({ queryKey: ['currentPlan'] });
      queryClient.invalidateQueries({ queryKey: ['usage'] });
    } else if (paymentResult === 'cancelled') {
      setPayStatus('error');
      setPayMessage('Payment was cancelled.');
      window.history.replaceState({}, '', '/billing');
    }
  }, [queryClient]);

  const features = ['Unlimited fields & livestock', 'AI Morning Briefing & Health Score', 'Market trip tracking', 'Worker hours & payroll', 'Season budget & economics', 'PDF/Excel report export', planObj.ai ? 'WhatsApp alerts' : null, 'Priority support'].filter(Boolean);

  const defaultInvoices = [
    { date: '1 Apr 2026', amount: '$' + planObj.price + '.00', status: 'Paid' },
    { date: '1 Mar 2026', amount: '$' + planObj.price + '.00', status: 'Paid' },
    { date: '1 Feb 2026', amount: '$' + planObj.price + '.00', status: 'Paid' },
    { date: '1 Jan 2026', amount: '$' + planObj.price + '.00', status: 'Paid' },
  ];
  const defaultUsage = [
    { label: 'Fields', current: 6, max: 'Unlimited', pct: 100 },
    { label: 'Livestock', current: 147, max: 'Unlimited', pct: 100 },
    { label: 'Workers', current: 4, max: 10, pct: 40 },
    { label: 'Users', current: 2, max: 5, pct: 40 },
  ];

  return (
    <div>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', borderRadius: 14, padding: '0 24px', height: 90, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, overflow: 'hidden' }}>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>Billing & Subscription</h2>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)', marginTop: 3 }}>Manage your Pewil plan, invoices, and payment method</p>
        </div>
        <div style={{ fontSize: 48, opacity: 0.2 }}>{'\u{1F4B3}'}</div>
      </div>

      {/* Success/Error banner */}
      {payStatus === 'success' && (
        <div style={{ background: '#e8f5ee', border: '1px solid #1a6b3a', borderRadius: 10, padding: '10px 16px', marginBottom: 14, fontSize: 12, color: '#1a6b3a', fontWeight: 600 }}>
          {'\u2705'} {payMessage}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {[['overview', 'Overview'], ['plans', 'Change Plan'], ['invoices', 'Invoices']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{ padding: '6px 14px', borderRadius: 20, border: tab === k ? '1px solid #1a6b3a' : '1px solid #e5e7eb', background: tab === k ? '#1a6b3a' : '#fff', color: tab === k ? '#fff' : '#374151', fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}>{l}</button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <div style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{planObj.name} Plan</div>
                  <div style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>{planObj.modules}</div>
                </div>
                <span style={pill('#e8f5ee', '#1a6b3a')}>ACTIVE</span>
              </div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: '#1a6b3a', marginBottom: 4 }}>
                ${planObj.price}<span style={{ fontSize: 12, color: '#6b7280', fontFamily: 'Inter' }}>/month</span>
              </div>
              <div style={{ fontSize: 10, color: '#6b7280', marginBottom: 12 }}>Pesepay (Card) {'\u2022'} Paynow (EcoCash / OneMoney)</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button style={btnS(false)} onClick={() => setTab('plans')}>Change Plan</button>
              </div>
            </div>
            <div style={{ ...card, marginTop: 10 }}>
              <div style={sLabel}>{'\u2705'} Plan Features</div>
              {features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0', fontSize: 11 }}>
                  <span style={{ color: '#1a6b3a', fontWeight: 700 }}>{'\u2713'}</span>{f}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={card}>
              <div style={sLabel}>Recent Invoices</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                <thead><tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  {['Date', 'Amount', 'Status', 'Receipt'].map(h => <th key={h} style={thS}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {(invoices?.results || defaultInvoices).map((inv, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '7px 8px', color: '#374151' }}>{inv.date || inv.created_at}</td>
                      <td style={{ padding: '7px 8px', fontWeight: 600 }}>{inv.amount || ('$' + (inv.total || 0))}</td>
                      <td style={{ padding: '7px 8px' }}><span style={pill('#e8f5ee', '#1a6b3a')}>{inv.status || 'Paid'}</span></td>
                      <td style={{ padding: '7px 8px' }}><span style={{ color: '#1a6b3a', fontSize: 10, cursor: 'pointer' }}>Download</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ ...card, marginTop: 10 }}>
              <div style={sLabel}>Usage</div>
              {(usage?.items || defaultUsage).map((u, i) => (
                <div key={i} style={{ marginBottom: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, marginBottom: 2 }}>
                    <span style={{ color: '#374151', fontWeight: 500 }}>{u.label}</span>
                    <span style={{ fontWeight: 700 }}>{u.current} / {u.max}</span>
                  </div>
                  <div style={{ height: 6, background: '#f3f4f6', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: 6, borderRadius: 3, width: Math.min(u.pct, 100) + '%', background: '#1a6b3a' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PLANS */}
      {tab === 'plans' && (
        <div>
          <p style={{ color: '#6b7280', marginBottom: 16, fontSize: 12 }}>
            You{'\u2019'}re currently on the <strong style={{ color: '#1a6b3a' }}>{planObj.name}</strong> plan. Select a plan and choose how to pay.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
            {PLAN_DATA.map(p => (
              <div key={p.key} onClick={() => handleUpgrade(p.key)} style={{ border: currentPlan === p.key ? '2px solid #1a6b3a' : '2px solid #e5e7eb', borderRadius: 14, padding: 20, textAlign: 'center', cursor: p.key === currentPlan ? 'default' : 'pointer', transition: 'all 0.2s', background: currentPlan === p.key ? '#e8f5ee' : '#fff' }}>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: '#1a6b3a', marginBottom: 8 }}>
                  ${p.price}<span style={{ fontSize: 13, fontWeight: 400, color: '#6b7280' }}>/mo</span>
                </div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>{p.modules}, {p.users === 999 ? 'unlimited' : p.users} users</div>
                {currentPlan === p.key
                  ? <div style={{ fontSize: 12, color: '#1a6b3a', marginTop: 8, fontWeight: 600 }}>Current plan</div>
                  : <button style={{ ...btnS(true), marginTop: 8 }} onClick={(e) => { e.stopPropagation(); handleUpgrade(p.key); }}>{p.price < planObj.price ? 'Downgrade' : 'Upgrade'}</button>
                }
              </div>
            ))}
          </div>
          <div style={card}>
            <h4 style={{ fontWeight: 700, marginBottom: 16 }}>Plan Comparison</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                {['Feature', 'Starter', 'Growth', 'Enterprise'].map(h => <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#6b7280' }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '10px 14px', fontSize: 13 }}>{row.feature}</td>
                    <td style={{ padding: '10px 14px', fontSize: 13 }}>{row.starter}</td>
                    <td style={{ padding: '10px 14px', fontSize: 13 }}>{row.growth}</td>
                    <td style={{ padding: '10px 14px', fontSize: 13 }}>{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INVOICES */}
      {tab === 'invoices' && (
        <div style={card}>
          <div style={sLabel}>Invoice History</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              {['Date', 'Description', 'Amount', 'Provider', 'Status', ''].map(h => <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#6b7280' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {(invoices?.results || []).length > 0
                ? invoices.results.map((inv, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '10px 14px', fontSize: 13 }}>{inv.created_at ? new Date(inv.created_at).toLocaleDateString() : ''}</td>
                    <td style={{ padding: '10px 14px', fontSize: 13 }}>{inv.description}</td>
                    <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600 }}>${inv.amount}</td>
                    <td style={{ padding: '10px 14px', fontSize: 13 }}>
                      <span style={pill(inv.payment_method === 'mobile_money' ? '#FEF3C7' : '#EFF6FF', inv.payment_method === 'mobile_money' ? '#92400E' : '#1d4ed8')}>
                        {inv.payment_method === 'mobile_money' ? 'Mobile Money' : inv.payment_method === 'card' ? 'Card' : inv.payment_provider || 'N/A'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={pill(
                        inv.status === 'paid' ? '#e8f5ee' : inv.status === 'pending' ? '#FEF3C7' : '#FEE2E2',
                        inv.status === 'paid' ? '#1a6b3a' : inv.status === 'pending' ? '#92400E' : '#991B1B'
                      )}>{inv.status}</span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>{inv.status === 'paid' && <span style={{ color: '#1a6b3a', fontSize: 12, cursor: 'pointer' }}>PDF</span>}</td>
                  </tr>
                ))
                : [
                  { date: 'Apr 11, 2026', desc: planObj.name + ' Plan \u2014 Free Trial', amount: '$0.00', status: 'Free', bg: '#e8f5ee', color: '#1a6b3a' },
                  { date: 'May 11, 2026', desc: planObj.name + ' Plan \u2014 Monthly', amount: '$' + planObj.price + '.00', status: 'Upcoming', bg: '#EFF6FF', color: '#1d4ed8', dim: true },
                ].map((inv, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f3f4f6', opacity: inv.dim ? 0.4 : 1 }}>
                    <td style={{ padding: '10px 14px', fontSize: 13 }}>{inv.date}</td>
                    <td style={{ padding: '10px 14px', fontSize: 13 }}>{inv.desc}</td>
                    <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600 }}>{inv.amount}</td>
                    <td style={{ padding: '10px 14px' }}><span style={pill('#f3f4f6', '#6b7280')}>N/A</span></td>
                    <td style={{ padding: '10px 14px' }}><span style={pill(inv.bg, inv.color)}>{inv.status}</span></td>
                    <td style={{ padding: '10px 14px' }}>{!inv.dim && <span style={{ color: '#1a6b3a', fontSize: 12, cursor: 'pointer' }}>PDF</span>}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
          <div style={{ marginTop: 24, padding: 16, background: '#f9fafb', borderRadius: 10, fontSize: 13, color: '#6b7280' }}>
            Payments are processed securely via <strong style={{ color: '#111827' }}>Pesepay</strong> (cards) and <strong style={{ color: '#111827' }}>Paynow</strong> (EcoCash / OneMoney). Your card details are never stored on our servers.
          </div>
        </div>
      )}

      {/* ─── PAYMENT MODAL ──────────────────────────────── */}
      {showPayModal && selectedPlan && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }} onClick={() => { if (payStatus !== 'loading' && payStatus !== 'pending') setShowPayModal(false); }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 420, maxWidth: '90vw', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, margin: 0 }}>Upgrade to {selectedPlan.name}</h3>
              <button onClick={() => setShowPayModal(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#6b7280' }}>{'\u2715'}</button>
            </div>

            {/* Price */}
            <div style={{ textAlign: 'center', padding: '12px 0 20px', borderBottom: '1px solid #e5e7eb', marginBottom: 20 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: '#1a6b3a' }}>
                ${selectedPlan.price}<span style={{ fontSize: 14, fontWeight: 400, color: '#6b7280' }}>/month</span>
              </div>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{selectedPlan.modules}, {selectedPlan.users === 999 ? 'unlimited' : selectedPlan.users} users</div>
            </div>

            {/* Payment method selection */}
            {payStatus !== 'success' && (
              <>
                <div style={{ ...sLabel, marginBottom: 12 }}>Choose Payment Method</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
                  <div
                    onClick={() => setPayMethod('card')}
                    style={{
                      border: payMethod === 'card' ? '2px solid #1a6b3a' : '2px solid #e5e7eb',
                      borderRadius: 10,
                      padding: 14,
                      cursor: 'pointer',
                      background: payMethod === 'card' ? '#e8f5ee' : '#fff',
                      textAlign: 'center',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{'\u{1F4B3}'}</div>
                    <div style={{ fontWeight: 700, fontSize: 12 }}>Card</div>
                    <div style={{ fontSize: 9, color: '#6b7280', marginTop: 2 }}>Visa / Mastercard</div>
                    <div style={{ fontSize: 8, color: '#9ca3af', marginTop: 2 }}>via Pesepay</div>
                  </div>
                  <div
                    onClick={() => setPayMethod('ecocash')}
                    style={{
                      border: payMethod === 'ecocash' ? '2px solid #1a6b3a' : '2px solid #e5e7eb',
                      borderRadius: 10,
                      padding: 14,
                      cursor: 'pointer',
                      background: payMethod === 'ecocash' ? '#e8f5ee' : '#fff',
                      textAlign: 'center',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{'\u{1F4F1}'}</div>
                    <div style={{ fontWeight: 700, fontSize: 12 }}>EcoCash</div>
                    <div style={{ fontSize: 9, color: '#6b7280', marginTop: 2 }}>Econet (077/078)</div>
                    <div style={{ fontSize: 8, color: '#9ca3af', marginTop: 2 }}>via Paynow</div>
                  </div>
                  <div
                    onClick={() => setPayMethod('onemoney')}
                    style={{
                      border: payMethod === 'onemoney' ? '2px solid #1a6b3a' : '2px solid #e5e7eb',
                      borderRadius: 10,
                      padding: 14,
                      cursor: 'pointer',
                      background: payMethod === 'onemoney' ? '#e8f5ee' : '#fff',
                      textAlign: 'center',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{'\u{1F4F1}'}</div>
                    <div style={{ fontWeight: 700, fontSize: 12 }}>OneMoney</div>
                    <div style={{ fontSize: 9, color: '#6b7280', marginTop: 2 }}>NetOne (071)</div>
                    <div style={{ fontSize: 8, color: '#9ca3af', marginTop: 2 }}>via Paynow</div>
                  </div>
                </div>

                {/* Phone number input for mobile money */}
                {(payMethod === 'ecocash' || payMethod === 'onemoney') && (
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>
                      {payMethod === 'ecocash' ? 'EcoCash' : 'OneMoney'} Number
                    </label>
                    <input
                      type="tel"
                      placeholder={payMethod === 'ecocash' ? '0771234567' : '0712345678'}
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: 8,
                        fontSize: 14,
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                    <div style={{ fontSize: 9, color: '#9ca3af', marginTop: 4 }}>
                      {payMethod === 'ecocash'
                        ? 'Enter your Econet number (077x or 078x)'
                        : 'Enter your NetOne number (071x)'}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Status messages */}
            {payStatus === 'pending' && (
              <div style={{ background: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: 10, padding: '12px 16px', marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: '#92400E', marginBottom: 4 }}>Waiting for payment confirmation...</div>
                <div style={{ fontSize: 11, color: '#92400E' }}>{payMessage}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid #F59E0B', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
                  <span style={{ fontSize: 10, color: '#92400E' }}>Checking every 5 seconds...</span>
                </div>
              </div>
            )}

            {payStatus === 'success' && (
              <div style={{ background: '#e8f5ee', border: '1px solid #1a6b3a', borderRadius: 10, padding: '12px 16px', marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: '#1a6b3a' }}>{'\u2705'} {payMessage}</div>
              </div>
            )}

            {payStatus === 'error' && (
              <div style={{ background: '#FEE2E2', border: '1px solid #EF4444', borderRadius: 10, padding: '12px 16px', marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: '#991B1B' }}>{payMessage}</div>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              {payStatus !== 'success' && (
                <button
                  onClick={handlePay}
                  disabled={payStatus === 'loading' || payStatus === 'pending'}
                  style={{
                    ...btnS(true),
                    flex: 1,
                    justifyContent: 'center',
                    padding: '10px 16px',
                    fontSize: 13,
                    opacity: (payStatus === 'loading' || payStatus === 'pending') ? 0.6 : 1,
                  }}
                >
                  {payStatus === 'loading' ? 'Processing...'
                    : payStatus === 'pending' ? 'Waiting...'
                    : payMethod === 'card' ? 'Pay with Card (Pesepay)'
                    : payMethod === 'ecocash' ? 'Pay with EcoCash'
                    : 'Pay with OneMoney'}
                </button>
              )}
              <button
                onClick={() => setShowPayModal(false)}
                disabled={payStatus === 'loading'}
                style={{ ...btnS(false), flex: payStatus === 'success' ? 1 : 0, justifyContent: 'center', padding: '10px 16px', fontSize: 13 }}
              >
                {payStatus === 'success' ? 'Done' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spinner animation */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
