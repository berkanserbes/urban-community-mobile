import { Text, View } from 'react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';

export default function CommunityScreen() {
  return (
    <ScreenContainer>
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">Topluluk</Text>
        <Text className="mt-2 text-gray-500">Mahalle paylaşımları burada görünecek</Text>
      </View>
    </ScreenContainer>
  );
}
