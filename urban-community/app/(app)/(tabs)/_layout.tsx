import { Tabs } from 'expo-router';
import { Text } from 'react-native';

function TabIcon({ label, emoji }: { label: string; emoji: string }) {
  return <Text>{emoji}</Text>;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: () => <TabIcon label="Ana Sayfa" emoji="🏠" />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Raporlar',
          tabBarIcon: () => <TabIcon label="Raporlar" emoji="📋" />,
        }}
      />
      <Tabs.Screen
        name="suggestions"
        options={{
          title: 'Öneriler',
          tabBarIcon: () => <TabIcon label="Öneriler" emoji="💡" />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Topluluk',
          tabBarIcon: () => <TabIcon label="Topluluk" emoji="👥" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: () => <TabIcon label="Profil" emoji="👤" />,
        }}
      />
    </Tabs>
  );
}
