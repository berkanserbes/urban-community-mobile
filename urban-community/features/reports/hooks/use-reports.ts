import { useQuery } from '@tanstack/react-query';
import { reportsApi, type ReportStatus } from '../api/reports.api';

export const reportKeys = {
  all: ['reports'] as const,
  lists: () => [...reportKeys.all, 'list'] as const,
  list: (params: Record<string, string | undefined>) =>
    [...reportKeys.lists(), params] as const,
  my: () => [...reportKeys.all, 'mine'] as const,
  details: () => [...reportKeys.all, 'detail'] as const,
  detail: (id: string) => [...reportKeys.details(), id] as const,
};

export function useReports(params: {
  neighborhoodId?: string;
  status?: ReportStatus;
  categoryId?: string;
  userId?: string;
}) {
  return useQuery({
    queryKey: reportKeys.list(params as Record<string, string | undefined>),
    queryFn: () => reportsApi.getReports(params),
    staleTime: 60 * 1000,
  });
}

export function useMyReports() {
  return useQuery({
    queryKey: reportKeys.my(),
    queryFn: reportsApi.getMyReports,
    staleTime: 60 * 1000,
  });
}
