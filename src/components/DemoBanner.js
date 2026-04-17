import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * DemoBanner — thin sticky bar rendered at the top of the app shell
 * whenever the signed-in user is on the live-demo tenant (`user.is_demo`).
 *
 * Writes for demo tenants are blocked server-side by core.middleware
 * DemoWriteGuard, so every action the visitor clicks is either a harmless
 * read or a 403 with a friendly "start a trial" pointer. This banner
 * explains that up front + gives a single-click path to register.
 */
export default function DemoBanner() {
  const { user, logout } = useAuth();
  if (!user || !user.is_demo) return null;

  return (
    <div
      role="status"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        width: '100%',
        background: 'linear-gradient(135deg, #f4a743, #d9562c)',
        color: '#fff',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        flexWrap: 'wrap',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        fontSize: 13.5,
        fontWeight: 500,
        boxShadow: '0 2px 8px rgba(0,0,0,.12)',
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <span
          aria-hidden
          style={{
            display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
            background: '#fff', boxShadow: '0 0 0 4px rgba(255,255,255,.2)',
          }}
        />
        You're viewing the live demo — changes aren't saved.
      </span>
      <Link
        to="/register"
        onClick={() => { try { logout(); } catch {} }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '6px 14px', borderRadius: 999,
          background: '#fff', color: '#b13b17',
          fontWeight: 700, textDecoration: 'none',
          boxShadow: '0 2px 6px rgba(0,0,0,.12)',
        }}
      >
        Start 14-day free trial →
      </Link>
    </div>
  );
}
