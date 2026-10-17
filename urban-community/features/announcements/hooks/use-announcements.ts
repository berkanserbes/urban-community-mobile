import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { DEFAULT_PAGE_SIZE, getNextPageParam, selectLoadedPages } from '@/lib/api/pagination';
import { announcementApi } from '../api/announcement.api';

type AnnouncementListParams = {
  provinceId?: string;
  districtId?: string;
  neighborhoodId?: string;
};

export const announcementKeys = {
  all: ['announcements'] as const,
  lists: () => [...announcementKeys.all, 'list'] as const,
  list: (params: AnnouncementListParams) =>
    [...announcementKeys.lists(), params] as const,
  latest: (params: AnnouncementListParams, count: number) =>
    [...announcementKeys.lists(), 'latest', params, count] as const,
  details: () => [...announcementKeys.all, 'detail'] as const,
  detail: (id: string) => [...announcementKeys.details(), id] as const,
};

function normalizeAnnouncementParams(params: AnnouncementListParams): AnnouncementListParams {
  if (params.neighborhoodId) {
    return { neighborhoodId: params.neighborhoodId };
  }

  if (params.districtId) {
    return { districtId: params.districtId };
  }

  if (params.provinceId) {
    return { provinceId: params.provinceId };
  }

  return {};
}

export function useAnnouncements(params: AnnouncementListParams) {
  const normalizedParams = normalizeAnnouncementParams(params);

  return useInfiniteQuery({
    queryKey: announcementKeys.list(normalizedParams),
    queryFn: ({ pageParam }) =>
      announcementApi.getAnnouncements({
        ...normalizedParams,
        pageIndex: pageParam,
        pageSize: DEFAULT_PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam,
    select: selectLoadedPages,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/** Newest announcements for feed previews; the API already sorts newest first. */
export function useLatestAnnouncements(params: AnnouncementListParams, count: number) {
  const normalizedParams = normalizeAnnouncementParams(params);

  return useQuery({
    queryKey: announcementKeys.latest(normalizedParams, count),
    queryFn: () =>
      announcementApi.getAnnouncements({ ...normalizedParams, pageIndex: 1, pageSize: count }),
    select: (page) => page.items,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAnnouncementById(id: string) {
  return useQuery({
    queryKey: announcementKeys.detail(id),
    queryFn: () => announcementApi.getAnnouncementById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
