import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { importCertificates } from '../api/import-certificates-api';

export const useImportCertificatesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => importCertificates(formData),
  });
};
