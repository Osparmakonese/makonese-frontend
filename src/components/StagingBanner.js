/**
 * StagingBanner — thin amber bar rendered at the very top of the app on
 * staging hosts (staging.pewil.org, Vercel preview URLs containing "staging",
 * or when REACT_APP_STAGING=true is baked into the build).
 *
 * Purpose: make it impossible for a beta tester to mistake staging for
 * production. Shown on every page including login/register, because the
 * first thing a tester sees is the login screen and they need to know
 * the data isn't real before they key in anything sensitive.
 */
export default function StagingBanner() {
  if (typeof window === 'undefined') return null;

  const host = (window.location && window.location.hostname) || '';
  const isStaging =
    /staging/i.test(host) ||
    process.env.REACT_APP_STAGING === 'true' ||
    process.env.REACT_APP_ENV === 'staging';

  if (!isStaging) return null;

  return (
    <div
      role="status"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1200,
        width: '100%',
        background: 'repeating-linear-gradient(45deg, #c97d1a 0 12px, #a8661a 12px 24px)',
        color: '#fff',
        padding: '8px 14px',
        textAlign: 'center',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        fontSize: 12.5,
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        boxShadow: '0 2px 6px rgba(0,0,0,.15)',
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        <span
          aria-hidden
          style={{
            display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
            background: '#fff', boxShadow: '0 0 0 3px rgba(255,255,255,.25)',
          }}
        />
        Staging environment &middot; demo data only &middot; do not use for real operations
      </span>
    </div>
  );
}
