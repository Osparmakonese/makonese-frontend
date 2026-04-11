import api from './axios';

// Tenant
export const getMyTenant = () => api.get('/core/tenants/my-tenant/').then(r => r.data);
export const updateMyTenant = (data) => api.patch('/core/tenants/my-tenant/update/', data).then(r => r.data);
