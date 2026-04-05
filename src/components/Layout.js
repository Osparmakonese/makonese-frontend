import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Logo from './Logo';
import { initials, avatarColor } from '../utils/format';
const MORE_TABS = [
  { key: 'Costs', emoji: '🧾', label: 'Costs', sub: 'Farm expenses' },
  { key: 'Harvest', emoji: '🌾', label: 'Harvest', sub: 'Yield tracking' },
  { key: 'Budget', emoji: '📋', label: 'Budget', sub: 'Plan vs actual' },
  { key: 'Water', emoji: '💧', label: 'Water', sub: 'Irrigation logs' },
  { key: 'Loans', emoji: '🏦', label: 'Loans', sub: 'Credit tracker' },
  { key: 'Market Prices', emoji: '📊', label: 'Prices', sub: 'Commodity prices' },
  { key: 'Economics', emoji: '📈', label: 'Economics', sub: 'Farm analytics', ownerOnly: true },
  { key: 'Cattle', emoji: '🐄', label: 'Cattle', sub: 'Herd management' },
  { key: 'Goats', emoji: '🐐', label: 'Goats', sub: 'Goat records' },
  { key: 'Sheep', emoji: '🐑', label: 'Sheep', sub: 'Flock records' },
  { key: 'Pigs', emoji: '🐷', label: 'Pigs', sub: 'Pig management' },
  { key: 'Broilers', emoji: '🐔', label: 'Broilers', sub: 'Meat birds' },
  { key: 'Layers', emoji: '🥚', label: 'Layers', sub: 'Egg production' },
  { key: 'Workers', emoji: '👷', label: 'Workers', sub: 'Roster & wages' },
  { key: 'Hours & Pay', emoji: '⏱️', label: 'Hours & Pay', sub: 'Attendance' },
  { key: 'Report', emoji: '📈', label: 'Report', sub: 'P&L overview', ownerOnly: true },
  { key: 'Farm Assets', emoji: '🏗️', label: 'Farm Assets', sub: 'Equipment & assets' },
  { key: 'Settings', emoji: '⚙️', label: 'Settings', sub: 'Configuration' },
  { key: 'Import', emoji: '📥', label: 'Import', sub: 'Excel upload' },
  { key: 'Admin Panel', emoji: '🔐', label: 'Admin', sub: 'Super admin', ownerOnly: true },
];
const BOTTOM_PRIMARY = ['Dashboard', 'Fields', 'Sales & Market', 'Stock'];
export default function Layout({
  activeTab, onTabChange, user, onLogout,
  pageTitle, pageSub, primaryAction, onPrimaryAction,
  dashboardData, lowStockCount, children,
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
        />
      </div>
      <div className="main-content" style={{ marginLeft: 200, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Mobile header */}
        <div className="mobile-header">
          <div>
            <Logo size={30} />
          </div>
          <div className="mh-right">
            <button className="mobile-wa-btn" onClick={() => window.open('https://wa.me/', '_blank')}>
              📱 WhatsApp
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
      {/* Bottom nav */}
      <div className="bottom-nav">
        <button className={`bn-tab${activeTab === 'Dashboard' ? ' active' : ''}`} onClick={() => goTab('Dashboard')}>
          <span className="bn-icon">🏠</span>
          <span className="bn-label">Home</span>
        </button>
        <button className={`bn-tab${activeTab === 'Fields' ? ' active' : ''}`} onClick={() => goTab('Fields')}>
          <span className="bn-icon">🌾</span>
          <span className="bn-label">Fields</span>
        </button>
        <button className={`bn-tab${activeTab === 'Sales & Market' ? ' active' : ''}`} onClick={() => goTab('Sales & Market')}>
          <span className="bn-icon">🚚</span>
          <span className="bn-label">Sales</span>
        </button>
        <button className={`bn-tab${activeTab === 'Stock' ? ' active' : ''}`} onClick={() => goTab('Stock')}>
          <span className="bn-icon">📦</span>
          <span className="bn-label">Stock</span>
          {lowStockCount > 0 && <span className="bn-badge">{lowStockCount}</span>}
        </button>
        <button className={`bn-tab${isMore ? ' active' : ''}`} onClick={() => setShowMobileMore(true)}>
          <span className="bn-icon">⋯</span>
          <span className="bn-label">More</span>
        </button>
      </div>
      {/* Mobile more drawer */}
      {showMobileMore && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 400 }}
            onClick={() => setShowMobileMore(false)}
          />
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            background: '#fff', borderRadius: '20px 20px 0 0',
            padding: 20, maxHeight: '70vh', overflowY: 'auto', zIndex: 450,
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
            {/* Menu grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {MORE_TABS.filter(t => !t.ownerOnly || role === 'owner').map(t => (
                <button
                  key={t.key}
                  onClick={() => goTab(t.key)}
                  style={{
                    background: activeTab === t.key ? '#e8f5ee' : '#fff',
                    border: `1px solid ${activeTab === t.key ? '#1a6b3a' : '#e5e7eb'}`,
                    borderRadius: 12, padding: 16, textAlign: 'center',
                    cursor: 'pointer', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: 4,
                  }}
                >
                  <span style={{ fontSize: 28 }}>{t.emoji}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{t.label}</span>
                  <span style={{ fontSize: 10, color: '#6b7280' }}>{t.sub}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
