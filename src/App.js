import OfflineBanner from './OfflineBanner';
// v2 - production API routing fix
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './context/AuthContext';
import { getDashboard, getLowStock } from './api/farmApi';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
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
import FarmAssets from './pages/FarmAssets';
import Cattle from './pages/Cattle';
import Goats from './pages/Goats';
import Sheep from './pages/Sheep';
import Pigs from './pages/Pigs';
import Broilers from './pages/Broilers';
import Layers from './pages/Layers';
import Harvest from './pages/Harvest';
import Budget from './pages/Budget';
import Water from './pages/Water';
import Loans from './pages/Loans';
import MarketPrices from './pages/MarketPrices';
import Economics from './pages/Economics';
import Billing from './pages/Billing';
import TeamManagement from './pages/TeamManagement';
import Register from './pages/Register';
import RetailDashboard from './pages/RetailDashboard';
import Products from './pages/Products';
import POS from './pages/POS';
import SalesHistory from './pages/SalesHistory';
import CashierSessions from './pages/CashierSessions';
import StockAdjustments from './pages/StockAdjustments';
import Categories from './pages/Categories';
import RetailReport from './pages/RetailReport';
import PWAInstallPrompt from './components/PWAInstallPrompt';

/* --- */
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
  'Farm Assets': FarmAssets,
  'Cattle': Cattle,
  'Goats': Goats,
  'Sheep': Sheep,
  'Pigs': Pigs,
  'Broilers': Broilers,
  'Layers': Layers,
  'Harvest': Harvest,
  'Budget': Budget,
  'Water': Water,
  'Loans': Loans,
  'Market Prices': MarketPrices,
  'Economics': Economics,
  'Admin Panel': AdminPanel,
  // Retail module
  'Retail': RetailDashboard,
  'Products': Products,
  'POS': POS,
  'Sales History': SalesHistory,
  'Cashier Sessions': CashierSessions,
  'Stock Adjustments': StockAdjustments,
  'Categories': Categories,
  'Retail Report': RetailReport,
  // Billing & Account
  'Billing': Billing,
  'Team': TeamManagement,
};

/* --- */
const PAGE_META = {
  'Dashboard': { title: 'Dashboard', sub: 'Season overview - Pewil' },
  'Fields': { title: 'Fields', sub: 'Manage your farm fields' },
  'Sales & Market': { title: 'Sales & Market', sub: 'Market trips and direct income' },
  'Costs': { title: 'Costs', sub: 'Farm expenses and inputs' },
  'Stock': { title: 'Stock', sub: 'Inventory and usage tracking' },
  'Cattle': { title: 'Cattle', sub: 'Herd management and health records' },
  'Goats': { title: 'Goats', sub: 'Goat records and health tracking' },
  'Sheep': { title: 'Sheep', sub: 'Flock management and health records' },
  'Pigs': { title: 'Pigs', sub: 'Pig management and litter tracking' },
  'Broilers': { title: 'Broilers', sub: 'Meat bird batches and expenses' },
  'Layers': { title: 'Layers', sub: 'Egg production and flock management' },
  'Workers': { title: 'Workers', sub: 'Roster and wage management' },
  'Hours & Pay': { title: 'Hours & Pay', sub: 'Attendance and payroll' },
  'Report': { title: 'Financial Report', sub: 'Season P&L - Owner only' },
  'Farm Assets': { title: 'Farm Assets', sub: 'Equipment and long-term investments' },
  'Settings': { title: 'Settings', sub: 'Tenant configuration - Pewil' },
  'Import': { title: 'Import Data', sub: 'Upload Excel to populate your farm data' },
  'Harvest': { title: 'Harvest & Yield', sub: 'Track harvest output per field' },
  'Budget': { title: 'Season Budget', sub: 'Plan your spending vs actual' },
  'Water': { title: 'Water & Irrigation', sub: 'Track water usage and rainfall' },
  'Loans': { title: 'Loans & Credit', sub: 'Track borrowing and repayments' },
  'Market Prices': { title: 'Market Prices', sub: 'Commodity price tracking' },
  'Economics': { title: 'Farm Economics', sub: 'Profitability and enterprise analysis' },
  'Admin Panel': { title: 'Super Admin Panel', sub: 'Pewil system administration' },
  // Retail module
  'Retail': { title: 'Retail Dashboard', sub: 'Store overview and daily metrics' },
  'Products': { title: 'Products', sub: 'Product catalog and inventory' },
  'POS': { title: 'Point of Sale', sub: 'Process sales and manage cart' },
  'Sales History': { title: 'Sales History', sub: 'View all retail transactions and receipts' },
  'Cashier Sessions': { title: 'Cashier Sessions', sub: 'Open, close, and manage cashier sessions' },
  'Stock Adjustments': { title: 'Stock Adjustments', sub: 'Log damaged, stolen, or restocked items' },
  'Categories': { title: 'Categories', sub: 'Organize products into categories' },
  'Retail Report': { title: 'Retail Report', sub: 'Store P&L, inventory and performance' },
  // Billing
  'Billing': { title: 'Billing', sub: 'Pewil subscription, invoices, and usage' },
  'Team': { title: 'Team & Users', sub: 'Manage team members and permissions' },
};

/* --- */
const PRIMARY_ACTIONS = {
  'Dashboard': '+ Log expense',
  'Fields': '+ Open field',
  'Sales & Market': '+ Record trip',
  'Costs': '+ Log expense',
  'Stock': '+ Add stock',
  'Cattle': '+ Add cattle',
  'Goats': '+ Add goat',
  'Sheep': '+ Add sheep',
  'Pigs': '+ Add pig',
  'Broilers': '+ Add batch',
  'Layers': '+ Add flock',
  'Workers': '+ Add worker',
  'Hours & Pay': '+ Log hours',
  'Report': 'Export PDF',
  'Farm Assets': '+ Add asset',
  'Harvest': '+ Log harvest',
  'Budget': '+ Add budget line',
  'Water': '+ Log water',
  'Loans': '+ Add loan',
  'Market Prices': '+ Add price',
  'Settings': 'Save changes',
  'Retail': null,
  'Products': '+ Add product',
  'POS': null,
  'Sales History': null,
  'Cashier Sessions': '+ Open Session',
  'Stock Adjustments': '+ Log Adjustment',
  'Categories': '+ Add Category',
  'Retail Report': null,
  'Billing': 'Change Plan',
  'Team': '+ Invite User',
};

/* --- */
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

/* --- */
function FarmApp() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [activeModule, setActiveModule] = useState('farm');
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

  const handleModuleChange = (mod) => {
    setActiveModule(mod);
    // Navigate to the appropriate dashboard when switching modules
    if (mod === 'retail') {
      setActiveTab('Retail');
    } else {
      setActiveTab('Dashboard');
    }
  };

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
        /* --- */
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      dashboardData={dashboardData}
      lowStockCount={lowStockData.length}
      activeModule={activeModule}
      onModuleChange={handleModuleChange}
    >
      <Page onTabChange={setActiveTab} />
      <PWAInstallPrompt />
        <OfflineBanner />
    </Layout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/app"
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
