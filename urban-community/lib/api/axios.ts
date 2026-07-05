import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse } from '@/types/api.types';
import { useAuthStore, type AuthSession } from '@/features/auth/store/auth.store';
import { unwrapApiData } from './result';
import { queryClient } from './query-client';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:5000';
const API_TIMEOUT = Number(process.env.EXPO_PUBLIC_API_TIMEOUT) || 10000;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

interface RefreshTokenResponse {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

let refreshPromise: Promise<string> | null = null;

function isExpired(expiresAt: string | null) {
  if (!expiresAt) return true;
  const time = Date.parse(expiresAt);
  return Number.isNaN(time) || time <= Date.now();
}

function clearSession() {
  useAuthStore.getState().logout();
  queryClient.clear();
}

function shouldSkipRefresh(url?: string) {
  if (!url) return true;
  return (
    url.includes('/api/auth/login') ||
    url.includes('/api/auth/register') ||
    url.includes('/api/auth/refresh-token') ||
    url.includes('/api/auth/logout')
  );
}

async function refreshAccessToken() {
  if (refreshPromise) {
    return refreshPromise;
  }

  const { token, refreshToken, refreshTokenExpiresAt, updateTokens } = useAuthStore.getState();

  if (!token || !refreshToken || isExpired(refreshTokenExpiresAt)) {
    clearSession();
    throw new Error('Session expired');
  }

  refreshPromise = refreshClient
    .post<ApiResponse<RefreshTokenResponse>>('/api/auth/refresh-token', {
      accessToken: token,
      refreshToken,
    })
    .then((response) => {
      const data = unwrapApiData(response.data, 'Session expired');
      const session: AuthSession = {
        accessToken: data.accessToken,
        accessTokenExpiresAt: data.accessTokenExpiresAt,
        refreshToken: data.refreshToken,
        refreshTokenExpiresAt: data.refreshTokenExpiresAt,
      };
      updateTokens(session);
      return session.accessToken;
    })
    .catch((error) => {
      clearSession();
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // React Native'de Axios, FormData gönderilirken default 'application/json'
  // Content-Type'ını otomatik kaldırmaz. Manuel silmemiz gerekiyor;
  // böylece native XHR 'multipart/form-data; boundary=...' header'ını kendisi ekler.
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      shouldSkipRefresh(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const token = await refreshAccessToken();
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return apiClient(originalRequest);
    } catch {
      return Promise.reject(error);
    }
  }
);
