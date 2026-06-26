import { useMutation, useQueryClient } from '@tanstack/react-query';
import { suggestionsApi } from '../api/suggestions.api';
import { suggestionKeys } from './use-suggestions';

export function useVote(suggestionId: string) {
  const queryClient = useQueryClient();

  const vote = useMutation({
    mutationFn: (isUpvote: boolean) => suggestionsApi.vote(suggestionId, isUpvote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: suggestionKeys.detail(suggestionId) });
      queryClient.invalidateQueries({ queryKey: suggestionKeys.lists() });
    },
  });

  const removeVote = useMutation({
    mutationFn: () => suggestionsApi.removeVote(suggestionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: suggestionKeys.detail(suggestionId) });
      queryClient.invalidateQueries({ queryKey: suggestionKeys.lists() });
    },
  });

  return { vote, removeVote };
}
