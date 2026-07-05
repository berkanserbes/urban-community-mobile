import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { useCreateSuggestion, useSuggestionById, useUpdateSuggestion } from '@/features/suggestions';

const createSuggestionSchema = z.object({
  title: z.string().min(3, 'Başlık en az 3 karakter olmalıdır').max(150, 'Başlık en fazla 150 karakter olabilir'),
  content: z.string().min(10, 'Açıklama en az 10 karakter olmalıdır').max(1000, 'Açıklama en fazla 1000 karakter olabilir'),
});

type CreateSuggestionForm = z.infer<typeof createSuggestionSchema>;

export default function CreateSuggestionScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = !!id;
  const { data: existing, isLoading: loadingExisting } = useSuggestionById(id ?? null);
  const createSuggestion = useCreateSuggestion();
  const updateSuggestion = useUpdateSuggestion();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateSuggestionForm>({
    resolver: zodResolver(createSuggestionSchema),
    defaultValues: { title: '', content: '' },
  });

  useEffect(() => {
    if (existing) {
      reset({ title: existing.title, content: existing.content });
    }
  }, [existing, reset]);

  const onSubmit = (data: CreateSuggestionForm) => {
    if (isEdit && id) {
      updateSuggestion.mutate({ id, data });
    } else {
      createSuggestion.mutate(data);
    }
  };

  if (isEdit && loadingExisting) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScreenContainer safeAreaEdges={['bottom']} contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="gap-6 pt-3">
            <View className="gap-2">
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                {isEdit ? 'Öneriyi Düzenle' : 'Yeni Öneri'}
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {isEdit ? 'Önerini güncelle' : 'Mahalleni geliştirecek fikrini paylaş'}
              </Text>
            </View>

            <View className="gap-4">
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Başlık"
                    placeholder="Önerinizin başlığı nedir?"
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
                      placeholder="Önerinizi detaylıca açıklayın..."
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

            {(createSuggestion.isError || updateSuggestion.isError) && (
              <Text className="text-sm text-red-500 text-center">
                {createSuggestion.error?.message ?? updateSuggestion.error?.message ?? 'İşlem başarısız.'}
              </Text>
            )}

            <Button
              label={isEdit ? 'Güncelle' : 'Öneri Gönder'}
              onPress={handleSubmit(onSubmit)}
              isLoading={createSuggestion.isPending || updateSuggestion.isPending}
            />
          </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
