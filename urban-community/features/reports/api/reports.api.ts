import { apiClient } from '@/lib/api/axios';
import type { ApiResponse } from '@/types/api.types';

export type ReportStatus =
  | 'PendingReview'
  | 'AiReview'
  | 'Confirmed'
  | 'InProgress'
  | 'Resolved'
  | 'Rejected';

export type ReportPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type MediaType = 'Image' | 'Video';

export interface ReportListItem {
  id: string;
  title: string;
  description: string;
  status: ReportStatus;
  priority: ReportPriority;
  latitude: number | null;
  longitude: number | null;
  userId: string;
  reporterName: string;
  categoryId: string;
  categoryName: string;
  neighborhoodId: string;
  neighborhoodName: string;
  assignedOrganizationDepartmentId: string | null;
  assignedOrganizationId: string | null;
  assignedOrganizationName: string | null;
  assignedDepartmentId: string | null;
  assignedDepartmentName: string | null;
  assignedDepartmentContactEmail: string | null;
  assignedDepartmentContactPhone: string | null;
  assignmentNeedsReview: boolean;
  createdAt: string;
  resolvedAt: string | null;
}

export interface ReportMediaDto {
  id: string;
  url: string;
  thumbnailUrl: string | null;
  originalFileName: string | null;
  contentType: string | null;
  fileSizeBytes: number | null;
  displayOrder: number;
  mediaType: MediaType;
}

export interface ReportHistoryDto {
  id: string;
  fromStatus: ReportStatus;
  toStatus: ReportStatus;
  note: string | null;
  changedByUserId: string | null;
  changedByUserFullName: string | null;
  changedAt: string;
}

export interface SimilarReportDto {
  reportId: string;
  title: string;
  status: ReportStatus;
  similarityScore: number;
  reasoning: string;
}

export interface ReportDetail {
  id: string;
  title: string;
  description: string;
  status: ReportStatus;
  priority: ReportPriority;
  latitude: number | null;
  longitude: number | null;
  userId: string;
  userFullName: string;
  categoryId: string;
  categoryName: string;
  neighborhoodId: string;
  neighborhoodName: string;
  assignedOrganizationDepartmentId: string | null;
  assignedOrganizationId: string | null;
  assignedOrganizationName: string | null;
  assignedDepartmentId: string | null;
  assignedDepartmentName: string | null;
  assignedDepartmentContactEmail: string | null;
  assignedDepartmentContactPhone: string | null;
  assignmentNeedsReview: boolean;
  media: ReportMediaDto[];
  history: ReportHistoryDto[];
  similarReports: SimilarReportDto[];
  createdAt: string;
  updatedAt: string | null;
  resolvedAt: string | null;
}

export interface CategoryDto {
  id: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
}

export interface CreateReportData {
  title: string;
  description: string;
  suggestedCategoryId?: string;
  neighborhoodId: string;
  latitude?: number;
  longitude?: number;
  media?: { uri: string; type: string; name: string }[];
}

export const reportsApi = {
  getReports: (params: {
    neighborhoodId?: string;
    status?: ReportStatus;
    categoryId?: string;
    userId?: string;
  }): Promise<ReportListItem[]> =>
    apiClient
      .get<ApiResponse<ReportListItem[]>>('/api/reports', { params })
      .then((res) => res.data.data),

  getMyReports: (): Promise<ReportListItem[]> =>
    apiClient
      .get<ApiResponse<ReportListItem[]>>('/api/reports/mine')
      .then((res) => res.data.data),

  getReportById: (id: string): Promise<ReportDetail> =>
    apiClient
      .get<ApiResponse<ReportDetail>>(`/api/reports/${id}`)
      .then((res) => res.data.data),

  createReport: (data: CreateReportData) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('neighborhoodId', data.neighborhoodId);
    if (data.suggestedCategoryId) {
      formData.append('suggestedCategoryId', data.suggestedCategoryId);
    }
    if (data.latitude !== undefined) {
      formData.append('latitude', String(data.latitude));
    }
    if (data.longitude !== undefined) {
      formData.append('longitude', String(data.longitude));
    }
    if (data.media) {
      data.media.forEach((file) => {
        formData.append('media', {
          uri: file.uri,
          type: file.type,
          name: file.name,
        } as unknown as Blob);
      });
    }
    return apiClient
      .post<ApiResponse<ReportDetail>>('/api/reports', formData)
      .then((res) => res.data.data);
  },

  getCategories: (): Promise<CategoryDto[]> =>
    apiClient
      .get<ApiResponse<CategoryDto[]>>('/api/categories')
      .then((res) => res.data.data),
};
