import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { authApi } from '../api/auth.api';
import type { RegisterFormValues } from '../types/auth.types';

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterFormValues) => authApi.register(data),
    onSuccess: () => {
      router.replace('/(auth)/login');
    },
  });
}
