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

// Paystack payment
export const initializePayment = (planSlug) =>
  api.post('/billing/billing/initialize_payment/', { plan_slug: planSlug }).then(r => r.data);

export const createSubscription = (data) =>
  api.post('/billing/billing/create_subscription/', data).then(r => r.data);
