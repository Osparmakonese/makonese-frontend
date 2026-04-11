import api from './axios';

// Plans
export const getPlans = () => api.get('/billing/plans/').then(r => r.data);

// Current Plan
export const getCurrentPlan = () => api.get('/billing/billing/current_plan/').then(r => r.data);
export const changePlan = (data) => api.post('/billing/billing/change_plan/', data).then(r => r.data);

// Invoices
export const getInvoices = () => api.get('/billing/billing/invoices/').then(r => r.data);

// Usage
export const getUsage = () => api.get('/billing/billing/usage/').then(r => r.data);

// Payment methods — which providers are configured
export const getPaymentMethods = () => api.get('/billing/billing/payment_methods/').then(r => r.data);

// Initialize payment (multi-provider)
// body: { plan_slug, payment_method: 'card'|'ecocash'|'onemoney'|'mobile_money', phone_number? }
export const initializePayment = (data) =>
  api.post('/billing/billing/initialize_payment/', data).then(r => r.data);

// Verify payment status (for mobile money polling)
// body: { reference, provider: 'paynow'|'pesepay' }
export const verifyPayment = (data) =>
  api.post('/billing/billing/verify_payment/', data).then(r => r.data);

// Legacy: Paystack subscription
export const createSubscription = (data) =>
  api.post('/billing/billing/create_subscription/', data).then(r => r.data);
