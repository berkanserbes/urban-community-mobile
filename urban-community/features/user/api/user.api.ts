import { apiClient } from '@/lib/api/axios';
import type { ApiResponse } from '@/types/api.types';

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
      .then((res) => res.data.data),

  updateProfile: (data: UpdateProfileDto) =>
    apiClient
      .put<ApiResponse<UserProfileDto>>('/api/users/me/profile', data)
      .then((res) => res.data.data),

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
      .then((res) => res.data.data);
  },

  deleteProfileImage: () => apiClient.delete('/api/users/me/profile-image'),

  changePassword: (data: ChangePasswordDto) =>
    apiClient.put('/api/users/me/password', data).then((res) => res.data),
};
