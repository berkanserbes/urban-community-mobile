import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { useAnnouncementById } from '@/features/announcements';
import { getApiErrorMessage } from '@/lib/utils/error';

export default function AnnouncementDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: announcement, isLoading, error } = useAnnouncementById(id || '');

  if (isLoading) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      </ScreenContainer>
    );
  }

  if (error || !announcement) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <Text className="text-red-500 text-center px-4">
            {getApiErrorMessage(error, 'Duyuru yuklenemedi.')}
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  const expiresAt = announcement.expiresAt ? new Date(announcement.expiresAt) : null;
  const now = new Date();
  const isExpired = expiresAt && expiresAt <= now;

  return (
    <ScreenContainer scrollable>
      <View className="gap-4">
        {/* Header */}
        <View className="gap-2">
          <View className="flex-row items-start justify-between gap-2">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                {announcement.title}
              </Text>
            </View>
            {isExpired && (
              <View className="bg-red-100 dark:bg-red-900/30 px-3 py-1.5 rounded-lg">
                <Text className="text-xs font-semibold text-red-700 dark:text-red-400">
                  Süresi Bitti
                </Text>
              </View>
            )}
          </View>

          {/* Meta */}
          <View className="gap-1">
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              {announcement.userFullName}
            </Text>
            <Text className="text-xs text-gray-500 dark:text-gray-500">
              {new Date(announcement.createdAt).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </View>

        {/* Location */}
        <View className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
          <Text className="text-sm font-medium text-blue-900 dark:text-blue-300">
            {announcement.scope === 'All'
              ? '🌐 Tüm Bölgeler'
              : `📍 ${[
                  announcement.provinceName,
                  announcement.districtName,
                  announcement.neighborhoodName,
                ]
                  .filter(Boolean)
                  .join(' / ')}`}
          </Text>
        </View>

        {/* Expiry Info */}
        {expiresAt && (
          <View className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <Text className="text-xs text-gray-600 dark:text-gray-400 mb-1">Geçerlilik:</Text>
            <Text className="text-sm font-medium text-gray-900 dark:text-white">
              {expiresAt.toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              {' kadar'}
            </Text>
          </View>
        )}

        {/* Content */}
        <View className="gap-2">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">İçerik</Text>
          <Text className="text-base text-gray-800 dark:text-gray-200 leading-relaxed">
            {announcement.content}
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}
