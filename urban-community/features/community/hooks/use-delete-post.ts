import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { getApiErrorMessage } from '@/lib/utils/error';
import { communityApi } from '../api/community.api';
import { communityKeys } from './use-posts';

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => communityApi.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.lists() });
      queryClient.invalidateQueries({ queryKey: communityKeys.details() });
      Toast.show({ type: 'success', text1: 'Gönderi silindi' });
      router.back();
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Silme başarısız',
        text2: getApiErrorMessage(error),
      });
    },
  });
}
