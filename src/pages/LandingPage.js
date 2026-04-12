import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const COLORS = {
  green: '#1a6b3a',
  greenDark: '#0D4A22',
  green2: '#2d9e58',
  green3: '#e8f5ee',
  amber: '#c97d1a',
  ink: '#111827',
  ink2: '#374151',
  ink3: '#6b7280',
  surface: '#f9fafb',
  border: '#e5e7eb',
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('Growth');
  const [userCount, setUserCount] = useState(10);
  const [includeAI, setIncludeAI] = useState(true);

  // Redirect to app if already logged in
  if (user) {
    navigate('/app');
    return null;
  }

  // Pricing plans data
  const plans = {
    Starter: { price: 15, modules: 1, users: 3, features: ['1 module', '3 users', 'Core features', 'Email support'], disabled: ['AI', 'Both modules'], addon: 10 },
    Growth: { price: 25, modules: 2, users: 10, features: ['Farm + Retail', '10 users', 'AI included', 'Health Score', 'Priority email', 'Export'], mostPopular: true },
    Enterprise: { price: 89, modules: 'unlimited', users: 'unlimited', features: ['All modules', 'Unlimited users', 'WhatsApp alerts', 'White-label', 'Dedicated support', 'Custom integrations'] },
  };

  const calculateTotal = () => {
    if (selectedPlan === 'Growth') {
      const baseCost = 25;
      const extraSeats = Math.max(0, userCount - 10) * 5;
      return baseCost + extraSeats;
    } else if (selectedPlan === 'Starter') {
      const baseCost = 15;
      const aiCost = includeAI ? 10 : 0;
      const extraSeats = Math.max(0, userCount - 3) * 5;
      return baseCost + aiCost + extraSeats;
    } else {
      return 89;
    }
  };

  const features = [
    { title: 'Farm Management', image: 'https://cdn.pixabay.com/photo/2017/06/10/05/26/rice-terraces-2389023_640.jpg', desc: 'Track fields, crops, and harvest with precision' },
    { title: 'Retail & POS', image: 'https://cdn.pixabay.com/photo/2016/03/02/20/13/grocery-1232944_640.jpg', desc: 'Modern point of sale and inventory management' },
    { title: 'AI Intelligence', image: 'https://cdn.pixabay.com/photo/2020/07/08/04/12/work-5382501_640.jpg', desc: 'Smart insights and predictive analytics' },
    { title: 'Reports & Export', image: 'https://cdn.pixabay.com/photo/2015/05/15/01/48/computer-767776_1280.jpg', desc: 'Export reports for accounting and analysis' },
    { title: 'Livestock Tracking', image: 'https://cdn.pixabay.com/photo/2017/09/24/17/19/cow-2782461_1280.jpg', desc: 'Complete herd and animal management' },
    { title: 'Multi-Location', image: 'https://cdn.pixabay.com/photo/2017/07/28/17/20/wheat-2549245_640.jpg', desc: 'Manage multiple farms from one dashboard' },
  ];

  return (
    <div style={{ background: COLORS.surface }}>
      {/* Sticky Navigation */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'white',
        borderBottom: `1px solid ${COLORS.border}`,
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: COLORS.greenDark,
            padding: '0.5rem 0.75rem',
            borderRadius: '0.5rem',
            fontWeight: 'bold',
            color: COLORS.amber,
            fontSize: '1.25rem',
            letterSpacing: '-0.02em',
          }}>
            PEWIL
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
          <Link to="#features" style={{ color: COLORS.ink, textDecoration: 'none', fontWeight: '500', cursor: 'pointer' }}>Features</Link>
          <Link to="#pricing" style={{ color: COLORS.ink, textDecoration: 'none', fontWeight: '500', cursor: 'pointer' }}>Pricing</Link>
          <Link to="/login" style={{ color: COLORS.ink, textDecoration: 'none', fontWeight: '500', cursor: 'pointer' }}>Log in</Link>
          <button
            onClick={() => navigate('/register')}
            style={{
              background: COLORS.green,
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.95rem',
            }}
          >
            Start Free Trial
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        backgroundImage: 'url(https://cdn.pixabay.com/photo/2021/06/11/22/41/wheat-6329586_1280.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        padding: '6rem 2rem',
        textAlign: 'center',
        color: 'white',
        minHeight: '500px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: '2rem',
        borderBottomRightRadius: '2rem',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg,rgba(13,74,34,.88) 0%,rgba(26,107,58,.82) 50%,rgba(45,158,88,.75) 100%)',
          borderBottomLeftRadius: '2rem',
          borderBottomRightRadius: '2rem',
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px' }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontFamily: 'Playfair Display, serif',
            fontWeight: '700',
            marginBottom: '1rem',
            lineHeight: '1.2',
          }}>
            Run Your Business Smarter
          </h1>
          <p style={{
            fontSize: '1.25rem',
            marginBottom: '2rem',
            lineHeight: '1.6',
            opacity: 0.95,
            fontFamily: 'Inter, sans-serif',
          }}>
            Farm management and retail POS in one powerful platform. Built for businesses that grow.
          </p>
          <button
            onClick={() => navigate('/register')}
            style={{
              background: COLORS.amber,
              color: COLORS.ink,
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Start Your Free Month
          </button>
        </div>
      </section>

      {/* Trial Banner */}
      <section style={{
        background: 'linear-gradient(135deg,#e8f5ee,#eff6ff)',
        border: `2px dashed ${COLORS.green}`,
        margin: '3rem 2rem',
        padding: '2rem',
        borderRadius: '1rem',
        textAlign: 'center',
      }}>
        <h3 style={{ color: COLORS.green, fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          30 Days Free — No Card Required
        </h3>
        <p style={{ color: COLORS.ink2, fontSize: '1rem' }}>
          Every new signup gets a full month free. Farm AI analysis unlocks on paid plans. Cancel anytime.
        </p>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontFamily: 'Playfair Display, serif',
          textAlign: 'center',
          marginBottom: '3rem',
          color: COLORS.ink,
        }}>
          Simple, Fair Pricing
        </h2>

        {/* Pricing Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '4rem',
        }}>
          {Object.entries(plans).map(([planName, plan]) => (
            <div
              key={planName}
              style={{
                border: plan.mostPopular ? `3px solid ${COLORS.green}` : `1px solid ${COLORS.border}`,
                borderRadius: '1rem',
                overflow: 'hidden',
                background: 'white',
                boxShadow: plan.mostPopular ? `0 10px 30px rgba(26, 107, 58, 0.1)` : '0 1px 3px rgba(0, 0, 0, 0.1)',
                position: 'relative',
              }}
            >
              {plan.mostPopular && (
                <div style={{
                  background: COLORS.green,
                  color: 'white',
                  textAlign: 'center',
                  padding: '0.5rem',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                }}>
                  MOST POPULAR
                </div>
              )}
              <img
                src={
                  planName === 'Starter'
                    ? 'https://cdn.pixabay.com/photo/2022/06/19/21/21/grain-7272712_640.jpg'
                    : planName === 'Growth'
                    ? 'https://cdn.pixabay.com/photo/2020/12/16/14/56/farm-5836815_640.jpg'
                    : 'https://cdn.pixabay.com/photo/2019/08/22/09/09/cows-4423003_640.jpg'
                }
                alt={planName}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <div style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: COLORS.ink }}>
                  {planName}
                </h3>
                <div style={{ marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: '700', color: COLORS.green }}>
                    ${plan.price}
                  </span>
                  <span style={{ color: COLORS.ink3 }}>/month</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                  {plan.features.map((feature, idx) => (
                    <li key={idx} style={{ padding: '0.5rem 0', color: COLORS.ink2, fontSize: '0.95rem' }}>
                      ✓ {feature}
                    </li>
                  ))}
                </ul>
                {plan.disabled && (
                  <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem' }}>
                    {plan.disabled.map((feature, idx) => (
                      <li key={idx} style={{ padding: '0.5rem 0', color: COLORS.ink3, fontSize: '0.95rem', opacity: 0.6 }}>
                        ✗ {feature}
                      </li>
                    ))}
                  </ul>
                )}
                {plan.addon && (
                  <p style={{ fontSize: '0.85rem', color: COLORS.amber, marginBottom: '1.5rem' }}>
                    Add-on: ${plan.addon}/mo AI
                  </p>
                )}
                <button
                  onClick={() => navigate('/register')}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: plan.mostPopular ? 'none' : `2px solid ${COLORS.green}`,
                    background: plan.mostPopular ? COLORS.green : 'transparent',
                    color: plan.mostPopular ? 'white' : COLORS.green,
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                  }}
                >
                  {planName === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Seat Calculator */}
        <div style={{
          background: COLORS.green3,
          padding: '2rem',
          borderRadius: '1rem',
          maxWidth: '600px',
          margin: '0 auto',
        }}>
          <h3 style={{ color: COLORS.ink, marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '700' }}>
            Calculate Your Cost
          </h3>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: COLORS.ink2, fontWeight: '600' }}>
              Select Plan
            </label>
            <select
              value={selectedPlan}
              onChange={(e) => {
                setSelectedPlan(e.target.value);
                if (e.target.value === 'Growth') setUserCount(10);
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '0.5rem',
                fontSize: '1rem',
              }}
            >
              {Object.keys(plans).map((plan) => (
                <option key={plan} value={plan}>{plan}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: COLORS.ink2, fontWeight: '600' }}>
              Number of Users: {userCount}
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={userCount}
              onChange={(e) => setUserCount(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          {selectedPlan === 'Starter' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={includeAI}
                  onChange={(e) => setIncludeAI(e.target.checked)}
                />
                <span style={{ color: COLORS.ink2, fontWeight: '600' }}>Add AI ($10/month)</span>
              </label>
            </div>
          )}

          <div style={{
            background: 'white',
            padding: '1rem',
            borderRadius: '0.5rem',
            textAlign: 'center',
          }}>
            <p style={{ color: COLORS.ink3, fontSize: '0.9rem', marginBottom: '0.5rem' }}>Estimated monthly cost</p>
            <p style={{ fontSize: '2rem', fontWeight: '700', color: COLORS.green }}>
              ${calculateTotal()}/month
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" style={{ padding: '4rem 2rem', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontFamily: 'Playfair Display, serif',
            textAlign: 'center',
            marginBottom: '3rem',
            color: COLORS.ink,
          }}>
            Everything You Need
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
          }}>
            {features.map((feature, idx) => (
              <div key={idx} style={{
                borderRadius: '1rem',
                overflow: 'hidden',
                background: COLORS.surface,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}>
                <img
                  src={feature.image}
                  alt={feature.title}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: COLORS.ink }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: COLORS.ink3, fontSize: '0.95rem', lineHeight: '1.5' }}>
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: `linear-gradient(135deg, ${COLORS.greenDark}, ${COLORS.green}, ${COLORS.green2})`,
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontFamily: 'Playfair Display, serif',
            marginBottom: '1rem',
          }}>
            Ready to Grow Your Business?
          </h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.95 }}>
            Join thousands of farm and retail owners who trust Pewil.
          </p>
          <button
            onClick={() => navigate('/register')}
            style={{
              background: COLORS.amber,
              color: COLORS.ink,
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: COLORS.greenDark,
        color: 'white',
        padding: '2rem',
        textAlign: 'center',
      }}>
        <p style={{ marginBottom: '1rem' }}>Copyright 2026 Pewil. All rights reserved.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', fontSize: '0.9rem' }}>
          <Link to="#terms" style={{ color: 'white', textDecoration: 'none' }}>Terms</Link>
          <Link to="#privacy" style={{ color: 'white', textDecoration: 'none' }}>Privacy</Link>
          <Link to="#support" style={{ color: 'white', textDecoration: 'none' }}>Support</Link>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
