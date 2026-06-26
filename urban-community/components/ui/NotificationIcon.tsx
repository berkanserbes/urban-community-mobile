import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';

interface NotificationIconProps {
  onPress: () => void;
  unreadCount?: number;
}

export function NotificationIcon({ onPress, unreadCount = 0 }: NotificationIconProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center active:opacity-70"
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Ionicons name="notifications-outline" size={22} color="#374151" />
      {unreadCount > 0 && (
        <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center px-1 border-2 border-white dark:border-gray-900">
          <Text className="text-[10px] font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
