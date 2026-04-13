import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const S = {
  wrapper: {
    height: '100vh', display: 'flex', background: '#fff', overflow: 'hidden',
  },
  leftSide: {
    flex: 1,
    backgroundImage: 'url(https://cdn.pixabay.com/photo/2016/11/22/21/57/apparel-1850804_1280.jpg)',
    backgroundSize: 'cover', backgroundPosition: 'center',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '40px 20px', position: 'relative',
  },
  leftOverlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(135deg,rgba(13,74,34,.9) 0%,rgba(26,107,58,.85) 50%,rgba(45,158,88,.8) 100%)',
  },
  leftContent: {
    position: 'relative', zIndex: 10, textAlign: 'center', color: '#fff',
    maxWidth: 400,
  },
  leftTitle: {
    fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 700,
    margin: '0 0 16px', letterSpacing: '-1px',
  },
  leftSubtitle: {
    fontSize: 16, lineHeight: 1.6, marginBottom: 40, opacity: 0.95,
  },
  pillsContainer: {
    display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center',
  },
  pill: {
    background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(10px)',
    borderRadius: '20px', padding: '8px 18px', fontSize: 13, fontWeight: 600,
    color: '#fff', textAlign: 'center', whiteSpace: 'nowrap',
  },
  rightSide: {
    width: 480, minWidth: 360, background: '#fff', display: 'flex', flexDirection: 'column',
    padding: 48, overflowY: 'auto',
  },
  rightSideMobile: {
    flex: 1, background: '#fff', display: 'flex', flexDirection: 'column',
    padding: 24, overflowY: 'auto',
  },
  logo: {
    marginBottom: 24,
  },
  title: {
    fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700,
    color: '#111827', margin: '0 0 8px',
  },
  subtitle: {
    fontSize: 14, color: '#6b7280', lineHeight: 1.5, marginBottom: 28,
  },
  form: {},
  field: {
    marginBottom: 20,
  },
  label: {
    display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8,
  },
  input: {
    width: '100%', padding: '12px 14px', border: '1px solid #e5e7eb',
    borderRadius: 8, fontSize: 14, outline: 'none', color: '#111827',
    boxSizing: 'border-box', transition: 'border-color 0.15s',
  },
  select: {
    width: '100%', padding: '12px 14px', border: '1px solid #e5e7eb',
    borderRadius: 8, fontSize: 14, outline: 'none', color: '#111827',
    boxSizing: 'border-box', background: '#fff', cursor: 'pointer',
  },
  row: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20,
  },
  moduleGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20,
  },
  moduleCard: (active) => ({
    padding: '20px 16px', border: active ? '2px solid #1a6b3a' : '1px solid #e5e7eb',
    borderRadius: 8, background: active ? '#e8f5ee' : '#fff', cursor: 'pointer',
    textAlign: 'center', transition: 'all 0.15s',
  }),
  moduleIcon: {
    fontSize: 32, marginBottom: 8,
  },
  moduleName: (active) => ({
    fontWeight: 700, color: active ? '#1a6b3a' : '#111827', marginBottom: 4,
  }),
  moduleDesc: {
    fontSize: 12, color: '#6b7280', lineHeight: 1.4,
  },
  passwordStrength: {
    display: 'flex', gap: 4, marginTop: 8,
  },
  strengthBar: (active, color) => ({
    flex: 1, height: 4, borderRadius: 2, background: active ? color : '#e5e7eb',
    transition: 'background 0.15s',
  }),
  strengthLabel: (strength) => {
    const colors = { weak: '#dc2626', medium: '#c97d1a', strong: '#1a6b3a' };
    return { fontSize: 12, marginTop: 6, color: colors[strength] || '#6b7280', fontWeight: 600 };
  },
  checkboxRow: {
    display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 24,
  },
  checkbox: {
    width: 18, height: 18, marginTop: 1, cursor: 'pointer', accentColor: '#1a6b3a',
    flexShrink: 0,
  },
  checkboxLabel: {
    fontSize: 13, color: '#374151', lineHeight: 1.5,
  },
  checkboxLink: {
    color: '#1a6b3a', fontWeight: 600, textDecoration: 'none',
  },
  button: {
    width: '100%', padding: '14px 16px', background: '#1a6b3a', color: '#fff',
    border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700,
    cursor: 'pointer', transition: 'background 0.15s', marginBottom: 24,
  },
  error: {
    background: '#fdecea', color: '#c0392b', fontSize: 13,
    padding: '12px 14px', borderRadius: 8, marginBottom: 20,
  },
  footer: {
    fontSize: 13, color: '#6b7280', textAlign: 'center',
    paddingTop: 20, borderTop: '1px solid #e5e7eb',
  },
  footerLink: {
    color: '#1a6b3a', fontWeight: 600, textDecoration: 'none',
  },
};

export default function Register() {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const [form, setForm] = useState({
    business_name: '',
    modules: ['farm'],
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    username: '',
    password: '',
    country: 'United States',
    currency: 'USD',
    terms_agreed: false,
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const toggleModule = (mod) => {
    setForm(p => {
      const mods = p.modules.includes(mod)
        ? p.modules.filter(m => m !== mod)
        : [...p.modules, mod];
      return { ...p, modules: mods.length ? mods : [mod] };
    });
  };

  // Calculate password strength
  const calcStrength = (pwd) => {
    if (pwd.length < 6) return 'weak';
    if (pwd.length < 10) return 'medium';
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNum = /\d/.test(pwd);
    const hasSpecial = /[!@#$%^&*]/.test(pwd);
    if (hasUpper && hasLower && hasNum && hasSpecial) return 'strong';
    return 'medium';
  };

  const strength = calcStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.terms_agreed) {
      alert('Please agree to the terms');
      return;
    }
    const ok = await register(form);
    if (ok) navigate('/app');
  };

  const canSubmit = form.business_name && form.email && form.username && form.password.length >= 6 && form.terms_agreed && !loading;

  return (
    <div style={S.wrapper}>
      {/* Left Side - Hidden on mobile */}
      {!isMobile && <div style={S.leftSide}>
        <div style={S.leftOverlay} />
        <div style={S.leftContent}>
          <h1 style={S.leftTitle}>Start Your Free Month</h1>
          <p style={S.leftSubtitle}>
            No credit card required. Full access for 30 days. Choose your module and start managing your business today.
          </p>
          <div style={S.pillsContainer}>
            <div style={S.pill}>30 Days Free</div>
            <div style={S.pill}>No Card Needed</div>
            <div style={S.pill}>Cancel Anytime</div>
          </div>
        </div>
      </div>}

      {/* Right Side */}
      <div style={isMobile ? S.rightSideMobile : S.rightSide}>
        <div style={S.logo}>
          <div style={{ background: '#0D4A22', borderRadius: 8, padding: '6px 14px', display: 'inline-block' }}>
            <span style={{ color: '#c97d1a', fontWeight: 800, fontSize: 18, fontFamily: "'Playfair Display', serif", letterSpacing: 1 }}>PEWIL</span>
          </div>
        </div>

        <h2 style={S.title}>Create Account</h2>
        <p style={S.subtitle}>Set up your business in under 2 minutes</p>

        {error && <div style={S.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={S.form}>
          {/* Business Name */}
          <div style={S.field}>
            <label style={S.label}>Business Name</label>
            <input
              style={S.input}
              type="text"
              placeholder="e.g. Makonese Farm"
              value={form.business_name}
              onChange={e => set('business_name', e.target.value)}
              onFocus={e => { e.target.style.borderColor = '#1a6b3a'; }}
              onBlur={e => { e.target.style.borderColor = '#e5e7eb'; }}
              required
            />
          </div>

          {/* Module Selector */}
          <label style={{ ...S.label, marginBottom: 12 }}>Choose Your Module</label>
          <div style={S.moduleGrid}>
            <div
              style={S.moduleCard(form.modules.includes('farm'))}
              onClick={() => toggleModule('farm')}
            >
              <div style={S.moduleIcon}>🌱</div>
              <div style={S.moduleName(form.modules.includes('farm'))}>Farm</div>
              <div style={S.moduleDesc}>Fields, stock, workers, reports</div>
            </div>
            <div
              style={S.moduleCard(form.modules.includes('retail'))}
              onClick={() => toggleModule('retail')}
            >
              <div style={S.moduleIcon}>🛒</div>
              <div style={S.moduleName(form.modules.includes('retail'))}>Retail</div>
              <div style={S.moduleDesc}>POS, products, cashier, sales</div>
            </div>
          </div>

          {/* Full Name & Phone */}
          <div style={S.row}>
            <div style={{ marginBottom: 0 }}>
              <label style={S.label}>Full Name</label>
              <input
                style={S.input}
                type="text"
                placeholder="John Doe"
                value={form.first_name}
                onChange={e => set('first_name', e.target.value)}
                onFocus={e => { e.target.style.borderColor = '#1a6b3a'; }}
                onBlur={e => { e.target.style.borderColor = '#e5e7eb'; }}
              />
            </div>
            <div style={{ marginBottom: 0 }}>
              <label style={S.label}>Phone</label>
              <input
                style={S.input}
                type="tel"
                placeholder="+1 234 567 8900"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                onFocus={e => { e.target.style.borderColor = '#1a6b3a'; }}
                onBlur={e => { e.target.style.borderColor = '#e5e7eb'; }}
              />
            </div>
          </div>

          {/* Email */}
          <div style={S.field}>
            <label style={S.label}>Email</label>
            <input
              style={S.input}
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              onFocus={e => { e.target.style.borderColor = '#1a6b3a'; }}
              onBlur={e => { e.target.style.borderColor = '#e5e7eb'; }}
              required
            />
          </div>

          {/* Username */}
          <div style={S.field}>
            <label style={S.label}>Username</label>
            <input
              style={S.input}
              type="text"
              placeholder="Choose a username"
              value={form.username}
              onChange={e => set('username', e.target.value)}
              onFocus={e => { e.target.style.borderColor = '#1a6b3a'; }}
              onBlur={e => { e.target.style.borderColor = '#e5e7eb'; }}
              required
            />
          </div>

          {/* Password with Strength Meter */}
          <div style={S.field}>
            <label style={S.label}>Password</label>
            <input
              style={S.input}
              type="password"
              placeholder="Create a strong password"
              value={form.password}
              onChange={e => set('password', e.target.value)}
              onFocus={e => { e.target.style.borderColor = '#1a6b3a'; }}
              onBlur={e => { e.target.style.borderColor = '#e5e7eb'; }}
              required
            />
            {form.password && (
              <>
                <div style={S.passwordStrength}>
                  <div style={S.strengthBar(true, strength === 'weak' ? '#dc2626' : strength === 'medium' ? '#c97d1a' : '#1a6b3a')} />
                  <div style={S.strengthBar(strength !== 'weak', strength === 'medium' || strength === 'strong' ? (strength === 'medium' ? '#c97d1a' : '#1a6b3a') : '#e5e7eb')} />
                  <div style={S.strengthBar(strength === 'strong', '#1a6b3a')} />
                  <div style={S.strengthBar(false, '#e5e7eb')} />
                </div>
                <div style={S.strengthLabel(strength)}>
                  {strength === 'weak' && 'Weak password'}
                  {strength === 'medium' && 'Medium strength'}
                  {strength === 'strong' && 'Strong password'}
                </div>
              </>
            )}
          </div>

          {/* Country Dropdown */}
          <div style={S.field}>
            <label style={S.label}>Country</label>
            <select
              style={S.select}
              value={form.country}
              onChange={e => set('country', e.target.value)}
            >
              <option>United States</option>
              <option>United Kingdom</option>
              <option>Canada</option>
              <option>Australia</option>
              <option>South Africa</option>
              <option>Zimbabwe</option>
              <option>Kenya</option>
              <option>Nigeria</option>
              <option>Ghana</option>
              <option>India</option>
              <option>Brazil</option>
              <option>Germany</option>
              <option>France</option>
              <option>Netherlands</option>
              <option>Other</option>
            </select>
          </div>

          {/* Currency Dropdown */}
          <div style={S.field}>
            <label style={S.label}>Currency</label>
            <select
              style={S.select}
              value={form.currency}
              onChange={e => set('currency', e.target.value)}
            >
              <option value="USD">USD ($)</option>
              <option value="GBP">GBP (£)</option>
              <option value="EUR">EUR (€)</option>
              <option value="ZAR">ZAR (R)</option>
              <option value="KES">KES (KSh)</option>
              <option value="NGN">NGN (₦)</option>
              <option value="AUD">AUD (A$)</option>
              <option value="CAD">CAD (C$)</option>
              <option value="INR">INR (₹)</option>
              <option value="BRL">BRL (R$)</option>
            </select>
          </div>

          {/* Terms Checkbox */}
          <div style={S.checkboxRow}>
            <input
              style={S.checkbox}
              type="checkbox"
              id="terms"
              checked={form.terms_agreed}
              onChange={e => set('terms_agreed', e.target.checked)}
            />
            <label style={S.checkboxLabel} htmlFor="terms">
              I agree to the{' '}
              <a href="#" style={S.checkboxLink} onClick={e => e.preventDefault()}>
                Terms of Service
              </a>
              {' '}and{' '}
              <a href="#" style={S.checkboxLink} onClick={e => e.preventDefault()}>
                Privacy Policy
              </a>
            </label>
          </div>

          <button
            type="submit"
            style={{ ...S.button, opacity: canSubmit ? 1 : 0.6 }}
            disabled={!canSubmit}
            onMouseEnter={e => { if (canSubmit) e.currentTarget.style.background = '#2d9e58'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#1a6b3a'; }}
          >
            {loading ? 'Creating account...' : 'Create Account & Start Free Month'}
          </button>
        </form>

        <div style={S.footer}>
          Already have an account?{' '}
          <Link to="/login" style={S.footerLink}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
