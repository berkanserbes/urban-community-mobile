import { apiClient } from '@/lib/api/axios';
import type { ApiResponse } from '@/types/api.types';

function unwrapApiData<T>(response: ApiResponse<T>): T {
  if (!response.isSuccess || response.data == null) {
    throw new Error(response.errors?.[0] ?? 'İşlem başarısız.');
  }

  return response.data;
}

export interface UserProfileDto {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  role: 'Citizen' | 'Official' | 'Admin';
  isActive: boolean;
  neighborhoodId: string | null;
  neighborhoodName: string | null;
  districtId: string | null;
  districtName: string | null;
  provinceId: string | null;
  provinceName: string | null;
  departmentId: string | null;
  departmentName: string | null;
  bio: string | null;
  profileImageUrl: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface UpdateProfileDto {
  firstName: string;
  lastName: string;
  bio?: string | null;
  phoneNumber?: string | null;
  neighborhoodId?: string | null;
}

export interface ChangePasswordDto {
  userId: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export const userApi = {
  getMe: () =>
    apiClient
      .get<ApiResponse<UserProfileDto>>('/api/users/me')
      .then((res) => unwrapApiData(res.data)),

  updateProfile: (data: UpdateProfileDto) =>
    apiClient
      .put<ApiResponse<UserProfileDto>>('/api/users/me/profile', data)
      .then((res) => unwrapApiData(res.data)),

  updateProfileImage: (imageUri: string, mimeType: string) => {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      name: 'profile.jpg',
      type: mimeType || 'image/jpeg',
    } as unknown as Blob);
    return apiClient
      .post<ApiResponse<{ userId: string; profileImageUrl: string }>>(
        '/api/users/me/profile-image',
        formData,
      )
      .then((res) => unwrapApiData(res.data));
  },

  deleteProfileImage: () =>
    apiClient
      .delete<ApiResponse<unknown>>('/api/users/me/profile-image')
      .then((res) => unwrapApiData(res.data)),

  changePassword: (data: ChangePasswordDto) =>
    apiClient
      .put<ApiResponse<unknown>>('/api/users/me/password', data)
      .then((res) => unwrapApiData(res.data)),
};
