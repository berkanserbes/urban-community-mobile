import { Text, View } from 'react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';

export default function ReportsScreen() {
  return (
    <ScreenContainer>
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">Raporlar</Text>
        <Text className="mt-2 text-gray-500">Raporların burada görünecek</Text>
      </View>
    </ScreenContainer>
  );
}
