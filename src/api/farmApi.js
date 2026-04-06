import api from './axios';

// Dashboard
export const getDashboard = () => api.get('/dashboard/').then(r => r.data);

// Fields
export const getFields = () => api.get('/fields/').then(r => r.data);
export const createField = (data) => api.post('/fields/', data).then(r => r.data);
export const closeField = (id) => api.post(`/fields/${id}/close_field/`).then(r => r.data);
export const reopenField = (id, data) => api.post(`/fields/${id}/reopen_field/`, data).then(r => r.data);
export const getFieldReport = (id, opening) => api.get(`/fields/${id}/field_report/`, { params: { opening } }).then(r => r.data);

// Stock
export const getStock = () => api.get('/stock/').then(r => r.data);
export const getLowStock = () => api.get('/stock/low_stock/').then(r => r.data);
export const createStockItem = (data) => api.post('/stock/', { ...data, remaining_qty: data.remaining_qty ?? data.opening_qty }).then(r => r.data);
export const getStockUsage = () => api.get('/stock-usage/').then(r => r.data);
export const logStockUsage = (data) => api.post('/stock-usage/', data).then(r => r.data);
export const deleteStockItem = (id) => api.delete(`/stock/${id}/`);

// Expenses
export const getExpenses = (fieldId) => api.get('/expenses/', { params: fieldId ? { field: fieldId } : {} }).then(r => r.data);
export const createExpense = (data) => api.post('/expenses/', data).then(r => r.data);

// Trips
export const getTrips = () => api.get('/trips/').then(r => r.data);
export const createTrip = (data) => api.post('/trips/', data).then(r => r.data);

// Income
export const getIncome = () => api.get('/income/').then(r => r.data);
export const createIncome = (data) => api.post('/income/', { ...data, income_date: data.income_date || data.date }).then(r => r.data);

// Workers
export const getWorkers = () => api.get('/workers/').then(r => r.data);
export const createWorker = (data) => api.post('/workers/', data).then(r => r.data);
export const getWagesSummary = () => api.get('/workers/wages_summary/').then(r => r.data);

// Attendance
export const getAttendance = (params) => api.get('/attendance/', { params }).then(r => r.data);
export const createAttendance = (data) => api.post('/attendance/', data).then(r => r.data);
export const markPaid = (id) => api.post(`/attendance/${id}/mark_paid/`).then(r => r.data);

// Trip two-stage (departure + settlement)
export async function createDeparture(data) {
  const res = await api.post('/trips/', data);
  return res.data;
}
export async function createTripEntry(data) {
  const res = await api.post('/trips/entries/', data);
  return res.data;
}
export async function updateTripEntry(id, data) {
  // Map frontend field names to backend model field names
  const mapped = { ...data };
  if ('price_large' in mapped) { mapped.large_price = mapped.price_large; delete mapped.price_large; }
  if ('price_medium' in mapped) { mapped.medium_price = mapped.price_medium; delete mapped.price_medium; }
  if ('price_small' in mapped) { mapped.small_price = mapped.price_small; delete mapped.price_small; }
  const res = await api.patch(`/trip-entries/${id}/`, mapped);
  return res.data;
}
export async function createGiveaway(data) {
  const res = await api.post('/giveaways/', data);
  return res.data;
}
export async function createSpecialSale(data) {
  const res = await api.post('/special-sales/', data);
  return res.data;
}
export async function settleTrip(id, data) {
  const res = await api.post(`/trips/${id}/settle_trip/`, data);
  return res.data;
}

// Daily Summary & History
export async function getDailySummary(date) {
  const res = await api.get(`/fields/daily_summary/${date ? `?date=${date}` : ''}`);
  return res.data;
}

export async function getFieldHistory(id) {
  const res = await api.get(`/fields/${id}/history_analysis/`);
  return res.data;
}

// Admin Panel
export const getAdminUsers = () => api.get('/admin-panel/users/').then(r => r.data);
export const createAdminUser = (data) => api.post('/admin-panel/create_user/', data).then(r => r.data);
export const updateAdminUser = (data) => api.patch('/admin-panel/update_user/', data).then(r => r.data);
export const resetAdminPassword = (userId, newPassword) => api.post('/admin-panel/reset_password/', { user_id: userId, new_password: newPassword }).then(r => r.data);
export const deactivateUser = (userId) => api.post('/admin-panel/deactivate_user/', { user_id: userId }).then(r => r.data);
export const reactivateUser = (userId) => api.post('/admin-panel/reactivate_user/', { user_id: userId }).then(r => r.data);
export const getAuditTrail = () => api.get('/admin-panel/audit_trail/').then(r => r.data);

export const deleteWorker = (id) => api.delete(`/workers/${id}/`);
export const deleteField = (id) => api.delete(`/fields/${id}/`);

export const deleteExpense = (id) => api.delete(`/expenses/${id}/`);

export const getFarmAssets = () => api.get('/farm-assets/').then(r => r.data);
export const createFarmAsset = (data) => api.post('/farm-assets/', data).then(r => r.data);
export const deleteFarmAsset = (id) => api.delete('/farm-assets/' + id + '/');

// Cattle
export const getCattle = () => api.get('/cattle/').then(r => r.data);
export const createCattle = (data) => api.post('/cattle/', data).then(r => r.data);
export const deleteCattle = (id) => api.delete(`/cattle/${id}/`);
export const getCattleHealth = (params) => api.get('/cattle-health/', { params }).then(r => r.data);
export const createCattleHealth = (data) => api.post('/cattle-health/', data).then(r => r.data);

// Goats
export const getGoats = () => api.get('/goats/').then(r => r.data);
export const createGoat = (data) => api.post('/goats/', data).then(r => r.data);
export const deleteGoat = (id) => api.delete(`/goats/${id}/`);
export const getGoatHealth = (params) => api.get('/goat-health/', { params }).then(r => r.data);
export const createGoatHealth = (data) => api.post('/goat-health/', data).then(r => r.data);

// Sheep
export const getSheep = () => api.get('/sheep/').then(r => r.data);
export const createSheep = (data) => api.post('/sheep/', data).then(r => r.data);
export const deleteSheep = (id) => api.delete(`/sheep/${id}/`);
export const getSheepHealth = (params) => api.get('/sheep-health/', { params }).then(r => r.data);
export const createSheepHealth = (data) => api.post('/sheep-health/', data).then(r => r.data);

// Pigs
export const getPigs = () => api.get('/pigs/').then(r => r.data);
export const createPig = (data) => api.post('/pigs/', data).then(r => r.data);
export const deletePig = (id) => api.delete(`/pigs/${id}/`);
export const getPigHealth = (params) => api.get('/pig-health/', { params }).then(r => r.data);
export const createPigHealth = (data) => api.post('/pig-health/', data).then(r => r.data);

// Broilers
export const getBroilerBatches = () => api.get('/broiler-batches/').then(r => r.data);
export const createBroilerBatch = (data) => api.post('/broiler-batches/', data).then(r => r.data);
export const deleteBroilerBatch = (id) => api.delete(`/broiler-batches/${id}/`);
export const getBroilerExpenses = (params) => api.get('/broiler-expenses/', { params }).then(r => r.data);
export const createBroilerExpense = (data) => api.post('/broiler-expenses/', data).then(r => r.data);

// Layers
export const getLayerFlocks = () => api.get('/layer-flocks/').then(r => r.data);
export const createLayerFlock = (data) => api.post('/layer-flocks/', data).then(r => r.data);
export const deleteLayerFlock = (id) => api.delete(`/layer-flocks/${id}/`);
export const getEggCollections = (params) => api.get('/egg-collections/', { params }).then(r => r.data);
export const createEggCollection = (data) => api.post('/egg-collections/', data).then(r => r.data);
export const getLayerExpenses = (params) => api.get('/layer-expenses/', { params }).then(r => r.data);
export const createLayerExpense = (data) => api.post('/layer-expenses/', data).then(r => r.data);

// Livestock Sales (shared)
export const getLivestockSales = (params) => api.get('/livestock-sales/', { params }).then(r => r.data);
export const createLivestockSale = (data) => api.post('/livestock-sales/', data).then(r => r.data);

// Harvests (yield tracking)
export const getHarvests = () => api.get('/harvests/').then(r => r.data);
export const createHarvest = (data) => api.post('/harvests/', data).then(r => r.data);
export const deleteHarvest = (id) => api.delete(`/harvests/${id}/`);

// Season Budgets
export const getSeasonBudgets = (season) => api.get('/season-budgets/', { params: season ? { season } : {} }).then(r => r.data);
export const createSeasonBudget = (data) => api.post('/season-budgets/', data).then(r => r.data);
export const updateSeasonBudget = (id, data) => api.patch(`/season-budgets/${id}/`, data).then(r => r.data);
export const deleteSeasonBudget = (id) => api.delete(`/season-budgets/${id}/`);

// Market Prices
export const getMarketPrices = () => api.get('/market-prices/').then(r => r.data);
export const createMarketPrice = (data) => api.post('/market-prices/', data).then(r => r.data);
export const deleteMarketPrice = (id) => api.delete(`/market-prices/${id}/`);

// Water Logs
export const getWaterLogs = () => api.get('/water-logs/').then(r => r.data);
export const createWaterLog = (data) => api.post('/water-logs/', data).then(r => r.data);
export const deleteWaterLog = (id) => api.delete(`/water-logs/${id}/`);

// Loans
export const getLoans = () => api.get('/loans/').then(r => r.data);
export const createLoan = (data) => api.post('/loans/', data).then(r => r.data);
export const updateLoan = (id, data) => api.patch(`/loans/${id}/`, data).then(r => r.data);
export const deleteLoan = (id) => api.delete(`/loans/${id}/`);

// Loan Repayments
export const getLoanRepayments = () => api.get('/loan-repayments/').then(r => r.data);
export const createLoanRepayment = (data) => api.post('/loan-repayments/', data).then(r => r.data);

// Analytics (Field Profitability, Enterprise Comparison, Cash Flow, Budget vs Actual)
export const getAnalytics = () => api.get('/analytics/').then(r => r.data);
export const getHealthScore = () => api.get('/analytics/health_score/').then(r => r.data);
export const getBriefing = () => api.get('/analytics/briefing/').then(r => r.data);
export const getAchievements = () => api.get('/analytics/achievements/').then(r => r.data);
export const getSeasonalComparison = () => api.get('/analytics/seasonal_comparison/').then(r => r.data);
