import { useEffect, useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ============ Demo handler — called from the hero CTA + any "See a live demo" button ============
function useDemoEntry() {
  const navigate = useNavigate();
  const { demoLogin } = useAuth();
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoError, setDemoError] = useState('');
  async function enterDemo() {
    if (demoLoading) return;
    setDemoLoading(true);
    setDemoError('');
    try {
      const ok = await demoLogin();
      if (ok) {
        navigate('/app');
      } else {
        setDemoError("Demo isn't available right now. Please try again shortly.");
      }
    } finally {
      setDemoLoading(false);
    }
  }
  return { enterDemo, demoLoading, demoError };
}

// Exact palette from pewil-design-3-living-africa.html
const C = {
  amber: '#f4a743',
  terra: '#d9562c',
  clay: '#b13b17',
  forest: '#1f3d26',
  forest2: '#2d5a37',
  sand: '#fff7ec',
  sand2: '#fdeedd',
  cream: '#fffcf7',
  ink: '#1b1b1b',
  muted: '#6b5d50',
  line: 'rgba(27,27,27,.12)',
  line2: 'rgba(255,247,236,.4)',
};
const R = 18, RLG = 28;
const SERIF = "'Fraunces', Georgia, serif";
const SANS = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";

const WAVY_UNDERLINE_SVG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 10'><path d='M2 5 Q25 1 50 5 T100 5 T150 5 T198 5' stroke='%23d9562c' stroke-width='2.5' fill='none' stroke-linecap='round'/></svg>\")";

// ============ reusable button styles ============
const btnBase = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  padding: '12px 20px', borderRadius: 999, fontWeight: 600, fontSize: 14.5,
  border: 0, cursor: 'pointer', fontFamily: SANS, whiteSpace: 'nowrap',
  transition: 'transform .12s, box-shadow .15s, background .15s, opacity .15s',
  textDecoration: 'none',
};
const btnPrimary = { ...btnBase, background: C.forest, color: '#fff', boxShadow: '0 8px 20px -8px rgba(31,61,38,.5)' };
const btnWarm = {
  ...btnBase,
  background: `linear-gradient(135deg, ${C.amber}, ${C.terra})`,
  color: '#fff',
  boxShadow: '0 10px 24px -8px rgba(217,86,44,.6)',
};
const btnOutline = { ...btnBase, border: `1.5px solid ${C.ink}`, color: C.ink, background: 'transparent' };
const btnGhost = { ...btnBase, color: C.ink, background: 'transparent', opacity: 0.8 };
const btnLg = { padding: '16px 28px', fontSize: 16 };

// Logo mark: The Kernel — maize kernel silhouette with an amber sprout
function LogoMark({ size = 34, light = false }) {
  const shell = light ? C.cream : C.forest;
  const sprout = light ? C.forest : C.amber;
  const iconW = Math.round(size * (110 / 120));
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: size, height: size, flexShrink: 0,
    }}>
      <svg
        width={iconW} height={size} viewBox="0 0 110 120"
        xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pewil"
      >
        <path d="M 55 4 C 89 4, 105 28, 105 56 C 105 88, 83 108, 55 108 C 27 108, 5 88, 5 56 C 5 28, 21 4, 55 4 Z" fill={shell} />
        <path d="M 55 34 L 55 86" stroke={sprout} strokeWidth="5" strokeLinecap="round" />
        <path d="M 55 48 C 45 48, 39 40, 39 32" stroke={sprout} strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M 55 60 C 67 60, 75 52, 75 44" stroke={sprout} strokeWidth="5" strokeLinecap="round" fill="none" />
      </svg>
    </span>
  );
}

// Serif kicker with left bar: "— Text —"
function SecKicker({ children, light = false }) {
  const color = light ? C.amber : C.clay;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      fontSize: 13, fontWeight: 600, textTransform: 'uppercase',
      letterSpacing: '.12em', color, marginBottom: 16,
    }}>
      <span style={{ width: 22, height: 2, background: color, borderRadius: 2 }} />
      {children}
    </div>
  );
}

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { enterDemo, demoLoading, demoError } = useDemoEntry();
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(window.innerWidth <= 1000);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const id = 'pewil-livingafrica-fonts';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;0,9..144,800;1,9..144,400;1,9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';
      document.head.appendChild(link);
    }
    const onScroll = () => setScrolled(window.scrollY > 20);
    const onResize = () => setMobile(window.innerWidth <= 1000);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  if (user) return <Navigate to="/app" replace />;

  // ==== NAV ====
  const navBar = (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50, padding: '16px 0',
      background: scrolled ? 'rgba(255,252,247,.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(14px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
      borderBottom: scrolled ? `1px solid ${C.line}` : '1px solid transparent',
      transition: 'background .2s, border-color .2s',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20,
      }}>
        <Link to="/" style={{
          display: 'flex', alignItems: 'center', gap: 10,
          textDecoration: 'none', color: C.ink,
          fontWeight: 700, fontSize: 20, letterSpacing: '-0.01em',
        }}>
          <LogoMark />
          Pewil
        </Link>
        {!mobile && (
          <div style={{ display: 'flex', gap: 28, fontSize: 15 }}>
            {['Features', 'Customers', 'Pricing', 'Resources'].map(n => (
              <a key={n} href={`#${n.toLowerCase()}`} style={{
                color: C.ink, opacity: 0.78, textDecoration: 'none', fontWeight: 500,
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0.78'}
              >{n}</a>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {!mobile && (
            <Link to="/login" style={btnGhost}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,.04)'; e.currentTarget.style.opacity = '1'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.opacity = '0.8'; }}
            >Log in</Link>
          )}
          <button
            style={btnWarm}
            onClick={() => navigate('/register')}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 14px 30px -8px rgba(217,86,44,.7)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 10px 24px -8px rgba(217,86,44,.6)'; }}
          >Start trial</button>
          {mobile && (
            <button
              aria-label="Menu"
              onClick={() => setNavOpen(v => !v)}
              style={{
                width: 42, height: 42, borderRadius: 999,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                background: '#fff', border: `1px solid ${C.line}`, cursor: 'pointer',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M3 6h14M3 10h14M3 14h14" />
              </svg>
            </button>
          )}
        </div>
      </div>
      {mobile && navOpen && (
        <div style={{
          background: '#fff', borderTop: `1px solid ${C.line}`,
          padding: '16px 28px', display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          {['Features', 'Customers', 'Pricing', 'Resources'].map(n => (
            <a key={n} href={`#${n.toLowerCase()}`} onClick={() => setNavOpen(false)}
              style={{ color: C.ink, textDecoration: 'none', fontWeight: 500, fontSize: 15 }}>{n}</a>
          ))}
          <Link to="/login" style={{ color: C.ink, textDecoration: 'none', fontWeight: 500, fontSize: 15 }}>Log in</Link>
        </div>
      )}
    </nav>
  );

  // ==== HERO ====
  const hero = (
    <header style={{
      position: 'relative', overflow: 'hidden',
      background: `
        radial-gradient(ellipse at 20% 10%, rgba(244,167,67,.35), transparent 45%),
        radial-gradient(ellipse at 90% 30%, rgba(217,86,44,.28), transparent 45%),
        radial-gradient(ellipse at 50% 100%, rgba(31,61,38,.18), transparent 50%),
        ${C.sand}
      `,
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        padding: mobile ? '18px 18px 32px' : '36px 28px 48px',
        display: 'grid',
        gridTemplateColumns: mobile ? '1fr' : '1.15fr 1fr',
        gap: mobile ? 32 : 36,
        alignItems: 'center',
      }}>
        <div>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'rgba(255,255,255,.6)', backdropFilter: 'blur(8px)',
            padding: '8px 14px', borderRadius: 999,
            fontSize: 13, fontWeight: 600, color: C.clay,
            border: '1px solid rgba(217,86,44,.2)', marginBottom: 26,
          }}>
            🌱 Built in Harare · For all of Africa
          </span>
          <h1 style={{
            fontFamily: SERIF, fontWeight: 700,
            fontSize: mobile ? 38 : 'clamp(40px, 5.4vw, 72px)',
            lineHeight: 1.02, letterSpacing: '-0.028em',
            maxWidth: '12ch', color: C.ink,
          }}>
            Grow more.<br />
            Count{' '}
            <span style={{
              fontStyle: 'italic', color: C.clay, fontWeight: 600,
              display: 'inline-block', position: 'relative',
            }}>
              every row
              <span style={{
                position: 'absolute', left: '-4%', right: '-4%',
                bottom: '-10%', height: '18%',
                backgroundImage: WAVY_UNDERLINE_SVG,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                opacity: 0.9,
              }} />
            </span>
            .
          </h1>
          <p style={{
            marginTop: 22, maxWidth: '48ch',
            fontSize: mobile ? 15.5 : 'clamp(16px, 1.4vw, 18px)',
            color: '#3a3024', lineHeight: 1.55,
          }}>
            Pewil is the business operating system for African farmers and retailers. Track fields, livestock, stock, staff, and cashflow from one place. Online or off. In USD, ZWL, or ZAR. In the language of your team.
          </p>
          <div style={{ marginTop: 36, display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              style={{ ...btnWarm, ...btnLg }}
              onClick={() => navigate('/register')}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 14px 30px -8px rgba(217,86,44,.7)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 10px 24px -8px rgba(217,86,44,.6)'; }}
            >Start your free trial →</button>
            <button
              type="button"
              onClick={enterDemo}
              disabled={demoLoading}
              style={{
                ...btnOutline, ...btnLg,
                opacity: demoLoading ? 0.65 : 1,
                cursor: demoLoading ? 'wait' : 'pointer',
              }}
              onMouseEnter={e => { if (demoLoading) return; e.currentTarget.style.background = C.ink; e.currentTarget.style.color = C.cream; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.ink; }}
            >{demoLoading ? 'Opening demo…' : 'See a live demo'}</button>
          </div>
          {demoError && (
            <div style={{
              marginTop: 14, maxWidth: 520, padding: '10px 14px', borderRadius: 12,
              background: 'rgba(217,86,44,.1)', color: C.clay,
              border: `1px solid ${C.terra}`, fontSize: 14,
            }}>{demoError}</div>
          )}
          {/* small honest line */}
          <div style={{
            marginTop: 32, display: 'flex', gap: 12, alignItems: 'center',
            fontSize: 13.5, color: C.muted, flexWrap: 'wrap',
          }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 999,
              background: 'rgba(255,255,255,.6)', backdropFilter: 'blur(6px)',
              border: '1px solid rgba(27,27,27,.08)',
              fontWeight: 600, color: C.forest,
            }}>🌍 Made in Harare</span>
            <span style={{ fontFamily: SERIF, fontStyle: 'italic', color: C.forest, fontSize: 15 }}>
              For every scale — from the kitchen table to the coop.
            </span>
          </div>
        </div>

        {/* Hero photo collage */}
        <div style={{ position: 'relative', height: mobile ? 300 : 460 }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: RLG, overflow: 'hidden',
            boxShadow: '0 40px 80px -30px rgba(177,59,23,.3)',
          }}>
            <img
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&q=80&auto=format&fit=crop"
              alt="Farm"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => {
                e.currentTarget.parentElement.style.background = 'linear-gradient(135deg,#f4a743,#d9562c)';
                e.currentTarget.remove();
              }}
            />
          </div>
          {/* card-1: field tagline (single floating caption — keeps the original feel without dominating) */}
          <div style={{
            position: 'absolute', bottom: mobile ? 16 : 22, left: mobile ? 8 : -14,
            background: '#fff', borderRadius: 16, padding: '14px 16px',
            boxShadow: '0 16px 32px -14px rgba(0,0,0,.18)',
            display: 'flex', gap: 11, alignItems: 'center',
            minWidth: mobile ? 220 : 260, maxWidth: 280,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 12,
              background: `linear-gradient(135deg, ${C.amber}, ${C.terra})`,
              display: 'grid', placeItems: 'center',
              color: '#fff', fontSize: 18, flexShrink: 0,
            }}>🌾</div>
            <div>
              <b style={{ fontFamily: SERIF, fontSize: 14, fontStyle: 'italic', display: 'block', color: C.ink, lineHeight: 1.25 }}>
                From the field, not the office.
              </b>
              <small style={{ color: C.muted, fontSize: 11.5, display: 'block', marginTop: 2 }}>
                Logged by the hands that did the work.
              </small>
            </div>
          </div>
          {/* card-2: small forest "promise" tag in the top-right corner */}
          <div style={{
            position: 'absolute', top: 18, right: mobile ? 8 : -10,
            background: C.forest, color: '#fff', borderRadius: 14,
            padding: '12px 14px', width: 168,
            boxShadow: '0 16px 32px -14px rgba(0,0,0,.22)',
          }}>
            <div style={{
              fontSize: 10, color: C.amber,
              textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 700,
            }}>— Our promise</div>
            <div style={{
              fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic',
              fontSize: 16, letterSpacing: '-.01em',
              marginTop: 6, lineHeight: 1.25,
            }}>
              Built slow.<br />
              For African <span style={{ color: C.amber }}>soil.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Soft values strip (no fake brand names) */}
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '30px 28px 10px',
        display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap',
        justifyContent: 'center', color: C.muted, fontSize: 14,
      }}>
        {[
          'Works offline',
          'Your data is yours',
          'Built for Zimbabwe',
          'Cancel any time',
          'No credit card to start',
        ].map((name, i, arr) => (
          <span key={name} style={{
            display: 'inline-flex', alignItems: 'center', gap: 28,
            fontFamily: SERIF, fontStyle: 'italic', color: C.ink,
            opacity: 0.65, fontSize: 17, letterSpacing: '-.01em',
          }}>
            {name}
            {i < arr.length - 1 && (
              <span style={{ color: C.terra, opacity: 0.5, fontSize: 12, fontStyle: 'normal' }}>✦</span>
            )}
          </span>
        ))}
      </div>
    </header>
  );

  // ==== FEATURES / BENTO GRID ====
  const card = (extra = {}) => ({
    background: '#fff', borderRadius: 24, overflow: 'hidden',
    boxShadow: '0 8px 20px -15px rgba(0,0,0,.15)',
    transition: 'transform .25s, box-shadow .25s',
    display: 'flex', flexDirection: 'column',
    ...extra,
  });
  const cardHover = e => {
    e.currentTarget.style.transform = 'translateY(-4px)';
    e.currentTarget.style.boxShadow = '0 30px 50px -25px rgba(177,59,23,.25)';
  };
  const cardUnhover = e => {
    e.currentTarget.style.transform = 'none';
    e.currentTarget.style.boxShadow = '0 8px 20px -15px rgba(0,0,0,.15)';
  };
  const tag = (dark = false, warm = false) => ({
    display: 'inline-block', padding: '5px 11px', borderRadius: 999,
    fontSize: 11.5, fontWeight: 700, letterSpacing: '.06em',
    textTransform: 'uppercase', marginBottom: 14,
    background: warm ? 'rgba(255,255,255,.25)' : dark ? 'rgba(244,167,67,.2)' : C.sand2,
    color: warm ? '#fff' : dark ? C.amber : C.clay,
  });
  const cardH4 = { fontFamily: SERIF, fontWeight: 700, fontSize: 26, letterSpacing: '-.015em', lineHeight: 1.2, marginBottom: 10 };

  const features = (
    <section id="features" style={{
      maxWidth: 1280, margin: '0 auto',
      padding: mobile ? '60px 18px' : '100px 28px',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-end', gap: 30, flexWrap: 'wrap',
      }}>
        <div>
          <SecKicker>Everything you need</SecKicker>
          <h2 style={{
            fontFamily: SERIF, fontWeight: 700,
            fontSize: mobile ? 36 : 'clamp(36px, 5vw, 68px)',
            lineHeight: 1.02, letterSpacing: '-.025em', maxWidth: '22ch',
            color: C.ink,
          }}>
            The whole business in{' '}
            <em style={{ color: C.clay, fontStyle: 'italic', fontWeight: 600 }}>one warm place</em>.
          </h2>
        </div>
        <p style={{ marginTop: 20, maxWidth: '62ch', color: C.muted, fontSize: 18, lineHeight: 1.6 }}>
          From the first seed to the last till receipt — Pewil covers the work your team actually does. No more spreadsheets held together with prayer. No more "which version is the real one?".
        </p>
      </div>

      <div style={{
        marginTop: 60,
        display: 'grid',
        gridTemplateColumns: mobile ? '1fr' : 'repeat(12, 1fr)',
        gap: mobile ? 18 : 22,
      }}>
        {/* 1 big photo — FARM MODULE (Design 5 accent) */}
        <div style={card({ gridColumn: mobile ? undefined : 'span 7', borderLeft: `3px solid ${C.forest}` })}
          onMouseEnter={cardHover} onMouseLeave={cardUnhover}>
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <img
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1400&q=75&auto=format&fit=crop"
              alt="Field staff"
              style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}
              onError={e => { e.currentTarget.parentElement.style.background = C.sand2; e.currentTarget.remove(); }}
            />
          </div>
          <div style={{ padding: '26px 28px 30px' }}>
            <span style={{ ...tag(), background: 'rgba(31,61,38,0.1)', color: C.forest }}>Farm module {'\u2022'} Fields &amp; livestock</span>
            <h4 style={cardH4}>Track the field from the field.</h4>
            <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.55 }}>
              Your foreman enters readings from a phone by the gate. Even if the network drops, Pewil keeps the data and syncs when signal returns. Every field, every crop, every cow gets a living record.
            </p>
          </div>
        </div>

        {/* 2 dark with stats */}
        <div style={card({ gridColumn: mobile ? undefined : 'span 5', background: C.forest, color: C.sand })}
          onMouseEnter={cardHover} onMouseLeave={cardUnhover}>
          <div style={{ padding: '36px 34px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <span style={tag(true)}>Multi-tenant SaaS</span>
            <h4 style={{ ...cardH4, color: '#fff' }}>Your farm. Your data. Your door key.</h4>
            <p style={{ color: 'rgba(255,247,236,.75)', fontSize: 15, lineHeight: 1.55 }}>
              Strict row-level tenant isolation. Auditable writes. Soft deletes. Role-based dashboards for owners, managers, and workers.
            </p>
            <div style={{ display: 'flex', gap: 24, marginTop: 'auto', paddingTop: 22 }}>
              {[['3', 'Roles built in'], ['100%', 'Audit coverage'], ['0', 'Shared-row leaks']].map(([num, lbl]) => (
                <div key={lbl} style={{ flex: 1 }}>
                  <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 42, letterSpacing: '-.02em', color: C.amber }}>{num}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,247,236,.7)', textTransform: 'uppercase', letterSpacing: '.08em', marginTop: 2 }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3 warm gradient card */}
        <div style={card({
          gridColumn: mobile ? undefined : 'span 4',
          background: `linear-gradient(135deg, ${C.amber}, ${C.terra})`,
          color: '#fff',
        })}
          onMouseEnter={cardHover} onMouseLeave={cardUnhover}>
          <div style={{ padding: '34px 30px', flex: 1 }}>
            <span style={tag(false, true)}>Payments</span>
            <h4 style={{ ...cardH4, color: '#fff' }}>Pesepay. EcoCash. Paynow. Card.</h4>
            <p style={{ color: 'rgba(255,255,255,.88)', fontSize: 15, lineHeight: 1.55 }}>
              One checkout flow, every rail Zimbabweans actually use. Multi-currency ledger that balances itself.
            </p>
          </div>
        </div>

        {/* 4 Retail POS — RETAIL MODULE (Design 5 accent) */}
        <div style={card({ gridColumn: mobile ? undefined : 'span 4', borderLeft: `3px solid ${C.amber}` })}
          onMouseEnter={cardHover} onMouseLeave={cardUnhover}>
          <div style={{ overflow: 'hidden' }}>
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&q=75&auto=format&fit=crop"
              alt="Shop"
              style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}
              onError={e => { e.currentTarget.parentElement.style.background = C.sand2; e.currentTarget.remove(); }}
            />
          </div>
          <div style={{ padding: '26px 28px 30px' }}>
            <span style={{ ...tag(), background: 'rgba(244,167,67,0.16)', color: C.clay }}>Retail module {'\u2022'} POS</span>
            <h4 style={cardH4}>Till, printer, barcode — done.</h4>
            <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.55 }}>
              From farm gate to shop shelf, one inventory truth.
            </p>
          </div>
        </div>

        {/* 5 AI */}
        <div style={card({ gridColumn: mobile ? undefined : 'span 4' })}
          onMouseEnter={cardHover} onMouseLeave={cardUnhover}>
          <div style={{ overflow: 'hidden' }}>
            <img
              src="https://images.unsplash.com/photo-1560493676-04071c5f467b?w=900&q=75&auto=format&fit=crop"
              alt="AI"
              style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}
              onError={e => { e.currentTarget.parentElement.style.background = C.sand2; e.currentTarget.remove(); }}
            />
          </div>
          <div style={{ padding: '26px 28px 30px' }}>
            <span style={tag()}>AI Copilot</span>
            <h4 style={cardH4}>The quiet assistant at your side.</h4>
            <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.55 }}>
              Pewil reads your patterns and whispers when something's off — a spike in feed, a missing receipt, a field that should've been logged yesterday.
            </p>
          </div>
        </div>

        {/* 6 Offline-first big */}
        <div style={card({ gridColumn: mobile ? undefined : 'span 8', background: C.sand2 })}
          onMouseEnter={cardHover} onMouseLeave={cardUnhover}>
          <div style={{ padding: '34px 34px 36px' }}>
            <span style={tag()}>Offline-first</span>
            <h4 style={cardH4}>Loads in the dip. Syncs when the tower wakes up.</h4>
            <p style={{ color: C.muted, fontSize: 15.5, lineHeight: 1.6, maxWidth: '58ch' }}>
              Service workers and queued writes mean your team can keep working in Murehwa, Binga, or Beitbridge — with or without bars. Everything reconciles the moment the signal comes back.
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  // ==== STORY ====
  const story = (
    <section id="customers" style={{ background: C.sand2, padding: mobile ? '60px 0' : '100px 0' }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: mobile ? '0 18px' : '0 28px',
        display: 'grid',
        gridTemplateColumns: mobile ? '1fr' : '1fr 1.05fr',
        gap: mobile ? 30 : 60,
        alignItems: 'center',
      }}>
        <div style={{
          borderRadius: RLG, overflow: 'hidden',
          boxShadow: '0 30px 60px -25px rgba(177,59,23,.25)',
          aspectRatio: mobile ? '16/10' : '4/5',
        }}>
          <img
            src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=1200&q=75&auto=format&fit=crop"
            alt="Customer"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={e => {
              e.currentTarget.parentElement.style.background = `linear-gradient(135deg, ${C.amber}, ${C.terra})`;
              e.currentTarget.remove();
            }}
          />
        </div>
        <div>
          <SecKicker>Made with real farmers</SecKicker>
          <h3 style={{
            fontFamily: SERIF, fontWeight: 700,
            fontSize: mobile ? 32 : 'clamp(32px, 4vw, 56px)',
            lineHeight: 1.05, letterSpacing: '-.02em', color: C.ink,
            maxWidth: '20ch',
          }}>
            From a notebook on the kitchen table to{' '}
            <em style={{ color: C.clay, fontStyle: 'italic', fontWeight: 600 }}>real-time dashboards</em>.
          </h3>
          <p style={{
            marginTop: 24,
            fontFamily: SERIF, fontSize: mobile ? 19 : 22, fontStyle: 'italic',
            lineHeight: 1.5, color: '#3a3024', maxWidth: '52ch',
          }}>
            We used to reconcile stock with four separate notebooks and one very tired aunt. Now the foreman enters stock from the shed and I watch it appear on my phone in Harare. Pewil paid for itself the first month.
          </p>
          <div style={{ marginTop: 26, display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: `linear-gradient(135deg, ${C.amber}, ${C.terra})`,
              display: 'grid', placeItems: 'center',
              color: '#fff', fontFamily: SERIF, fontWeight: 700, fontSize: 18,
            }}>W</div>
            <div>
              <b style={{ display: 'block', color: C.ink, fontSize: 15 }}>Wilbert</b>
              <small style={{ color: C.muted, fontSize: 13 }}>Owner — Tomato and tobacco farm, Chivhu</small>
            </div>
          </div>
          <div style={{ marginTop: 30 }}>
            <button
              style={btnPrimary}
              onClick={() => navigate('/register')}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
            >Read more stories →</button>
          </div>
        </div>
      </div>
    </section>
  );

  // ==== PRICING ====
  // Source of truth: makonese_backend/billing/migrations/0005_seed_per_module_plans.py
  // and src/pages/Pricing.js. Landing shows Farm tier prices; Retail note below. Full grid at /pricing.
  const plans = [
    {
      name: 'Starter', price: '$10', unit: '/ mo · Farm',
      retailNote: 'Retail: $15 / mo',
      yearlyHint: 'or $100 / year — save 2 months',
      desc: 'For small farms and single-till shops just getting started.',
      features: [
        'Up to 2 users',
        '5 fields · 10 workers · 50 livestock',
        'Costs, stock, sales & reports',
        'Email support',
      ],
      btn: 'outline', cta: 'Start 14-day trial',
    },
    {
      name: 'Growth', price: '$25', unit: '/ mo · Farm',
      retailNote: 'Retail: $35 / mo',
      yearlyHint: 'or $250 / year — save 2 months',
      desc: 'Most popular — growing farms and multi-cashier shops.',
      features: [
        'Up to 5 users',
        '20 fields · 30 workers · 500 livestock',
        'Basic AI insights + WhatsApp alerts',
        'Multi-currency + ZIMRA fiscal (retail)',
        'Priority email support',
      ],
      btn: 'warm', cta: 'Start 14-day trial', hl: true, badge: 'Most popular',
    },
    {
      name: 'Enterprise', price: '$60', unit: '/ mo · Farm',
      retailNote: 'Retail: $80 / mo',
      yearlyHint: 'or $600 / year — save 2 months',
      desc: 'Large estates, chains, and multi-site operators.',
      features: [
        'Unlimited users, fields, products',
        'Advanced AI insights',
        'White-label branding',
        'Dedicated account manager',
        'Phone support',
      ],
      btn: 'outline', cta: 'Start 14-day trial',
    },
  ];

  const pricing = (
    <section id="pricing" style={{
      padding: mobile ? '60px 0' : '100px 0',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: mobile ? '0 18px' : '0 28px',
      }}>
        <div style={{
          background: C.forest, color: '#fff',
          borderRadius: RLG, padding: mobile ? '46px 24px' : '72px 56px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -80, right: -80,
            width: 280, height: 280, borderRadius: '50%',
            background: `radial-gradient(circle, rgba(244,167,67,.18), transparent 65%)`,
            pointerEvents: 'none',
          }} />
          <SecKicker light>Pricing</SecKicker>
          <h2 style={{
            fontFamily: SERIF, fontWeight: 700,
            fontSize: mobile ? 36 : 'clamp(36px, 5vw, 64px)',
            lineHeight: 1.05, letterSpacing: '-.025em',
            maxWidth: '18ch', color: '#fff',
          }}>
            Made for Zimbabwean{' '}
            <em style={{ color: C.amber, fontStyle: 'italic', fontWeight: 600 }}>cashflow</em>.
          </h2>
          <p style={{
            marginTop: 18, maxWidth: '62ch',
            color: 'rgba(255,247,236,.75)', fontSize: 17, lineHeight: 1.6,
          }}>
            Per-module pricing in USD. 14-day free trial, no card up front. Month-to-month or yearly (10 × monthly — 2 months free). Cancel any time from your Billing page.
          </p>

          <div style={{
            marginTop: 56,
            display: 'grid',
            gridTemplateColumns: mobile ? '1fr' : 'repeat(3, 1fr)',
            gap: 20,
          }}>
            {plans.map(plan => {
              const hl = plan.hl;
              return (
                <div key={plan.name} style={{
                  background: hl ? C.cream : 'rgba(255,247,236,.07)',
                  color: hl ? C.ink : '#fff',
                  border: hl ? `1px solid ${C.amber}` : '1px solid rgba(255,247,236,.14)',
                  borderRadius: 22, padding: 30,
                  backdropFilter: hl ? 'none' : 'blur(10px)',
                  transform: !mobile && hl ? 'translateY(-10px)' : 'none',
                  boxShadow: hl ? '0 30px 60px -20px rgba(0,0,0,.4)' : 'none',
                  display: 'flex', flexDirection: 'column',
                }}>
                  {plan.badge && (
                    <span style={{
                      display: 'inline-block', padding: '4px 10px', borderRadius: 999,
                      background: C.amber, color: C.ink,
                      fontSize: 11, fontWeight: 700, letterSpacing: '.06em',
                      textTransform: 'uppercase', alignSelf: 'flex-start', marginBottom: 12,
                    }}>{plan.badge}</span>
                  )}
                  <h4 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 22, letterSpacing: '-.01em' }}>{plan.name}</h4>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '14px 0 4px' }}>
                    <span style={{
                      fontFamily: SERIF, fontWeight: 700, fontSize: 54,
                      letterSpacing: '-.03em', lineHeight: 1,
                    }}>{plan.price}</span>
                    <span style={{ opacity: 0.7, fontSize: 14 }}>{plan.unit}</span>
                  </div>
                  {plan.retailNote && (
                    <div style={{
                      fontSize: 12.5, fontWeight: 600,
                      color: hl ? C.clay : C.amber,
                      opacity: hl ? 1 : 0.9,
                      marginBottom: 4,
                    }}>{plan.retailNote}</div>
                  )}
                  {plan.yearlyHint && (
                    <div style={{
                      fontSize: 12, fontStyle: 'italic',
                      color: hl ? C.muted : 'rgba(255,247,236,.6)',
                      marginBottom: 14,
                    }}>{plan.yearlyHint}</div>
                  )}
                  <p style={{ opacity: 0.75, fontSize: 14, marginBottom: 24, minHeight: 42 }}>{plan.desc}</p>
                  <ul style={{ listStyle: 'none', display: 'grid', gap: 11, fontSize: 14.5, flex: 1, padding: 0, margin: 0 }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span style={{ color: hl ? C.clay : C.amber, fontWeight: 700, marginTop: -1 }}>✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => navigate('/register')}
                    style={
                      plan.btn === 'warm'
                        ? { ...btnWarm, marginTop: 24, width: '100%' }
                        : {
                            ...btnOutline, marginTop: 24, width: '100%',
                            borderColor: hl ? C.ink : 'rgba(255,247,236,.35)',
                            color: hl ? C.ink : '#fff',
                          }
                    }
                  >{plan.cta}</button>
                </div>
              );
            })}
          </div>

          <div style={{
            marginTop: 32, display: 'flex', gap: 24, flexWrap: 'wrap',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 14.5, color: 'rgba(255,247,236,.75)',
          }}>
            <span>Farm + Retail are priced per-module — combine any tier.</span>
            <Link to="/pricing" style={{
              color: C.amber, fontWeight: 700, textDecoration: 'none',
              borderBottom: `1px solid ${C.amber}`, paddingBottom: 2,
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >See the full pricing grid →</Link>
          </div>
        </div>
      </div>
    </section>
  );

  // ==== CTA STRIP ====
  const ctaStrip = (
    <section style={{
      padding: mobile ? '0 18px 60px' : '0 28px 100px',
      textAlign: 'center',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        background: `linear-gradient(135deg, ${C.amber}, ${C.terra})`,
        borderRadius: RLG,
        padding: mobile ? '56px 24px' : '80px 40px',
        color: '#fff',
      }}>
        <h2 style={{
          fontFamily: SERIF, fontWeight: 700,
          fontSize: mobile ? 34 : 'clamp(34px, 5vw, 60px)',
          lineHeight: 1.05, letterSpacing: '-.025em',
          color: '#fff', margin: '0 auto', maxWidth: '18ch',
        }}>
          Let's grow something{' '}
          <em style={{
            fontStyle: 'italic', fontWeight: 600,
            borderBottom: `4px solid ${C.forest}`,
            paddingBottom: 2,
          }}>good</em>, together.
        </h2>
        <p style={{
          marginTop: 18, maxWidth: '52ch', marginLeft: 'auto', marginRight: 'auto',
          fontSize: 17, opacity: 0.95, lineHeight: 1.55,
        }}>
          14-day free trial. No card required. Full access from day one. Your data leaves with you if you ever want to go.
        </p>
        <div style={{ marginTop: 30, display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            style={{ ...btnBase, ...btnLg, background: '#fff', color: C.clay }}
            onClick={() => navigate('/register')}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
          >Start 14-day trial →</button>
          <Link
            to="/login"
            style={{ ...btnBase, ...btnLg, background: 'transparent', color: '#fff', border: '1.5px solid #fff' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >Log in</Link>
        </div>
      </div>
    </section>
  );

  // ==== FOOTER ====
  const footLinks = (title, items) => (
    <div>
      <h5 style={{
        fontSize: 12, fontWeight: 700, color: C.amber,
        textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 14,
      }}>{title}</h5>
      <ul style={{ listStyle: 'none', display: 'grid', gap: 10, padding: 0, margin: 0 }}>
        {items.map(([label, href]) => (
          <li key={label}>
            <Link to={href} style={{
              color: 'rgba(255,247,236,.75)', textDecoration: 'none', fontSize: 14.5,
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,247,236,.75)'}
            >{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );

  const footer = (
    <footer style={{
      background: C.forest, color: C.sand,
      padding: mobile ? '54px 18px 30px' : '80px 28px 40px',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: mobile ? '1fr' : '1.4fr repeat(3, 1fr)',
        gap: mobile ? 32 : 40,
      }}>
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            fontWeight: 700, fontSize: 20, color: '#fff', marginBottom: 6,
          }}>
            <LogoMark />
            Pewil
          </div>
          <div style={{
            fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500,
            fontSize: 15, color: C.amber, marginBottom: 14, letterSpacing: '0.01em',
          }}>
            Rooted in the work.
          </div>
          <p style={{ opacity: 0.7, fontSize: 14.5, maxWidth: '34ch', lineHeight: 1.55 }}>
            The operating system for African agribusiness. Built in Harare. Shipped with love across borders.
          </p>
          <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
            {['X', 'in', 'f'].map(s => (
              <a key={s} href="#" style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(244,167,67,.15)',
                display: 'grid', placeItems: 'center',
                color: C.amber, textDecoration: 'none', fontSize: 14, fontWeight: 600,
              }}>{s}</a>
            ))}
          </div>
        </div>
        {footLinks('Product', [['Pewil Farm', '/'], ['Pewil Retail', '/'], ['Finance', '/'], ['AI Copilot', '/']])}
        {footLinks('Company', [['About', '/'], ['Stories', '/'], ['Careers', '/'], ['Contact', '/']])}
        {footLinks('Legal', [['Terms', '/terms'], ['Privacy', '/privacy'], ['Refunds', '/refunds'], ['Status', '/status']])}
      </div>
      <div style={{
        maxWidth: 1280, margin: '40px auto 0',
        paddingTop: 24, borderTop: '1px solid rgba(255,247,236,.12)',
        display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap',
   
        gap: 12, fontSize: 13, color: 'rgba(255,247,236,.55)',
      }}>
        <div>&copy; 2026 Pewil Technologies Pvt Ltd &middot; Harare, Zimbabwe</div>
        <div>Made with care in Africa</div>
      </div>
    </footer>
  );

  return (
    <div style={{
      background: C.cream, color: C.ink,
      fontFamily: SANS, fontSize: 16, lineHeight: 1.55,
      WebkitFontSmoothing: 'antialiased', overflowX: 'hidden',
    }}>
      {navBar}
      {hero}
      {features}
      {story}
      {pricing}
      {ctaStrip}
      {footer}
    </div>
  );
};

export default LandingPage;
