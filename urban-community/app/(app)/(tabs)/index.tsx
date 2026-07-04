import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ActivityIndicator, Image, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnnouncementCard } from '@/components/ui/AnnouncementCard';
import { CommunityPostCard } from '@/components/ui/CommunityPostCard';
import { FeedSection } from '@/components/ui/FeedSection';
import { NotificationIcon } from '@/components/ui/NotificationIcon';
import { ReportCard } from '@/components/ui/ReportCard';
import { useAuthStore } from '@/features/auth';
import { useAnnouncements } from '@/features/announcements';
import { useReports } from '@/features/reports';
import { useCommunityPosts } from '@/features/community';
import { useProfile } from '@/features/user';
import { useUnreadCount } from '@/features/notifications';
import { toAbsoluteUrl } from '@/lib/utils/url';
import { useCallback, useState } from 'react';

function Avatar({ imageUrl, initials }: { imageUrl: string | null; initials: string }) {
  if (imageUrl) {
    return (
      <Image
        source={{ uri: toAbsoluteUrl(imageUrl)! }}
        className="w-12 h-12 rounded-full"
      />
    );
  }
  return (
    <View className="w-12 h-12 rounded-full bg-blue-600 items-center justify-center">
      <Text className="text-lg font-bold text-white">{initials}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const [refreshing, setRefreshing] = useState(false);

  const { data: profile, isLoading: profileLoading } = useProfile();

  const { data: reports = [], isLoading: reportsLoading, refetch: refetchReports } = useReports({
    neighborhoodId: user?.neighborhoodId ?? undefined,
  });

  const announcementNeighborhoodId = profile?.neighborhoodId ?? user?.neighborhoodId ?? undefined;
  const { data: announcements = [], isLoading: announcementsLoading, refetch: refetchAnnouncements } = useAnnouncements({
    provinceId: profile?.provinceId ?? undefined,
    districtId: profile?.districtId ?? undefined,
    neighborhoodId: announcementNeighborhoodId,
  });

  const { data: communityPosts = [], isLoading: communityLoading, refetch: refetchCommunity } = useCommunityPosts({
    neighborhoodId: user?.neighborhoodId ?? undefined,
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchReports(), refetchAnnouncements(), refetchCommunity()]);
    setRefreshing(false);
  }, [refetchReports, refetchAnnouncements, refetchCommunity]);

  const { data: unreadData } = useUnreadCount();

  const displayUser = profile ?? user;
  const initials =
    (displayUser?.firstName?.[0] ?? '').toUpperCase() +
    (displayUser?.lastName?.[0] ?? '').toUpperCase();
  const fullName = displayUser ? `${displayUser.firstName} ${displayUser.lastName}` : '';
  const recentReports = reports.slice(0, 3);
  const recentAnnouncements = announcements.slice(0, 3);
  const recentPosts = communityPosts.slice(0, 3);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900" edges={['top', 'left', 'right']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 0 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#2563EB"
          />
        }
      >
        <View className="flex-row items-center justify-between px-3 pt-3 pb-4">
          <View className="flex-row items-center gap-3">
            {profileLoading ? (
              <View className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center">
                <ActivityIndicator size="small" color="#2563EB" />
              </View>
            ) : (
              <Avatar
                imageUrl={profile?.profileImageUrl ?? null}
                initials={initials || '?'}
              />
            )}
            <View>
              <Text className="text-sm text-gray-500 dark:text-gray-400">Hoşgeldin</Text>
              <Text className="text-lg font-bold text-gray-900 dark:text-white" numberOfLines={1}>
                {fullName || '...'}
              </Text>
            </View>
          </View>
          <NotificationIcon
            onPress={() => router.push('/(app)/notifications' as any)}
            unreadCount={unreadData?.unreadCount ?? 0}
          />
        </View>

        <View className="px-3">
          <FeedSection
            title="Son Raporlar"
            icon="clipboard-outline"
            onViewAll={() => router.push('/(app)/(tabs)/reports' as any)}
          >
            {reportsLoading ? (
              <View className="py-6 items-center">
                <ActivityIndicator size="small" color="#2563EB" />
              </View>
            ) : recentReports.length > 0 ? (
              recentReports.map((item) => (
                <ReportCard
                  key={item.id}
                  report={item}
                  onPress={() => router.push(`/(app)/report/${item.id}` as any)}
                />
              ))
            ) : (
              <View className="items-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <Ionicons name="clipboard-outline" size={32} color="#cbd5e1" />
                <Text className="text-sm text-gray-400 mt-2">Henüz rapor yok</Text>
              </View>
            )}
          </FeedSection>

          <FeedSection
            title="Son Duyurular"
            icon="megaphone-outline"
            onViewAll={() => router.push('/(app)/announcements' as any)}
          >
            {announcementsLoading ? (
              <View className="py-6 items-center">
                <ActivityIndicator size="small" color="#2563EB" />
              </View>
            ) : recentAnnouncements.length > 0 ? (
              recentAnnouncements.map((item) => (
                <AnnouncementCard
                  key={item.id}
                  announcement={item}
                  onPress={() => router.push(`/(app)/announcement/${item.id}` as any)}
                />
              ))
            ) : (
              <View className="items-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <Ionicons name="megaphone-outline" size={32} color="#cbd5e1" />
                <Text className="text-sm text-gray-400 mt-2">Henüz duyuru yok</Text>
              </View>
            )}
          </FeedSection>

          <FeedSection
            title="Topluluk Gönderileri"
            icon="people-outline"
            onViewAll={() => router.push('/(app)/(tabs)/community' as any)}
          >
            {communityLoading ? (
              <View className="py-6 items-center">
                <ActivityIndicator size="small" color="#2563EB" />
              </View>
            ) : recentPosts.length > 0 ? (
              recentPosts.map((item) => (
                <CommunityPostCard
                  key={item.id}
                  post={item}
                  onPress={() => router.push(`/(app)/community-post/${item.id}` as any)}
                />
              ))
            ) : (
              <View className="items-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <Ionicons name="people-outline" size={32} color="#cbd5e1" />
                <Text className="text-sm text-gray-400 mt-2">Henüz gönderi yok</Text>
              </View>
            )}
          </FeedSection>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
