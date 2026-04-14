import type { Tenant, RentCycle } from './tenant';

export type PaymentMethod = 'cash' | 'bank_transfer' | 'upi' | 'cheque' | 'other';

export interface Payment {
  _id: string;
  tenant: Tenant | string;
  rentCycle: RentCycle | string;
  amount: number;
  method: PaymentMethod;
  paidAt: string;
  receiptUrl?: string;
  transactionId?: string;
  notes?: string;
  recordedBy: { _id: string; name: string } | string;
  createdAt: string;
  updatedAt: string;
}

export interface RecordPaymentPayload {
  tenant: string;
  rentCycle: string;
  amount: number;
  method: PaymentMethod;
  paidAt?: string;
  transactionId?: string;
  notes?: string;
  receipt?: File;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
  total?: number;
  page?: number;
}
