import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { storage } from '@/lib/utils/storage';
import type { UserDto } from '../api/auth.api';

interface AuthState {
  token: string | null;
  user: UserDto | null;
  login: (token: string, user: UserDto) => void;
  logout: () => void;
  setUser: (user: UserDto) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => storage),
    }
  )
);
