import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { DEFAULT_PAGE_SIZE, getNextPageParam, selectLoadedPages } from '@/lib/api/pagination';
import { reportsApi, type ReportStatus } from '../api/reports.api';

type ReportListParams = {
  scope?: string;
  status?: ReportStatus;
  categoryId?: string;
};

export const reportKeys = {
  all: ['reports'] as const,
  lists: () => [...reportKeys.all, 'list'] as const,
  list: (params: Record<string, string | undefined>) =>
    [...reportKeys.lists(), params] as const,
  latest: (params: ReportListParams, count: number) =>
    [...reportKeys.lists(), 'latest', params, count] as const,
  my: () => [...reportKeys.all, 'mine'] as const,
  myList: (params: { status?: ReportStatus }) => [...reportKeys.my(), params] as const,
  details: () => [...reportKeys.all, 'detail'] as const,
  detail: (id: string) => [...reportKeys.details(), id] as const,
};

export function useReports(params: ReportListParams) {
  return useInfiniteQuery({
    queryKey: reportKeys.list(params as Record<string, string | undefined>),
    queryFn: ({ pageParam }) =>
      reportsApi.getReports({ ...params, pageIndex: pageParam, pageSize: DEFAULT_PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam,
    select: selectLoadedPages,
    staleTime: 60 * 1000,
  });
}

/** Newest reports for feed previews; the API already sorts newest first. */
export function useLatestReports(params: ReportListParams, count: number) {
  return useQuery({
    queryKey: reportKeys.latest(params, count),
    queryFn: () => reportsApi.getReports({ ...params, pageIndex: 1, pageSize: count }),
    select: (page) => page.items,
    staleTime: 60 * 1000,
  });
}

export function useMyReports(params: { status?: ReportStatus }) {
  return useInfiniteQuery({
    queryKey: reportKeys.myList(params),
    queryFn: ({ pageParam }) =>
      reportsApi.getMyReports({ ...params, pageIndex: pageParam, pageSize: DEFAULT_PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam,
    select: selectLoadedPages,
    staleTime: 60 * 1000,
  });
}
