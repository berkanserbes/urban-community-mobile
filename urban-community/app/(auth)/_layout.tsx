import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@/features/auth';

export default function AuthLayout() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  if (token) {
    if (user?.neighborhoodId === null) {
      return <Redirect href="/(onboarding)/location-select" />;
    }
    return <Redirect href="/(app)/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
