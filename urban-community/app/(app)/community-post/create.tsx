import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { useAuthStore } from '@/features/auth';
import { useCreateCommunityPost, useCommunityPostById, useUpdatePost, type PostType, type CommunityPostScope } from '@/features/community';
import { useProfile } from '@/features/user';

const createPostSchema = z.object({
  title: z.string().min(3, 'Başlık en az 3 karakter olmalıdır').max(150, 'Başlık en fazla 150 karakter olabilir'),
  content: z.string().min(10, 'Açıklama en az 10 karakter olmalıdır').max(1000, 'Açıklama en fazla 1000 karakter olabilir'),
});

type CreatePostForm = z.infer<typeof createPostSchema>;

interface SelectedMedia {
  uri: string;
  type: string;
  name: string;
}

const TYPE_OPTIONS: { value: PostType; icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { value: 'HelpRequested', icon: 'hand-left-outline', label: 'Yardım Talebi' },
  { value: 'BorrowTool', icon: 'build-outline', label: 'Ödünç Eşya' },
  { value: 'LostAndFound', icon: 'search-outline', label: 'Kayıp/Buluntu' },
];

export default function CreateCommunityPostScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = !!id;
  const user = useAuthStore((s) => s.user);
  const { data: profile } = useProfile();
  const { data: existing, isLoading: loadingExisting } = useCommunityPostById(id ?? null);
  const createPost = useCreateCommunityPost();
  const updatePost = useUpdatePost();
  const [selectedType, setSelectedType] = useState<PostType>('HelpRequested');
  const [selectedScope, setSelectedScope] = useState<CommunityPostScope>('Neighborhood');
  const [media, setMedia] = useState<SelectedMedia[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePostForm>({
    resolver: zodResolver(createPostSchema),
    defaultValues: { title: '', content: '' },
  });

  useEffect(() => {
    if (existing) {
      reset({ title: existing.title, content: existing.content });
      setSelectedType(existing.type);
      setSelectedScope(existing.scope);
    }
  }, [existing, reset]);

  if (isEdit && loadingExisting) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      </ScreenContainer>
    );
  }

  async function handlePickMedia() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('İzin Gerekli', 'Medya seçmek için galeri iznine ihtiyaç var.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 10 - media.length,
    });

    if (!result.canceled && result.assets.length > 0) {
      const newMedia = result.assets.map((asset) => ({
        uri: asset.uri,
        type: asset.mimeType ?? 'image/jpeg',
        name: asset.fileName ?? `media_${Date.now()}.${asset.mimeType?.split('/')[1] ?? 'jpg'}`,
      }));
      setMedia((prev) => [...prev, ...newMedia].slice(0, 10));
    }
  }

  function handleRemoveMedia(index: number) {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  }

  function handleTakePhoto() {
    Alert.alert('Medya Ekle', 'Fotoğraf/Video eklemek için:', [
      {
        text: 'Galeri',
        onPress: handlePickMedia,
      },
      {
        text: 'Kamera',
        onPress: async () => {
          const permission = await ImagePicker.requestCameraPermissionsAsync();
          if (!permission.granted) {
            Alert.alert('İzin Gerekli', 'Kamera kullanmak için izin gerekli.');
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            quality: 0.8,
            allowsEditing: true,
          });
          if (!result.canceled && result.assets[0]) {
            const asset = result.assets[0];
            setMedia((prev) =>
              [
                ...prev,
                {
                  uri: asset.uri,
                  type: asset.mimeType ?? 'image/jpeg',
                  name: asset.fileName ?? `camera_${Date.now()}.jpg`,
                },
              ].slice(0, 10),
            );
          }
        },
      },
      { text: 'İptal', style: 'cancel' },
    ]);
  }

  const onSubmit = (data: CreatePostForm) => {
    if (isEdit && id) {
      updatePost.mutate({ id, data: { title: data.title, content: data.content } });
    } else {
      const provinceId = profile?.provinceId ?? undefined;
      const districtId = profile?.districtId ?? undefined;
      const neighborhoodId = profile?.neighborhoodId ?? user?.neighborhoodId ?? undefined;

      if (selectedScope === 'Province' && !provinceId) {
        Alert.alert('Konum Eksik', 'İl kapsamında paylaşım yapmak için profil konumunuzu tamamlayın.');
        return;
      }

      if (selectedScope === 'District' && !districtId) {
        Alert.alert('Konum Eksik', 'İlçe kapsamında paylaşım yapmak için profil konumunuzu tamamlayın.');
        return;
      }

      if (selectedScope === 'Neighborhood' && !neighborhoodId) {
        Alert.alert('Konum Eksik', 'Mahalle kapsamında paylaşım yapmak için profil konumunuzu tamamlayın.');
        return;
      }

      createPost.mutate({
        type: selectedType,
        title: data.title,
        content: data.content,
        scope: selectedScope,
        provinceId: selectedScope === 'Province' ? provinceId : undefined,
        districtId: selectedScope === 'District' ? districtId : undefined,
        neighborhoodId: selectedScope === 'Neighborhood' ? neighborhoodId : undefined,
        media: media.length > 0 ? media : undefined,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScreenContainer safeAreaEdges={['bottom']} contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="gap-6 pt-3">
            <View className="gap-2">
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                {isEdit ? 'Gönderiyi Düzenle' : 'Yeni Gönderi'}
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {isEdit ? 'Gönderini güncelle' : 'Mahallenle paylaşmak istediğin bir şey mi var?'}
              </Text>
            </View>

            {!isEdit && (
            <View className="gap-2">
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">Tür</Text>
              <View className="flex-row gap-2">
                {TYPE_OPTIONS.map((opt) => (
                  <Pressable
                    key={opt.value}
                    onPress={() => setSelectedType(opt.value)}
                    className={`flex-1 flex-row items-center justify-center gap-1.5 py-3 rounded-xl border ${
                      selectedType === opt.value
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    } active:opacity-70`}
                  >
                    <Ionicons
                      name={opt.icon}
                      size={16}
                      color={selectedType === opt.value ? '#2563EB' : '#64748b'}
                    />
                    <Text
                      className={`text-xs font-medium ${
                        selectedType === opt.value
                          ? 'text-blue-700 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            )}

            {!isEdit && (
            <View className="gap-2">
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">Görünürlük</Text>
              <View className="flex-row gap-2">
                {(['Neighborhood', 'District', 'Province'] as CommunityPostScope[]).map((scope) => (
                  <Pressable
                    key={scope}
                    onPress={() => setSelectedScope(scope)}
                    className={`flex-1 py-3 rounded-xl border ${
                      selectedScope === scope
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    } active:opacity-70`}
                  >
                    <Text
                      className={`text-xs font-medium text-center ${
                        selectedScope === scope
                          ? 'text-blue-700 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {scope === 'Neighborhood' ? 'Mahalle' : scope === 'District' ? 'İlçe' : 'İl'}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            )}

            <View className="gap-4">
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Başlık"
                    placeholder="Gönderinizin başlığı nedir?"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.title?.message}
                  />
                )}
              />

              <View className="gap-1">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Açıklama
                </Text>
                <Controller
                  control={control}
                  name="content"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className={`h-32 px-4 py-3 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-base ${
                        errors.content
                          ? 'border-red-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      multiline
                      textAlignVertical="top"
                      placeholder="Detaylıca açıklayın..."
                      placeholderTextColor="#9CA3AF"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                    />
                  )}
                />
                {errors.content && (
                  <Text className="text-xs text-red-500">{errors.content.message}</Text>
                )}
              </View>
            </View>

            {!isEdit && (
            <View className="gap-2">
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Fotoğraf / Video ({media.length}/10)
              </Text>
              {media.length > 0 && (
                <View className="flex-row flex-wrap gap-2">
                  {media.map((file, index) => (
                    <View key={index} className="relative">
                      <Image
                        source={{ uri: file.uri }}
                        className="w-20 h-20 rounded-xl"
                        resizeMode="cover"
                      />
                      <Pressable
                        onPress={() => handleRemoveMedia(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 items-center justify-center"
                      >
                        <Ionicons name="close" size={14} color="white" />
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}
              {media.length < 10 && (
                <Pressable
                  onPress={handleTakePhoto}
                  className="h-20 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 items-center justify-center active:opacity-70"
                >
                  <Ionicons name="camera-outline" size={24} color="#94a3b8" />
                  <Text className="text-xs text-gray-400 mt-1">Fotoğraf/Video Ekle</Text>
                </Pressable>
              )}
            </View>
            )}

            {(createPost.isError || updatePost.isError) && (
              <Text className="text-sm text-red-500 text-center">
                {createPost.error?.message ?? updatePost.error?.message ?? 'İşlem başarısız.'}
              </Text>
            )}

            <Button
              label={isEdit ? 'Güncelle' : 'Paylaş'}
              onPress={handleSubmit(onSubmit)}
              isLoading={createPost.isPending || updatePost.isPending}
            />
          </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
