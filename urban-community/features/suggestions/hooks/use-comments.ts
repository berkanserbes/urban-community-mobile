import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { suggestionsApi } from '../api/suggestions.api';
import { suggestionKeys } from './use-suggestions';

export function useComments(suggestionId: string | null) {
  return useQuery({
    queryKey: [...suggestionKeys.detail(suggestionId ?? ''), 'comments'],
    queryFn: () => suggestionsApi.getComments(suggestionId!),
    enabled: !!suggestionId,
    staleTime: 30 * 1000,
  });
}

export function useAddComment(suggestionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => suggestionsApi.addComment(suggestionId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...suggestionKeys.detail(suggestionId), 'comments'],
      });
    },
  });
}
