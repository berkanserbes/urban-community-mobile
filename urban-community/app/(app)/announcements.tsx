import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from 'react-native';
import { AnnouncementCard } from '@/components/ui/AnnouncementCard';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { useProfile } from '@/features/user';
import { useAnnouncements } from '@/features/announcements';

export default function AnnouncementsScreen() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const {
    data: announcements = [],
    isLoading: announcementsLoading,
    refetch,
  } = useAnnouncements({
    provinceId: profile?.provinceId ?? undefined,
    districtId: profile?.districtId ?? undefined,
    neighborhoodId: profile?.neighborhoodId ?? undefined,
  });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (profileLoading || announcementsLoading) {
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
      <FlatList
        data={announcements}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
        ListHeaderComponent={
          <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Duyurular</Text>
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <Text className="text-gray-500 dark:text-gray-400">Henüz duyuru yok</Text>
          </View>
        }
        renderItem={({ item }) => (
          <AnnouncementCard
            announcement={item}
            onPress={() => router.push(`/(app)/announcement/${item.id}` as any)}
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </ScreenContainer>
  );
}
