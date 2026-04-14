import axiosClient from './axiosClient';
import type { Tenant, CreateTenantPayload } from '../types/tenant';
import type { ApiResponse } from '../types/payment';

export const tenantApi = {
  getAll: (params?: { active?: boolean }) =>
    axiosClient.get<ApiResponse<Tenant[]>>('/tenants', { params }).then((r) => r.data),

  getById: (id: string) =>
    axiosClient.get<ApiResponse<Tenant>>(`/tenants/${id}`).then((r) => r.data),

  create: (payload: CreateTenantPayload) =>
    axiosClient.post<ApiResponse<Tenant>>('/tenants', payload).then((r) => r.data),

  update: (id: string, payload: Partial<CreateTenantPayload>) =>
    axiosClient.put<ApiResponse<Tenant>>(`/tenants/${id}`, payload).then((r) => r.data),

  deactivate: (id: string) =>
    axiosClient.delete<ApiResponse<null>>(`/tenants/${id}`).then((r) => r.data),
};
