import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { getApiErrorMessage } from '@/lib/utils/error';
import { suggestionsApi } from '../api/suggestions.api';
import { suggestionKeys } from './use-suggestions';

export function useCreateSuggestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { title: string; content: string }) =>
      suggestionsApi.createSuggestion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: suggestionKeys.lists() });
      Toast.show({ type: 'success', text1: 'Öneri oluşturuldu' });
      router.back();
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Öneri oluşturulamadı',
        text2: getApiErrorMessage(error),
      });
    },
  });
}
