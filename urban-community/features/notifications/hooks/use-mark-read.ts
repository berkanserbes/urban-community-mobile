import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { getApiErrorMessage } from '@/lib/utils/error';
import { notificationsApi } from '../api/notifications.api';
import { notificationKeys } from './use-notifications';

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: notificationKeys.all });
  };

  const showError = (error: unknown) => {
    Toast.show({
      type: 'error',
      text1: 'Bildirim islemi basarisiz',
      text2: getApiErrorMessage(error),
    });
  };

  const markAsRead = useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: invalidate,
    onError: showError,
  });

  const markAllAsRead = useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: invalidate,
    onError: showError,
  });

  const markAsUnread = useMutation({
    mutationFn: (id: string) => notificationsApi.markAsUnread(id),
    onSuccess: invalidate,
    onError: showError,
  });

  return { markAsRead, markAllAsRead, markAsUnread };
}
