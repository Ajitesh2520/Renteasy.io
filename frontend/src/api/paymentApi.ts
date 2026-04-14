import axiosClient from './axiosClient';
import type { Payment, RecordPaymentPayload } from '../types/payment';
import type { ApiResponse } from '../types/payment';

export const paymentApi = {
  getAll: (params?: { tenantId?: string; rentCycleId?: string; page?: number; limit?: number }) =>
    axiosClient.get<ApiResponse<Payment[]>>('/payments', { params }).then((r) => r.data),

  getById: (id: string) =>
    axiosClient.get<ApiResponse<Payment>>(`/payments/${id}`).then((r) => r.data),

  record: (payload: RecordPaymentPayload) => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value instanceof File ? value : String(value));
      }
    });
    return axiosClient
      .post<ApiResponse<Payment>>('/payments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },
};
