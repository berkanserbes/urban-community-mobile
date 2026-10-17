import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DEFAULT_PAGE_SIZE, getNextPageParam, selectLoadedPages } from '@/lib/api/pagination';
import { suggestionsApi } from '../api/suggestions.api';
import { suggestionKeys } from './use-suggestions';

export function useComments(suggestionId: string | null) {
  return useInfiniteQuery({
    queryKey: [...suggestionKeys.detail(suggestionId ?? ''), 'comments'],
    queryFn: ({ pageParam }) =>
      suggestionsApi.getComments(suggestionId!, { pageIndex: pageParam, pageSize: DEFAULT_PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam,
    select: selectLoadedPages,
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
