import { apiClient } from '@/lib/api/axios';
import { unwrapApiData } from '@/lib/api/result';
import type { ApiResponse } from '@/types/api.types';

export interface AnnouncementDto {
  id: string;
  title: string;
  content: string;
  userId: string;
  userFullName: string;
  scope: 'All' | 'Province' | 'District' | 'Neighborhood';
  provinceId: string | null;
  provinceName: string | null;
  districtId: string | null;
  districtName: string | null;
  neighborhoodId: string | null;
  neighborhoodName: string | null;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateAnnouncementDto {
  title: string;
  content: string;
  scope: 'All' | 'Province' | 'District' | 'Neighborhood';
  provinceId?: string | null;
  districtId?: string | null;
  neighborhoodId?: string | null;
  expiresAt?: string | null;
}

export const announcementApi = {
  getAnnouncements: (params: {
    provinceId?: string;
    districtId?: string;
    neighborhoodId?: string;
  }): Promise<AnnouncementDto[]> =>
    apiClient
      .get<ApiResponse<AnnouncementDto[]>>('/api/announcements', { params })
      .then((res) => unwrapApiData(res.data)),

  getAnnouncementById: (id: string): Promise<AnnouncementDto> =>
    apiClient
      .get<ApiResponse<AnnouncementDto>>(`/api/announcements/${id}`)
      .then((res) => unwrapApiData(res.data)),

  createAnnouncement: (data: CreateAnnouncementDto): Promise<AnnouncementDto> =>
    apiClient
      .post<ApiResponse<AnnouncementDto>>('/api/announcements', data)
      .then((res) => unwrapApiData(res.data)),
};
