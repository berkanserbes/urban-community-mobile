import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState , useCallback} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { NotificationCard } from '@/components/ui/NotificationCard';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import {
  useNotifications,
  useMarkAsRead,
  useUnreadCount,
  notificationsApi,
  notificationKeys
} from '@/features/notifications';
import { useQueryClient } from '@tanstack/react-query';
import type { NotificationDto } from '@/features/notifications';

function handleNotificationPress(notification: NotificationDto) {
  if (!notification.relatedEntityId) return;

  switch (notification.relatedEntityType) {
    case 'Report':
      router.push(`/(app)/report/${notification.relatedEntityId}` as any);
      break;
    case 'Suggestion':
      router.push(`/(app)/suggestion/${notification.relatedEntityId}` as any);
      break;
    case 'Announcement':
      router.push(`/(app)/announcement/${notification.relatedEntityId}` as any);
      break;
    case 'CommunityPost':
      router.push(`/(app)/community-post/${notification.relatedEntityId}` as any);
      break;
  }
}

function handleDeleteNotification(item: NotificationDto, queryClient: ReturnType<typeof useQueryClient>) {
  Alert.alert(
    'Bildirimi Sil',
    'Bu bildirim silinsin mi?',
    [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          await notificationsApi.deleteNotification(item.id);
          queryClient.invalidateQueries({ queryKey: notificationKeys.all });
        },
      },
    ],
  );
}

export default function NotificationsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { data: notifications = [], isLoading, refetch } = useNotifications();
  const { markAsRead, markAllAsRead: markAll } = useMarkAsRead();
  const { data: unreadData } = useUnreadCount();
  const queryClient = useQueryClient();
  const unreadCount = unreadData?.unreadCount ?? 0;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleMarkAllRead = () => {
    if (unreadCount === 0) return;
    Alert.alert('Tümünü Okundu İşaretle', 'Tüm bildirimler okundu olarak işaretlensin mi?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'İşaretle',
        onPress: () => markAll.mutate(),
      },
    ]);
  };

  const handleDeleteAll = () => {
    if (notifications.length === 0) return;
    Alert.alert('Tümünü Sil', 'Tüm bildirimler silinsin mi? Bu işlem geri alınamaz.', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          await notificationsApi.deleteAll();
          queryClient.invalidateQueries({ queryKey: notificationKeys.all });
        },
      },
    ]);
  };

  return (
    <ScreenContainer scrollable={false}>
      <View className="flex-1">
        <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
          <View className="flex-row items-center gap-2">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">Bildirimler</Text>
            {unreadCount > 0 && (
              <View className="bg-blue-600 rounded-full px-2 py-0.5 min-w-[22px] items-center">
                <Text className="text-xs font-bold text-white">{unreadCount}</Text>
              </View>
            )}
          </View>
          <View className="flex-row gap-2">
            {unreadCount > 0 && (
              <Pressable
                onPress={handleMarkAllRead}
                className="px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 active:opacity-70"
              >
                <Text className="text-xs font-medium text-blue-600 dark:text-blue-400">
                  Tümünü Oku
                </Text>
              </Pressable>
            )}
            {notifications.length > 0 && (
              <Pressable
                onPress={handleDeleteAll}
                className="px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/30 active:opacity-70"
              >
                <Text className="text-xs font-medium text-red-600 dark:text-red-400">
                  Tümünü Sil
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        {isLoading && notifications.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        ) : notifications.length === 0 ? (
          <View className="flex-1 items-center justify-center px-4">
            <View className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center mb-4">
              <Ionicons name="notifications-off-outline" size={32} color="#94a3b8" />
            </View>
            <Text className="text-base text-gray-400 text-center">Henüz bildirim yok</Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <NotificationCard
                notification={item}
                onPress={() => handleNotificationPress(item)}
                onMarkRead={() => markAsRead.mutate(item.id)}
                onDelete={() => handleDeleteNotification(item, queryClient)}
              />
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563EB" />
            }
          />
        )}
      </View>
    </ScreenContainer>
  );
}
