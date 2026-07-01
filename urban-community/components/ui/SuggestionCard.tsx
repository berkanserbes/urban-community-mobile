import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { StatusBadge } from './StatusBadge';
import { VoteButtons } from './VoteButtons';
import type { SuggestionListItem } from '@/features/suggestions';

interface SuggestionCardProps {
  suggestion: SuggestionListItem;
  currentUserVote?: boolean | null;
  onPress: () => void;
  onVote: (isUpvote: boolean) => void;
  onRemoveVote: () => void;
  isLoadingVote?: boolean;
}

export function SuggestionCard({
  suggestion,
  currentUserVote,
  onPress,
  onVote,
  onRemoveVote,
  isLoadingVote = false,
}: SuggestionCardProps) {
  return (
    <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 border border-gray-200 dark:border-gray-700">
      <View className="flex-row gap-3">
        <VoteButtons
          upVotes={suggestion.upVotes}
          downVotes={suggestion.downVotes}
          voteScore={suggestion.voteScore}
          currentUserVote={currentUserVote}
          onVote={onVote}
          onRemoveVote={onRemoveVote}
          isLoading={isLoadingVote}
        />
        <Pressable onPress={onPress} className="flex-1 min-w-0 active:opacity-70">
          <View className="flex-row items-start justify-between gap-2 mb-1">
            <Text
              className="text-base font-semibold text-gray-900 dark:text-white flex-1"
              numberOfLines={1}
            >
              {suggestion.title}
            </Text>
          </View>
          <StatusBadge status={suggestion.status} />
          <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1.5" numberOfLines={2}>
            {suggestion.content}
          </Text>
          <View className="flex-row items-center gap-2 mt-2">
            <Ionicons name="person-outline" size={12} color="#94a3b8" />
            <Text className="text-xs text-gray-400 dark:text-gray-500">
              {suggestion.userFullName}
            </Text>
            <Text className="text-xs text-gray-400 dark:text-gray-500">•</Text>
            <Text className="text-xs text-gray-400 dark:text-gray-500">
              {new Date(suggestion.createdAt).toLocaleDateString('tr-TR')}
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
