import { useQuery } from '@tanstack/react-query';
import { suggestionsApi } from '../api/suggestions.api';
import { suggestionKeys } from './use-suggestions';

export function useSuggestionById(id: string | null) {
  return useQuery({
    queryKey: suggestionKeys.detail(id ?? ''),
    queryFn: () => suggestionsApi.getSuggestionById(id!),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
}
