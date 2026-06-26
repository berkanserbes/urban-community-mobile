import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

interface FeedSectionProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onViewAll?: () => void;
  children: ReactNode;
}

export function FeedSection({ title, icon, onViewAll, children }: FeedSectionProps) {
  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between mb-2 px-1">
        <View className="flex-row items-center gap-2">
          <Ionicons name={icon} size={20} color="#64748b" />
          <Text className="text-lg font-bold text-gray-900 dark:text-white">{title}</Text>
        </View>
        {onViewAll && (
          <Pressable onPress={onViewAll} className="flex-row items-center gap-1 active:opacity-70">
            <Text className="text-sm font-medium text-blue-600">Tümünü Gör</Text>
            <Ionicons name="chevron-forward" size={14} color="#2563EB" />
          </Pressable>
        )}
      </View>
      {children}
    </View>
  );
}
