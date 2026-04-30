import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { storage } from '@/lib/utils/storage';
import type { UserDto } from '../api/auth.api';

interface AuthState {
  token: string | null;
  user: UserDto | null;
  rememberMe: boolean;
  login: (token: string, user: UserDto) => void;
  logout: () => void;
  setUser: (user: UserDto) => void;
  setRememberMe: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      rememberMe: true,
      login: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      setUser: (user) => set({ user }),
      setRememberMe: (value) => set({ rememberMe: value }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => storage),
      partialize: (state) =>
        state.rememberMe
          ? { token: state.token, user: state.user, rememberMe: state.rememberMe }
          : { rememberMe: state.rememberMe },
    }
  )
);
