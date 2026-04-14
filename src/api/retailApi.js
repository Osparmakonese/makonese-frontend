import api from './axios';

// ── Categories ──
export const getCategories = () => api.get('/retail/categories/').then(r => r.data);
export const createCategory = (data) => api.post('/retail/categories/', data).then(r => r.data);
export const updateCategory = (id, data) => api.patch(`/retail/categories/${id}/`, data).then(r => r.data);
export const deleteCategory = (id) => api.delete(`/retail/categories/${id}/`);

// ── Products ──
export const getProducts = () => api.get('/retail/products/').then(r => r.data);
export const createProduct = (data) => api.post('/retail/products/', data).then(r => r.data);
export const updateProduct = (id, data) => api.patch(`/retail/products/${id}/`, data).then(r => r.data);
export const deleteProduct = (id) => api.delete(`/retail/products/${id}/`);
export const getLowStockProducts = () => api.get('/retail/products/low_stock/').then(r => r.data);
export const getExpiringProducts = () => api.get('/retail/products/expiring_soon/').then(r => r.data);
export const barcodeLookup = (barcode) => api.get('/retail/products/barcode_lookup/', { params: { barcode } }).then(r => r.data);

// ── Stock Adjustments ──
export const getStockAdjustments = () => api.get('/retail/stock-adjustments/').then(r => r.data);
export const createStockAdjustment = (data) => api.post('/retail/stock-adjustments/', data).then(r => r.data);

// ── Cashier Sessions ──
export const getCashierSessions = () => api.get('/retail/cashier-sessions/').then(r => r.data);
export const createCashierSession = (data) => api.post('/retail/cashier-sessions/', data).then(r => r.data);
export const closeCashierSession = (id, data) => api.post(`/retail/cashier-sessions/${id}/close/`, data).then(r => r.data);

// ── Sales ──
export const getSales = () => api.get('/retail/sales/').then(r => r.data);
export const createSale = (data) => api.post('/retail/sales/', data).then(r => r.data);
export const getDailySummary = () => api.get('/retail/sales/daily_summary/').then(r => r.data);
export const getReceipt = (id) => api.get(`/retail/sales/${id}/receipt/`).then(r => r.data);
export const getRetailReport = (params) => api.get('/retail/sales/retail_report/', { params }).then(r => r.data);

// ── Customers ──
export const getCustomers = (search) => api.get('/retail/customers/', { params: search ? { search } : {} }).then(r => r.data);
export const createCustomer = (data) => api.post('/retail/customers/', data).then(r => r.data);
export const updateCustomer = (id, data) => api.patch(`/retail/customers/${id}/`, data).then(r => r.data);
export const deleteCustomer = (id) => api.delete(`/retail/customers/${id}/`);
export const getTopCustomers = () => api.get('/retail/customers/top_customers/').then(r => r.data);
export const getCustomerHistory = (id) => api.get(`/retail/customers/${id}/purchase_history/`).then(r => r.data);

// ── Returns & Refunds ──
export const getReturns = () => api.get('/retail/returns/').then(r => r.data);
export const createReturn = (data) => api.post('/retail/returns/', data).then(r => r.data);
export const approveReturn = (id) => api.post(`/retail/returns/${id}/approve/`).then(r => r.data);
export const completeReturn = (id) => api.post(`/retail/returns/${id}/complete/`).then(r => r.data);
export const getReturnsSummary = () => api.get('/retail/returns/summary/').then(r => r.data);

// ── Suppliers ──
export const getSuppliers = () => api.get('/retail/suppliers/').then(r => r.data);
export const createSupplier = (data) => api.post('/retail/suppliers/', data).then(r => r.data);
export const updateSupplier = (id, data) => api.patch(`/retail/suppliers/${id}/`, data).then(r => r.data);
export const deleteSupplier = (id) => api.delete(`/retail/suppliers/${id}/`);

// ── Purchase Orders ──
export const getPurchaseOrders = (params) => api.get('/retail/purchase-orders/', { params }).then(r => r.data);
export const createPurchaseOrder = (data) => api.post('/retail/purchase-orders/', data).then(r => r.data);
export const updatePurchaseOrder = (id, data) => api.patch(`/retail/purchase-orders/${id}/`, data).then(r => r.data);
export const receivePurchaseOrder = (id) => api.post(`/retail/purchase-orders/${id}/receive/`).then(r => r.data);

// ── Discounts & Promotions ──
export const getDiscounts = (params) => api.get('/retail/discounts/', { params }).then(r => r.data);
export const createDiscount = (data) => api.post('/retail/discounts/', data).then(r => r.data);
export const updateDiscount = (id, data) => api.patch(`/retail/discounts/${id}/`, data).then(r => r.data);
export const deleteDiscount = (id) => api.delete(`/retail/discounts/${id}/`);
export const validateDiscountCode = (code) => api.get('/retail/discounts/validate_code/', { params: { code } }).then(r => r.data);

// ── Journal Entries ──
export const getJournalEntries = (params) => api.get('/retail/journal-entries/', { params }).then(r => r.data);
export const createJournalEntry = (data) => api.post('/retail/journal-entries/', data).then(r => r.data);
export const getTrialBalance = () => api.get('/retail/journal-entries/trial_balance/').then(r => r.data);

// ── Payroll ──
export const getPayrollRuns = () => api.get('/retail/payroll-runs/').then(r => r.data);
export const createPayrollRun = (data) => api.post('/retail/payroll-runs/', data).then(r => r.data);
export const approvePayrollRun = (id) => api.post(`/retail/payroll-runs/${id}/approve/`).then(r => r.data);
export const markPayrollPaid = (id) => api.post(`/retail/payroll-runs/${id}/mark_paid/`).then(r => r.data);
export const getPayrollLines = (runId) => api.get('/retail/payroll-lines/', { params: runId ? { run: runId } : {} }).then(r => r.data);
export const createPayrollLine = (data) => api.post('/retail/payroll-lines/', data).then(r => r.data);

// ── Currency Rates ──
export const getCurrencyRates = () => api.get('/retail/currency-rates/').then(r => r.data);
export const createCurrencyRate = (data) => api.post('/retail/currency-rates/', data).then(r => r.data);
export const getLatestRates = () => api.get('/retail/currency-rates/latest/').then(r => r.data);

// ── Loyalty Program ──
export const getLoyaltyMembers = (params) => api.get('/retail/loyalty-members/', { params }).then(r => r.data);
export const createLoyaltyMember = (data) => api.post('/retail/loyalty-members/', data).then(r => r.data);
export const getLoyaltyStats = () => api.get('/retail/loyalty-members/stats/').then(r => r.data);
export const getLoyaltyTransactions = (params) => api.get('/retail/loyalty-transactions/', { params }).then(r => r.data);
export const createLoyaltyTransaction = (data) => api.post('/retail/loyalty-transactions/', data).then(r => r.data);

// ── Receipt Templates ──
export const getReceiptTemplates = () => api.get('/retail/receipt-templates/').then(r => r.data);
export const createReceiptTemplate = (data) => api.post('/retail/receipt-templates/', data).then(r => r.data);
export const updateReceiptTemplate = (id, data) => api.patch(`/retail/receipt-templates/${id}/`, data).then(r => r.data);

// ── Device Profiles ──
export const getDeviceProfiles = (deviceType) => api.get('/retail/device-profiles/', { params: deviceType ? { device_type: deviceType } : {} }).then(r => r.data);
export const createDeviceProfile = (data) => api.post('/retail/device-profiles/', data).then(r => r.data);
export const updateDeviceProfile = (id, data) => api.patch(`/retail/device-profiles/${id}/`, data).then(r => r.data);
export const deleteDeviceProfile = (id) => api.delete(`/retail/device-profiles/${id}/`);
export const testDevice = (id) => api.post(`/retail/device-profiles/${id}/test_device/`).then(r => r.data);
export const setDefaultDevice = (id) => api.post(`/retail/device-profiles/${id}/set_default/`).then(r => r.data);
export const getDeviceSummary = () => api.get('/retail/device-profiles/summary/').then(r => r.data);

// ── Print Bridge ──
export const getPrintBridgeStatus = () => api.get('/retail/print-bridge/status/').then(r => r.data);
export const sendPrintBridgeHeartbeat = (data) => api.post('/retail/print-bridge/heartbeat/', data).then(r => r.data);

// ── ZIMRA Fiscal ──
export const getZimraDevices = () => api.get('/retail/zimra-devices/').then(r => r.data);
export const createZimraDevice = (data) => api.post('/retail/zimra-devices/', data).then(r => r.data);
export const updateZimraDevice = (id, data) => api.patch(`/retail/zimra-devices/${id}/`, data).then(r => r.data);
export const getZReports = () => api.get('/retail/z-reports/').then(r => r.data);
export const generateZReport = () => api.post('/retail/z-reports/generate/').then(r => r.data);

// ── Fiscal Queue ──
export const getFiscalQueue = (queueStatus) => api.get('/retail/fiscal-queue/', { params: queueStatus ? { status: queueStatus } : {} }).then(r => r.data);
export const retryFiscalItem = (id) => api.post(`/retail/fiscal-queue/${id}/retry/`).then(r => r.data);
export const getFiscalQueueStats = () => api.get('/retail/fiscal-queue/stats/').then(r => r.data);

// ── Analytics ──
export const getRetailDashboard = () => api.get('/retail/analytics/dashboard/').then(r => r.data);
export const getEndOfDayReport = (date) => api.get('/retail/analytics/end_of_day/', { params: date ? { date } : {} }).then(r => r.data);
export const getCashierPerformance = (days) => api.get('/retail/analytics/cashier_performance/', { params: days ? { days } : {} }).then(r => r.data);
export const getProfitMargins = () => api.get('/retail/analytics/profit_margins/').then(r => r.data);

// ── POS Settings (singleton per tenant) ──
export const getPOSSettings = () => api.get('/retail/pos-settings/').then(r => r.data);
export const updatePOSSettings = (data) => api.put('/retail/pos-settings/', data).then(r => r.data);
