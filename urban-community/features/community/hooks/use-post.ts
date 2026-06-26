import { useQuery } from '@tanstack/react-query';
import { communityApi } from '../api/community.api';
import { communityKeys } from './use-posts';

export function useCommunityPostById(id: string | null) {
  return useQuery({
    queryKey: communityKeys.detail(id ?? ''),
    queryFn: () => communityApi.getPostById(id!),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
}
