import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

interface VoteButtonsProps {
  upVotes: number;
  downVotes: number;
  voteScore: number;
  currentUserVote?: boolean | null;
  onVote: (isUpvote: boolean) => void;
  onRemoveVote: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export function VoteButtons({
  upVotes,
  voteScore,
  currentUserVote,
  onVote,
  onRemoveVote,
  isLoading = false,
  disabled = false,
  size = 'sm',
}: VoteButtonsProps) {
  const isDisabled = isLoading || disabled;

  const handleUpvote = () => {
    if (isDisabled) return;

    if (currentUserVote === true) {
      onRemoveVote();
    } else {
      onVote(true);
    }
  };

  const handleDownvote = () => {
    if (isDisabled) return;

    if (currentUserVote === false) {
      onRemoveVote();
    } else {
      onVote(false);
    }
  };

  if (size === 'md') {
    return (
      <View className={`flex-row items-center gap-4 ${disabled ? 'opacity-50' : ''}`}>
        <Pressable
          onPress={handleUpvote}
          disabled={isDisabled}
          className={`w-10 h-10 rounded-full items-center justify-center ${
            currentUserVote === true
              ? 'bg-blue-100 dark:bg-blue-900/30'
              : 'bg-gray-100 dark:bg-gray-800'
          } active:opacity-70`}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#2563EB" />
          ) : (
            <Ionicons
              name="arrow-up"
              size={20}
              color={currentUserVote === true ? '#2563EB' : '#64748b'}
            />
          )}
        </Pressable>
        <Text className="text-lg font-bold text-gray-900 dark:text-white min-w-[32px] text-center">
          {voteScore}
        </Text>
        <Pressable
          onPress={handleDownvote}
          disabled={isDisabled}
          className={`w-10 h-10 rounded-full items-center justify-center ${
            currentUserVote === false
              ? 'bg-red-100 dark:bg-red-900/30'
              : 'bg-gray-100 dark:bg-gray-800'
          } active:opacity-70`}
        >
          <Ionicons
            name="arrow-down"
            size={20}
            color={currentUserVote === false ? '#EF4444' : '#64748b'}
          />
        </Pressable>
      </View>
    );
  }

  return (
    <View className={`items-center gap-1 ${disabled ? 'opacity-50' : ''}`}>
      <Pressable
        onPress={handleUpvote}
        disabled={isDisabled}
        className="p-1 active:opacity-70"
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#2563EB" />
        ) : (
          <Ionicons
            name="arrow-up"
            size={18}
            color={currentUserVote === true ? '#2563EB' : '#94a3b8'}
          />
        )}
      </Pressable>
      <Text
        className={`text-xs font-bold text-center min-w-[24px] ${
          voteScore > 0
            ? 'text-blue-600'
            : voteScore < 0
              ? 'text-red-500'
              : 'text-gray-500 dark:text-gray-400'
        }`}
      >
        {voteScore}
      </Text>
      <Pressable
        onPress={handleDownvote}
        disabled={isDisabled}
        className="p-1 active:opacity-70"
      >
        <Ionicons
          name="arrow-down"
          size={18}
          color={currentUserVote === false ? '#EF4444' : '#94a3b8'}
        />
      </Pressable>
    </View>
  );
}
