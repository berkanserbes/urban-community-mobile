import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { DEFAULT_PAGE_SIZE, getNextPageParam, selectLoadedPages } from '@/lib/api/pagination';
import { communityApi, type PostType, type CommunityPostScope, type CommunityPostStatus } from '../api/community.api';

export const communityKeys = {
  all: ['community-posts'] as const,
  lists: () => [...communityKeys.all, 'list'] as const,
  list: (params: Record<string, string | undefined>) =>
    [...communityKeys.lists(), params] as const,
  latest: (params: CommunityPostListParams, count: number) =>
    [...communityKeys.lists(), 'latest', params, count] as const,
  details: () => [...communityKeys.all, 'detail'] as const,
  detail: (id: string) => [...communityKeys.details(), id] as const,
};

type CommunityPostListParams = {
  scope?: CommunityPostScope;
  provinceId?: string;
  districtId?: string;
  neighborhoodId?: string;
  status?: CommunityPostStatus;
  type?: PostType;
  userId?: string;
};

export function useCommunityPosts(params: CommunityPostListParams) {
  return useInfiniteQuery({
    queryKey: communityKeys.list(params as Record<string, string | undefined>),
    queryFn: ({ pageParam }) =>
      communityApi.getPosts({ ...params, pageIndex: pageParam, pageSize: DEFAULT_PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam,
    select: selectLoadedPages,
    staleTime: 60 * 1000,
  });
}

/** Newest posts for feed previews; the API already sorts newest first. */
export function useLatestCommunityPosts(params: CommunityPostListParams, count: number) {
  return useQuery({
    queryKey: communityKeys.latest(params, count),
    queryFn: () => communityApi.getPosts({ ...params, pageIndex: 1, pageSize: count }),
    select: (page) => page.items,
    staleTime: 60 * 1000,
  });
}
