import { apiClient } from '@/lib/api/axios';
import { unwrapApiData } from '@/lib/api/result';
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
  mustChangePassword: boolean;
}

export interface RefreshTokenResponseDto {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'Citizen' | 'Official' | 'Admin';
  mustChangePassword: boolean;
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
      .then((res) => unwrapApiData(res.data)),

  register: (data: RegisterFormValues) =>
    apiClient
      .post<ApiResponse<RegisterResponseDto>>('/api/auth/register', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      })
      .then((res) => unwrapApiData(res.data)),

  refreshToken: (data: { accessToken: string; refreshToken: string }) =>
    apiClient
      .post<ApiResponse<RefreshTokenResponseDto>>('/api/auth/refresh-token', data)
      .then((res) => unwrapApiData(res.data)),

  logout: (refreshToken: string) =>
    apiClient
      .post<ApiResponse<unknown>>('/api/auth/logout', { refreshToken })
      .then((res) => unwrapApiData(res.data)),

  me: () =>
    apiClient
      .get<ApiResponse<UserDto>>('/api/users/me')
      .then((res) => unwrapApiData(res.data)),
};
