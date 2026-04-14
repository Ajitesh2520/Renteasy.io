import { useQuery } from '@tanstack/react-query';
import { paymentApi } from '../api/paymentApi';
import { formatDate, formatCurrency } from '../utils/dateUtils';
import type { Payment } from '../types/payment';
import { Receipt, ExternalLink, Loader2 } from 'lucide-react';

const methodLabels: Record<string, string> = {
  cash: 'Cash', bank_transfer: 'Bank Transfer', upi: 'UPI', cheque: 'Cheque', other: 'Other',
};

const methodColors: Record<string, string> = {
  cash: 'bg-green-100 text-green-700',
  bank_transfer: 'bg-blue-100 text-blue-700',
  upi: 'bg-purple-100 text-purple-700',
  cheque: 'bg-amber-100 text-amber-700',
  other: 'bg-slate-100 text-slate-600',
};

export default function PaymentHistory() {
  const { data, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: () => paymentApi.getAll({ limit: 50 }),
    select: r => r.data,
  });

  const payments: Payment[] = data ?? [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Payment History</h1>
        <p className="text-slate-500 text-sm mt-1">{payments.length} payments recorded</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" /></div>
      ) : payments.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <Receipt size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No payments recorded yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Tenant</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Period</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Amount</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Method</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map(payment => {
                  const tenant = typeof payment.tenant === 'object' ? payment.tenant : null;
                  const cycle = typeof payment.rentCycle === 'object' ? payment.rentCycle : null;
                  return (
                    <tr key={payment._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-900">{tenant?.name ?? '—'}</p>
                        <p className="text-xs text-slate-400">{tenant?.unit ?? ''}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {cycle ? `${new Date(2000, cycle.month - 1, 1).toLocaleString('default', { month: 'short' })} ${cycle.year}` : '—'}
                      </td>
                      <td className="px-5 py-4 font-semibold text-emerald-600">{formatCurrency(payment.amount)}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${methodColors[payment.method] ?? methodColors.other}`}>
                          {methodLabels[payment.method] ?? payment.method}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{formatDate(payment.paidAt)}</td>
                      <td className="px-5 py-4">
                        {payment.receiptUrl ? (
                          <a href={`http://localhost:5000${payment.receiptUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-xs font-medium">
                            <ExternalLink size={13} /> View
                          </a>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
