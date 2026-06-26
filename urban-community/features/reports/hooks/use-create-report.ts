import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { getApiErrorMessage } from '@/lib/utils/error';
import { type CreateReportData, reportsApi } from '../api/reports.api';
import { reportKeys } from './use-reports';

export function useCreateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReportData) => reportsApi.createReport(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
      Toast.show({ type: 'success', text1: 'Rapor oluşturuldu', text2: data.title });
      router.back();
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Rapor oluşturulamadı',
        text2: getApiErrorMessage(error),
      });
    },
  });
}
