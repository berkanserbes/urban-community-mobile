import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '../api/reports.api';
import { reportKeys } from './use-reports';

export function useReportById(id: string | null) {
  return useQuery({
    queryKey: reportKeys.detail(id ?? ''),
    queryFn: () => reportsApi.getReportById(id!),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}
