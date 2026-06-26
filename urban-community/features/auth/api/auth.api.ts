import { apiClient } from '@/lib/api/axios';
import type { ApiResponse } from '@/types/api.types';
import type { LoginFormValues, RegisterFormValues } from '../types/auth.types';

export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Citizen' | 'Official' | 'Admin';
  neighborhoodId: string | null;
}

export interface LoginResponseDto {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'Citizen' | 'Official' | 'Admin';
  neighborhoodId: string | null;
}

export interface RegisterResponseDto {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export const authApi = {
  login: (data: LoginFormValues) =>
    apiClient
      .post<ApiResponse<LoginResponseDto>>('/api/auth/login', data)
      .then((res) => res.data.data),

  register: (data: RegisterFormValues) =>
    apiClient
      .post<ApiResponse<RegisterResponseDto>>('/api/auth/register', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      })
      .then((res) => res.data.data),

  logout: () => apiClient.post('/api/auth/logout'),

  me: () =>
    apiClient
      .get<ApiResponse<UserDto>>('/api/auth/me')
      .then((res) => res.data.data),
};
