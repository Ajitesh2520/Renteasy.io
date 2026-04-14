import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

interface Props {
  overdueCount: number;
  pendingCount: number;
}

export default function ReminderBanner({ overdueCount, pendingCount }: Props) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || (overdueCount === 0 && pendingCount === 0)) return null;

  const isUrgent = overdueCount > 0;

  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl mb-6 ${isUrgent ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'}`}>
      <AlertTriangle size={18} className={`flex-shrink-0 mt-0.5 ${isUrgent ? 'text-red-500' : 'text-amber-500'}`} />
      <div className="flex-1 text-sm">
        {overdueCount > 0 && (
          <p className="font-semibold text-red-700">
            {overdueCount} tenant{overdueCount > 1 ? 's have' : ' has'} overdue rent
          </p>
        )}
        {pendingCount > 0 && (
          <p className={`${overdueCount > 0 ? 'text-red-600' : 'font-semibold text-amber-700'}`}>
            {pendingCount} payment{pendingCount > 1 ? 's' : ''} still pending this month
          </p>
        )}
      </div>
      <button
        onClick={() => setDismissed(true)}
        className={`flex-shrink-0 ${isUrgent ? 'text-red-400 hover:text-red-600' : 'text-amber-400 hover:text-amber-600'}`}
      >
        <X size={16} />
      </button>
    </div>
  );
}
