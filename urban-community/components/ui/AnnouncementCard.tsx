import { Pressable, Text, View } from 'react-native';
import type { AnnouncementDto } from '@/features/announcements';

interface AnnouncementCardProps {
  announcement: AnnouncementDto;
  onPress: () => void;
}

export function AnnouncementCard({ announcement, onPress }: AnnouncementCardProps) {
  const expiresAt = announcement.expiresAt ? new Date(announcement.expiresAt) : null;
  const now = new Date();
  const isExpiringSoon =
    expiresAt && expiresAt.getTime() - now.getTime() < 24 * 60 * 60 * 1000 && expiresAt > now;
  const isExpired = expiresAt && expiresAt <= now;

  return (
    <Pressable
      onPress={onPress}
      className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-3 border border-gray-200 dark:border-gray-700 active:opacity-70"
    >
      <View className="flex-row items-start justify-between gap-2 mb-2">
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-900 dark:text-white">
            {announcement.title}
          </Text>
        </View>
        {isExpired && (
          <View className="bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">
            <Text className="text-xs font-medium text-red-700 dark:text-red-400">Süresi Bitti</Text>
          </View>
        )}
        {isExpiringSoon && (
          <View className="bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded">
            <Text className="text-xs font-medium text-yellow-700 dark:text-yellow-400">
              Bitmek Üzere
            </Text>
          </View>
        )}
      </View>

      <Text className="text-sm text-gray-600 dark:text-gray-400 mb-3" numberOfLines={2}>
        {announcement.content}
      </Text>

      <View className="flex-row items-center justify-between">
        <Text className="text-xs text-gray-500 dark:text-gray-500">
          {announcement.userFullName}
        </Text>
        <Text className="text-xs text-gray-400 dark:text-gray-600">
          {new Date(announcement.createdAt).toLocaleDateString('tr-TR')}
        </Text>
      </View>

      {announcement.neighborhoodName && (
        <Text className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          📍 {announcement.neighborhoodName}
        </Text>
      )}
    </Pressable>
  );
}
