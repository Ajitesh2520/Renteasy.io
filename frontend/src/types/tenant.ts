export interface Tenant {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  unit: string;
  property?: string;
  monthlyRent: number;
  securityDeposit: number;
  leaseStart: string;
  leaseEnd?: string;
  rentDueDay: number;
  isActive: boolean;
  notes?: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTenantPayload {
  name: string;
  phone: string;
  email?: string;
  unit: string;
  property?: string;
  monthlyRent: number;
  securityDeposit?: number;
  leaseStart: string;
  leaseEnd?: string;
  rentDueDay?: number;
  notes?: string;
}

export interface RentCycle {
  _id: string;
  tenant: Tenant | string;
  month: number;
  year: number;
  amountDue: number;
  amountPaid: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'partial' | 'waived';
  reminderSent: boolean;
  reminderSentAt?: string;
  notes?: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSummary {
  totalTenants: number;
  totalDue: number;
  totalCollected: number;
  pending: number;
  paid: number;
  overdue: number;
  month: number;
  year: number;
}
