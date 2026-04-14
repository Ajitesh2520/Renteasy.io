import { useState } from 'react';
import { useTenants, useCreateTenant, useDeactivateTenant, useUpdateTenant } from '../hooks/useTenants';
import TenantCard from '../components/TenantCard';
import type { Tenant, CreateTenantPayload } from '../types/tenant';
import { Plus, Search, Loader2 } from 'lucide-react';

const emptyForm: CreateTenantPayload = {
  name: '', phone: '', email: '', unit: '', property: '',
  monthlyRent: 0, securityDeposit: 0, leaseStart: '', rentDueDay: 1,
};

export default function Tenants() {
  const { data: tenants = [], isLoading } = useTenants();
  const createTenant = useCreateTenant();
  const updateTenant = useUpdateTenant();
  const deactivateTenant = useDeactivateTenant();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Tenant | null>(null);
  const [form, setForm] = useState<CreateTenantPayload>(emptyForm);

  const filtered = tenants.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.unit.toLowerCase().includes(search.toLowerCase()) ||
    t.phone.includes(search)
  );

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (tenant: Tenant) => {
    setEditing(tenant);
    setForm({ name: tenant.name, phone: tenant.phone, email: tenant.email || '', unit: tenant.unit,
      property: tenant.property || '', monthlyRent: tenant.monthlyRent, securityDeposit: tenant.securityDeposit,
      leaseStart: tenant.leaseStart.split('T')[0], rentDueDay: tenant.rentDueDay });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await updateTenant.mutateAsync({ id: editing._id, payload: form });
    } else {
      await createTenant.mutateAsync(form);
    }
    setModalOpen(false);
  };

  const Field = ({ label, ...props }: any) => (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      <input {...props} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tenants</h1>
          <p className="text-slate-500 text-sm mt-1">{tenants.length} active tenants</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          <Plus size={16} /> Add Tenant
        </button>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          placeholder="Search by name, unit, or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="font-medium">No tenants found</p>
          <p className="text-sm mt-1">Add your first tenant to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(t => (
            <TenantCard key={t._id} tenant={t} onEdit={openEdit} onDeactivate={id => deactivateTenant.mutate(id)} />
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">{editing ? 'Edit Tenant' : 'Add New Tenant'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Full Name *" required value={form.name} onChange={(e: any) => setForm(f => ({ ...f, name: e.target.value }))} />
                <Field label="Phone *" required value={form.phone} onChange={(e: any) => setForm(f => ({ ...f, phone: e.target.value }))} />
                <Field label="Email" type="email" value={form.email} onChange={(e: any) => setForm(f => ({ ...f, email: e.target.value }))} />
                <Field label="Unit / Flat *" required value={form.unit} onChange={(e: any) => setForm(f => ({ ...f, unit: e.target.value }))} />
                <Field label="Property Name" value={form.property} onChange={(e: any) => setForm(f => ({ ...f, property: e.target.value }))} />
                <Field label="Monthly Rent (₹) *" required type="number" min="0" value={form.monthlyRent} onChange={(e: any) => setForm(f => ({ ...f, monthlyRent: Number(e.target.value) }))} />
                <Field label="Security Deposit (₹)" type="number" min="0" value={form.securityDeposit} onChange={(e: any) => setForm(f => ({ ...f, securityDeposit: Number(e.target.value) }))} />
                <Field label="Rent Due Day" type="number" min="1" max="28" value={form.rentDueDay} onChange={(e: any) => setForm(f => ({ ...f, rentDueDay: Number(e.target.value) }))} />
                <Field label="Lease Start Date *" required type="date" value={form.leaseStart} onChange={(e: any) => setForm(f => ({ ...f, leaseStart: e.target.value }))} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 border border-slate-200 rounded-lg py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" disabled={createTenant.isPending || updateTenant.isPending} className="flex-1 bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
                  {editing ? 'Save Changes' : 'Add Tenant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
