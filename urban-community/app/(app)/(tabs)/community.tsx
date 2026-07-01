import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { CommunityPostCard } from '@/components/ui/CommunityPostCard';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { useProfile } from '@/features/user';
import { useCommunityPosts, type PostType } from '@/features/community';

const TYPE_FILTERS: { label: string; value: PostType | null; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: 'Hepsi', value: null, icon: 'grid-outline' },
  { label: 'Yardım', value: 'HelpRequested', icon: 'hand-left-outline' },
  { label: 'Ödünç', value: 'BorrowTool', icon: 'build-outline' },
  { label: 'Kayıp', value: 'LostAndFound', icon: 'search-outline' },
];

export default function CommunityScreen() {
  const { data: profile } = useProfile();
  const [activeFilter, setActiveFilter] = useState<PostType | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: posts = [],
    isLoading,
    refetch,
  } = useCommunityPosts({
    neighborhoodId: profile?.neighborhoodId ?? undefined,
    type: activeFilter ?? undefined,
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  return (
    <ScreenContainer scrollable={false}>
      <View className="flex-1">
        <View className="px-4 pt-4 pb-2">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">Topluluk</Text>
        </View>

        <View className="px-4 pb-2">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={TYPE_FILTERS}
            keyExtractor={(item) => item.label}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => setActiveFilter(item.value)}
                className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full mr-2 ${
                  activeFilter === item.value
                    ? 'bg-gray-200 dark:bg-gray-700'
                    : 'bg-gray-50 dark:bg-gray-800/50'
                }`}
              >
                <Ionicons
                  name={item.icon}
                  size={14}
                  color={activeFilter === item.value ? '#374151' : '#94a3b8'}
                />
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

        {isLoading && posts.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        ) : posts.length === 0 ? (
          <View className="flex-1 items-center justify-center px-4">
            <View className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center mb-4">
              <Ionicons name="people-outline" size={32} color="#94a3b8" />
            </View>
            <Text className="text-base text-gray-400 text-center">
              Mahallede henüz gönderi yok
            </Text>
            <Pressable
              onPress={() => router.push('/(app)/community-post/create' as any)}
              className="bg-blue-600 rounded-xl px-6 py-3 mt-4 active:opacity-80"
            >
              <Text className="text-white font-semibold">İlk Gönderiyi Yap</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
            renderItem={({ item }) => (
              <CommunityPostCard
                post={item}
                onPress={() => router.push(`/(app)/community-post/${item.id}` as any)}
              />
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563EB" />
            }
          />
        )}

        <Pressable
          onPress={() => router.push('/(app)/community-post/create' as any)}
          className="absolute -bottom-2 right-0 w-14 h-14 rounded-full bg-blue-600 items-center justify-center active:opacity-80 shadow-lg"
        >
          <Ionicons name="add" size={28} color="white" />
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
