import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Logo from './Logo';
import QuickCapture from './QuickCapture';
import { initials, avatarColor } from '../utils/format';

/*
  UX Laws applied to mobile drawer:
  - Miller's Law: Items grouped into 5 sections (within 7+-2 rule)
  - Proximity Law: Section headers + spacing separate groups visually
  - Hick's Law: Sections reduce cognitive load vs flat 20-item grid
  - Von Restorff Effect: Active item has green border + bg to stand out
*/
const DRAWER_SECTIONS = [
  { label: 'Farm Operations', items: [
    { key: 'Costs', emoji: '\u{1F9FE}', label: 'Costs', sub: 'Farm expenses' },
    { key: 'Farm Assets', emoji: '\u{1F3D7}\uFE0F', label: 'Assets', sub: 'Equipment' },
  ]},
  { label: 'Economics', items: [
    { key: 'Harvest', emoji: '\u{1F33E}', label: 'Harvest', sub: 'Yield tracking' },
    { key: 'Budget', emoji: '\u{1F4CB}', label: 'Budget', sub: 'Plan vs actual' },
    { key: 'Water', emoji: '\u{1F4A7}', label: 'Water', sub: 'Irrigation logs' },
    { key: 'Loans', emoji: '\u{1F3E6}', label: 'Loans', sub: 'Credit tracker' },
    { key: 'Market Prices', emoji: '\u{1F4CA}', label: 'Prices', sub: 'Commodity prices' },
    { key: 'Economics', emoji: '\u{1F4C8}', label: 'Analytics', sub: 'Profitability', ownerOnly: true },
  ]},
  { label: 'Livestock', items: [
    { key: 'Cattle', emoji: '\u{1F404}', label: 'Cattle', sub: 'Herd management' },
    { key: 'Goats', emoji: '\u{1F410}', label: 'Goats', sub: 'Goat records' },
    { key: 'Sheep', emoji: '\u{1F411}', label: 'Sheep', sub: 'Flock records' },
    { key: 'Pigs', emoji: '\u{1F437}', label: 'Pigs', sub: 'Pig management' },
    { key: 'Broilers', emoji: '\u{1F414}', label: 'Broilers', sub: 'Meat birds' },
    { key: 'Layers', emoji: '\u{1F95A}', label: 'Layers', sub: 'Egg production' },
  ]},
  { label: 'People', items: [
    { key: 'Workers', emoji: '\u{1F477}', label: 'Workers', sub: 'Roster & wages' },
    { key: 'Hours & Pay', emoji: '\u23F1\uFE0F', label: 'Hours & Pay', sub: 'Attendance' },
  ]},
  { label: 'Admin', items: [
    { key: 'Report', emoji: '\u{1F4C8}', label: 'Report', sub: 'P&L overview', ownerOnly: true },
    { key: 'Settings', emoji: '\u2699\uFE0F', label: 'Settings', sub: 'Configuration' },
    { key: 'Import', emoji: '\u{1F4E5}', label: 'Import', sub: 'Excel upload' },
    { key: 'Admin Panel', emoji: '\u{1F510}', label: 'Admin', sub: 'Super admin', ownerOnly: true },
  ]},
];

const BOTTOM_PRIMARY = ['Dashboard', 'Fields', 'Sales & Market', 'Stock'];

export default function Layout({
  activeTab, onTabChange, user, onLogout,
  pageTitle, pageSub, primaryAction, onPrimaryAction,
  dashboardData, lowStockCount, children,
  activeModule, onModuleChange,
}) {
  const [showMobileMore, setShowMobileMore] = useState(false);
  const role = user?.role || 'worker';
  const ac = avatarColor(user?.username || '');
  const isMore = !BOTTOM_PRIMARY.includes(activeTab);
  const goTab = (tab) => {
    onTabChange(tab);
    setShowMobileMore(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div className="sidebar-desktop">
        <Sidebar
          activeTab={activeTab}
          onTabChange={onTabChange}
          user={user}
          onLogout={onLogout}
          lowStockCount={lowStockCount}
          activeModule={activeModule}
          onModuleChange={onModuleChange}
        />
      </div>
      <div className="main-content" style={{ marginLeft: 220, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Mobile header */}
        <div className="mobile-header">
          <div>
            <Logo size={30} />
          </div>
          <div className="mh-right">
            <button className="mobile-wa-btn" onClick={() => window.open('https://wa.me/', '_blank')}>
              {'\u{1F4F1}'} WhatsApp
            </button>
            <div className="mobile-avatar" style={{ background: ac.bg }}>
              {initials(user?.username || '')}
            </div>
          </div>
        </div>
        <div className="topbar-desktop">
          <Topbar
            pageTitle={pageTitle}
            pageSub={pageSub}
            primaryAction={primaryAction}
            onPrimaryAction={onPrimaryAction}
            dashboardData={dashboardData}
          />
        </div>
        <main className="page-content-mobile" style={{ flex: 1, padding: '20px 24px', background: '#f9fafb' }}>
          {children}
        </main>
      </div>

      {/* Quick Capture FAB — always visible */}
      <QuickCapture />

      {/* Bottom nav — Hick's Law: only 5 primary choices */}
      <div className="bottom-nav">
        <button className={`bn-tab${activeTab === 'Dashboard' ? ' active' : ''}`} onClick={() => goTab('Dashboard')}>
          <span className="bn-icon">{'\u{1F3E0}'}</span>
          <span className="bn-label">Home</span>
        </button>
        <button className={`bn-tab${activeTab === 'Fields' ? ' active' : ''}`} onClick={() => goTab('Fields')}>
          <span className="bn-icon">{'\u{1F33E}'}</span>
          <span className="bn-label">Fields</span>
        </button>
        <button className={`bn-tab${activeTab === 'Sales & Market' ? ' active' : ''}`} onClick={() => goTab('Sales & Market')}>
          <span className="bn-icon">{'\u{1F69A}'}</span>
          <span className="bn-label">Sales</span>
        </button>
        <button className={`bn-tab${activeTab === 'Stock' ? ' active' : ''}`} onClick={() => goTab('Stock')}>
          <span className="bn-icon">{'\u{1F4E6}'}</span>
          <span className="bn-label">Stock</span>
          {lowStockCount > 0 && <span className="bn-badge">{lowStockCount}</span>}
        </button>
        <button className={`bn-tab${isMore ? ' active' : ''}`} onClick={() => setShowMobileMore(true)}>
          <span className="bn-icon">{'\u22EF'}</span>
          <span className="bn-label">More</span>
        </button>
      </div>

      {/* Mobile more drawer — Miller's Law: grouped into 5 sections */}
      {showMobileMore && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 400 }}
            onClick={() => setShowMobileMore(false)}
          />
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            background: '#fff', borderRadius: '20px 20px 0 0',
            padding: 20, maxHeight: '75vh', overflowY: 'auto', zIndex: 450,
          }}>
            {/* Drag handle */}
            <div style={{ width: 36, height: 4, background: '#e5e7eb', borderRadius: 2, margin: '0 auto 16px' }} />

            {/* User info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: ac.bg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                {initials(user?.username || '')}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{user?.username || 'User'}</div>
                <div style={{ fontSize: 11, color: '#9ca3af', textTransform: 'capitalize' }}>{role}</div>
              </div>
              <button
                onClick={() => { setShowMobileMore(false); onLogout(); }}
                style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: 8, padding: '6px 12px', fontSize: 11, color: '#c0392b', fontWeight: 600, cursor: 'pointer' }}
              >
                Logout
              </button>
            </div>

            {/* Miller's Law + Proximity: Sectioned grid with headers */}
            {DRAWER_SECTIONS.map((section, sIdx) => {
              const visibleItems = section.items.filter(t => !t.ownerOnly || role === 'owner');
              if (visibleItems.length === 0) return null;
              return (
                <div key={section.label} style={{ marginBottom: sIdx < DRAWER_SECTIONS.length - 1 ? 18 : 0 }}>
                  {/* Proximity Law: section header separates groups */}
                  <div style={{
                    fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase',
                    letterSpacing: '0.06em', marginBottom: 8, paddingLeft: 2,
                  }}>
                    {section.label}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    {visibleItems.map(t => {
                      const isActive = activeTab === t.key;
                      return (
                        <button
                          key={t.key}
                          onClick={() => goTab(t.key)}
                          style={{
                            /* Von Restorff: active item visually distinct */
                            background: isActive ? '#e8f5ee' : '#fff',
                            border: `1.5px solid ${isActive ? '#1a6b3a' : '#e5e7eb'}`,
                            borderRadius: 12, padding: '12px 8px', textAlign: 'center',
                            cursor: 'pointer', display: 'flex', flexDirection: 'column',
                            alignItems: 'center', gap: 3,
                            boxShadow: isActive ? '0 0 0 2px rgba(26,107,58,0.15)' : 'none',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <span style={{ fontSize: 26 }}>{t.emoji}</span>
                          <span style={{ fontSize: 12, fontWeight: isActive ? 700 : 600, color: isActive ? '#1a6b3a' : '#111827' }}>{t.label}</span>
                          <span style={{ fontSize: 9, color: '#6b7280' }}>{t.sub}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
