import api from './axios';

// Tenant
export const getMyTenant = () => api.get('/core/tenants/my-tenant/').then(r => r.data);
export const updateMyTenant = (data) => api.patch('/core/tenants/my-tenant/update/', data).then(r => r.data);

// Tenant switching
export const getMyTenants = () => api.get('/core/tenants/my-tenants/').then(r => r.data);
export const switchTenant = (tenantId) => api.post('/core/tenants/switch/', { tenant_id: tenantId }).then(r => r.data);

// Usage stats
export const getUsageStats = () => api.get('/core/tenants/usage/').then(r => r.data);

// User management (owner)
export const getTenantUsers = () => api.get('/core/tenants/users/').then(r => r.data);
export const inviteUser = (data) => api.post('/core/tenants/invite/', data).then(r => r.data);
export const updateUserPermissions = (userId, data) =>
  api.patch(`/core/tenants/users/${userId}/permissions/`, data).then(r => r.data);
