import { useQuery } from '@tanstack/react-query';
import { userApi } from '../api/user.api';

export const userKeys = {
  me: ['user', 'me'] as const,
};

export function useProfile() {
  return useQuery({
    queryKey: userKeys.me,
    queryFn: userApi.getMe,
    staleTime: 1000 * 60 * 5,
  });
}
