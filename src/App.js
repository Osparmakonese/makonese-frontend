import OfflineBanner from './OfflineBanner';
// v2 "” production API routing fix
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './context/AuthContext';
import { getDashboard, getLowStock } from './api/farmApi';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Fields from './pages/Fields';
import Sales from './pages/Sales';
import Costs from './pages/Costs';
import Stock from './pages/Stock';
import Workers from './pages/Workers';
import Hours from './pages/Hours';
import Report from './pages/Report';
import Settings from './pages/Settings';
import Import from './pages/Import';
import AdminPanel from './pages/AdminPanel';
import PWAInstallPrompt from './components/PWAInstallPrompt';

/* â”€â”€ Tab â†’ page component map â”€â”€ */
const PAGES = {
  'Dashboard': Dashboard,
  'Fields': Fields,
  'Sales & Market': Sales,
  'Costs': Costs,
  'Stock': Stock,
  'Workers': Workers,
  'Hours & Pay': Hours,
  'Report': Report,
  'Settings': Settings,
  'Import': Import,
  'Admin Panel': AdminPanel,
};

/* â”€â”€ Page titles & subtitles â”€â”€ */
const PAGE_META = {
  'Dashboard': { title: 'Dashboard', sub: 'Season overview "” Makonese Farm' },
  'Fields': { title: 'Fields', sub: 'Manage your farm fields' },
  'Sales & Market': { title: 'Sales & Market', sub: 'Market trips and direct income' },
  'Costs': { title: 'Costs', sub: 'Farm expenses and inputs' },
  'Stock': { title: 'Stock', sub: 'Inventory and usage tracking' },
  'Workers': { title: 'Workers', sub: 'Roster and wage management' },
  'Hours & Pay': { title: 'Hours & Pay', sub: 'Attendance and payroll' },
  'Report': { title: 'Financial Report', sub: 'Season P&L "” Owner only' },
  'Settings': { title: 'Settings', sub: 'System configuration' },
  'Import': { title: 'Import Data', sub: 'Upload Excel to populate your farm data' },
  'Admin Panel': { title: 'ðŸ” Super Admin Panel', sub: 'System administration "” visible to you only' },
};

/* â”€â”€ Primary actions per tab â”€â”€ */
const PRIMARY_ACTIONS = {
  'Dashboard': '+ Log expense',
  'Fields': '+ Open field',
  'Sales & Market': '+ Record trip',
  'Costs': '+ Log expense',
  'Stock': '+ Add stock',
  'Workers': '+ Add worker',
  'Hours & Pay': '+ Log hours',
  'Report': 'Export PDF',
  'Settings': 'Save changes',
};

/* â”€â”€ Auth gate â”€â”€ */
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

/* â”€â”€ Main app shell â”€â”€ */
function FarmApp() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const { user, logout } = useAuth();

  const { data: dashboardData } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboard,
    staleTime: 30000,
  });

  const { data: lowStockData = [] } = useQuery({
    queryKey: ['lowStock'],
    queryFn: getLowStock,
    staleTime: 60000,
  });

  const Page = PAGES[activeTab] || Dashboard;
  const meta = PAGE_META[activeTab] || PAGE_META['Dashboard'];
  const primaryAction = PRIMARY_ACTIONS[activeTab];

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      user={user}
      onLogout={logout}
      pageTitle={meta.title}
      pageSub={meta.sub}
      primaryAction={primaryAction}
      onPrimaryAction={() => {
        /* Scroll to form section "” pages handle their own forms */
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      dashboardData={dashboardData}
      lowStockCount={lowStockData.length}
    >
      <Page />
      <PWAInstallPrompt />
        <OfflineBanner />
    </Layout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <FarmApp />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
