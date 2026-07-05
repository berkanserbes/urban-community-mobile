import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, ActivityIndicator, Image, Pressable, Text, View } from 'react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { authApi, useAuthStore } from '@/features/auth';
import { useProfile } from '@/features/user';
import { useUnreadCount } from '@/features/notifications';
import { queryClient } from '@/lib/api/query-client';
import { toAbsoluteUrl } from '@/lib/utils/url';

const ROLE_LABELS: Record<string, string> = {
  Citizen: 'Vatandaş',
  Official: 'Yetkili',
  Admin: 'Yönetici',
};

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  Citizen: { bg: 'bg-blue-100', text: 'text-blue-700' },
  Official: { bg: 'bg-green-100', text: 'text-green-700' },
  Admin: { bg: 'bg-purple-100', text: 'text-purple-700' },
};

function MenuItem({
  icon,
  label,
  onPress,
  danger,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-4 px-4 py-4 bg-white dark:bg-gray-800 active:opacity-70"
    >
      <View
        className={`w-9 h-9 rounded-full items-center justify-center ${danger ? 'bg-red-100' : 'bg-gray-100 dark:bg-gray-700'}`}
      >
        <Ionicons name={icon} size={18} color={danger ? '#EF4444' : '#6B7280'} />
      </View>
      <Text
        className={`flex-1 text-base ${danger ? 'text-red-500' : 'text-gray-800 dark:text-gray-100'}`}
      >
        {label}
      </Text>
      {!danger && <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />}
    </Pressable>
  );
}

function Divider() {
  return <View className="h-px bg-gray-100 dark:bg-gray-700 mx-4" />;
}

export default function ProfileScreen() {
  const authUser = useAuthStore((s) => s.user);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const logout = useAuthStore((s) => s.logout);
  const { data: profile, isLoading } = useProfile();
  const { data: unreadData } = useUnreadCount();
  const unreadCount = unreadData?.unreadCount ?? 0;

  const displayUser = profile ?? authUser;
  const initials =
    (displayUser?.firstName?.[0] ?? '?').toUpperCase() +
    (displayUser?.lastName?.[0] ?? '?').toUpperCase();
  const fullName = displayUser ? `${displayUser.firstName} ${displayUser.lastName}` : '';
  const roleKey = displayUser?.role ?? 'Citizen';
  const roleColor = ROLE_COLORS[roleKey] ?? { bg: 'bg-gray-100', text: 'text-gray-700' };

  async function performLogout() {
    if (refreshToken) {
      await authApi.logout(refreshToken).catch(() => {});
    }

    logout();
    queryClient.clear();
    router.replace('/(auth)/login');
  }

  function handleLogout() {
    Alert.alert('Çıkış Yap', 'Hesabından çıkmak istediğine emin misin?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Çıkış Yap',
        style: 'destructive',
        onPress: () => {
          void performLogout();
        },
      },
    ]);
  }

  return (
    <ScreenContainer scrollable>
      <View className="gap-6">
        {/* Avatar + bilgiler */}
        <View className="items-center gap-3 pt-4">
          {isLoading ? (
            <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center">
              <ActivityIndicator color="#2563EB" />
            </View>
          ) : profile?.profileImageUrl ? (
            <Image
              source={{ uri: toAbsoluteUrl(profile.profileImageUrl)! }}
              className="w-20 h-20 rounded-full"
            />
          ) : (
            <View className="w-20 h-20 rounded-full bg-blue-600 items-center justify-center">
              <Text className="text-3xl font-bold text-white">{initials}</Text>
            </View>
          )}

          <View className="items-center gap-1">
            <Text className="text-xl font-bold text-gray-900 dark:text-white">{fullName}</Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">{displayUser?.email}</Text>
            {profile?.neighborhoodName && (
              <Text className="text-xs text-gray-400 dark:text-gray-500">
                📍 {profile.neighborhoodName}
              </Text>
            )}
            <View className={`mt-1 px-3 py-1 rounded-full ${roleColor.bg}`}>
              <Text className={`text-xs font-semibold ${roleColor.text}`}>
                {ROLE_LABELS[roleKey]}
              </Text>
            </View>
          </View>

          {profile?.bio && (
            <Text className="text-sm text-center text-gray-500 dark:text-gray-400 px-6">
              {profile.bio}
            </Text>
          )}
        </View>

        {/* Hesap menüsü */}
        <View className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <MenuItem
            icon="person-outline"
            label="Profili Düzenle"
            onPress={() => router.push('/(app)/edit-profile' as any)}
          />
          <Divider />
          <MenuItem
            icon="lock-closed-outline"
            label="Şifre Değiştir"
            onPress={() => router.push('/(app)/change-password' as any)}
          />
          <Divider />
          <MenuItem
            icon="location-outline"
            label="Konum Değiştir"
            onPress={() => router.push('/(app)/change-location' as any)}
          />
          <Divider />
          <MenuItem
            icon="document-text-outline"
            label="Raporlarım"
            onPress={() => router.push('/(app)/(tabs)/reports' as any)}
          />
          <Divider />
          <MenuItem
            icon="notifications-outline"
            label={`Bildirimler${unreadCount > 0 ? ` (${unreadCount})` : ''}`}
            onPress={() => router.push('/(app)/notifications' as any)}
          />
        </View>

        {/* Çıkış */}
        <View className="rounded-xl overflow-hidden border border-red-100 dark:border-red-900/30">
          <MenuItem
            icon="log-out-outline"
            label="Çıkış Yap"
            onPress={handleLogout}
            danger
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

