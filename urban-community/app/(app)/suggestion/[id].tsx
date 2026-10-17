import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LoadMoreButton } from '@/components/ui/LoadMoreButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { VoteButtons } from '@/components/ui/VoteButtons';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { useAuthStore } from '@/features/auth';
import {
  getNextVoteSummary,
  useSuggestionById,
  useVote,
  useVoteSummary,
  useComments,
  useAddComment,
  useDeleteSuggestion,
  type VoteSummary,
} from '@/features/suggestions';
import { loadNextPage } from '@/lib/api/pagination';
import { getApiErrorMessage } from '@/lib/utils/error';

export default function SuggestionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const currentUser = useAuthStore((s) => s.user);
  const { data: suggestion, isLoading, isError, error } = useSuggestionById(id ?? null);
  const commentsQuery = useComments(id ?? null);
  const comments = commentsQuery.data?.items ?? [];
  const commentCount = commentsQuery.data?.totalCount ?? 0;
  const addComment = useAddComment(id ?? '');
  const { vote, removeVote } = useVote(id ?? '');
  const { data: voteSummary, isLoading: isVoteSummaryLoading } = useVoteSummary(id ?? null);
  const deleteSuggestion = useDeleteSuggestion();
  const [newComment, setNewComment] = useState('');
  const voteRequestLocked = useRef(false);
  const displayedVoteSummaryRef = useRef<VoteSummary | null>(null);
  const [isVoteSubmitting, setIsVoteSubmitting] = useState(false);
  const [displayedVoteSummary, setDisplayedVoteSummary] = useState<VoteSummary | null>(null);

  const isOwner = suggestion?.userId === currentUser?.id;

  useEffect(() => {
    voteRequestLocked.current = false;
    displayedVoteSummaryRef.current = null;
    setIsVoteSubmitting(false);
    setDisplayedVoteSummary(null);
  }, [id]);

  useEffect(() => {
    if (voteSummary) {
      displayedVoteSummaryRef.current = voteSummary;
      setDisplayedVoteSummary(voteSummary);
    }
  }, [voteSummary]);

  if (isLoading) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      </ScreenContainer>
    );
  }

  if (isError || !suggestion) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center px-4">
          <Ionicons name="warning-outline" size={40} color="#ef4444" />
          <Text className="text-base text-red-500 text-center mt-3">
            {getApiErrorMessage(error, 'Oneri yuklenemedi.')}
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  const handleSendComment = () => {
    const text = newComment.trim();
    if (text.length < 2) return;
    addComment.mutate(text, {
      onSuccess: () => setNewComment(''),
    });
  };

  const handleDelete = () => {
    Alert.alert('Öneriyi Sil', 'Bu öneriyi silmek istediğine emin misin?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => deleteSuggestion.mutate(suggestion.id) },
    ]);
  };

  const handleEdit = () => {
    router.push(`/(app)/suggestion/create?id=${suggestion.id}` as any);
  };

  const activeVoteSummary = displayedVoteSummary ?? {
    upVotes: suggestion.upVotes,
    downVotes: suggestion.downVotes,
    voteScore: suggestion.voteScore,
    currentUserVote: null,
  };

  const applyVoteSummary = (nextVoteSummary: VoteSummary) => {
    displayedVoteSummaryRef.current = nextVoteSummary;
    setDisplayedVoteSummary(nextVoteSummary);
  };

  const releaseVoteLock = () => {
    voteRequestLocked.current = false;
    setIsVoteSubmitting(false);
  };

  return (
    <ScreenContainer scrollable={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-4 pt-5">
            <View className="flex-row items-start justify-between gap-3 mb-4">
              <View className="flex-1">
                <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {suggestion.title}
                </Text>
                <StatusBadge status={suggestion.status} size="md" />
              </View>
              <VoteButtons
                upVotes={activeVoteSummary.upVotes}
                downVotes={activeVoteSummary.downVotes}
                voteScore={activeVoteSummary.voteScore}
                currentUserVote={activeVoteSummary.currentUserVote}
                size="md"
                onVote={(isUpvote) => {
                  if (voteRequestLocked.current) return;

                  voteRequestLocked.current = true;
                  setIsVoteSubmitting(true);

                  const previousVoteSummary = displayedVoteSummaryRef.current ?? activeVoteSummary;
                  applyVoteSummary(getNextVoteSummary(previousVoteSummary, isUpvote));

                  vote.mutate(isUpvote, {
                    onSuccess: applyVoteSummary,
                    onError: () => applyVoteSummary(previousVoteSummary),
                    onSettled: releaseVoteLock,
                  });
                }}
                onRemoveVote={() => {
                  if (voteRequestLocked.current) return;

                  voteRequestLocked.current = true;
                  setIsVoteSubmitting(true);

                  const previousVoteSummary = displayedVoteSummaryRef.current ?? activeVoteSummary;
                  applyVoteSummary(getNextVoteSummary(previousVoteSummary, null));

                  removeVote.mutate(undefined, {
                    onSuccess: applyVoteSummary,
                    onError: () => applyVoteSummary(previousVoteSummary),
                    onSettled: releaseVoteLock,
                  });
                }}
                isLoading={
                  isVoteSubmitting ||
                  vote.isPending ||
                  removeVote.isPending ||
                  (isVoteSummaryLoading && !voteSummary)
                }
              />
            </View>

            <Text className="text-base text-gray-600 dark:text-gray-400 leading-6 mb-6">
              {suggestion.content}
            </Text>

            {suggestion.officialResponse && (
              <View className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 rounded-xl p-4 mb-6">
                <View className="flex-row items-center gap-2 mb-2">
                  <Ionicons name="shield-checkmark" size={18} color="#2563EB" />
                  <Text className="text-sm font-bold text-blue-800 dark:text-blue-300">
                    Resmi Yanıt
                  </Text>
                </View>
                <Text className="text-sm text-blue-700 dark:text-blue-200 leading-5">
                  {suggestion.officialResponse}
                </Text>
              </View>
            )}

            <View className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 gap-3 mb-6">
              <View className="flex-row items-center gap-2">
                <Ionicons name="person-outline" size={16} color="#64748b" />
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Öneren:{' '}
                  <Text className="font-medium text-gray-900 dark:text-white">
                    {suggestion.userFullName}
                  </Text>
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Ionicons name="calendar-outline" size={16} color="#64748b" />
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(suggestion.createdAt).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            </View>

            {isOwner && (
              <View className="flex-row gap-3 mb-6">
                <Pressable
                  onPress={handleEdit}
                  className="flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 active:opacity-70"
                >
                  <Ionicons name="pencil-outline" size={16} color="#2563EB" />
                  <Text className="text-sm font-medium text-blue-700 dark:text-blue-400">Düzenle</Text>
                </Pressable>
                <Pressable
                  onPress={handleDelete}
                  className="flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl bg-red-50 dark:bg-red-900/30 active:opacity-70"
                >
                  <Ionicons name="trash-outline" size={16} color="#EF4444" />
                  <Text className="text-sm font-medium text-red-600 dark:text-red-400">Sil</Text>
                </Pressable>
              </View>
            )}

            <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Yorumlar ({commentCount})
            </Text>

            {comments.length === 0 ? (
              <View className="items-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl mb-4">
                <Ionicons name="chatbubble-outline" size={32} color="#cbd5e1" />
                <Text className="text-sm text-gray-400 mt-2">Henüz yorum yok. İlk yorumu sen yap!</Text>
              </View>
            ) : (
              comments.map((comment) => (
                <View
                  key={comment.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-3 border border-gray-100 dark:border-gray-700"
                >
                  <View className="flex-row items-center gap-2 mb-2">
                    <View className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 items-center justify-center">
                      <Text className="text-xs font-bold text-blue-700 dark:text-blue-400">
                        {comment.authorName[0]?.toUpperCase() ?? '?'}
                      </Text>
                    </View>
                    <Text className="text-sm font-medium text-gray-900 dark:text-white">
                      {comment.authorName}
                    </Text>
                    <Text className="text-xs text-gray-400">•</Text>
                    <Text className="text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString('tr-TR')}
                    </Text>
                  </View>
                  <Text className="text-sm text-gray-600 dark:text-gray-400 leading-5">
                    {comment.content}
                  </Text>
                </View>
              ))
            )}

            <LoadMoreButton
              visible={commentsQuery.hasNextPage}
              loading={commentsQuery.isFetchingNextPage}
              onPress={() => loadNextPage(commentsQuery)}
              label="Daha fazla yorum yükle"
            />
          </View>
        </ScrollView>

        <View className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <View className="flex-row items-center gap-2">
            <TextInput
              className="flex-1 h-10 px-4 rounded-full bg-gray-100 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
              placeholder="Yorum yaz..."
              placeholderTextColor="#94a3b8"
              value={newComment}
              onChangeText={setNewComment}
              returnKeyType="send"
              onSubmitEditing={handleSendComment}
            />
            <Pressable
              onPress={handleSendComment}
              disabled={newComment.trim().length < 2 || addComment.isPending}
              className={`w-10 h-10 rounded-full items-center justify-center ${
                newComment.trim().length >= 2
                  ? 'bg-blue-600 active:opacity-80'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              {addComment.isPending ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons
                  name="send"
                  size={16}
                  color={newComment.trim().length >= 2 ? 'white' : '#94a3b8'}
                />
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
