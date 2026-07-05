import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { communityApi, type CommunityPostComment } from '../api/community.api';
import { communityKeys } from './use-posts';

export function usePostComments(postId: string | null) {
  return useQuery({
    queryKey: [...communityKeys.detail(postId ?? ''), 'comments'],
    queryFn: () => communityApi.getComments(postId!),
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
