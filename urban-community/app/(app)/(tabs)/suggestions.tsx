import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { SuggestionCard } from '@/components/ui/SuggestionCard';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { useAuthStore } from '@/features/auth';
import { useProfile } from '@/features/user';
import { useSuggestions, useVote, type SuggestionStatus } from '@/features/suggestions';

const STATUS_FILTERS: { label: string; value: SuggestionStatus | null }[] = [
  { label: 'Tümü', value: null },
  { label: 'Aktif', value: 'Active' },
  { label: 'İncelemede', value: 'Reviewing' },
  { label: 'Uygulamada', value: 'Implementation' },
];

export default function SuggestionsScreen() {
  const { data: profile } = useProfile();
  const [activeFilter, setActiveFilter] = useState<SuggestionStatus | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: suggestions = [],
    isLoading,
    refetch,
  } = useSuggestions({
    neighborhoodId: profile?.neighborhoodId ?? undefined,
    status: activeFilter ?? undefined,
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const [loadingVotes, setLoadingVotes] = useState<Record<string, boolean>>({});

  return (
    <ScreenContainer scrollable={false}>
      <View className="flex-1">
        <View className="px-4 pt-4 pb-2">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">Öneriler</Text>
        </View>

        <View className="px-4 pb-2">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={STATUS_FILTERS}
            keyExtractor={(item) => item.label}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => setActiveFilter(item.value)}
                className={`px-3 py-1.5 rounded-full mr-2 ${
                  activeFilter === item.value
                    ? 'bg-gray-200 dark:bg-gray-700'
                    : 'bg-gray-50 dark:bg-gray-800/50'
                }`}
              >
                <Text
                  className={`text-xs ${
                    activeFilter === item.value
                      ? 'text-gray-900 dark:text-white font-medium'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {item.label}
                </Text>
              </Pressable>
            )}
          />
        </View>

        {isLoading && suggestions.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        ) : suggestions.length === 0 ? (
          <View className="flex-1 items-center justify-center px-4">
            <View className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 items-center justify-center mb-4">
              <Ionicons name="bulb-outline" size={32} color="#9333ea" />
            </View>
            <Text className="text-base text-gray-400 text-center">
              Mahallede henüz öneri yok
            </Text>
            <Pressable
              onPress={() => router.push('/(app)/suggestion/create' as any)}
              className="bg-purple-600 rounded-xl px-6 py-3 mt-4 active:opacity-80"
            >
              <Text className="text-white font-semibold">İlk Öneriyi Yap</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
            renderItem={({ item }) => (
              <SuggestionCardWrapper
                suggestion={item}
                onPress={() => router.push(`/(app)/suggestion/${item.id}` as any)}
              />
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563EB" />
            }
          />
        )}

        <Pressable
          onPress={() => router.push('/(app)/suggestion/create' as any)}
          className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-purple-600 items-center justify-center active:opacity-80 shadow-lg"
        >
          <Ionicons name="add" size={28} color="white" />
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

function SuggestionCardWrapper({
  suggestion,
  onPress,
}: {
  suggestion: { id: string; upVotes: number; downVotes: number; voteScore: number; title: string; status: string; content: string; userFullName: string; createdAt: string };
  onPress: () => void;
}) {
  const { vote, removeVote } = useVote(suggestion.id);

  return (
    <SuggestionCard
      suggestion={suggestion as any}
      onPress={onPress}
      onVote={(isUpvote) => vote.mutate(isUpvote)}
      onRemoveVote={() => removeVote.mutate()}
      isLoadingVote={vote.isPending || removeVote.isPending}
    />
  );
}
