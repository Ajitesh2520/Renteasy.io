import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantApi } from '../api/tenantApi';
import type { CreateTenantPayload } from '../types/tenant';
import toast from 'react-hot-toast';

export const useTenants = (activeOnly = true) => {
  return useQuery({
    queryKey: ['tenants', { activeOnly }],
    queryFn: () => tenantApi.getAll({ active: activeOnly }),
    select: (data) => data.data,
  });
};

export const useTenant = (id: string) => {
  return useQuery({
    queryKey: ['tenants', id],
    queryFn: () => tenantApi.getById(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};

export const useCreateTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTenantPayload) => tenantApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast.success('Tenant added successfully');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to add tenant'),
  });
};

export const useUpdateTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateTenantPayload> }) =>
      tenantApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast.success('Tenant updated successfully');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update tenant'),
  });
};

export const useDeactivateTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tenantApi.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast.success('Tenant deactivated');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to deactivate tenant'),
  });
};
