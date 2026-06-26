import { useQuery } from '@tanstack/react-query';
import { announcementApi } from '../api/announcement.api';

export const announcementKeys = {
  all: ['announcements'] as const,
  lists: () => [...announcementKeys.all, 'list'] as const,
  list: (params: { provinceId?: string; districtId?: string; neighborhoodId?: string }) =>
    [...announcementKeys.lists(), params] as const,
  details: () => [...announcementKeys.all, 'detail'] as const,
  detail: (id: string) => [...announcementKeys.details(), id] as const,
};

export function useAnnouncements(params: {
  provinceId?: string;
  districtId?: string;
  neighborhoodId?: string;
}) {
  return useQuery({
    queryKey: announcementKeys.list(params),
    queryFn: () => announcementApi.getAnnouncements(params),
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
