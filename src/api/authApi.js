import api from './axios';

// 2FA
export const totpSetup = () => api.post('/core/auth/totp_setup/').then(r => r.data);
export const totpConfirm = (code) => api.post('/core/auth/totp_confirm/', { code }).then(r => r.data);
export const totpVerify = (code) => api.post('/core/auth/totp_verify/', { code }).then(r => r.data);
export const totpDisable = (password) => api.post('/core/auth/totp_disable/', { password }).then(r => r.data);
export const totpStatus = () => api.get('/core/auth/totp_status/').then(r => r.data);

// Password reset
export const requestPasswordReset = (email) =>
  api.post('/core/auth/password_reset_request/', { email }).then(r => r.data);
export const confirmPasswordReset = (token, new_password) =>
  api.post('/core/auth/password_reset_confirm/', { token, new_password }).then(r => r.data);

// Email verification
export const sendVerificationEmail = () =>
  api.post('/core/auth/send_verification_email/').then(r => r.data);
export const verifyEmailConfirm = (token) =>
  api.post('/core/auth/verify_email_confirm/', { token }).then(r => r.data);

// Change password (logged in)
export const changePassword = (current_password, new_password) =>
  api.post('/core/auth/change_password/', { current_password, new_password }).then(r => r.data);

// Data export
export const exportData = (format = 'json') =>
  api.get(`/core/export/?format=${format}`, { responseType: 'blob' }).then(r => r.data);

// Audit log
export const getAuditLog = (page = 1, limit = 50) =>
  api.get(`/core/audit/?page=${page}&limit=${limit}`).then(r => r.data);

// Billing extras
export const cancelSubscription = (module = 'farm') =>
  api.post('/billing/billing/cancel_subscription/', { module }).then(r => r.data);
export const requestRefund = (invoiceId) =>
  api.post(`/billing/billing/${invoiceId}/request-refund/`).then(r => r.data);
