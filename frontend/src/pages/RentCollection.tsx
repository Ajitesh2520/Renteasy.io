import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rentApi } from '../api/rentApi';
import { paymentApi } from '../api/paymentApi';
import { useTenants } from '../hooks/useTenants';
import RentStatusCard from '../components/RentStatusCard';
import PaymentUpload from '../components/PaymentUpload';
import type { RentCycle } from '../types/tenant';
import type { RecordPaymentPayload } from '../types/payment';
import { getCurrentMonthYear, formatMonthYear } from '../utils/dateUtils';
import { RefreshCw, Loader2, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RentCollection() {
  const queryClient = useQueryClient();
  const { month, year } = getCurrentMonthYear();
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentModal, setPaymentModal] = useState<RentCycle | null>(null);
  const [paymentForm, setPaymentForm] = useState({ amount: 0, method: 'cash' as const, transactionId: '', notes: '' });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const { data: cycles = [], isLoading } = useQuery({
    queryKey: ['rent-cycles', selectedMonth, selectedYear, statusFilter],
    queryFn: () => rentApi.getCycles({ month: selectedMonth, year: selectedYear, status: statusFilter || undefined }),
    select: r => r.data,
  });

  const generateMutation = useMutation({
    mutationFn: () => rentApi.generate(selectedMonth, selectedYear),
    onSuccess: (data) => {
      toast.success(`Generated ${data.data.created} rent cycles`);
      queryClient.invalidateQueries({ queryKey: ['rent-cycles'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to generate'),
  });

  const recordMutation = useMutation({
    mutationFn: (payload: RecordPaymentPayload) => paymentApi.record(payload),
    onSuccess: () => {
      toast.success('Payment recorded!');
      queryClient.invalidateQueries({ queryKey: ['rent-cycles'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      setPaymentModal(null);
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to record payment'),
  });

  const openPayment = (cycle: RentCycle) => {
    const balance = cycle.amountDue - cycle.amountPaid;
    setPaymentForm({ amount: balance, method: 'cash', transactionId: '', notes: '' });
    setReceiptFile(null);
    setPaymentModal(cycle);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModal) return;
    const tenant = typeof paymentModal.tenant === 'object' ? paymentModal.tenant._id : paymentModal.tenant;
    recordMutation.mutate({ tenant, rentCycle: paymentModal._id, ...paymentForm, receipt: receiptFile || undefined });
  };

  const months = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: new Date(2000, i, 1).toLocaleString('default', { month: 'long' }) }));
  const years = [year - 1, year, year + 1];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rent Collection</h1>
          <p className="text-slate-500 text-sm mt-1">{cycles.length} records for {formatMonthYear(selectedMonth, selectedYear)}</p>
        </div>
        <button
          onClick={() => generateMutation.mutate()}
          disabled={generateMutation.isPending}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          <RefreshCw size={15} className={generateMutation.isPending ? 'animate-spin' : ''} />
          Generate Cycles
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))} className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
        <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
          <option value="partial">Partial</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" /></div>
      ) : cycles.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="font-medium">No rent cycles found</p>
          <p className="text-sm mt-1">Click "Generate Cycles" to create rent records for this month</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cycles.map(c => <RentStatusCard key={c._id} cycle={c} onRecordPayment={openPayment} />)}
        </div>
      )}

      {paymentModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">Record Payment</h2>
              <p className="text-sm text-slate-500 mt-1">
                {typeof paymentModal.tenant === 'object' ? paymentModal.tenant.name : ''} · {formatMonthYear(paymentModal.month, paymentModal.year)}
              </p>
            </div>
            <form onSubmit={handleRecordPayment} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Amount (₹) *</label>
                <input required type="number" min="1" value={paymentForm.amount} onChange={e => setPaymentForm(f => ({ ...f, amount: Number(e.target.value) }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Payment Method *</label>
                <select value={paymentForm.method} onChange={e => setPaymentForm(f => ({ ...f, method: e.target.value as any }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="upi">UPI</option>
                  <option value="cheque">Cheque</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Transaction ID</label>
                <input value={paymentForm.transactionId} onChange={e => setPaymentForm(f => ({ ...f, transactionId: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Optional" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-2">Receipt (optional)</label>
                <PaymentUpload onFileSelect={setReceiptFile} />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setPaymentModal(null)} className="flex-1 border border-slate-200 rounded-lg py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={recordMutation.isPending} className="flex-1 bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
                  {recordMutation.isPending ? 'Saving...' : 'Record Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
