import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { StatusBadge } from './StatusBadge';
import type { CommunityPostListItem, PostType } from '@/features/community';

const TYPE_CONFIG: Record<PostType, { icon: keyof typeof Ionicons.glyphMap; label: string; color: string }> = {
  HelpRequested: { icon: 'hand-left-outline', label: 'Yardım Talebi', color: '#ef4444' },
  BorrowTool: { icon: 'build-outline', label: 'Ödünç Eşya', color: '#f59e0b' },
  LostAndFound: { icon: 'search-outline', label: 'Kayıp/Buluntu', color: '#8b5cf6' },
};

interface CommunityPostCardProps {
  post: CommunityPostListItem;
  onPress: () => void;
}

export function CommunityPostCard({ post, onPress }: CommunityPostCardProps) {
  const typeConfig = TYPE_CONFIG[post.type] ?? TYPE_CONFIG.HelpRequested;

  const timeAgo = (date: string) => {
    const now = new Date();
    const created = new Date(date);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Az önce';
    if (diffMins < 60) return `${diffMins} dk önce`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} sa önce`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} gün önce`;
    return created.toLocaleDateString('tr-TR');
  };

  return (
    <Pressable
      onPress={onPress}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 border border-gray-200 dark:border-gray-700 active:opacity-70"
    >
      <View className="flex-row items-start gap-3">
        <View
          className="w-10 h-10 rounded-lg items-center justify-center flex-shrink-0"
          style={{ backgroundColor: typeConfig.color + '20' }}
        >
          <Ionicons name={typeConfig.icon} size={20} color={typeConfig.color} />
        </View>
        <View className="flex-1 min-w-0">
          <View className="flex-row items-center gap-2 mb-1">
            <Text
              className="text-xs font-semibold"
              style={{ color: typeConfig.color }}
            >
              {typeConfig.label}
            </Text>
            <StatusBadge status={post.status} />
          </View>
          <Text
            className="text-base font-semibold text-gray-900 dark:text-white"
            numberOfLines={1}
          >
            {post.title}
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1" numberOfLines={2}>
            {post.content}
          </Text>
          <View className="flex-row items-center gap-3 mt-2">
            <View className="flex-row items-center gap-1">
              <Ionicons name="person-outline" size={12} color="#94a3b8" />
              <Text className="text-xs text-gray-400 dark:text-gray-500" numberOfLines={1}>
                {post.userFullName}
              </Text>
            </View>
            {post.neighborhoodName && (
              <View className="flex-row items-center gap-1">
                <Ionicons name="location-outline" size={12} color="#94a3b8" />
                <Text className="text-xs text-gray-400 dark:text-gray-500" numberOfLines={1}>
                  {post.neighborhoodName}
                </Text>
              </View>
            )}
          </View>
          <View className="flex-row items-center gap-3 mt-1.5">
            <View className="flex-row items-center gap-1">
              <Ionicons name="chatbubble-outline" size={12} color="#94a3b8" />
              <Text className="text-xs text-gray-400">{post.commentCount}</Text>
            </View>
            {post.mediaCount > 0 && (
              <View className="flex-row items-center gap-1">
                <Ionicons name="image-outline" size={12} color="#94a3b8" />
                <Text className="text-xs text-gray-400">{post.mediaCount}</Text>
              </View>
            )}
            <Text className="text-xs text-gray-400 dark:text-gray-600 ml-auto">
              {timeAgo(post.createdAt)}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
