import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { getApiErrorMessage } from '@/lib/utils/error';
import { type ChangePasswordDto, userApi } from '../api/user.api';

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordDto) => userApi.changePassword(data),
    onSuccess: () => {
      Toast.show({ type: 'success', text1: 'Şifre güncellendi' });
      router.back();
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Şifre değiştirilemedi',
        text2: getApiErrorMessage(error, 'Mevcut şifrenizi kontrol edin.'),
      });
    },
  });
}
