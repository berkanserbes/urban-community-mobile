import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@/features/auth';

export default function AppLayout() {
  const token = useAuthStore((s) => s.token);

  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="report/[id]" options={{ headerShown: true, title: 'Rapor Detay' }} />
      <Stack.Screen name="report/create" options={{ headerShown: true, title: 'Yeni Rapor' }} />
    </Stack>
  );
}
