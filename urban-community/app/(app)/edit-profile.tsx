import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { z } from 'zod';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { useAuthStore } from '@/features/auth';
import {
  useDeleteProfileImage,
  useProfile,
  useUpdateProfile,
  useUpdateProfileImage,
} from '@/features/user';
import { toAbsoluteUrl } from '@/lib/utils/url';

const schema = z.object({
  firstName: z.string().min(1, 'Ad zorunlu'),
  lastName: z.string().min(1, 'Soyad zorunlu'),
  bio: z.string().max(300, 'Bio en fazla 300 karakter').optional(),
  phoneNumber: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function EditProfileScreen() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const updateImage = useUpdateProfileImage();
  const deleteImage = useDeleteProfileImage();
  const user = useAuthStore((s) => s.user);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      firstName: profile?.firstName ?? user?.firstName ?? '',
      lastName: profile?.lastName ?? user?.lastName ?? '',
      bio: profile?.bio ?? '',
      phoneNumber: profile?.phoneNumber ?? '',
    },
  });

  async function handlePickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('İzin Gerekli', 'Fotoğraf seçmek için galeri iznine ihtiyaç var.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      updateImage.mutate({ uri: asset.uri, mimeType: asset.mimeType ?? 'image/jpeg' });
    }
  }

  function handleDeleteImage() {
    Alert.alert('Fotoğrafı Sil', 'Profil fotoğrafını silmek istediğine emin misin?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => deleteImage.mutate() },
    ]);
  }

  function onSubmit(values: FormValues) {
    updateProfile.mutate(
      {
        firstName: values.firstName,
        lastName: values.lastName,
        bio: values.bio || null,
        phoneNumber: values.phoneNumber || null,
        neighborhoodId: profile?.neighborhoodId ?? user?.neighborhoodId,
      },
      { onSuccess: () => router.back() },
    );
  }

  const initials =
    (profile?.firstName?.[0] ?? user?.firstName?.[0] ?? '?').toUpperCase() +
    (profile?.lastName?.[0] ?? user?.lastName?.[0] ?? '?').toUpperCase();

  if (isLoading) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      {/* Profil Fotoğrafı */}
      <View className="items-center gap-3 mb-8">
        <Pressable onPress={handlePickImage} disabled={updateImage.isPending}>
          {profile?.profileImageUrl ? (
            <Image
              source={{ uri: toAbsoluteUrl(profile.profileImageUrl)! }}
              className="w-24 h-24 rounded-full"
            />
          ) : (
            <View className="w-24 h-24 rounded-full bg-blue-600 items-center justify-center">
              <Text className="text-3xl font-bold text-white">{initials}</Text>
            </View>
          )}
          {updateImage.isPending && (
            <View className="absolute inset-0 rounded-full bg-black/40 items-center justify-center">
              <ActivityIndicator color="white" />
            </View>
          )}
        </Pressable>

        <View className="flex-row gap-3">
          <Pressable onPress={handlePickImage} disabled={updateImage.isPending}>
            <Text className="text-blue-600 text-sm font-medium">Fotoğraf Değiştir</Text>
          </Pressable>
          {profile?.profileImageUrl && (
            <>
              <Text className="text-gray-300">|</Text>
              <Pressable onPress={handleDeleteImage} disabled={deleteImage.isPending}>
                <Text className="text-red-500 text-sm font-medium">Sil</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>

      {/* Form */}
      <View className="gap-5">
        <FormField label="Ad" error={errors.firstName?.message}>
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, value } }) => (
              <StyledInput
                value={value}
                onChangeText={onChange}
                placeholder="Adınız"
                hasError={!!errors.firstName}
              />
            )}
          />
        </FormField>

        <FormField label="Soyad" error={errors.lastName?.message}>
          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, value } }) => (
              <StyledInput
                value={value}
                onChangeText={onChange}
                placeholder="Soyadınız"
                hasError={!!errors.lastName}
              />
            )}
          />
        </FormField>

        <FormField label="Telefon" error={errors.phoneNumber?.message}>
          <Controller
            control={control}
            name="phoneNumber"
            render={({ field: { onChange, value } }) => (
              <StyledInput
                value={value}
                onChangeText={onChange}
                placeholder="05xx xxx xx xx"
                keyboardType="phone-pad"
                hasError={!!errors.phoneNumber}
              />
            )}
          />
        </FormField>

        <FormField label="Hakkımda" error={errors.bio?.message}>
          <Controller
            control={control}
            name="bio"
            render={({ field: { onChange, value } }) => (
              <StyledInput
                value={value}
                onChangeText={onChange}
                placeholder="Kendinizi tanıtın..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                hasError={!!errors.bio}
                className="h-24 py-3"
              />
            )}
          />
        </FormField>

        <Pressable
          onPress={handleSubmit(onSubmit)}
          disabled={updateProfile.isPending}
          className="bg-blue-600 rounded-xl py-4 items-center active:opacity-80 disabled:opacity-50"
        >
          {updateProfile.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-base">Kaydet</Text>
          )}
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <View className="gap-1.5">
      <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</Text>
      {children}
      {error && <Text className="text-xs text-red-500">{error}</Text>}
    </View>
  );
}

function StyledInput({
  hasError,
  className = '',
  ...props
}: React.ComponentProps<typeof TextInput> & { hasError?: boolean }) {
  return (
    <TextInput
      className={`border rounded-xl px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 ${
        hasError ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'
      } ${className}`}
      placeholderTextColor="#9CA3AF"
      {...props}
    />
  );
}
