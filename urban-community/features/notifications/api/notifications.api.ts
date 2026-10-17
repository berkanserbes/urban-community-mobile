import { apiClient } from '@/lib/api/axios';
import { unwrapApiData } from '@/lib/api/result';
import type { ApiResponse, PagedResult, PaginationParams } from '@/types/api.types';

export interface NotificationDto {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  relatedEntityId: string | null;
  relatedEntityType: string | null;
  createdAt: string;
}

export interface UnreadCountDto {
  unreadCount: number;
}

export const notificationsApi = {
  getNotifications: (params: PaginationParams & { isRead?: boolean }): Promise<PagedResult<NotificationDto>> =>
    apiClient
      .get<ApiResponse<PagedResult<NotificationDto>>>('/api/notifications', { params })
      .then((res) => unwrapApiData(res.data)),

  getUnreadCount: (): Promise<UnreadCountDto> =>
    apiClient
      .get<ApiResponse<UnreadCountDto>>('/api/notifications/unread-count')
      .then((res) => unwrapApiData(res.data)),

  markAsRead: (id: string) =>
    apiClient
      .patch<ApiResponse<unknown>>(`/api/notifications/${id}/read`)
      .then((res) => unwrapApiData(res.data)),

  markAllAsRead: () =>
    apiClient
      .patch<ApiResponse<unknown>>('/api/notifications/read-all')
      .then((res) => unwrapApiData(res.data)),

  markAsUnread: (id: string) =>
    apiClient
      .patch<ApiResponse<unknown>>(`/api/notifications/${id}/unread`)
      .then((res) => unwrapApiData(res.data)),

  deleteNotification: (id: string) =>
    apiClient
      .delete<ApiResponse<unknown>>(`/api/notifications/${id}`)
      .then((res) => unwrapApiData(res.data)),

  deleteAll: () =>
    apiClient
      .delete<ApiResponse<unknown>>('/api/notifications')
      .then((res) => unwrapApiData(res.data)),
};
