import type { Tenant } from '../types/tenant';
import { formatCurrency, formatDate } from '../utils/dateUtils';
import { Phone, Mail, Home, Calendar, MoreVertical, UserX } from 'lucide-react';
import { useState } from 'react';

interface Props {
  tenant: Tenant;
  onEdit?: (tenant: Tenant) => void;
  onDeactivate?: (id: string) => void;
}

export default function TenantCard({ tenant, onEdit, onDeactivate }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow relative">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-base">
            {tenant.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">{tenant.name}</h3>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{tenant.unit}</span>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
          >
            <MoreVertical size={16} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-10 w-36">
              {onEdit && (
                <button
                  onClick={() => { onEdit(tenant); setMenuOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Edit Details
                </button>
              )}
              {onDeactivate && (
                <button
                  onClick={() => { onDeactivate(tenant._id); setMenuOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Deactivate
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <Phone size={14} className="text-slate-400 flex-shrink-0" />
          <span>{tenant.phone}</span>
        </div>
        {tenant.email && (
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-slate-400 flex-shrink-0" />
            <span className="truncate">{tenant.email}</span>
          </div>
        )}
        {tenant.property && (
          <div className="flex items-center gap-2">
            <Home size={14} className="text-slate-400 flex-shrink-0" />
            <span>{tenant.property}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-slate-400 flex-shrink-0" />
          <span>Since {formatDate(tenant.leaseStart)}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-500">Monthly Rent</span>
        <span className="font-bold text-indigo-600 text-sm">{formatCurrency(tenant.monthlyRent)}</span>
      </div>

      {!tenant.isActive && (
        <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center">
          <div className="flex items-center gap-2 text-slate-400">
            <UserX size={18} />
            <span className="text-sm font-medium">Inactive</span>
          </div>
        </div>
      )}
    </div>
  );
}
