import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { useAuthStore } from '@/features/auth';
import { useCommunityPostById, communityApi, useDeletePost } from '@/features/community';
import { toAbsoluteUrl } from '@/lib/utils/url';
import { useQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { communityKeys } from '@/features/community';

const TYPE_LABELS: Record<string, { label: string; icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  HelpRequested: { label: 'Yardım Talebi', icon: 'hand-left-outline', color: '#ef4444' },
  BorrowTool: { label: 'Ödünç Eşya', icon: 'build-outline', color: '#f59e0b' },
  LostAndFound: { label: 'Kayıp/Buluntu', icon: 'search-outline', color: '#8b5cf6' },
};

export default function CommunityPostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const currentUser = useAuthStore((s) => s.user);
  const { data: post, isLoading } = useCommunityPostById(id ?? null);
  const deletePost = useDeletePost();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');

  const { data: comments = [] } = useQuery({
    queryKey: [...communityKeys.detail(id ?? ''), 'comments'],
    queryFn: () => communityApi.getComments(id!),
    enabled: !!id,
  });

  const addComment = useMutation({
    mutationFn: (content: string) => communityApi.addComment(id!, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...communityKeys.detail(id ?? ''), 'comments'] });
      setNewComment('');
    },
  });

  if (isLoading || !post) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      </ScreenContainer>
    );
  }

  const typeConfig = TYPE_LABELS[post.type] ?? TYPE_LABELS.HelpRequested;
  const isOwner = post?.userId === currentUser?.id;

  const handleSendComment = () => {
    const text = newComment.trim();
    if (text.length < 2) return;
    addComment.mutate(text);
  };

  const handleDelete = () => {
    Alert.alert('Gönderiyi Sil', 'Bu gönderiyi silmek istediğine emin misin?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => deletePost.mutate(post.id) },
    ]);
  };

  const handleEdit = () => {
    router.push(`/(app)/community-post/create?id=${post.id}` as any);
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
            <View className="flex-row items-center gap-2 mb-3">
              <View
                className="px-3 py-1 rounded-full flex-row items-center gap-1.5"
                style={{ backgroundColor: typeConfig.color + '20' }}
              >
                <Ionicons name={typeConfig.icon} size={14} color={typeConfig.color} />
                <Text className="text-xs font-semibold" style={{ color: typeConfig.color }}>
                  {typeConfig.label}
                </Text>
              </View>
              <StatusBadge status={post.status} size="sm" />
            </View>

            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {post.title}
            </Text>

            <Text className="text-base text-gray-600 dark:text-gray-400 leading-6 mb-4">
              {post.content}
            </Text>

            {post.media.length > 0 && (
              <FlatList
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                data={post.media}
                keyExtractor={(item) => item.id}
                className="h-56 mb-4"
                renderItem={({ item }) => (
                  <View className="w-screen h-56 rounded-xl overflow-hidden mr-2 bg-gray-100 dark:bg-gray-800">
                    {item.mediaType === 'Image' ? (
                      <Image
                        source={{ uri: toAbsoluteUrl(item.url)! }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="flex-1 items-center justify-center">
                        <Ionicons name="videocam-outline" size={48} color="#94a3b8" />
                      </View>
                    )}
                  </View>
                )}
              />
            )}

            <View className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 gap-3 mb-6">
              <View className="flex-row items-center gap-2">
                <Ionicons name="person-outline" size={16} color="#64748b" />
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Paylaşan: <Text className="font-medium text-gray-900 dark:text-white">{post.userFullName}</Text>
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Ionicons name="location-outline" size={16} color="#64748b" />
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  <Text className="font-medium text-gray-900 dark:text-white">
                    {post.neighborhoodName ?? post.districtName ?? post.provinceName ?? 'Belirtilmemiş'}
                  </Text>
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Ionicons name="calendar-outline" size={16} color="#64748b" />
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString('tr-TR', {
                    year: 'numeric', month: 'long', day: 'numeric',
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
              Yorumlar ({comments.length})
            </Text>

            {comments.length === 0 ? (
              <View className="items-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl mb-4">
                <Ionicons name="chatbubble-outline" size={32} color="#cbd5e1" />
                <Text className="text-sm text-gray-400 mt-2">Henüz yorum yok</Text>
              </View>
            ) : (
              comments.map((comment: { id: string; authorName: string; content: string; createdAt: string }) => (
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
