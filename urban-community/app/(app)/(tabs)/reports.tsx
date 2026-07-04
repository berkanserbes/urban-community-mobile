import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { ReportCard } from '@/components/ui/ReportCard';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { useAuthStore } from '@/features/auth';
import { useMyReports, useReports, type ReportStatus } from '@/features/reports';
import { useProfile } from '@/features/user';

const STATUS_FILTERS: { label: string; value: ReportStatus | null }[] = [
  { label: 'Tümü', value: null },
  { label: 'Onay Bekliyor', value: 'PendingReview' },
  { label: 'Onaylandı', value: 'Confirmed' },
  { label: 'İşlemde', value: 'InProgress' },
  { label: 'Çözüldü', value: 'Resolved' },
];

export default function ReportsScreen() {
  const user = useAuthStore((s) => s.user);
  const { data: profile } = useProfile();
  const [activeFilter, setActiveFilter] = useState<ReportStatus | null>(null);
  const [showMine, setShowMine] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const neighborhoodId = profile?.neighborhoodId ?? user?.neighborhoodId ?? undefined;

  const {
    data: allReports = [],
    isLoading: loadingAll,
    refetch: refetchAll,
  } = useReports({
    neighborhoodId,
    status: activeFilter ?? undefined,
  });

  const {
    data: myReports = [],
    isLoading: loadingMine,
    refetch: refetchMine,
  } = useMyReports();

  const reports = showMine ? myReports : allReports;
  const isLoading = showMine ? loadingMine : loadingAll;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (showMine) {
      await refetchMine();
    } else {
      await refetchAll();
    }
    setRefreshing(false);
  }, [showMine, refetchMine, refetchAll]);

  return (
    <ScreenContainer scrollable={false}>
      <View className="flex-1">
        <View className="px-4 pt-4 pb-2">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">Raporlar</Text>
        </View>

        <View className="flex-row px-4 pb-3 gap-2">
          <Pressable
            onPress={() => setShowMine(false)}
            className={`px-4 py-2 rounded-full ${!showMine ? 'bg-blue-600' : 'bg-gray-100 dark:bg-gray-800'}`}
          >
            <Text className={`text-sm font-medium ${!showMine ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}>
              Mahalle
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setShowMine(true)}
            className={`px-4 py-2 rounded-full ${showMine ? 'bg-blue-600' : 'bg-gray-100 dark:bg-gray-800'}`}
          >
            <Text className={`text-sm font-medium ${showMine ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}>
              Benim
            </Text>
          </Pressable>
        </View>

        {!showMine && (
          <View className="px-4 pb-2">
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={STATUS_FILTERS}
              keyExtractor={(item) => item.label}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => setActiveFilter(item.value)}
                  className={`px-3 py-1.5 rounded-full mr-2 ${
                    activeFilter === item.value ? 'bg-gray-200 dark:bg-gray-700' : 'bg-gray-50 dark:bg-gray-800/50'
                  }`}
                >
                  <Text
                    className={`text-xs ${
                      activeFilter === item.value
                        ? 'text-gray-900 dark:text-white font-medium'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        )}

        {isLoading && reports.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        ) : reports.length === 0 ? (
          <View className="flex-1 items-center justify-center px-4">
            <Ionicons name="document-text-outline" size={48} color="#cbd5e1" />
            <Text className="text-base text-gray-400 mt-3 text-center">
              {showMine ? 'Henüz rapor oluşturmadın' : 'Mahallede henüz rapor yok'}
            </Text>
            <Pressable
              onPress={() => router.push('/(app)/report/create' as any)}
              className="bg-blue-600 rounded-xl px-6 py-3 mt-4 active:opacity-80"
            >
              <Text className="text-white font-semibold">İlk Raporu Oluştur</Text>
            </Pressable>
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
          />
        )}

        <Pressable
          onPress={() => router.push('/(app)/report/create' as any)}
          className="absolute -bottom-2 right-0 w-14 h-14 rounded-full bg-blue-600 items-center justify-center active:opacity-80 shadow-lg"
        >
          <Ionicons name="add" size={28} color="white" />
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
