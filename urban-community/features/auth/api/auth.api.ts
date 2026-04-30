import { apiClient } from '@/lib/api/axios';
import type { ApiResponse } from '@/types/api.types';
import type { LoginFormValues, RegisterFormValues } from '../types/auth.types';

export interface AuthTokenDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Citizen' | 'Official' | 'Admin';
  neighborhoodId: string | null;
}

export interface LoginResponseDto {
  token: AuthTokenDto;
  user: UserDto;
}

export const authApi = {
  login: (data: LoginFormValues) =>
    apiClient
      .post<ApiResponse<LoginResponseDto>>('/api/auth/login', data)
      .then((res) => res.data.data),

  register: (data: Omit<RegisterFormValues, 'confirmPassword'>) =>
    apiClient
      .post<ApiResponse<LoginResponseDto>>('/api/auth/register', data)
      .then((res) => res.data.data),

  logout: () => apiClient.post('/api/auth/logout'),

  me: () =>
    apiClient
      .get<ApiResponse<UserDto>>('/api/auth/me')
      .then((res) => res.data.data),
};
