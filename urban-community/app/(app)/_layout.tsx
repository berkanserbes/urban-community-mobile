import { useQueryClient } from '@tanstack/react-query';
import { Redirect, Stack } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { useAuthStore } from '@/features/auth';
import { notificationKeys } from '@/features/notifications';
import { connectSignalR, disconnectSignalR, onSignalREvent } from '@/lib/api/signalr';

const NOTIFICATION_EVENTS = [
  'NewNotification',
  'SuggestionStatusChanged',
  'SuggestionOfficialResponseUpdated',
  'FileUploadCompleted',
  'FileUploadFailed',
] as const;

export default function AppLayout() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const invalidateNotifications = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: notificationKeys.all });
  }, [queryClient]);

  useEffect(() => {
    if (!token) return;

    connectSignalR().catch(() => {});

    const unsubs = NOTIFICATION_EVENTS.map((event) =>
      onSignalREvent(event, invalidateNotifications)
    );

    return () => {
      unsubs.forEach((unsub) => unsub());
      disconnectSignalR();
    };
  }, [token, invalidateNotifications]);

  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }

  if (user?.neighborhoodId === null) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <Redirect href={'/(onboarding)/location-select' as any} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, headerBackTitle: '', headerBackButtonDisplayMode: 'minimal' }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="notifications" options={{ headerShown: true, title: 'Bildirimler' }} />
      <Stack.Screen name="announcements" options={{ headerShown: true, title: 'Duyurular' }} />
      <Stack.Screen name="edit-profile" options={{ headerShown: true, title: 'Profili Düzenle' }} />
      <Stack.Screen name="change-password" options={{ headerShown: true, title: 'Şifre Değiştir' }} />
      <Stack.Screen name="change-location" options={{ headerShown: true, title: 'Konum Değiştir' }} />
      <Stack.Screen name="announcement/[id]" options={{ headerShown: true, title: 'Duyuru' }} />
      <Stack.Screen name="suggestion/[id]" options={{ headerShown: true, title: 'Öneri Detay' }} />
      <Stack.Screen name="suggestion/create" options={{ headerShown: true, title: 'Yeni Öneri' }} />
      <Stack.Screen name="community-post/[id]" options={{ headerShown: true, title: 'Gönderi' }} />
      <Stack.Screen name="community-post/create" options={{ headerShown: true, title: 'Yeni Gönderi' }} />
      <Stack.Screen name="report/[id]" options={{ headerShown: true, title: 'Rapor Detay' }} />
      <Stack.Screen name="report/create" options={{ headerShown: true, title: 'Yeni Rapor' }} />
    </Stack>
  );
}
