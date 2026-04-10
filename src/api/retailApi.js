import api from './axios';

// Categories
export const getCategories = () => api.get('/retail/categories/').then(r => r.data);
export const createCategory = (data) => api.post('/retail/categories/', data).then(r => r.data);
export const updateCategory = (id, data) => api.patch(`/retail/categories/${id}/`, data).then(r => r.data);
export const deleteCategory = (id) => api.delete(`/retail/categories/${id}/`);

// Products
export const getProducts = () => api.get('/retail/products/').then(r => r.data);
export const createProduct = (data) => api.post('/retail/products/', data).then(r => r.data);
export const updateProduct = (id, data) => api.patch(`/retail/products/${id}/`, data).then(r => r.data);
export const deleteProduct = (id) => api.delete(`/retail/products/${id}/`);

// Product Insights
export const getLowStockProducts = () => api.get('/retail/products/low_stock/').then(r => r.data);
export const getExpiringProducts = () => api.get('/retail/products/expiring_soon/').then(r => r.data);

// Barcode Lookup
export const barcodeLookup = (barcode) => api.get('/retail/products/barcode_lookup/', { params: { barcode } }).then(r => r.data);

// Stock Adjustments
export const getStockAdjustments = () => api.get('/retail/stock-adjustments/').then(r => r.data);
export const createStockAdjustment = (data) => api.post('/retail/stock-adjustments/', data).then(r => r.data);

// Cashier Sessions
export const getCashierSessions = () => api.get('/retail/cashier-sessions/').then(r => r.data);
export const createCashierSession = (data) => api.post('/retail/cashier-sessions/', data).then(r => r.data);
export const closeCashierSession = (id, data) => api.post(`/retail/cashier-sessions/${id}/close/`, data).then(r => r.data);

// Sales
export const getSales = () => api.get('/retail/sales/').then(r => r.data);
export const createSale = (data) => api.post('/retail/sales/', data).then(r => r.data);

// Sales Insights
export const getDailySummary = () => api.get('/retail/sales/daily_summary/').then(r => r.data);

// Receipt
export const getReceipt = (id) => api.get(`/retail/sales/${id}/receipt/`).then(r => r.data);
