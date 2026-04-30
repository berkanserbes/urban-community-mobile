import { Text, View } from 'react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';

export default function ProfileScreen() {
  return (
    <ScreenContainer>
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">Profil</Text>
        <Text className="mt-2 text-gray-500">Profil bilgilerin burada görünecek</Text>
      </View>
    </ScreenContainer>
  );
}
