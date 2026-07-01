import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { suggestionsApi, type VoteSummary } from '../api/suggestions.api';
import { suggestionKeys } from './use-suggestions';

const voteSummaryKey = (suggestionId: string) =>
  [...suggestionKeys.all, suggestionId, 'vote-summary'] as const;

export function useVote(suggestionId: string) {
  const queryClient = useQueryClient();

  const invalidateSuggestionVotes = () => {
    queryClient.invalidateQueries({ queryKey: suggestionKeys.lists() });
    queryClient.invalidateQueries({ queryKey: suggestionKeys.detail(suggestionId) });
    queryClient.invalidateQueries({ queryKey: voteSummaryKey(suggestionId) });
  };

  const vote = useMutation({
    mutationFn: (isUpvote: boolean) => suggestionsApi.vote(suggestionId, isUpvote),
    onSuccess: invalidateSuggestionVotes,
  });

  const removeVote = useMutation({
    mutationFn: () => suggestionsApi.removeVote(suggestionId),
    onSuccess: invalidateSuggestionVotes,
  });

  return { vote, removeVote };
}

export function getNextVoteSummary(
  current: VoteSummary,
  nextUserVote: boolean | null
): VoteSummary {
  const currentUserVote = current.currentUserVote ?? null;

  if (currentUserVote === nextUserVote) {
    return current;
  }

  let upVotes = current.upVotes;
  let downVotes = current.downVotes;
  let voteScore = current.voteScore;

  if (currentUserVote === true) {
    upVotes -= 1;
    voteScore -= 1;
  } else if (currentUserVote === false) {
    downVotes -= 1;
    voteScore += 1;
  }

  if (nextUserVote === true) {
    upVotes += 1;
    voteScore += 1;
  } else if (nextUserVote === false) {
    downVotes += 1;
    voteScore -= 1;
  }

  return {
    upVotes: Math.max(0, upVotes),
    downVotes: Math.max(0, downVotes),
    voteScore,
    currentUserVote: nextUserVote,
  };
}

export function useVoteSummary(suggestionId: string | null) {
  return useQuery({
    queryKey: voteSummaryKey(suggestionId ?? ''),
    queryFn: () => suggestionsApi.getVoteSummary(suggestionId!),
    enabled: !!suggestionId,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  });
}
