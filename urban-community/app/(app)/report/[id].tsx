import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, FlatList, Image, ScrollView, Text, View } from 'react-native';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { useReportById, type ReportHistoryDto } from '@/features/reports';
import { toAbsoluteUrl } from '@/lib/utils/url';

function HistoryTimeline({ history }: { history: ReportHistoryDto[] }) {
  return (
    <View className="gap-4">
      {history.map((item, index) => (
        <View key={item.id} className="flex-row">
          <View className="items-center mr-3">
            <View className="w-3 h-3 rounded-full bg-blue-600" />
            {index < history.length - 1 && (
              <View className="w-0.5 flex-1 bg-blue-200 dark:bg-blue-800 mt-1" />
            )}
          </View>
          <View className="flex-1 pb-4">
            <Text className="text-sm font-medium text-gray-900 dark:text-white">
              {item.changedByUserFullName ?? 'Sistem'}
            </Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {new Date(item.changedAt).toLocaleString('tr-TR')}
            </Text>
            {item.note && (
              <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.note}</Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: report, isLoading } = useReportById(id ?? null);

  if (isLoading || !report) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable={false}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {report.media.length > 0 && (
          <FlatList
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            data={report.media}
            keyExtractor={(item) => item.id}
            className="h-64"
            renderItem={({ item }) => (
              <View className="w-screen h-64 bg-gray-100 dark:bg-gray-800">
                {item.mediaType === 'Image' ? (
                  <Image
                    source={{ uri: toAbsoluteUrl(item.url)! }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="flex-1 items-center justify-center">
                    <Ionicons name="videocam-outline" size={48} color="#94a3b8" />
                  </View>
                )}
              </View>
            )}
          />
        )}

        <View className="px-4 pt-5">
          <View className="flex-row items-start justify-between gap-2 mb-3">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white flex-1">
              {report.title}
            </Text>
            <StatusBadge status={report.status} size="md" />
          </View>

          <Text className="text-base text-gray-600 dark:text-gray-400 leading-6 mb-4">
            {report.description}
          </Text>

          <View className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6 gap-3">
            <View className="flex-row items-center gap-2">
              <Ionicons name="pricetag-outline" size={16} color="#64748b" />
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                Kategori: <Text className="font-medium text-gray-900 dark:text-white">{report.categoryName}</Text>
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Ionicons name="person-outline" size={16} color="#64748b" />
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                Bildiren: <Text className="font-medium text-gray-900 dark:text-white">{report.userFullName}</Text>
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Ionicons name="location-outline" size={16} color="#64748b" />
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                <Text className="font-medium text-gray-900 dark:text-white">{report.neighborhoodName}</Text>
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Ionicons name="calendar-outline" size={16} color="#64748b" />
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(report.createdAt).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
            {report.assignedDepartmentName && (
              <View className="flex-row items-center gap-2">
                <Ionicons name="business-outline" size={16} color="#64748b" />
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Yetkili: <Text className="font-medium text-gray-900 dark:text-white">{report.assignedDepartmentName}</Text>
                </Text>
              </View>
            )}
          </View>

          {report.similarReports.length > 0 && (
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                Benzer Raporlar
              </Text>
              {report.similarReports.map((similar) => (
                <View
                  key={similar.reportId}
                  className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 mb-2 border border-yellow-200 dark:border-yellow-800"
                >
                  <Text className="text-sm font-medium text-gray-900 dark:text-white">
                    {similar.title}
                  </Text>
                  <View className="flex-row items-center gap-2 mt-1">
                    <StatusBadge status={similar.status} />
                    <Text className="text-xs text-yellow-700 dark:text-yellow-400">
                      %{Math.round(similar.similarityScore * 100)} benzerlik
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {report.history.length > 0 && (
            <View>
              <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Durum Geçmişi
              </Text>
              <HistoryTimeline history={report.history} />
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
