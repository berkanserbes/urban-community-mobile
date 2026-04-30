import axios from 'axios';
import { useAuthStore } from '@/features/auth';

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:5000',
  timeout: Number(process.env.EXPO_PUBLIC_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
