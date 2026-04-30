import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';
import type { LoginFormValues } from '../types/auth.types';

export function useLogin() {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: (data: LoginFormValues) => authApi.login(data),
    onSuccess: ({ token, user }) => {
      login(token.accessToken, user);
      router.replace('/');
    },
  });
}
