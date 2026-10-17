import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { ListFooterLoader } from '@/components/ui/ListFooterLoader';
import { ReportCard } from '@/components/ui/ReportCard';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { useMyReports, useReports, type ReportStatus } from '@/features/reports';
import { loadNextPage } from '@/lib/api/pagination';
import { getApiErrorMessage } from '@/lib/utils/error';

const STATUS_FILTERS: { label: string; value: ReportStatus | null }[] = [
  { label: 'Tümü', value: null },
  { label: 'Onay Bekliyor', value: 'PendingReview' },
  { label: 'Onaylandı', value: 'Confirmed' },
  { label: 'İşlemde', value: 'InProgress' },
  { label: 'Çözüldü', value: 'Resolved' },
];

export default function ReportsScreen() {
  const [activeFilter, setActiveFilter] = useState<ReportStatus | null>(null);
  const [showMine, setShowMine] = useState(false);
  const [scope, setScope] = useState('Neighborhood');
  const [refreshing, setRefreshing] = useState(false);

  const status = activeFilter ?? undefined;
  const allReportsQuery = useReports({ scope, status });
  const myReportsQuery = useMyReports({ status });

  const reportsQuery = showMine ? myReportsQuery : allReportsQuery;
  const { isLoading, isError, error, refetch } = reportsQuery;
  const reports = reportsQuery.data?.items ?? [];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const scopeText = scope === 'Neighborhood' ? 'Mahallede' : scope === 'District' ? 'İlçede' : 'İlde';
  const activeFilterLabel = activeFilter ? STATUS_FILTERS.find((f) => f.value === activeFilter)?.label : null;

  const tabs = [
    { key: 'Neighborhood', label: 'Mahallem' },
    { key: 'District', label: 'İlçe' },
    { key: 'Province', label: 'İl' },
    { key: 'My', label: 'Benim' },
  ] as const;

  return (
    <ScreenContainer scrollable={false}>
      <View className="flex-1">
        <View className="px-4 pt-4 pb-2">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">Raporlar</Text>
        </View>

        <View className="px-4 pb-3">
          <View className="flex-row bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            {tabs.map((tab) => {
              const active = tab.key === 'My' ? showMine : !showMine && scope === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  className="flex-1"
                  onPress={() => {
                    if (tab.key === 'My') {
                      setShowMine(true);
                    } else {
                      setShowMine(false);
                      setScope(tab.key);
                    }
                  }}
                  activeOpacity={1}
                >
                  <View className={`py-2 rounded-lg items-center justify-center ${active ? 'bg-white dark:bg-gray-700' : ''}`}>
                    <Text className={`text-xs font-medium ${active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                      {tab.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View className="px-4 pb-2">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={STATUS_FILTERS}
            keyExtractor={(item) => item.label}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setActiveFilter(item.value)}
                activeOpacity={0.7}
                className={`px-3 py-1.5 rounded-full mr-2 ${activeFilter === item.value ? 'bg-gray-200 dark:bg-gray-700' : 'bg-gray-50 dark:bg-gray-800/50'}`}
              >
                <Text className={`text-xs ${activeFilter === item.value ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {isLoading && reports.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        ) : isError ? (
          <View className="flex-1 items-center justify-center px-4">
            <Ionicons name="warning-outline" size={48} color="#ef4444" />
            <Text className="text-base text-red-500 mt-3 text-center">
              {getApiErrorMessage(error, 'Raporlar yuklenemedi.')}
            </Text>
          </View>
        ) : reports.length === 0 ? (
          <View className="flex-1 items-center justify-center px-4">
            <Ionicons name="document-text-outline" size={48} color="#cbd5e1" />
            <Text className="text-base text-gray-400 mt-3 text-center">
              {showMine
                ? activeFilterLabel
                  ? `${activeFilterLabel} durumunda raporun yok`
                  : 'Henüz rapor oluşturmadın'
                : activeFilterLabel ? `${activeFilterLabel} durumunda rapor bulunamadı` : `${scopeText} henüz rapor yok`}
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(app)/report/create' as any)}
              activeOpacity={0.8}
              className="bg-blue-600 rounded-xl px-6 py-3 mt-4"
            >
              <Text className="text-white font-semibold">İlk Raporu Oluştur</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={reports}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
            renderItem={({ item }) => (
              <ReportCard
                report={item}
                onPress={() => router.push(`/(app)/report/${item.id}` as any)}
              />
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563EB" />
            }
            onEndReached={() => loadNextPage(reportsQuery)}
            onEndReachedThreshold={0.5}
            ListFooterComponent={<ListFooterLoader loading={reportsQuery.isFetchingNextPage} />}
          />
        )}

        <TouchableOpacity
          onPress={() => router.push('/(app)/report/create' as any)}
          activeOpacity={0.8}
          style={{ position: 'absolute', bottom: -8, right: 0 }}
          className="w-14 h-14 rounded-full bg-blue-600 items-center justify-center shadow-lg"
        >
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
