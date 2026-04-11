import React, { useState, useEffect, useRef } from 'react';
import { initials, avatarColor } from '../utils/format';
import Logo from './Logo';

const S = {
  sidebar: {
    position: 'fixed', top: 0, left: 0, width: 220, height: '100vh',
    background: '#ffffff', borderRight: '1px solid #e5e7eb',
    display: 'flex', flexDirection: 'column', zIndex: 60,
    fontFamily: "'Inter', sans-serif",
  },
  brand: {
    padding: '16px 14px 12px', borderBottom: '1px solid #e5e7eb',
    display: 'flex', alignItems: 'center', gap: 10,
  },
  /* Tenant switcher */
  tsw: {
    margin: '8px 8px 4px', padding: '9px 11px',
    border: '1px solid #e5e7eb', borderRadius: 8,
    cursor: 'pointer', transition: 'all 0.15s',
  },
  tswName: { fontWeight: 700, fontSize: 12, color: '#111827' },
  tswPlan: { fontSize: 9, color: '#6b7280', marginTop: 1 },
  tswLabel: { fontSize: 8, color: '#1a6b3a', fontWeight: 600, marginTop: 2 },
  /* Tenant dropdown */
  tdd: (open) => ({
    display: open ? 'block' : 'none',
    position: 'absolute', left: 8, top: 118, width: 204,
    background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 200, overflow: 'hidden',
  }),
  tdo: (active) => ({
    padding: '10px 14px', cursor: 'pointer', transition: 'background 0.15s',
    borderBottom: '1px solid #f3f4f6',
    background: active ? '#e8f5ee' : 'transparent',
    borderLeft: active ? '3px solid #1a6b3a' : '3px solid transparent',
  }),
  tdoName: { fontWeight: 600, fontSize: 11, color: '#111827' },
  tdoType: { fontSize: 9, color: '#6b7280' },
  nav: { flex: 1, overflowY: 'auto', padding: '4px 8px' },
  sectionGroup: { marginBottom: 2, paddingBottom: 2 },
  sectionDivider: { height: 1, background: '#f3f4f6', margin: '4px 10px' },
  sectionHeader: (isCollapsible) => ({
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 10px 3px', cursor: isCollapsible ? 'pointer' : 'default',
    userSelect: 'none', borderRadius: 4, transition: 'background 0.15s',
    fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase',
    letterSpacing: '0.08em',
  }),
  sectionChevron: (expanded) => ({
    fontSize: 10, color: '#9ca3af', transition: 'transform 0.2s',
    transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
  }),
  sectionCount: {
    fontSize: 8, fontWeight: 600, color: '#fff', background: '#d1d5db',
    borderRadius: 8, padding: '1px 5px', marginLeft: 4, minWidth: 14,
    textAlign: 'center', lineHeight: '14px',
  },
  sectionActiveDot: {
    width: 6, height: 6, borderRadius: '50%', background: '#1a6b3a', marginLeft: 4,
  },
  sectionItems: (expanded) => ({
    overflow: 'hidden', maxHeight: expanded ? 500 : 0,
    transition: 'max-height 0.25s ease-in-out', opacity: expanded ? 1 : 0,
  }),
  navItem: (active) => ({
    display: 'flex', alignItems: 'center', gap: 7,
    padding: '6px 10px', borderRadius: 7, fontSize: 11,
    fontWeight: active ? 600 : 500, cursor: 'pointer',
    background: active ? '#e8f5ee' : 'transparent',
    color: active ? '#1a6b3a' : '#374151',
    transition: 'all 0.15s', border: 'none', width: '100%', textAlign: 'left',
    position: 'relative', fontFamily: 'inherit', margin: '1px 0',
    borderLeft: active ? '3px solid #1a6b3a' : '3px solid transparent',
  }),
  navEmoji: { width: 16, textAlign: 'center', fontSize: 13 },
  badge: {
    position: 'absolute', right: 8, background: '#c0392b', color: '#fff',
    fontSize: 7, fontWeight: 700, padding: '1px 5px', borderRadius: 10,
    animation: 'badgePulse 2s infinite',
  },
  userSection: {
    borderTop: '1px solid #e5e7eb', padding: '10px 14px',
    display: 'flex', alignItems: 'center', gap: 8,
  },
  avatar: (bg) => ({
    width: 30, height: 30, borderRadius: '50%', background: bg,
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 10, fontWeight: 700, flexShrink: 0,
  }),
  userName: { fontSize: 11, fontWeight: 600, color: '#111827' },
  userRole: { fontSize: 9, color: '#9ca3af', textTransform: 'capitalize' },
  logoutBtn: {
    background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer',
    fontSize: 16, padding: 4, lineHeight: 1, flexShrink: 0, transition: 'color 0.15s',
  },
};

const NAV_ITEMS = [
  { section: 'MAIN', collapsible: false, items: [
    { key: 'Dashboard', emoji: '\u{1F4CA}', label: 'Dashboard' },
    { key: 'Fields', emoji: '\u{1F33E}', label: 'Fields' },
    { key: 'Sales & Market', emoji: '\u{1F69A}', label: 'Sales & Market' },
    { key: 'Costs', emoji: '\u{1F4B8}', label: 'Costs' },
    { key: 'Farm Assets', emoji: '\u{1F3D7}', label: 'Farm Assets' },
    { key: 'Stock', emoji: '\u{1F4E6}', label: 'Stock', showBadge: true },
  ]},
  { section: 'LIVESTOCK', collapsible: true, items: [
    { key: 'Cattle', emoji: '\u{1F404}', label: 'Cattle' },
    { key: 'Goats', emoji: '\u{1F410}', label: 'Goats' },
    { key: 'Sheep', emoji: '\u{1F411}', label: 'Sheep' },
    { key: 'Pigs', emoji: '\u{1F437}', label: 'Pigs' },
    { key: 'Broilers', emoji: '\u{1F414}', label: 'Broilers' },
    { key: 'Layers', emoji: '\u{1F95A}', label: 'Layers' },
  ]},
  { section: 'ECONOMICS', collapsible: true, items: [
    { key: 'Harvest', emoji: '\u{1F33E}', label: 'Harvest' },
    { key: 'Budget', emoji: '\u{1F4CB}', label: 'Budget' },
    { key: 'Water', emoji: '\u{1F4A7}', label: 'Water' },
    { key: 'Loans', emoji: '\u{1F3E6}', label: 'Loans' },
    { key: 'Market Prices', emoji: '\u{1F4CA}', label: 'Market Prices' },
    { key: 'Economics', emoji: '\u{1F4C8}', label: 'Economics' },
  ]},
  { section: 'PEOPLE', collapsible: false, items: [
    { key: 'Workers', emoji: '\u{1F477}', label: 'Workers' },
    { key: 'Hours & Pay', emoji: '\u23F1', label: 'Hours & Pay' },
  ]},
  { section: 'RETAIL', collapsible: true, items: [
    { key: 'Retail', emoji: '\u{1F6D2}', label: 'Retail Dashboard' },
    { key: 'POS', emoji: '\u{1F4B3}', label: 'Point of Sale' },
    { key: 'Products', emoji: '\u{1F3F7}', label: 'Products' },
  ]},
  { section: 'OWNER ONLY', ownerOnly: true, collapsible: false, items: [
    { key: 'Report', emoji: '\u{1F4C8}', label: 'Report' },
    { key: 'Billing', emoji: '\u{1F4B3}', label: 'Billing' },
    { key: 'Settings', emoji: '\u2699\uFE0F', label: 'Settings' },
    { key: 'Import', emoji: '\u{1F4E5}', label: 'Import' },
    { key: 'Admin Panel', emoji: '\u{1F510}', label: 'Admin Panel' },
  ]},
];

export default function Sidebar({ activeTab, onTabChange, user, onLogout, lowStockCount = 0 }) {
  const role = user?.role || 'worker';
  const ac = avatarColor(user?.username || '');
  const [expanded, setExpanded] = useState({});
  const [ddOpen, setDdOpen] = useState(false);
  const ddRef = useRef(null);

  // Get tenant info from JWT stored in localStorage
  const tenantName = user?.tenant_name || 'Makonese Farm';
  const tenantPlan = user?.plan || 'free';
  const planLabel = tenantPlan.charAt(0).toUpperCase() + tenantPlan.slice(1) + ' Plan';

  useEffect(() => {
    NAV_ITEMS.forEach(section => {
      if (section.collapsible && section.items.some(item => item.key === activeTab)) {
        setExpanded(prev => ({ ...prev, [section.section]: true }));
      }
    });
  }, [activeTab]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ddRef.current && !ddRef.current.contains(e.target)) setDdOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleSection = (sectionName) => {
    setExpanded(prev => ({ ...prev, [sectionName]: !prev[sectionName] }));
  };
  const sectionHasActive = (section) => section.items.some(item => item.key === activeTab);

  return (
    <div style={S.sidebar}>
      {/* Brand */}
      <div style={S.brand}>
        <Logo size={36} showText={true} />
      </div>

      {/* Tenant Switcher */}
      <div ref={ddRef} style={{ position: 'relative' }}>
        <div
          style={S.tsw}
          onClick={() => setDdOpen(!ddOpen)}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#1a6b3a'; e.currentTarget.style.background = '#e8f5ee'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = 'transparent'; }}
        >
          <div style={S.tswName}>{tenantName}</div>
          <div style={S.tswPlan}>{planLabel}</div>
          <div style={S.tswLabel}>{'\u25BE'} Switch tenant</div>
        </div>
        <div style={S.tdd(ddOpen)}>
          <div style={S.tdo(true)}>
            <div style={S.tdoName}>{tenantName}</div>
            <div style={S.tdoType}>Agriculture {'\u2022'} {planLabel}</div>
          </div>
          <div style={{...S.tdo(false), padding: '10px 14px', textAlign: 'center', fontSize: 10, color: '#6b7280'}}>
            More tenants coming soon
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={S.nav}>
        {NAV_ITEMS.map((section, idx) => {
          if (section.ownerOnly && role !== 'owner') return null;
          const isCollapsible = section.collapsible;
          const isExpanded = isCollapsible ? !!expanded[section.section] : true;
          const hasActive = sectionHasActive(section);

          return (
            <React.Fragment key={section.section}>
              {idx > 0 && <div style={S.sectionDivider} />}
              <div style={S.sectionGroup}>
                <div
                  style={S.sectionHeader(isCollapsible)}
                  onClick={isCollapsible ? () => toggleSection(section.section) : undefined}
                  onMouseEnter={e => { if (isCollapsible) e.currentTarget.style.background = '#f3f4f6'; }}
                  onMouseLeave={e => { if (isCollapsible) e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    {section.section}
                    {isCollapsible && !isExpanded && (
                      <span style={S.sectionCount}>{section.items.length}</span>
                    )}
                    {isCollapsible && !isExpanded && hasActive && (
                      <span style={S.sectionActiveDot} />
                    )}
                  </span>
                  {isCollapsible && (
                    <span style={S.sectionChevron(isExpanded)}>{'\u25B6'}</span>
                  )}
                </div>
                <div style={S.sectionItems(isExpanded)}>
                  {section.items.map(item => (
                    <button
                      key={item.key}
                      style={S.navItem(activeTab === item.key)}
                      onClick={() => onTabChange(item.key)}
                      onMouseEnter={e => { if (activeTab !== item.key) e.currentTarget.style.background = '#f3f4f6'; }}
                      onMouseLeave={e => { if (activeTab !== item.key) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span style={S.navEmoji}>{item.emoji}</span>
                      {item.label}
                      {item.showBadge && lowStockCount > 0 && (
                        <span style={S.badge}>{lowStockCount}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </nav>

      {/* User footer */}
      <div style={S.userSection}>
        <div style={S.avatar(ac.bg)}>{initials(user?.username || '')}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={S.userName}>{user?.username || 'User'}</div>
          <div style={S.userRole}>{role}</div>
        </div>
        <button
          style={S.logoutBtn}
          onClick={onLogout}
          title="Logout"
          onMouseEnter={e => { e.currentTarget.style.color = '#c0392b'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#9ca3af'; }}
        >
          {'\u21E5'}
        </button>
      </div>
    </div>
  );
}
