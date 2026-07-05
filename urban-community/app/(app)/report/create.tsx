import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SelectPicker, type SelectOption } from '@/components/ui/SelectPicker';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { useAuthStore } from '@/features/auth';
import { useCategories, useCreateReport } from '@/features/reports';
import { useProfile } from '@/features/user';

interface SelectedMedia {
  uri: string;
  type: string;
  name: string;
}

const createReportSchema = z.object({
  title: z.string().min(3, 'Başlık en az 3 karakter olmalıdır').max(150, 'Başlık en fazla 150 karakter olabilir'),
  description: z.string().min(10, 'Açıklama en az 10 karakter olmalıdır').max(1000, 'Açıklama en fazla 1000 karakter olabilir'),
});

type CreateReportForm = z.infer<typeof createReportSchema>;

function isValidReportLocation(
  coords: { latitude: number; longitude: number } | null,
): coords is { latitude: number; longitude: number } {
  return (
    coords !== null &&
    Number.isFinite(coords.latitude) &&
    Number.isFinite(coords.longitude) &&
    coords.latitude >= -90 &&
    coords.latitude <= 90 &&
    coords.longitude >= -180 &&
    coords.longitude <= 180
  );
}

export default function CreateReportScreen() {
  const user = useAuthStore((s) => s.user);
  const { data: profile } = useProfile();
  const { data: categories = [] } = useCategories();
  const createReport = useCreateReport();
  const [selectedCategory, setSelectedCategory] = useState<SelectOption | null>(null);
  const [media, setMedia] = useState<SelectedMedia[]>([]);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [region, setRegion] = useState({
    latitude: 39.9334,
    longitude: 32.8597,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const mapRef = useRef<MapView>(null);

  const applySelectedLocation = useCallback(
    (coords: { latitude: number; longitude: number }, animate = false) => {
      if (!isValidReportLocation(coords)) {
        return false;
      }

      const { latitude, longitude } = coords;
      setLocation({ latitude, longitude });
      setRegion((prev) => ({ ...prev, latitude, longitude }));

      if (animate) {
        mapRef.current?.animateToRegion(
          { latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 },
          500,
        );
      }

      return true;
    },
    [],
  );

  const requestCurrentLocation = useCallback(
    async (showError = false) => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        if (showError) {
          Alert.alert('Konum İzni Gerekli', 'Mevcut konumu kullanmak için konum izni vermelisiniz.');
        }
        return;
      }

      try {
        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const applied = applySelectedLocation(pos.coords, showError);
        if (!applied && showError) {
          Alert.alert('Konum Gecersiz', 'Haritadan konumu elle secebilir veya tekrar deneyebilirsiniz.');
        }
      } catch {
        if (showError) {
          Alert.alert('Konum Alınamadı', 'Haritadan konumu elle seçebilir veya tekrar deneyebilirsiniz.');
        }
      }
    },
    [applySelectedLocation],
  );

  useEffect(() => {
    requestCurrentLocation();
  }, [requestCurrentLocation]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateReportForm>({
    resolver: zodResolver(createReportSchema),
    defaultValues: { title: '', description: '' },
  });

  const categoryOptions: SelectOption[] = categories.map((c) => ({
    id: c.id,
    name: c.name,
  }));

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
    Alert.alert('Medya Ekle', 'Rapora fotoğraf/video eklemek için:', [
      { text: 'Galeri', onPress: handlePickMedia },
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
              [...prev, { uri: asset.uri, type: asset.mimeType ?? 'image/jpeg', name: asset.fileName ?? `camera_${Date.now()}.jpg` }].slice(0, 10),
            );
          }
        },
      },
      { text: 'İptal', style: 'cancel' },
    ]);
  }

  const onSubmit = useCallback(
    (data: CreateReportForm) => {
      const neighborhoodId = profile?.neighborhoodId ?? user?.neighborhoodId;
      if (!neighborhoodId) {
        Alert.alert('Konum Eksik', 'Rapor oluşturmak için profilinizde mahalle bilgisi seçili olmalı.');
        return;
      }

      if (!isValidReportLocation(location)) {
        Alert.alert('Konum Eksik', 'Rapor konumunu haritadan seçin veya mevcut konum butonunu kullanın.');
        return;
      }

      createReport.mutate({
        title: data.title,
        description: data.description,
        neighborhoodId,
        suggestedCategoryId: selectedCategory?.id ?? undefined,
        latitude: location?.latitude,
        longitude: location?.longitude,
        media: media.length > 0 ? media : undefined,
      });
    },
    [profile?.neighborhoodId, user?.neighborhoodId, selectedCategory, createReport, media, location],
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScreenContainer safeAreaEdges={['bottom']} contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="gap-6 pt-3">
            <View className="gap-2">
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">Yeni Rapor</Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                Mahallendeki sorunu bildir
              </Text>
            </View>

            <View className="gap-4">
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Başlık"
                    placeholder="Sorunun başlığı nedir?"
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
                  name="description"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className={`h-32 px-4 py-3 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-base ${
                        errors.description
                          ? 'border-red-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      multiline
                      textAlignVertical="top"
                      placeholder="Sorunun detaylarını açıkla..."
                      placeholderTextColor="#9CA3AF"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                    />
                  )}
                />
                {errors.description && (
                  <Text className="text-xs text-red-500">{errors.description.message}</Text>
                )}
              </View>

              <SelectPicker
                label="Kategori"
                placeholder="Kategori seçin"
                options={categoryOptions}
                value={selectedCategory?.id ?? null}
                onChange={setSelectedCategory}
              />
            </View>

            <View className="gap-2">
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Konum
              </Text>
              <View className="h-48 rounded-xl overflow-hidden border border-gray-300 dark:border-gray-600">
                <MapView
                  ref={mapRef}
                  style={{ flex: 1 }}
                  region={region}
                  onPress={(e) => {
                    const { latitude, longitude } = e.nativeEvent.coordinate;
                    applySelectedLocation({ latitude, longitude });
                  }}
                >
                  {location && (
                    <Marker
                      draggable
                      coordinate={location}
                      onDragEnd={(e) => {
                        const { latitude, longitude } = e.nativeEvent.coordinate;
                        applySelectedLocation({ latitude, longitude });
                      }}
                    />
                  )}
                </MapView>
                <Pressable
                  onPress={() => requestCurrentLocation(true)}
                  className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white dark:bg-gray-800 items-center justify-center shadow-sm"
                >
                  <Ionicons name="locate" size={20} color="#2563EB" />
                </Pressable>
              </View>
              {location && (
                <Text className="text-xs text-gray-400">
                  {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                </Text>
              )}
            </View>

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

            {createReport.isError && (
              <Text className="text-sm text-red-500 text-center">
                {createReport.error?.message ?? 'Rapor oluşturulamadı, tekrar deneyin.'}
              </Text>
            )}

            <Button
              label="Rapor Oluştur"
              onPress={handleSubmit(onSubmit)}
              isLoading={createReport.isPending}
            />
          </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
