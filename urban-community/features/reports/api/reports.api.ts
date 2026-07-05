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

function unwrapApiData<T>(response: ApiResponse<T>): T {
  if (!response.isSuccess || response.data == null) {
    throw new Error(response.errors?.[0] ?? 'İşlem başarısız.');
  }

  return response.data;
}

function isValidCoordinate(value: number | undefined, min: number, max: number): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
}

function appendLocation(formData: FormData, latitude: number | undefined, longitude: number | undefined) {
  const hasLatitude = latitude !== undefined;
  const hasLongitude = longitude !== undefined;

  if (!hasLatitude && !hasLongitude) {
    return;
  }

  if (
    !isValidCoordinate(latitude, -90, 90) ||
    !isValidCoordinate(longitude, -180, 180)
  ) {
    throw new Error('Gecerli bir konum secin.');
  }

  formData.append('latitude', String(latitude));
  formData.append('longitude', String(longitude));
}

function logCreateReportPayload(data: CreateReportData) {
  if (!__DEV__) {
    return;
  }

  console.log('[reportsApi.createReport] payload', {
    title: data.title,
    description: data.description,
    neighborhoodId: data.neighborhoodId,
    suggestedCategoryId: data.suggestedCategoryId ?? null,
    latitude: data.latitude ?? null,
    longitude: data.longitude ?? null,
    media: data.media?.map((file) => ({
      uri: file.uri,
      type: file.type,
      name: file.name,
    })) ?? [],
  });
}

export const reportsApi = {
  getReports: (params: {
    scope?: string;
    status?: ReportStatus;
    categoryId?: string;
  }): Promise<ReportListItem[]> =>
    apiClient
      .get<ApiResponse<ReportListItem[]>>('/api/reports', { params })
      .then((res) => unwrapApiData(res.data)),

  getMyReports: (): Promise<ReportListItem[]> =>
    apiClient
      .get<ApiResponse<ReportListItem[]>>('/api/reports/mine')
      .then((res) => unwrapApiData(res.data)),

  getReportById: (id: string): Promise<ReportDetail> =>
    apiClient
      .get<ApiResponse<ReportDetail>>(`/api/reports/${id}`)
      .then((res) => unwrapApiData(res.data)),

  createReport: (data: CreateReportData) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('neighborhoodId', data.neighborhoodId);
    if (data.suggestedCategoryId) {
      formData.append('suggestedCategoryId', data.suggestedCategoryId);
    }
    appendLocation(formData, data.latitude, data.longitude);
    if (data.media) {
      data.media.forEach((file) => {
        formData.append('media', {
          uri: file.uri,
          type: file.type,
          name: file.name,
        } as unknown as Blob);
      });
    }
    logCreateReportPayload(data);
    return apiClient
      .post<ApiResponse<ReportDetail>>('/api/reports', formData)
      .then((res) => unwrapApiData(res.data));
  },

  getCategories: (): Promise<CategoryDto[]> =>
    apiClient
      .get<ApiResponse<CategoryDto[]>>('/api/categories')
      .then((res) => unwrapApiData(res.data)),
};
