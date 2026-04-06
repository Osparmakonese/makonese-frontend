import React, { useState, useEffect } from 'react';
import { initials, avatarColor } from '../utils/format';
import Logo from './Logo';

/*
  UX Laws applied:
  - Hick's Law: Collapsible sections reduce visible choices from ~22 to ~12
  - Miller's Law: 5 section groups (well within 7±2 chunk limit)
  - Proximity Law: Clear spacing + dividers between section groups
  - Von Restorff Effect: Active item has bold left accent bar + green tint
*/

const S = {
  sidebar: {
    position: 'fixed', top: 0, left: 0, width: 220, height: '100vh',
    background: '#ffffff', borderRight: '1px solid #e5e7eb',
    display: 'flex', flexDirection: 'column', zIndex: 60,
    fontFamily: "'Inter', sans-serif",
  },
  brand: {
    padding: '18px 14px 14px', borderBottom: '1px solid #e5e7eb',
    display: 'flex', alignItems: 'center', gap: 10,
  },
  nav: {
    flex: 1, overflowY: 'auto', padding: '6px 8px',
    display: 'flex', flexDirection: 'column', gap: 0,
  },
  /* --- Proximity Law: section groups with visual separation --- */
  sectionGroup: {
    marginBottom: 2, paddingBottom: 2,
  },
  sectionDivider: {
    height: 1, background: '#f3f4f6', margin: '4px 10px',
  },
  /* --- Hick's Law: collapsible section headers --- */
  sectionHeader: (isCollapsible) => ({
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 10px 4px', cursor: isCollapsible ? 'pointer' : 'default',
    userSelect: 'none', borderRadius: 6,
    transition: 'background 0.15s',
  }),
  sectionLabel: {
    fontSize: 9, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase',
    letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6,
  },
  sectionChevron: (expanded) => ({
    fontSize: 8, color: '#9ca3af', transition: 'transform 0.2s ease',
    transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
  }),
  sectionCount: {
    fontSize: 8, fontWeight: 600, color: '#fff', background: '#d1d5db',
    borderRadius: 8, padding: '1px 5px', marginLeft: 4, minWidth: 14,
    textAlign: 'center', lineHeight: '14px',
  },
  /* --- Hick's Law: collapsible items wrapper --- */
  sectionItems: (expanded) => ({
    overflow: 'hidden', maxHeight: expanded ? 500 : 0,
    transition: 'max-height 0.25s ease-in-out', opacity: expanded ? 1 : 0,
  }),
  /* --- Von Restorff Effect: active item stands out with left accent --- */
  navItem: (active) => ({
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '7px 10px', borderRadius: 7, fontSize: 12,
    fontWeight: active ? 600 : 500, cursor: 'pointer',
    background: active ? '#e8f5ee' : 'transparent',
    color: active ? '#1a6b3a' : '#374151',
    transition: 'all 0.15s ease',
    border: 'none', width: '100%', textAlign: 'left',
    position: 'relative', fontFamily: 'inherit',
    borderLeft: active ? '3px solid #1a6b3a' : '3px solid transparent',
    marginLeft: active ? 0 : 0,
  }),
  navEmoji: { fontSize: 14, width: 18, textAlign: 'center', flexShrink: 0 },
  /* --- Von Restorff Effect: badge stands out with red pulse --- */
  badge: {
    position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
    background: '#c0392b', color: '#fff', fontSize: 8, fontWeight: 700,
    padding: '2px 6px', borderRadius: 10, minWidth: 16, textAlign: 'center',
    boxShadow: '0 0 0 2px rgba(192,57,43,0.2)',
    animation: 'badgePulse 2s infinite',
  },
  /* --- Von Restorff: collapsed section active indicator --- */
  sectionActiveDot: {
    width: 6, height: 6, borderRadius: '50%', background: '#1a6b3a',
    marginLeft: 4, flexShrink: 0,
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
  { section: 'MAIN', collapsible: false, items: [
    { key: 'Dashboard', emoji: '\u{1F4CA}', label: 'Dashboard' },
    { key: 'Fields', emoji: '\u{1F33E}', label: 'Fields' },
    { key: 'Sales & Market', emoji: '\u{1F69A}', label: 'Sales & Market' },
    { key: 'Costs', emoji: '\u{1F9FE}', label: 'Costs' },
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
  { section: 'OWNER ONLY', ownerOnly: true, collapsible: false, items: [
    { key: 'Report', emoji: '\u{1F4C8}', label: 'Report' },
    { key: 'Settings', emoji: '\u2699\uFE0F', label: 'Settings' },
    { key: 'Import', emoji: '\u{1F4E5}', label: 'Import' },
    { key: 'Admin Panel', emoji: '\u{1F510}', label: 'Admin Panel' },
  ]},
];

export default function Sidebar({ activeTab, onTabChange, user, onLogout, lowStockCount = 0 }) {
  const role = user?.role || 'worker';
  const ac = avatarColor(user?.username || '');

  /* Hick's Law: track which collapsible sections are expanded */
  const [expanded, setExpanded] = useState({});

  /* Auto-expand section if active tab is inside a collapsed section */
  useEffect(() => {
    NAV_ITEMS.forEach(section => {
      if (section.collapsible && section.items.some(item => item.key === activeTab)) {
        setExpanded(prev => ({ ...prev, [section.section]: true }));
      }
    });
  }, [activeTab]);

  const toggleSection = (sectionName) => {
    setExpanded(prev => ({ ...prev, [sectionName]: !prev[sectionName] }));
  };

  /* Check if a collapsed section has the active tab */
  const sectionHasActive = (section) => {
    return section.items.some(item => item.key === activeTab);
  };

  return (
    <div style={S.sidebar}>
      {/* Brand */}
      <div style={S.brand}>
        <Logo size={36} />
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
              {/* Proximity Law: divider between sections */}
              {idx > 0 && <div style={S.sectionDivider} />}

              <div style={S.sectionGroup}>
                {/* Section header — clickable for collapsible sections */}
                <div
                  style={S.sectionHeader(isCollapsible)}
                  onClick={isCollapsible ? () => toggleSection(section.section) : undefined}
                  onMouseEnter={(e) => { if (isCollapsible) e.currentTarget.style.background = '#f9fafb'; }}
                  onMouseLeave={(e) => { if (isCollapsible) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={S.sectionLabel}>
                    {section.section}
                    {/* Miller's Law: show count so users know what's inside collapsed sections */}
                    {isCollapsible && !isExpanded && (
                      <span style={S.sectionCount}>{section.items.length}</span>
                    )}
                    {/* Von Restorff: green dot if active tab is in collapsed section */}
                    {isCollapsible && !isExpanded && hasActive && (
                      <span style={S.sectionActiveDot} />
                    )}
                  </div>
                  {isCollapsible && (
                    <span style={S.sectionChevron(isExpanded)}>{'\u25B6'}</span>
                  )}
                </div>

                {/* Section items — animated collapse for Hick's Law */}
                <div style={S.sectionItems(isExpanded)}>
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
                      {/* Von Restorff: red badge for low stock alerts */}
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
          {'\u21E5'}
        </button>
      </div>
    </div>
  );
}
