import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '@/features/auth';
import { getApiErrorMessage } from '@/lib/utils/error';
import { type UpdateProfileDto, userApi } from '../api/user.api';
import { userKeys } from './use-profile';

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  const currentUser = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: (data: UpdateProfileDto) => userApi.updateProfile(data),
    onSuccess: async (data) => {
      if (currentUser) {
        setUser({
          ...currentUser,
          firstName: data.firstName,
          lastName: data.lastName,
          neighborhoodId: data.neighborhoodId ?? currentUser.neighborhoodId,
        });
      }
      await queryClient.refetchQueries({ queryKey: userKeys.me });
      Toast.show({ type: 'success', text1: 'Profil güncellendi' });
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
