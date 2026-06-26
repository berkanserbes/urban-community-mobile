import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { getApiErrorMessage } from '@/lib/utils/error';
import { communityApi } from '../api/community.api';
import { communityKeys } from './use-posts';

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { title: string; content: string } }) =>
      communityApi.updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.lists() });
      queryClient.invalidateQueries({ queryKey: communityKeys.details() });
      Toast.show({ type: 'success', text1: 'Gönderi güncellendi' });
      router.back();
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Güncelleme başarısız',
        text2: getApiErrorMessage(error),
      });
    },
  });
}
