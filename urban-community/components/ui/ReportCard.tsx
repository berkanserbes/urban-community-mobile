import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, Text, View } from 'react-native';
import type { ReportListItem } from '@/features/reports';
import { StatusBadge } from './StatusBadge';

interface ReportCardProps {
  report: ReportListItem;
  onPress: () => void;
}

export function ReportCard({ report, onPress }: ReportCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 border border-gray-200 dark:border-gray-700 active:opacity-70"
    >
      <View className="flex-row items-start gap-3">
        <View className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 items-center justify-center flex-shrink-0 overflow-hidden">
          {report.thumbnailUrl ? (
            <Image source={{ uri: report.thumbnailUrl }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <Ionicons name="document-text-outline" size={22} color="#64748b" />
          )}
        </View>
        <View className="flex-1 min-w-0">
          <View className="flex-row items-start justify-between gap-2">
            <Text
              className="text-base font-semibold text-gray-900 dark:text-white flex-1"
              numberOfLines={1}
            >
              {report.title}
            </Text>
            <StatusBadge status={report.status} />
          </View>
          <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1" numberOfLines={2}>
            {report.description}
          </Text>
          <View className="flex-row items-center gap-3 mt-2">
            <View className="flex-row items-center gap-1">
              <Ionicons name="person-outline" size={12} color="#94a3b8" />
              <Text className="text-xs text-gray-400 dark:text-gray-500" numberOfLines={1}>
                {report.reporterName}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="location-outline" size={12} color="#94a3b8" />
              <Text className="text-xs text-gray-400 dark:text-gray-500" numberOfLines={1}>
                {report.neighborhoodName}
              </Text>
            </View>
          </View>
          <Text className="text-xs text-gray-400 dark:text-gray-600 mt-1">
            {new Date(report.createdAt).toLocaleDateString('tr-TR')}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
