import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const C = {
  green: '#1a6b3a', greenDark: '#0D4A22', green2: '#2d9e58', green3: '#e8f5ee',
  amber: '#c97d1a', ink: '#111827', ink2: '#374151', ink3: '#6b7280',
  surface: '#f9fafb', border: '#e5e7eb', white: '#ffffff',
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('Growth');
  const [userCount, setUserCount] = useState(10);
  const [includeAI, setIncludeAI] = useState(true);
  const [faqOpen, setFaqOpen] = useState(null);

  if (user) return <Navigate to="/app" replace />;

  const plans = {
    Starter: { price: 15, features: ['1 module (Farm or Retail)', '3 users included', 'Core features', 'Email support', 'Data export'], disabled: ['AI insights', 'Both modules'], addon: 10 },
    Growth: { price: 25, features: ['Farm + Retail modules', '10 users included', 'AI insights included', 'Health Score dashboard', 'Priority email support', 'Full data export', 'WhatsApp alerts'], mostPopular: true },
    Enterprise: { price: 89, features: ['All modules unlocked', 'Unlimited users', 'WhatsApp + SMS alerts', 'White-label branding', 'Dedicated account manager', 'Custom integrations', 'SLA guarantee'] },
  };

  const calculateTotal = () => {
    if (selectedPlan === 'Growth') return 25 + Math.max(0, userCount - 10) * 5;
    if (selectedPlan === 'Starter') return 15 + (includeAI ? 10 : 0) + Math.max(0, userCount - 3) * 5;
    return 89;
  };

  const features = [
    { emoji: '\u{1F33E}', title: 'Farm Management', desc: 'Track fields, crops, livestock, costs, and harvest yields. Complete season management from planting to market.' },
    { emoji: '\u{1F6D2}', title: 'Retail POS', desc: 'Modern point of sale with barcode scanning, receipt printing, multi-currency support, and ZIMRA fiscal compliance.' },
    { emoji: '\u{1F9E0}', title: 'AI Intelligence', desc: 'Smart insights, health scores, and predictive analytics powered by AI. Know what to plant, when to sell, and where to cut costs.' },
    { emoji: '\u{1F4CA}', title: 'Reports & Analytics', desc: 'Profit & loss statements, cashier performance, end-of-day reconciliation, and exportable financial reports.' },
    { emoji: '\u{1F404}', title: 'Livestock Tracking', desc: 'Manage cattle, goats, sheep, pigs, broilers, and layers. Health records, breeding cycles, and mortality tracking.' },
    { emoji: '\u{1F465}', title: 'Team Management', desc: 'Role-based access for owners, managers, and workers. Payroll, attendance, and PAYE/NSSA compliance for Zimbabwe.' },
    { emoji: '\u{1F4F1}', title: 'Works on Any Device', desc: 'Progressive Web App works on phones, tablets, and desktops. Install it like a native app — works offline too.' },
    { emoji: '\u{1F512}', title: 'Bank-Grade Security', desc: 'HTTPS encryption, two-factor authentication, audit logs, and automatic backups. Your data is always safe.' },
    { emoji: '\u{1F4B1}', title: 'Multi-Currency', desc: 'Support for USD, ZWL, ZAR, and more. Automatic exchange rate updates for mixed-currency transactions.' },
  ];

  const testimonials = [
    { name: 'Tendai M.', role: 'Farm Owner, Masvingo', text: 'Pewil replaced three separate tools I was using. Now everything from field tracking to selling at the market is in one place.', rating: 5 },
    { name: 'Grace C.', role: 'Shop Owner, Harare', text: 'The POS system is fast and the ZIMRA fiscal compliance saved me from headaches with tax authorities. My cashiers love it.', rating: 5 },
    { name: 'Blessing N.', role: 'Agri-Business, Chinhoyi', text: 'Being able to switch between farm and retail in the same app is a game-changer. The AI insights help me plan each season better.', rating: 5 },
    { name: 'Tatenda K.', role: 'Poultry Farmer, Mutare', text: 'Layer and broiler tracking with mortality rates and feed costs — I can finally see where my money goes. Profit margins doubled.', rating: 4 },
  ];

  const faqs = [
    { q: 'Is there a free trial?', a: 'Yes! Every new account gets 30 days free with full access to all features. No credit card required to start.' },
    { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, EcoCash, and OneMoney through our secure Pesepay integration.' },
    { q: 'Can I use Pewil on my phone?', a: 'Absolutely. Pewil is a Progressive Web App that works on any device. Open pewil.org in your browser and add it to your home screen for a native app experience.' },
    { q: 'Is my data safe?', a: 'Yes. We use HTTPS encryption, JWT authentication, optional 2FA, role-based access control, and daily automated backups. You own your data and can export it anytime.' },
    { q: 'Can I manage both a farm and a shop?', a: 'Yes! The Growth and Enterprise plans include both Farm and Retail modules. Switch between them instantly from the sidebar.' },
    { q: 'Do you support ZIMRA fiscal compliance?', a: 'Yes. Our retail module includes ZIMRA fiscalisation support with fiscal device management and compliant receipt generation.' },
    { q: 'How many team members can I add?', a: 'Starter includes 3 users, Growth includes 10, and Enterprise offers unlimited users. Additional seats are $5/month each on Starter and Growth plans.' },
    { q: 'Can I export my data?', a: 'Yes, anytime. Export all your data as CSV (for spreadsheets) or JSON (for developers) from the Data Export page.' },
  ];

  const stats = [
    { number: '500+', label: 'Active Farms' },
    { number: '12,000+', label: 'Transactions/Month' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24hr', label: 'Support Response' },
  ];

  return (
    <div style={{ background: C.surface, fontFamily: "'Inter', sans-serif" }}>
      {/* Navigation */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(8px)', borderBottom: `1px solid ${C.border}`,
        padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: C.greenDark, padding: '8px 14px', borderRadius: 8, fontWeight: 800, color: C.amber, fontSize: 18, letterSpacing: -0.5 }}>PEWIL</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, fontSize: 14 }}>
          <a href="#features" style={{ color: C.ink2, textDecoration: 'none', fontWeight: 500 }}>Features</a>
          <a href="#pricing" style={{ color: C.ink2, textDecoration: 'none', fontWeight: 500 }}>Pricing</a>
          <a href="#faq" style={{ color: C.ink2, textDecoration: 'none', fontWeight: 500 }}>FAQ</a>
          <Link to="/login" style={{ color: C.ink2, textDecoration: 'none', fontWeight: 500 }}>Log in</Link>
          <button onClick={() => navigate('/register')} style={{
            background: C.green, color: '#fff', border: 'none', padding: '10px 22px',
            borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 14,
          }}>Start Free Trial</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        background: `linear-gradient(135deg, ${C.greenDark} 0%, ${C.green} 50%, ${C.green2} 100%)`,
        padding: '80px 24px 90px', textAlign: 'center', color: '#fff', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 24, backdropFilter: 'blur(4px)' }}>
            Trusted by 500+ businesses across Zimbabwe
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 52, fontWeight: 700, lineHeight: 1.15, marginBottom: 18 }}>
            Run Your Farm & Store<br />From One Platform
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.7, opacity: 0.92, maxWidth: 560, margin: '0 auto 32px' }}>
            Farm management and retail POS built for African businesses. Track everything from planting to point of sale.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14 }}>
            <button onClick={() => navigate('/register')} style={{
              background: C.amber, color: C.ink, border: 'none', padding: '14px 32px',
              borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 16,
            }}>Start Your Free Month</button>
            <a href="#features" style={{
              display: 'inline-flex', alignItems: 'center', padding: '14px 28px',
              borderRadius: 8, border: '2px solid rgba(255,255,255,0.4)', color: '#fff',
              textDecoration: 'none', fontWeight: 600, fontSize: 15,
            }}>See Features</a>
          </div>
        </div>
      </section>

      {/* Social proof stats */}
      <section style={{ background: '#fff', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'space-around', padding: '32px 24px', flexWrap: 'wrap', gap: 24 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', minWidth: 120 }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: C.green }}>{s.number}</div>
              <div style={{ fontSize: 13, color: C.ink3, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Trial banner */}
      <section style={{
        background: 'linear-gradient(135deg, #e8f5ee, #eff6ff)', border: `2px dashed ${C.green}`,
        margin: '40px 24px', padding: '28px 32px', borderRadius: 14, textAlign: 'center', maxWidth: 800, marginLeft: 'auto', marginRight: 'auto',
      }}>
        <h3 style={{ color: C.green, fontSize: 22, fontWeight: 700, marginBottom: 6 }}>30 Days Free — No Card Required</h3>
        <p style={{ color: C.ink2, fontSize: 15 }}>Full access to every feature. Start managing your business today.</p>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '64px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, textAlign: 'center', marginBottom: 12, color: C.ink }}>Everything You Need</h2>
        <p style={{ textAlign: 'center', color: C.ink3, fontSize: 16, marginBottom: 48, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
          One platform for your entire operation — from the field to the till.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '24px 22px', border: `1px solid ${C.border}`, transition: 'box-shadow 0.2s' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{f.emoji}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: C.ink, marginBottom: 6 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: C.ink3, lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ background: '#fff', padding: '64px 24px', borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, textAlign: 'center', marginBottom: 12, color: C.ink }}>What Our Customers Say</h2>
          <p style={{ textAlign: 'center', color: C.ink3, fontSize: 15, marginBottom: 48 }}>Real feedback from farm and retail owners across Zimbabwe.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background: C.surface, borderRadius: 12, padding: '24px 22px', border: `1px solid ${C.border}` }}>
                <div style={{ marginBottom: 12 }}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} style={{ color: C.amber, fontSize: 16 }}>{'\u2605'}</span>
                  ))}
                  {Array.from({ length: 5 - t.rating }).map((_, j) => (
                    <span key={j} style={{ color: '#d1d5db', fontSize: 16 }}>{'\u2605'}</span>
                  ))}
                </div>
                <p style={{ fontSize: 14, color: C.ink2, lineHeight: 1.7, marginBottom: 16, fontStyle: 'italic' }}>"{t.text}"</p>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: C.ink3 }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '64px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, textAlign: 'center', marginBottom: 12, color: C.ink }}>Simple, Fair Pricing</h2>
        <p style={{ textAlign: 'center', color: C.ink3, fontSize: 15, marginBottom: 48 }}>No hidden fees. Extra seats are just $5/month each.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 48 }}>
          {Object.entries(plans).map(([name, plan]) => (
            <div key={name} style={{
              border: plan.mostPopular ? `3px solid ${C.green}` : `1px solid ${C.border}`,
              borderRadius: 14, overflow: 'hidden', background: '#fff', position: 'relative',
              boxShadow: plan.mostPopular ? '0 10px 30px rgba(26,107,58,0.1)' : '0 1px 3px rgba(0,0,0,0.06)',
            }}>
              {plan.mostPopular && (
                <div style={{ background: C.green, color: '#fff', textAlign: 'center', padding: '8px', fontWeight: 700, fontSize: 12, letterSpacing: '0.05em' }}>MOST POPULAR</div>
              )}
              <div style={{ padding: '28px 24px' }}>
                <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: C.ink }}>{name}</h3>
                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontSize: 40, fontWeight: 800, color: C.green }}>${plan.price}</span>
                  <span style={{ color: C.ink3, fontSize: 15 }}>/month</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: 20 }}>
                  {plan.features.map((f, i) => (
                    <li key={i} style={{ padding: '6px 0', color: C.ink2, fontSize: 14 }}>{'\u2713'} {f}</li>
                  ))}
                  {plan.disabled && plan.disabled.map((f, i) => (
                    <li key={`d${i}`} style={{ padding: '6px 0', color: C.ink3, fontSize: 14, opacity: 0.5 }}>{'\u2717'} {f}</li>
                  ))}
                </ul>
                {plan.addon && (
                  <p style={{ fontSize: 13, color: C.amber, marginBottom: 16, fontWeight: 600 }}>AI add-on: +${plan.addon}/mo</p>
                )}
                <button onClick={() => navigate('/register')} style={{
                  width: '100%', padding: '12px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 15,
                  border: plan.mostPopular ? 'none' : `2px solid ${C.green}`,
                  background: plan.mostPopular ? C.green : 'transparent',
                  color: plan.mostPopular ? '#fff' : C.green,
                }}>
                  {name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Calculator */}
        <div style={{ background: C.green3, padding: '28px 32px', borderRadius: 14, maxWidth: 560, margin: '0 auto' }}>
          <h3 style={{ color: C.ink, marginBottom: 18, fontSize: 18, fontWeight: 700 }}>Calculate Your Cost</h3>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, color: C.ink2, fontWeight: 600, fontSize: 13 }}>Select Plan</label>
            <select value={selectedPlan} onChange={e => { setSelectedPlan(e.target.value); if (e.target.value === 'Growth') setUserCount(10); }}
              style={{ width: '100%', padding: '10px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14 }}>
              {Object.keys(plans).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, color: C.ink2, fontWeight: 600, fontSize: 13 }}>Number of Users: {userCount}</label>
            <input type="range" min="1" max="50" value={userCount} onChange={e => setUserCount(parseInt(e.target.value))} style={{ width: '100%' }} />
          </div>
          {selectedPlan === 'Starter' && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={includeAI} onChange={e => setIncludeAI(e.target.checked)} />
                <span style={{ color: C.ink2, fontWeight: 600, fontSize: 13 }}>Add AI ($10/month)</span>
              </label>
            </div>
          )}
          <div style={{ background: '#fff', padding: '14px', borderRadius: 8, textAlign: 'center' }}>
            <p style={{ color: C.ink3, fontSize: 13, marginBottom: 4 }}>Estimated monthly cost</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: C.green }}>${calculateTotal()}/mo</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ background: '#fff', padding: '64px 24px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, textAlign: 'center', marginBottom: 12, color: C.ink }}>Frequently Asked Questions</h2>
          <p style={{ textAlign: 'center', color: C.ink3, fontSize: 15, marginBottom: 40 }}>Everything you need to know about Pewil.</p>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
              <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{
                width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 15, fontWeight: 600, color: C.ink, textAlign: 'left',
              }}>
                <span>{faq.q}</span>
                <span style={{ fontSize: 18, color: C.ink3, transition: 'transform 0.2s', transform: faqOpen === i ? 'rotate(180deg)' : 'none' }}>{'\u25BC'}</span>
              </button>
              {faqOpen === i && (
                <p style={{ fontSize: 14, color: C.ink2, lineHeight: 1.7, padding: '0 0 18px', margin: 0 }}>{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: `linear-gradient(135deg, ${C.greenDark}, ${C.green}, ${C.green2})`,
        color: '#fff', padding: '72px 24px', textAlign: 'center',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, marginBottom: 12 }}>Ready to Grow Your Business?</h2>
          <p style={{ fontSize: 16, marginBottom: 28, opacity: 0.92, lineHeight: 1.7 }}>
            Join hundreds of farm and retail owners across Zimbabwe who manage their operations with Pewil.
          </p>
          <button onClick={() => navigate('/register')} style={{
            background: C.amber, color: C.ink, border: 'none', padding: '16px 36px',
            borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 16,
          }}>Get Started Free</button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: C.greenDark, color: '#fff', padding: '36px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 32 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, color: C.amber, marginBottom: 8 }}>PEWIL</div>
            <p style={{ fontSize: 13, opacity: 0.7, maxWidth: 280, lineHeight: 1.6 }}>
              Farm management and retail POS built for African businesses. Based in Zimbabwe.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 40, fontSize: 13 }}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 10, opacity: 0.6, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product</div>
              <a href="#features" style={{ display: 'block', color: '#fff', textDecoration: 'none', opacity: 0.8, marginBottom: 6 }}>Features</a>
              <a href="#pricing" style={{ display: 'block', color: '#fff', textDecoration: 'none', opacity: 0.8, marginBottom: 6 }}>Pricing</a>
              <a href="#faq" style={{ display: 'block', color: '#fff', textDecoration: 'none', opacity: 0.8 }}>FAQ</a>
            </div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 10, opacity: 0.6, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Legal</div>
              <Link to="/terms" style={{ display: 'block', color: '#fff', textDecoration: 'none', opacity: 0.8, marginBottom: 6 }}>Terms of Service</Link>
              <Link to="/privacy" style={{ display: 'block', color: '#fff', textDecoration: 'none', opacity: 0.8, marginBottom: 6 }}>Privacy Policy</Link>
              <Link to="/refunds" style={{ display: 'block', color: '#fff', textDecoration: 'none', opacity: 0.8 }}>Refund Policy</Link>
            </div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 10, opacity: 0.6, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Support</div>
              <a href="mailto:support@pewil.org" style={{ display: 'block', color: '#fff', textDecoration: 'none', opacity: 0.8, marginBottom: 6 }}>support@pewil.org</a>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1100, margin: '24px auto 0', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.15)', textAlign: 'center', fontSize: 12, opacity: 0.5 }}>
          {'\u00A9'} 2026 Pewil. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
