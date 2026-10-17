import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DEFAULT_PAGE_SIZE, getNextPageParam, selectLoadedPages } from '@/lib/api/pagination';
import { communityApi, type CommunityPostComment } from '../api/community.api';
import { communityKeys } from './use-posts';

export function usePostComments(postId: string | null) {
  return useInfiniteQuery({
    queryKey: [...communityKeys.detail(postId ?? ''), 'comments'],
    queryFn: ({ pageParam }) =>
      communityApi.getComments(postId!, { pageIndex: pageParam, pageSize: DEFAULT_PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam,
    select: selectLoadedPages,
    enabled: !!postId,
  });
}

export function useAddComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => communityApi.addComment(postId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...communityKeys.detail(postId), 'comments'],
      });
    },
  });
}
