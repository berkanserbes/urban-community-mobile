import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { storage } from '@/lib/utils/storage';
import type { UserDto } from '../api/auth.api';

export interface AuthSession {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

interface AuthState {
  token: string | null;
  accessTokenExpiresAt: string | null;
  refreshToken: string | null;
  refreshTokenExpiresAt: string | null;
  user: UserDto | null;
  rememberMe: boolean;
  login: (session: AuthSession, user: UserDto) => void;
  updateTokens: (session: AuthSession) => void;
  logout: () => void;
  setUser: (user: UserDto) => void;
  setRememberMe: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      accessTokenExpiresAt: null,
      refreshToken: null,
      refreshTokenExpiresAt: null,
      user: null,
      rememberMe: true,
      login: (session, user) =>
        set({
          token: session.accessToken,
          accessTokenExpiresAt: session.accessTokenExpiresAt,
          refreshToken: session.refreshToken,
          refreshTokenExpiresAt: session.refreshTokenExpiresAt,
          user,
        }),
      updateTokens: (session) =>
        set({
          token: session.accessToken,
          accessTokenExpiresAt: session.accessTokenExpiresAt,
          refreshToken: session.refreshToken,
          refreshTokenExpiresAt: session.refreshTokenExpiresAt,
        }),
      logout: () =>
        set({
          token: null,
          accessTokenExpiresAt: null,
          refreshToken: null,
          refreshTokenExpiresAt: null,
          user: null,
        }),
      setUser: (user) => set({ user }),
      setRememberMe: (value) => set({ rememberMe: value }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => storage),
      partialize: (state) =>
        state.rememberMe
          ? {
              token: state.token,
              accessTokenExpiresAt: state.accessTokenExpiresAt,
              refreshToken: state.refreshToken,
              refreshTokenExpiresAt: state.refreshTokenExpiresAt,
              user: state.user,
              rememberMe: state.rememberMe,
            }
          : { rememberMe: state.rememberMe },
    }
  )
);
