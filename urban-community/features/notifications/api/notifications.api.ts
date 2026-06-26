import { apiClient } from '@/lib/api/axios';
import type { ApiResponse } from '@/types/api.types';

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
  getNotifications: (params?: { isRead?: boolean }): Promise<NotificationDto[]> =>
    apiClient
      .get<ApiResponse<NotificationDto[]>>('/api/notifications', { params })
      .then((res) => res.data.data),

  getUnreadCount: (): Promise<UnreadCountDto> =>
    apiClient
      .get<ApiResponse<UnreadCountDto>>('/api/notifications/unread-count')
      .then((res) => res.data.data),

  markAsRead: (id: string) =>
    apiClient
      .patch<ApiResponse<unknown>>(`/api/notifications/${id}/read`)
      .then((res) => res.data.data),

  markAllAsRead: () =>
    apiClient
      .patch<ApiResponse<unknown>>('/api/notifications/read-all')
      .then((res) => res.data.data),

  markAsUnread: (id: string) =>
    apiClient
      .patch<ApiResponse<unknown>>(`/api/notifications/${id}/unread`)
      .then((res) => res.data.data),

  deleteNotification: (id: string) =>
    apiClient
      .delete<ApiResponse<unknown>>(`/api/notifications/${id}`)
      .then((res) => res.data.data),

  deleteAll: () =>
    apiClient
      .delete<ApiResponse<unknown>>('/api/notifications')
      .then((res) => res.data.data),
};
