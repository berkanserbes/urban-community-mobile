import { useQuery } from '@tanstack/react-query';
import { notificationsApi } from '../api/notifications.api';

export const notificationKeys = {
  all: ['notifications'] as const,
  list: (isRead?: boolean) => [...notificationKeys.all, 'list', { isRead }] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
};

export function useNotifications(params?: { isRead?: boolean }) {
  return useQuery({
    queryKey: notificationKeys.list(params?.isRead),
    queryFn: () => notificationsApi.getNotifications(params),
    staleTime: 30 * 1000,
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: notificationsApi.getUnreadCount,
    refetchInterval: 30_000,
    staleTime: 10_000,
  });
}
