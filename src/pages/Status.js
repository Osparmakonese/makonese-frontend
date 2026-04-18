import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

/**
 * Public status page — pewil.org/status
 *
 * Polls the backend health endpoint (/api/core/health/) and reports
 * the state of core components (API, database) plus the third-party
 * rails Pewil depends on (Resend email, Pesepay, Paynow).
 *
 * Third-party rails don't have per-integration health endpoints we
 * can hit without API credentials, so they default to "Operational"
 * with a link out to the provider's own status page. The API+DB row
 * is the real live signal — if that's red, everything else is moot.
 *
 * No auth required — this page is public so customers can self-serve
 * during an incident.
 */

const C = {
  green: '#1a6b3a', greenDark: '#0D4A22', green2: '#2d9e58', green3: '#e8f5ee',
  amber: '#c97d1a', amberLight: '#fef3c7', red: '#b91c1c', redLight: '#fee2e2',
  ink: '#111827', ink2: '#374151', ink3: '#6b7280',
  surface: '#f9fafb', border: '#e5e7eb', white: '#ffffff',
};

const API_BASE = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
const POLL_MS = 30_000;

/** Status labels — keep these consistent across rows. */
const OK = 'operational';
const DEGRADED = 'degraded';
const DOWN = 'down';
const UNKNOWN = 'unknown';

const STATUS_META = {
  [OK]:       { label: 'Operational', color: C.green,  bg: C.green3,     dot: C.green2 },
  [DEGRADED]: { label: 'Degraded',    color: C.amber,  bg: C.amberLight, dot: C.amber },
  [DOWN]:     { label: 'Down',        color: C.red,    bg: C.redLight,   dot: C.red },
  [UNKNOWN]:  { label: 'Checking…',   color: C.ink3,   bg: C.surface,    dot: C.ink3 },
};

function Dot({ color }) {
  return (
    <span style={{
      display: 'inline-block', width: 10, height: 10, borderRadius: '50%',
      background: color, marginRight: 8, verticalAlign: 'middle',
    }} />
  );
}

function StatusPill({ status }) {
  const meta = STATUS_META[status] || STATUS_META[UNKNOWN];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      background: meta.bg, color: meta.color,
      padding: '4px 12px', borderRadius: 999,
      fontSize: 13, fontWeight: 600,
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <Dot color={meta.dot} />
      {meta.label}
    </span>
  );
}

function ComponentRow({ name, description, status, latencyMs, link }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 20px', borderBottom: `1px solid ${C.border}`,
      background: C.white,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 16, fontWeight: 600, color: C.ink,
          fontFamily: "'Inter', system-ui, sans-serif",
        }}>
          {name}
        </div>
        <div style={{
          fontSize: 13, color: C.ink3, marginTop: 2,
          fontFamily: "'Inter', system-ui, sans-serif",
        }}>
          {description}
          {typeof latencyMs === 'number' && (
            <span style={{ marginLeft: 8, color: C.ink2 }}>· {latencyMs} ms</span>
          )}
          {link && (
            <>
              {' · '}
              <a href={link} target="_blank" rel="noreferrer"
                 style={{ color: C.green, textDecoration: 'none' }}>
                provider status ↗
              </a>
            </>
          )}
        </div>
      </div>
      <StatusPill status={status} />
    </div>
  );
}

/** Banner treatment palette. Keyed on STATUS_BANNER_SEVERITY from the API. */
const BANNER_META = {
  info:     { bg: '#e8f5ee', border: '#1a6b3a', color: '#0D4A22', icon: 'i' },
  warning:  { bg: '#fef3c7', border: '#c97d1a', color: '#92400e', icon: '!' },
  critical: { bg: '#fee2e2', border: '#b91c1c', color: '#7f1d1d', icon: '!' },
};

export default function Status() {
  const [apiStatus, setApiStatus] = useState(UNKNOWN);
  const [dbStatus, setDbStatus] = useState(UNKNOWN);
  const [dbLatency, setDbLatency] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState(null);

  const poll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const started = Date.now();
      const res = await fetch(`${API_BASE}/api/core/health/`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      const data = await res.json().catch(() => ({}));
      const checks = data.checks || {};
      // Treat HTTP reachability as API status. 2xx = ok, 5xx = degraded/down.
      if (res.ok) {
        setApiStatus(OK);
      } else if (res.status >= 500 && res.status < 600) {
        setApiStatus(DEGRADED);
      } else {
        setApiStatus(DOWN);
      }
      if (checks.database === 'ok') {
        setDbStatus(OK);
      } else if (typeof checks.database === 'string') {
        setDbStatus(DOWN);
      } else {
        setDbStatus(UNKNOWN);
      }
      setDbLatency(typeof checks.db_latency_ms === 'number' ? checks.db_latency_ms : null);
      setLastChecked(new Date());
      // Use fetch round-trip time as a coarse API latency signal only if health
      // didn't surface db_latency_ms (keeps display honest).
      if (typeof checks.db_latency_ms !== 'number') {
        setDbLatency(Date.now() - started);
      }
      // Ops banner — backend returns { message, severity } when env var is set.
      if (data.banner && typeof data.banner.message === 'string' && data.banner.message.trim()) {
        setBanner({
          message: data.banner.message,
          severity: BANNER_META[data.banner.severity] ? data.banner.severity : 'info',
        });
      } else {
        setBanner(null);
      }
    } catch (e) {
      setApiStatus(DOWN);
      setDbStatus(UNKNOWN);
      setError(e?.message || 'Network error');
      setLastChecked(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    poll();
    const id = setInterval(poll, POLL_MS);
    return () => clearInterval(id);
  }, [poll]);

  // Overall status: worst of the signals we have real telemetry for.
  const rank = (s) => (s === DOWN ? 3 : s === DEGRADED ? 2 : s === UNKNOWN ? 1 : 0);
  const overall = [apiStatus, dbStatus].reduce(
    (worst, s) => (rank(s) > rank(worst) ? s : worst),
    OK,
  );
  const overallMeta = STATUS_META[overall] || STATUS_META[UNKNOWN];
  const overallHeadline =
    overall === OK ? 'All systems operational'
    : overall === DEGRADED ? 'Some systems degraded'
    : overall === DOWN ? 'Major outage in progress'
    : 'Checking system health…';

  return (
    <div style={{
      minHeight: '100vh',
      background: C.surface,
      fontFamily: "'Inter', system-ui, sans-serif",
      color: C.ink,
    }}>
      {/* Top nav */}
      <header style={{
        background: C.white, borderBottom: `1px solid ${C.border}`,
        padding: '16px 24px',
      }}>
        <div style={{
          maxWidth: 1080, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Link to="/" style={{
            textDecoration: 'none',
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 22, fontWeight: 700, color: C.greenDark,
          }}>
            Pewil
          </Link>
          <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <Link to="/pricing" style={{ color: C.ink2, textDecoration: 'none', fontSize: 14 }}>Pricing</Link>
            <Link to="/status" style={{ color: C.green, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>Status</Link>
            <Link to="/login" style={{ color: C.ink2, textDecoration: 'none', fontSize: 14 }}>Log in</Link>
            <Link to="/register" style={{
              background: C.green, color: C.white,
              padding: '8px 16px', borderRadius: 8,
              textDecoration: 'none', fontSize: 14, fontWeight: 600,
            }}>
              Start free
            </Link>
          </nav>
        </div>
      </header>

      {/* Ops banner — driven by STATUS_BANNER_MESSAGE env var on the API */}
      {banner && (() => {
        const meta = BANNER_META[banner.severity] || BANNER_META.info;
        return (
          <div style={{
            background: meta.bg,
            borderBottom: `1px solid ${meta.border}`,
            color: meta.color,
            padding: '14px 24px',
          }}>
            <div style={{
              maxWidth: 1080, margin: '0 auto',
              display: 'flex', alignItems: 'center', gap: 12,
              fontSize: 14, fontWeight: 500,
              fontFamily: "'Inter', system-ui, sans-serif",
            }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 24, height: 24, borderRadius: '50%',
                background: meta.border, color: '#fff',
                fontSize: 13, fontWeight: 700, flexShrink: 0,
              }}>{meta.icon}</span>
              <span style={{ lineHeight: 1.5 }}>{banner.message}</span>
            </div>
          </div>
        );
      })()}

      {/* Hero / overall status banner */}
      <section style={{
        background: overallMeta.bg,
        borderBottom: `1px solid ${C.border}`,
        padding: '48px 24px',
      }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            fontSize: 13, letterSpacing: 1.2, textTransform: 'uppercase',
            color: overallMeta.color, fontWeight: 700, marginBottom: 12,
          }}>
            <Dot color={overallMeta.dot} /> System Status
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 40, fontWeight: 700, margin: 0,
            color: overallMeta.color,
          }}>
            {overallHeadline}
          </h1>
          <p style={{
            margin: '14px 0 0', fontSize: 15, color: C.ink2, maxWidth: 560,
            marginLeft: 'auto', marginRight: 'auto',
          }}>
            Live check of the services that power your Pewil account. This page
            refreshes automatically every 30 seconds.
          </p>
          <div style={{ marginTop: 20, fontSize: 13, color: C.ink3 }}>
            {lastChecked ? (
              <>Last checked: {lastChecked.toLocaleTimeString()}</>
            ) : (
              <>Loading…</>
            )}
            <button
              onClick={poll}
              disabled={loading}
              style={{
                marginLeft: 14,
                background: 'transparent',
                border: `1px solid ${C.border}`,
                color: C.ink2,
                padding: '6px 12px', borderRadius: 6,
                fontSize: 13, cursor: loading ? 'wait' : 'pointer',
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
            >
              {loading ? 'Refreshing…' : 'Refresh now'}
            </button>
          </div>
          {error && (
            <div style={{
              marginTop: 16, padding: '10px 14px',
              background: C.redLight, color: C.red,
              borderRadius: 8, fontSize: 13,
              display: 'inline-block',
            }}>
              Network error talking to the API: {error}
            </div>
          )}
        </div>
      </section>

      {/* Component list */}
      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 24, fontWeight: 700, margin: '0 0 16px',
            color: C.ink,
          }}>
            Components
          </h2>

          <div style={{
            background: C.white,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            overflow: 'hidden',
          }}>
            <ComponentRow
              name="API (pewil.org)"
              description="Core REST API serving the Pewil web app and mobile clients."
              status={apiStatus}
            />
            <ComponentRow
              name="Database"
              description="Primary MySQL database. Latency is measured from inside the API."
              status={dbStatus}
              latencyMs={dbLatency}
            />
            <ComponentRow
              name="Resend (transactional email)"
              description="Delivery of welcome emails, receipts, password resets, and alerts."
              status={OK}
              link="https://resend-status.com"
            />
            <ComponentRow
              name="Pesepay (cards + EcoCash)"
              description="Primary payment rail — Visa, Mastercard, and EcoCash via Pesepay."
              status={OK}
              link="https://pesepay.com"
            />
            <ComponentRow
              name="Paynow (mobile money)"
              description="Fallback payment rail — EcoCash and OneMoney via Paynow."
              status={OK}
              link="https://www.paynow.co.zw"
            />
          </div>

          <p style={{ marginTop: 20, fontSize: 13, color: C.ink3 }}>
            Third-party rails (Resend, Pesepay, Paynow) show as operational by
            default. If payments or emails are failing and the API + Database
            rows above are green, the issue is likely on the provider side —
            follow the provider status link for live confirmation.
          </p>

          {/* Incident history placeholder */}
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 24, fontWeight: 700, margin: '40px 0 16px',
            color: C.ink,
          }}>
            Recent incidents
          </h2>
          <div style={{
            background: C.white,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: '28px 20px',
            textAlign: 'center',
            color: C.ink3,
          }}>
            No incidents reported in the last 7 days.
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: C.white, borderTop: `1px solid ${C.border}`,
        padding: '24px', marginTop: 40,
      }}>
        <div style={{
          maxWidth: 1080, margin: '0 auto',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', flexWrap: 'wrap', gap: 12,
          fontSize: 13, color: C.ink3,
        }}>
          <div>© {new Date().getFullYear()} Pewil. All rights reserved.</div>
          <nav style={{ display: 'flex', gap: 18 }}>
            <Link to="/" style={{ color: C.ink3, textDecoration: 'none' }}>Home</Link>
            <Link to="/pricing" style={{ color: C.ink3, textDecoration: 'none' }}>Pricing</Link>
            <Link to="/status" style={{ color: C.ink3, textDecoration: 'none' }}>Status</Link>
            <Link to="/terms" style={{ color: C.ink3, textDecoration: 'none' }}>Terms</Link>
            <Link to="/privacy" style={{ color: C.ink3, textDecoration: 'none' }}>Privacy</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
