import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { getApiErrorMessage } from '@/lib/utils/error';
import { userApi } from '../api/user.api';
import { userKeys } from './use-profile';

export function useUpdateProfileImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uri, mimeType }: { uri: string; mimeType: string }) =>
      userApi.updateProfileImage(uri, mimeType),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: userKeys.me });
      Toast.show({ type: 'success', text1: 'Profil fotoğrafı güncellendi' });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Fotoğraf yüklenemedi',
        text2: getApiErrorMessage(error),
      });
    },
  });
}
