import type { RentCycle } from '../types/tenant';
import { formatCurrency, formatMonthYear, formatDate } from '../utils/dateUtils';
import { CheckCircle, Clock, AlertCircle, MinusCircle } from 'lucide-react';

interface Props {
  cycle: RentCycle;
  onRecordPayment?: (cycle: RentCycle) => void;
}

const statusConfig = {
  paid: { label: 'Paid', color: 'text-emerald-600 bg-emerald-50', icon: CheckCircle, iconColor: 'text-emerald-500' },
  pending: { label: 'Pending', color: 'text-amber-600 bg-amber-50', icon: Clock, iconColor: 'text-amber-500' },
  overdue: { label: 'Overdue', color: 'text-red-600 bg-red-50', icon: AlertCircle, iconColor: 'text-red-500' },
  partial: { label: 'Partial', color: 'text-blue-600 bg-blue-50', icon: MinusCircle, iconColor: 'text-blue-500' },
  waived: { label: 'Waived', color: 'text-slate-600 bg-slate-100', icon: CheckCircle, iconColor: 'text-slate-400' },
};

export default function RentStatusCard({ cycle, onRecordPayment }: Props) {
  const tenant = typeof cycle.tenant === 'object' ? cycle.tenant : null;
  const config = statusConfig[cycle.status] || statusConfig.pending;
  const StatusIcon = config.icon;
  const balance = cycle.amountDue - cycle.amountPaid;

  return (
    <div className={`bg-white rounded-xl border p-4 ${cycle.status === 'overdue' ? 'border-red-200' : 'border-slate-200'}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-semibold text-slate-900 text-sm">{tenant?.name ?? 'Unknown'}</p>
          <p className="text-xs text-slate-500">{tenant?.unit} · {formatMonthYear(cycle.month, cycle.year)}</p>
        </div>
        <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${config.color}`}>
          <StatusIcon size={12} className={config.iconColor} />
          {config.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs mb-3">
        <div>
          <p className="text-slate-400 mb-0.5">Amount Due</p>
          <p className="font-semibold text-slate-700">{formatCurrency(cycle.amountDue)}</p>
        </div>
        <div>
          <p className="text-slate-400 mb-0.5">Paid</p>
          <p className="font-semibold text-emerald-600">{formatCurrency(cycle.amountPaid)}</p>
        </div>
        <div>
          <p className="text-slate-400 mb-0.5">Balance</p>
          <p className={`font-semibold ${balance > 0 ? 'text-red-500' : 'text-slate-400'}`}>{formatCurrency(balance)}</p>
        </div>
        <div>
          <p className="text-slate-400 mb-0.5">Due Date</p>
          <p className="font-semibold text-slate-700">{formatDate(cycle.dueDate)}</p>
        </div>
      </div>

      {cycle.status !== 'paid' && cycle.status !== 'waived' && onRecordPayment && (
        <button
          onClick={() => onRecordPayment(cycle)}
          className="w-full text-xs font-medium py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          Record Payment
        </button>
      )}
    </div>
  );
}
