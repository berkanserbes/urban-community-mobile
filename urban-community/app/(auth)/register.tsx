import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { useRegister, registerSchema, type RegisterFormValues } from '@/features/auth';

export default function RegisterScreen() {
  const { mutate: register, isPending, error } = useRegister();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScreenContainer>
        <View className="flex-1 justify-start gap-8">
          <View className="gap-2">
            <Text className="text-3xl font-bold text-gray-900 dark:text-white">
              Hesap Oluştur
            </Text>
            <Text className="text-base text-gray-500 dark:text-gray-400">
              Topluluğa katılmak için kayıt ol
            </Text>
          </View>

          <View className="gap-4">
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Ad"
                      placeholder="Ahmet"
                      autoComplete="given-name"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      error={errors.firstName?.message}
                    />
                  )}
                />
              </View>
              <View className="flex-1">
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Soyad"
                      placeholder="Yılmaz"
                      autoComplete="family-name"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      error={errors.lastName?.message}
                    />
                  )}
                />
              </View>
            </View>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="E-posta"
                  placeholder="ornek@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Şifre"
                  placeholder="En az 8 karakter"
                  isPassword
                  autoComplete="new-password"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Şifre Tekrar"
                  placeholder="••••••••"
                  isPassword
                  autoComplete="new-password"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.confirmPassword?.message}
                />
              )}
            />

            {error && (
              <Text className="text-sm text-red-500 text-center">
                {(error as Error).message ?? 'Kayıt başarısız, tekrar deneyin.'}
              </Text>
            )}

            <Button
              label="Kayıt Ol"
              onPress={handleSubmit((data) => register(data))}
              isLoading={isPending}
            />
          </View>

          <View className="flex-row justify-center gap-1">
            <Text className="text-sm text-gray-500">Zaten hesabın var mı?</Text>
            <Link href="/(auth)/login" asChild>
              <Text className="text-sm font-semibold text-blue-600">Giriş Yap</Text>
            </Link>
          </View>
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
