import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { getApiErrorMessage } from '@/lib/utils/error';
import { type CreateCommunityPostData, communityApi } from '../api/community.api';
import { communityKeys } from './use-posts';

export function useCreateCommunityPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommunityPostData) => communityApi.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.lists() });
      Toast.show({ type: 'success', text1: 'Gönderi paylaşıldı' });
      router.back();
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Gönderi paylaşılamadı',
        text2: getApiErrorMessage(error),
      });
    },
  });
}
