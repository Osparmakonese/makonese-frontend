import api from './axios';

// ── AI Analysis (main endpoint — works for both farm and retail) ──
export const analyzeAI = (feature, params = {}) =>
  api.post('/ai/analyze/', { feature, params }).then(r => r.data);

// ── AI Budget (credits remaining, usage stats) ──
export const getAIBudget = () =>
  api.get('/ai/budget/').then(r => r.data);

// ── AI Features (list available features for this tenant) ──
export const getAIFeatures = () =>
  api.get('/ai/features/').then(r => r.data);

// ── Convenience wrappers for specific features ──

// Retail
export const analyzeEndOfDay = (date) =>
  analyzeAI('retail_eod_analysis', { date });

export const analyzeProfitMargins = () =>
  analyzeAI('retail_profit_advisor');

export const analyzeStockLevels = () =>
  analyzeAI('retail_stock_advisor');

export const analyzeCustomer = (customerId) =>
  analyzeAI('retail_customer_insights', { customer_id: customerId });

export const analyzeCashiers = (days = 7) =>
  analyzeAI('retail_cashier_monitor', { days });

export const analyzeRetailDashboard = () =>
  analyzeAI('retail_dashboard_summary');

// Farm
export const analyzeFarmReport = (period = 'season') =>
  analyzeAI('farm_report_analysis', { period });

export const analyzeFields = () =>
  analyzeAI('farm_field_insights');

export const analyzeSeasonalPlan = () =>
  analyzeAI('farm_seasonal_planner');

// System-wide
export const askAI = (question) =>
  analyzeAI('natural_language_query', { question });

// WhatsApp supplier PO parser
// Returns {analysis: raw, parsed: {supplier_guess, items: [...], ...}}
export const parseWhatsAppPO = (message) =>
  analyzeAI('whatsapp_po_parse', { message });
