import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../api/register';
import { RegisterFormData } from '../libs/schema/register-schema';

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (data: RegisterFormData) => registerUser(data),
  });
};
