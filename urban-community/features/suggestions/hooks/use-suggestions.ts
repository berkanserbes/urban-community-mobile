import { useQuery } from '@tanstack/react-query';
import { suggestionsApi, type SuggestionStatus } from '../api/suggestions.api';

type SuggestionListParams = {
  status?: SuggestionStatus;
  userId?: string;
  neighborhoodId?: string;
  districtId?: string;
  provinceId?: string;
};

export const suggestionKeys = {
  all: ['suggestions'] as const,
  lists: () => [...suggestionKeys.all, 'list'] as const,
  list: (params: Record<string, string | undefined>) =>
    [...suggestionKeys.lists(), params] as const,
  details: () => [...suggestionKeys.all, 'detail'] as const,
  detail: (id: string) => [...suggestionKeys.details(), id] as const,
};

function normalizeSuggestionParams(params: SuggestionListParams): SuggestionListParams {
  const normalizedParams: SuggestionListParams = {
    status: params.status,
    userId: params.userId,
  };

  if (params.neighborhoodId) {
    normalizedParams.neighborhoodId = params.neighborhoodId;
  } else if (params.districtId) {
    normalizedParams.districtId = params.districtId;
  } else if (params.provinceId) {
    normalizedParams.provinceId = params.provinceId;
  }

  return normalizedParams;
}

export function useSuggestions(params: SuggestionListParams) {
  const normalizedParams = normalizeSuggestionParams(params);

  return useQuery({
    queryKey: suggestionKeys.list(normalizedParams as Record<string, string | undefined>),
    queryFn: () => suggestionsApi.getSuggestions(normalizedParams),
    staleTime: 60 * 1000,
  });
}
