import { useState } from 'react';

const S = {
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '18px 20px', marginBottom: 16 },
  title: { fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 12 },
  p: { fontSize: 13, color: '#374151', lineHeight: 1.7, marginBottom: 10 },
  label: { display: 'block', fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 4, marginTop: 10 },
  input: { width: '100%', padding: '9px 11px', border: '1px solid #e5e7eb', borderRadius: 7, fontSize: 12, outline: 'none', color: '#111827', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '9px 11px', border: '1px solid #e5e7eb', borderRadius: 7, fontSize: 12, outline: 'none', color: '#111827', boxSizing: 'border-box', minHeight: 100, resize: 'vertical', fontFamily: 'inherit' },
  btn: { padding: '10px 20px', background: '#1a6b3a', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', marginTop: 12 },
  faqQ: { fontSize: 13, fontWeight: 600, color: '#111827', cursor: 'pointer', padding: '10px 12px', background: '#f9fafb', borderRadius: 7, marginBottom: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e5e7eb' },
  faqA: { fontSize: 12, color: '#374151', lineHeight: 1.7, padding: '8px 12px 14px', marginBottom: 6 },
  badge: { display: 'inline-block', padding: '3px 10px', borderRadius: 12, fontSize: 10, fontWeight: 600, marginRight: 8, marginBottom: 6 },
};

const FAQ = [
  { q: 'How do I add a new field or product?', a: 'Navigate to the relevant page (Fields for farms, Products for retail) and click the "+" button in the top-right corner. Fill in the required details and save.' },
  { q: 'How does the 30-day free trial work?', a: 'Every new account gets full access to all features for 30 days with no credit card required. After the trial, choose a plan to continue. Your data is preserved.' },
  { q: 'Can I use Pewil on my phone?', a: 'Yes! Pewil is a Progressive Web App (PWA). Open pewil.org on your phone browser and tap "Add to Home Screen" for a native app-like experience.' },
  { q: 'How do I export my data?', a: 'Go to Settings or the Data Export page. You can download all your farm or retail data as CSV or JSON files at any time.' },
  { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, EcoCash, and OneMoney through our Pesepay integration. All payments are securely processed.' },
  { q: 'How do I invite team members?', a: 'Navigate to the Team page (owner only). Click "+ Invite User" and enter their email. They will receive an invitation to join your tenant as a manager or worker.' },
  { q: 'Is my data secure?', a: 'Yes. We use HTTPS encryption, JWT authentication, role-based access control, optional 2FA, and regular backups. Your data is stored securely and is never shared with third parties.' },
  { q: 'Can I switch between Farm and Retail modules?', a: 'If your plan includes both modules, use the module switcher at the top of the sidebar to switch between Farm and Retail views.' },
];

export default function HelpSupport() {
  const [openFaq, setOpenFaq] = useState(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('general');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production this would POST to /api/core/support/ — for now just show confirmation
    setSent(true);
    setTimeout(() => setSent(false), 5000);
    setSubject(''); setMessage('');
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* Quick links */}
      <div style={S.card}>
        <h3 style={S.title}>Quick Links</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[
            { label: 'Getting Started', color: '#e8f5ee', text: '#1a6b3a' },
            { label: 'Billing & Plans', color: '#eff6ff', text: '#1d4ed8' },
            { label: 'Farm Module', color: '#fefce8', text: '#a16207' },
            { label: 'Retail & POS', color: '#fdf2f8', text: '#be185d' },
            { label: 'Data & Privacy', color: '#f0fdf4', text: '#15803d' },
            { label: 'Account & Security', color: '#fef2f2', text: '#991b1b' },
          ].map((cat) => (
            <span key={cat.label} style={{ ...S.badge, background: cat.color, color: cat.text }}>{cat.label}</span>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={S.card}>
        <h3 style={S.title}>Frequently Asked Questions</h3>
        {FAQ.map((item, i) => (
          <div key={i}>
            <div
              style={S.faqQ}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <span>{item.q}</span>
              <span style={{ fontSize: 14, color: '#9ca3af', transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                {'\u25BC'}
              </span>
            </div>
            {openFaq === i && <div style={S.faqA}>{item.a}</div>}
          </div>
        ))}
      </div>

      {/* Contact Form */}
      <div style={S.card}>
        <h3 style={S.title}>Contact Support</h3>
        <p style={S.p}>Can't find what you're looking for? Send us a message and we'll get back to you within 24 hours.</p>

        {sent && (
          <div style={{ background: '#e8f5ee', color: '#1a6b3a', padding: '10px 14px', borderRadius: 7, fontSize: 12, marginBottom: 12, fontWeight: 600 }}>
            Message sent! We'll respond within 24 hours.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={S.label}>Category</label>
          <select style={S.input} value={category} onChange={e => setCategory(e.target.value)}>
            <option value="general">General Question</option>
            <option value="billing">Billing & Payments</option>
            <option value="bug">Bug Report</option>
            <option value="feature">Feature Request</option>
            <option value="account">Account & Security</option>
          </select>

          <label style={S.label}>Subject</label>
          <input style={S.input} value={subject} onChange={e => setSubject(e.target.value)} placeholder="Brief description of your issue" required />

          <label style={S.label}>Message</label>
          <textarea style={S.textarea} value={message} onChange={e => setMessage(e.target.value)} placeholder="Describe your issue or question in detail..." required />

          <button type="submit" style={S.btn}>Send Message</button>
        </form>
      </div>

      {/* Contact info */}
      <div style={S.card}>
        <h3 style={S.title}>Other Ways to Reach Us</h3>
        <p style={S.p}>Email: support@pewil.org</p>
        <p style={S.p}>Response time: Within 24 hours on business days</p>
        <p style={{ ...S.p, fontSize: 11, color: '#9ca3af' }}>Pewil is based in Zimbabwe. Business hours: Mon-Fri 8am-5pm CAT.</p>
      </div>
    </div>
  );
}
