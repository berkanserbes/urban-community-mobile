import { Ionicons } from '@expo/vector-icons';
import { useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import type { NotificationDto } from '@/features/notifications';

interface NotificationCardProps {
  notification: NotificationDto;
  onPress: () => void;
  onMarkRead: () => void;
  onDelete: () => void;
}

function getIcon(type: string | null): keyof typeof Ionicons.glyphMap {
  switch (type) {
    case 'Report':
      return 'clipboard-outline';
    case 'Suggestion':
      return 'bulb-outline';
    case 'Announcement':
      return 'megaphone-outline';
    case 'CommunityPost':
      return 'people-outline';
    default:
      return 'notifications-outline';
  }
}

export function NotificationCard({
  notification,
  onPress,
  onMarkRead,
  onDelete,
}: NotificationCardProps) {
  const swipeableRef = useRef<Swipeable>(null);

  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    const translateX = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [0, 80],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={{ transform: [{ translateX }] }}
        className="justify-center ml-2"
      >
        <Pressable
          onPress={() => {
            swipeableRef.current?.close();
            onDelete();
          }}
          className="w-16 h-full rounded-xl bg-red-500 items-center justify-center"
        >
          <Ionicons name="trash-outline" size={20} color="white" />
        </Pressable>
      </Animated.View>
    );
  };

  const renderLeftActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    const translateX = dragX.interpolate({
      inputRange: [0, 80],
      outputRange: [-80, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={{ transform: [{ translateX }] }}
        className="justify-center mr-2"
      >
        <Pressable
          onPress={() => {
            swipeableRef.current?.close();
            if (notification.isRead) return;
            onMarkRead();
          }}
          className={`w-20 h-full rounded-xl items-center justify-center ${
            notification.isRead ? 'bg-gray-300' : 'bg-blue-500'
          }`}
        >
          <Ionicons
            name={notification.isRead ? 'checkmark-done' : 'checkmark'}
            size={20}
            color="white"
          />
          <Text className="text-xs text-white font-medium mt-0.5">
            {notification.isRead ? 'Okundu' : 'Oku'}
          </Text>
        </Pressable>
      </Animated.View>
    );
  };

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
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
      overshootLeft={false}
      overshootRight={false}
    >
      <Pressable
        onPress={onPress}
        className={`bg-white dark:bg-gray-800 px-4 py-3.5 border-b border-gray-100 dark:border-gray-700 active:opacity-70 ${
          !notification.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
        }`}
      >
        <View className="flex-row items-start gap-3">
          <View
            className={`w-10 h-10 rounded-full items-center justify-center flex-shrink-0 ${
              !notification.isRead
                ? 'bg-blue-100 dark:bg-blue-900/30'
                : 'bg-gray-100 dark:bg-gray-700'
            }`}
          >
            <Ionicons
              name={getIcon(notification.relatedEntityType)}
              size={18}
              color={!notification.isRead ? '#2563EB' : '#94a3b8'}
            />
          </View>
          <View className="flex-1 min-w-0">
            <View className="flex-row items-center gap-2">
              {!notification.isRead && (
                <View className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
              )}
              <Text
                className={`text-sm flex-1 ${
                  !notification.isRead
                    ? 'font-semibold text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
                numberOfLines={1}
              >
                {notification.title}
              </Text>
            </View>
            <Text
              className={`text-xs mt-0.5 ${
                !notification.isRead
                  ? 'text-gray-600 dark:text-gray-400'
                  : 'text-gray-500 dark:text-gray-500'
              }`}
              numberOfLines={2}
            >
              {notification.message}
            </Text>
            <Text className="text-xs text-gray-400 dark:text-gray-600 mt-1">
              {timeAgo(notification.createdAt)}
            </Text>
          </View>
        </View>
      </Pressable>
    </Swipeable>
  );
}
