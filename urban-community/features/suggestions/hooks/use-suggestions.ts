import { useQuery } from '@tanstack/react-query';
import { suggestionsApi, type SuggestionStatus } from '../api/suggestions.api';

export const suggestionKeys = {
  all: ['suggestions'] as const,
  lists: () => [...suggestionKeys.all, 'list'] as const,
  list: (params: Record<string, string | undefined>) =>
    [...suggestionKeys.lists(), params] as const,
  details: () => [...suggestionKeys.all, 'detail'] as const,
  detail: (id: string) => [...suggestionKeys.details(), id] as const,
};

export function useSuggestions(params: {
  status?: SuggestionStatus;
  userId?: string;
  neighborhoodId?: string;
  districtId?: string;
  provinceId?: string;
}) {
  return useQuery({
    queryKey: suggestionKeys.list(params as Record<string, string | undefined>),
    queryFn: () => suggestionsApi.getSuggestions(params),
    staleTime: 60 * 1000,
  });
}
