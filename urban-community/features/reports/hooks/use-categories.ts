import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '../api/reports.api';

export const categoryKeys = {
  all: ['categories'] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: reportsApi.getCategories,
    staleTime: 5 * 60 * 1000,
  });
}
