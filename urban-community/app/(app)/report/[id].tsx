import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { useReportById, type ReportHistoryDto, type ReportPriority } from '@/features/reports';
import { toAbsoluteUrl } from '@/lib/utils/url';
import { getApiErrorMessage } from '@/lib/utils/error';

const PRIORITY_LABELS: Record<ReportPriority, string> = {
  Low: 'Düşük',
  Medium: 'Orta',
  High: 'Yüksek',
  Urgent: 'Acil',
};

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
  const { data: report, isLoading, isError, error } = useReportById(id ?? null);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  if (isLoading) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      </ScreenContainer>
    );
  }

  if (isError || !report) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center px-4">
          <Ionicons name="warning-outline" size={40} color="#ef4444" />
          <Text className="text-base text-red-500 text-center mt-3">
            {getApiErrorMessage(error, 'Rapor yuklenemedi.')}
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  const sortedHistory = [...report.history].sort(
    (a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
  );
  const aiReviewNote = sortedHistory.find(
    (item) =>
      item.changedByUserFullName === null &&
      item.note?.toLowerCase().includes('ai')
  )?.note;
  const aiReviewText =
    report.status === 'AiReview'
      ? 'AI incelemesi devam ediyor. Kategori, öncelik ve benzer rapor analizi tamamlanınca burada görünecek.'
      : aiReviewNote ?? 'AI inceleme notu bulunamadı.';

  return (
    <ScreenContainer scrollable={false}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {report.media.length > 0 && (
          <FlatList
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            data={report.media}
            keyExtractor={(item) => item.id}
            className="h-56 mb-4"
            renderItem={({ item }) => (
              <Pressable onPress={() => setPreviewIndex(report.media.indexOf(item))}>
                <View className="w-screen h-56 rounded-xl overflow-hidden mr-2 bg-gray-100 dark:bg-gray-800">
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
              </Pressable>
            )}
          />
        )}

        <Modal
          visible={previewIndex !== null}
          transparent
          animationType="fade"
          statusBarTranslucent
          onRequestClose={() => setPreviewIndex(null)}
        >
          <View className="flex-1 bg-black/90 justify-center">
            <Pressable className="flex-1 justify-center" onPress={() => setPreviewIndex(null)}>
              {previewIndex !== null && report.media[previewIndex] && (
                <Image
                  source={{ uri: toAbsoluteUrl(report.media[previewIndex].url)! }}
                  className="w-full"
                  style={{ height: Dimensions.get('window').height * 0.65 }}
                  resizeMode="contain"
                />
              )}
            </Pressable>
            <View className="flex-row items-center justify-between px-5 pb-8 pt-4">
              <Text className="text-sm text-white/60">
                {previewIndex !== null ? previewIndex + 1 : 0} / {report.media.length}
              </Text>
              <Pressable
                className="w-10 h-10 rounded-full bg-white/15 items-center justify-center active:bg-white/30"
                onPress={() => setPreviewIndex(null)}
              >
                <Ionicons name="close" size={22} color="white" />
              </Pressable>
            </View>
          </View>
        </Modal>

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

          <View className="bg-indigo-50 dark:bg-indigo-950/30 rounded-xl p-4 mb-6 border border-indigo-100 dark:border-indigo-900/50">
            <View className="flex-row items-center gap-2 mb-3">
              <Ionicons name="sparkles-outline" size={18} color="#4f46e5" />
              <Text className="text-lg font-bold text-gray-900 dark:text-white">
                AI İncelemesi
              </Text>
            </View>
            <Text className="text-sm text-gray-700 dark:text-gray-300 leading-5 mb-3">
              {aiReviewText}
            </Text>
            <View className="flex-row flex-wrap gap-2">
              <View className="rounded-full bg-white dark:bg-gray-800 px-3 py-1 border border-indigo-100 dark:border-indigo-900">
                <Text className="text-xs font-medium text-gray-700 dark:text-gray-200">
                  Kategori: {report.categoryName}
                </Text>
              </View>
              <View className="rounded-full bg-white dark:bg-gray-800 px-3 py-1 border border-indigo-100 dark:border-indigo-900">
                <Text className="text-xs font-medium text-gray-700 dark:text-gray-200">
                  Öncelik: {PRIORITY_LABELS[report.priority]}
                </Text>
              </View>
              <View className="rounded-full bg-white dark:bg-gray-800 px-3 py-1 border border-indigo-100 dark:border-indigo-900">
                <Text className="text-xs font-medium text-gray-700 dark:text-gray-200">
                  Benzer: {report.similarReports.length}
                </Text>
              </View>
            </View>
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
                  {similar.reasoning && (
                    <Text className="text-xs text-gray-600 dark:text-gray-400 leading-5 mt-2">
                      {similar.reasoning}
                    </Text>
                  )}
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
