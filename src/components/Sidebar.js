import React from 'react';
import { initials, avatarColor } from '../utils/format';
import Logo from './Logo';

const S = {
  sidebar: {
    position: 'fixed', top: 0, left: 0, width: 200, height: '100vh',
    background: '#ffffff', borderRight: '1px solid #e5e7eb',
    display: 'flex', flexDirection: 'column', zIndex: 60,
    fontFamily: "'Inter', sans-serif",
  },
  brand: {
    padding: '18px 14px 14px', borderBottom: '1px solid #e5e7eb',
    display: 'flex', alignItems: 'center', gap: 10,
  },
  brandIcon: {
    width: 32, height: 32, borderRadius: 8, background: '#1a6b3a',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 16, flexShrink: 0,
  },
  brandText: { display: 'flex', flexDirection: 'column' },
  brandName: {
    fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700,
    color: '#111827', lineHeight: 1.2,
  },
  brandSub: { fontSize: 9, color: '#9ca3af', fontWeight: 500, letterSpacing: '0.02em' },
  nav: {
    flex: 1, overflowY: 'auto', padding: '8px 8px',
    display: 'flex', flexDirection: 'column', gap: 1,
  },
  sectionLabel: {
    fontSize: 9, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase',
    letterSpacing: '0.08em', padding: '12px 8px 4px',
  },
  navItem: (active) => ({
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '8px 10px', borderRadius: 7, fontSize: 12,
    fontWeight: active ? 600 : 500, cursor: 'pointer',
    background: active ? '#e8f5ee' : 'transparent',
    color: active ? '#1a6b3a' : '#374151',
    transition: 'background 0.15s, color 0.15s',
    border: 'none', width: '100%', textAlign: 'left',
    position: 'relative', fontFamily: 'inherit',
  }),
  navEmoji: { fontSize: 14, width: 18, textAlign: 'center', flexShrink: 0 },
  badge: {
    position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
    background: '#c0392b', color: '#fff', fontSize: 8, fontWeight: 700,
    padding: '1px 5px', borderRadius: 10, minWidth: 16, textAlign: 'center',
  },
  userSection: {
    borderTop: '1px solid #e5e7eb', padding: '12px 14px',
    display: 'flex', alignItems: 'center', gap: 8,
  },
  avatar: (bg) => ({
    width: 30, height: 30, borderRadius: '50%', background: bg,
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 10, fontWeight: 700, flexShrink: 0,
  }),
  userInfo: { flex: 1, minWidth: 0 },
  userName: { fontSize: 12, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  userRole: { fontSize: 10, color: '#9ca3af', textTransform: 'capitalize' },
  logoutBtn: {
    background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer',
    fontSize: 16, padding: 4, lineHeight: 1, flexShrink: 0,
    transition: 'color 0.15s',
  },
};

const NAV_ITEMS = [
  { section: 'MAIN', items: [
    { key: 'Dashboard', emoji: '📊', label: 'Dashboard' },
    { key: 'Fields', emoji: '🌾', label: 'Fields' },
    { key: 'Sales & Market', emoji: '🚚', label: 'Sales & Market' },
    { key: 'Costs', emoji: '🧾', label: 'Costs' },
    { key: 'Farm Assets', emoji: '🏗', label: 'Farm Assets' },
    { key: 'Stock', emoji: '📦', label: 'Stock', showBadge: true },
  ]},
  { section: 'PEOPLE', items: [
    { key: 'Workers', emoji: '👷', label: 'Workers' },
    { key: 'Hours & Pay', emoji: '⏱', label: 'Hours & Pay' },
  ]},
  { section: 'OWNER ONLY', ownerOnly: true, items: [
    { key: 'Report', emoji: '📈', label: 'Report' },
    { key: 'Settings', emoji: '⚙️', label: 'Settings' },
    { key: 'Import', emoji: '📥', label: 'Import' },
    { key: 'Admin Panel', emoji: '🔐', label: 'Admin Panel' },
  ]},
];

export default function Sidebar({ activeTab, onTabChange, user, onLogout, lowStockCount = 0 }) {
  const role = user?.role || 'worker';
  const ac = avatarColor(user?.username || '');

  return (
    <div style={S.sidebar}>
      {/* Brand */}
      <div style={S.brand}>
        <Logo size={36} />
      </div>

      {/* Navigation */}
      <nav style={S.nav}>
        {NAV_ITEMS.map((section) => {
          if (section.ownerOnly && role !== 'owner') return null;
          return (
            <React.Fragment key={section.section}>
              <div style={S.sectionLabel}>{section.section}</div>
              {section.items.map((item) => (
                <button
                  key={item.key}
                  style={S.navItem(activeTab === item.key)}
                  onClick={() => onTabChange(item.key)}
                  onMouseEnter={(e) => { if (activeTab !== item.key) e.currentTarget.style.background = '#f3f4f6'; }}
                  onMouseLeave={(e) => { if (activeTab !== item.key) e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={S.navEmoji}>{item.emoji}</span>
                  {item.label}
                  {item.showBadge && lowStockCount > 0 && (
                    <span style={S.badge}>{lowStockCount}</span>
                  )}
                </button>
              ))}
            </React.Fragment>
          );
        })}
      </nav>

      {/* User section */}
      <div style={S.userSection}>
        <div style={S.avatar(ac.bg)}>{initials(user?.username || '')}</div>
        <div style={S.userInfo}>
          <div style={S.userName}>{user?.username || 'User'}</div>
          <div style={S.userRole}>{role}</div>
        </div>
        <button
          style={S.logoutBtn}
          onClick={onLogout}
          title="Logout"
          onMouseEnter={(e) => { e.currentTarget.style.color = '#c0392b'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; }}
        >
          ⇥
        </button>
      </div>
    </div>
  );
}
