import { ActivityIndicator, View } from 'react-native';

/** Spinner shown under an infinite list while the next page loads. */
export function ListFooterLoader({ loading }: { loading: boolean }) {
  if (!loading) return null;

  return (
    <View className="py-4 items-center">
      <ActivityIndicator color="#2563EB" />
    </View>
  );
}
