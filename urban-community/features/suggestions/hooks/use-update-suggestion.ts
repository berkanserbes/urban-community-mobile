import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { getApiErrorMessage } from '@/lib/utils/error';
import { suggestionsApi } from '../api/suggestions.api';
import { suggestionKeys } from './use-suggestions';

export function useUpdateSuggestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { title: string; content: string } }) =>
      suggestionsApi.updateSuggestion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: suggestionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: suggestionKeys.details() });
      Toast.show({ type: 'success', text1: 'Öneri güncellendi' });
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
