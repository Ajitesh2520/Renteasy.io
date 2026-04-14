import { useQuery } from '@tanstack/react-query';
import { rentApi } from '../api/rentApi';
import { formatCurrency, formatMonthYear } from '../utils/dateUtils';
import ReminderBanner from '../components/ReminderBanner';
import { Users, TrendingUp, AlertCircle, CheckCircle, Clock, IndianRupee } from 'lucide-react';

const StatCard = ({ label, value, sub, icon: Icon, color }: { label: string; value: string | number; sub?: string; icon: any; color: string }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-5">
    <div className="flex items-start justify-between mb-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
    <p className="text-2xl font-bold text-slate-900">{value}</p>
    <p className="text-sm text-slate-500 mt-0.5">{label}</p>
    {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
  </div>
);

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: () => rentApi.getSummary(),
    select: (r) => r.data,
    refetchInterval: 60_000,
  });

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const summary = data!;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">{formatMonthYear(summary.month, summary.year)} overview</p>
      </div>

      <ReminderBanner overdueCount={summary.overdue} pendingCount={summary.pending} />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Tenants" value={summary.totalTenants} icon={Users} color="bg-indigo-500" />
        <StatCard label="Total Due" value={formatCurrency(summary.totalDue)} sub="This month" icon={IndianRupee} color="bg-slate-500" />
        <StatCard label="Collected" value={formatCurrency(summary.totalCollected)} sub="This month" icon={TrendingUp} color="bg-emerald-500" />
        <StatCard label="Paid" value={summary.paid} sub="Tenants" icon={CheckCircle} color="bg-emerald-400" />
        <StatCard label="Pending" value={summary.pending} sub="Tenants" icon={Clock} color="bg-amber-500" />
        <StatCard label="Overdue" value={summary.overdue} sub="Tenants" icon={AlertCircle} color="bg-red-500" />
      </div>

      {/* Collection Progress */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-900 mb-4">Collection Progress</h2>
        <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
          <span>Collected</span>
          <span>{summary.totalDue > 0 ? Math.round((summary.totalCollected / summary.totalDue) * 100) : 0}%</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-700"
            style={{ width: `${summary.totalDue > 0 ? Math.min(100, (summary.totalCollected / summary.totalDue) * 100) : 0}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
          <span>{formatCurrency(summary.totalCollected)} collected</span>
          <span>{formatCurrency(summary.totalDue - summary.totalCollected)} remaining</span>
        </div>
      </div>
    </div>
  );
}
