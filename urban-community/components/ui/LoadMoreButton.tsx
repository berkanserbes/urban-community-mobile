import { ActivityIndicator, Pressable, Text } from 'react-native';

interface LoadMoreButtonProps {
  visible: boolean;
  loading: boolean;
  onPress: () => void;
  label?: string;
}

/** "Load more" for paged lists rendered inside a ScrollView, where onEndReached is not available. */
export function LoadMoreButton({ visible, loading, onPress, label = 'Daha fazla yükle' }: LoadMoreButtonProps) {
  if (!visible) return null;

  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      className="items-center py-3 mb-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 active:opacity-80"
    >
      {loading ? (
        <ActivityIndicator color="#2563EB" />
      ) : (
        <Text className="text-sm font-medium text-blue-600 dark:text-blue-400">{label}</Text>
      )}
    </Pressable>
  );
}
