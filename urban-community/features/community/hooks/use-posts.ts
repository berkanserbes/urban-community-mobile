import { useQuery } from '@tanstack/react-query';
import { communityApi, type PostType, type CommunityPostScope, type CommunityPostStatus } from '../api/community.api';

export const communityKeys = {
  all: ['community-posts'] as const,
  lists: () => [...communityKeys.all, 'list'] as const,
  list: (params: Record<string, string | undefined>) =>
    [...communityKeys.lists(), params] as const,
  details: () => [...communityKeys.all, 'detail'] as const,
  detail: (id: string) => [...communityKeys.details(), id] as const,
};

export function useCommunityPosts(params: {
  scope?: CommunityPostScope;
  provinceId?: string;
  districtId?: string;
  neighborhoodId?: string;
  status?: CommunityPostStatus;
  type?: PostType;
  userId?: string;
}) {
  return useQuery({
    queryKey: communityKeys.list(params as Record<string, string | undefined>),
    queryFn: () => communityApi.getPosts(params),
    staleTime: 60 * 1000,
  });
}
