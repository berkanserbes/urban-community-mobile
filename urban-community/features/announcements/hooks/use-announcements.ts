import { useQuery } from '@tanstack/react-query';
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

  return useQuery({
    queryKey: announcementKeys.list(normalizedParams),
    queryFn: () => announcementApi.getAnnouncements(normalizedParams),
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
