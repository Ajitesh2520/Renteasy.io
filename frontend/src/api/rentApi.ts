import axiosClient from './axiosClient';
import type { RentCycle, DashboardSummary } from '../types/tenant';
import type { ApiResponse } from '../types/payment';

export const rentApi = {
  getCycles: (params?: { month?: number; year?: number; status?: string; tenantId?: string }) =>
    axiosClient.get<ApiResponse<RentCycle[]>>('/rent', { params }).then((r) => r.data),

  generate: (month: number, year: number) =>
    axiosClient.post<ApiResponse<{ created: number; skipped: number }>>('/rent', { month, year }).then((r) => r.data),

  updateStatus: (id: string, status: string) =>
    axiosClient.patch<ApiResponse<RentCycle>>(`/rent/${id}/status`, { status }).then((r) => r.data),

  getSummary: () =>
    axiosClient.get<ApiResponse<DashboardSummary>>('/rent/summary').then((r) => r.data),
};
