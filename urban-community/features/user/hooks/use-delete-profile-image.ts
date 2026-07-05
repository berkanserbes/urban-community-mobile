import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { getApiErrorMessage } from '@/lib/utils/error';
import { userApi } from '../api/user.api';
import { userKeys } from './use-profile';

export function useDeleteProfileImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.deleteProfileImage,
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: userKeys.me });
      Toast.show({ type: 'success', text1: 'Profil fotoğrafı silindi' });
    },
    onError: (error) => {
      Toast.show({ type: 'error', text1: 'İşlem başarısız', text2: getApiErrorMessage(error) });
    },
  });
}
