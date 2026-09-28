import { useMutation } from '@tanstack/react-query';
import { verifyCertificate } from '../api/verify-certificate-api';

export const useVerifyCertificateMutation = () => {
  return useMutation({
    mutationFn: (code: string) => verifyCertificate(code),
  });
};
