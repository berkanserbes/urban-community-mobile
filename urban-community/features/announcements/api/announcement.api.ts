import { apiClient } from '@/lib/api/axios';
import type { ApiResponse } from '@/types/api.types';

export interface AnnouncementDto {
  id: string;
  title: string;
  content: string;
  userId: string;
  publisherFullName: string;
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
      .then((res) => res.data.data),

  getAnnouncementById: (id: string): Promise<AnnouncementDto> =>
    apiClient
      .get<ApiResponse<AnnouncementDto>>(`/api/announcements/${id}`)
      .then((res) => res.data.data),

  createAnnouncement: (data: CreateAnnouncementDto): Promise<AnnouncementDto> =>
    apiClient
      .post<ApiResponse<AnnouncementDto>>('/api/announcements', data)
      .then((res) => res.data.data),
};
