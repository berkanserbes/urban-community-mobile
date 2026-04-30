import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';
import type { RegisterFormValues } from '../types/auth.types';

export function useRegister() {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: ({ confirmPassword: _, ...data }: RegisterFormValues) =>
      authApi.register(data),
    onSuccess: ({ token, user }) => {
      login(token.accessToken, user);
      router.replace('/');
    },
  });
}
