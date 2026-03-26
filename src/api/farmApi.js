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
export const createStockItem = (data) => api.post('/stock/', data).then(r => r.data);
export const getStockUsage = () => api.get('/stock-usage/').then(r => r.data);
export const logStockUsage = (data) => api.post('/stock-usage/', data).then(r => r.data);

// Expenses
export const getExpenses = (fieldId) => api.get('/expenses/', { params: fieldId ? { field: fieldId } : {} }).then(r => r.data);
export const createExpense = (data) => api.post('/expenses/', data).then(r => r.data);

// Trips
export const getTrips = () => api.get('/trips/').then(r => r.data);
export const createTrip = (data) => api.post('/trips/', data).then(r => r.data);

// Income
export const getIncome = () => api.get('/income/').then(r => r.data);
export const createIncome = (data) => api.post('/income/', data).then(r => r.data);

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
  const res = await api.patch(`/trips/entries/${id}/`, data);
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