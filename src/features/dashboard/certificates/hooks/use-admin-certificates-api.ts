import { useQuery } from '@tanstack/react-query';
import { getAdminCertificates } from '../api/admin-certificates-api';
import { GetAdminCertificatesParams } from '../lib/types/admin-certificates-types';

export const adminCertificatesQueryKeys = {
  all: ['admin-certificates'] as const,
  list: (params: GetAdminCertificatesParams) => ['admin-certificates', 'list', params] as const,
};

export const useGetAdminCertificatesQuery = (params: GetAdminCertificatesParams) => {
  return useQuery({
    queryKey: adminCertificatesQueryKeys.list(params),
    queryFn: () => getAdminCertificates(params),
  });
};
