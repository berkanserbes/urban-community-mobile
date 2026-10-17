import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { DEFAULT_PAGE_SIZE, getNextPageParam, selectLoadedPages } from '@/lib/api/pagination';
import { notificationsApi } from '../api/notifications.api';

export const notificationKeys = {
  all: ['notifications'] as const,
  list: (isRead?: boolean) => [...notificationKeys.all, 'list', { isRead }] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
};

export function useNotifications(params?: { isRead?: boolean }) {
  return useInfiniteQuery({
    queryKey: notificationKeys.list(params?.isRead),
    queryFn: ({ pageParam }) =>
      notificationsApi.getNotifications({
        isRead: params?.isRead,
        pageIndex: pageParam,
        pageSize: DEFAULT_PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam,
    select: selectLoadedPages,
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
