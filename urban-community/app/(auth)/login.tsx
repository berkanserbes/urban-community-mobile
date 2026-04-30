import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { useLogin, loginSchema, type LoginFormValues } from '@/features/auth';

export default function LoginScreen() {
  const { mutate: login, isPending, error } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScreenContainer scrollable={false}>
        <View className="flex-1 justify-start gap-8">
          <View className="gap-2">
            <Text className="text-3xl font-bold text-gray-900 dark:text-white">
              Tekrar Hoşgeldin 👋
            </Text>
            <Text className="text-base text-gray-500 dark:text-gray-400">
              Hesabına giriş yap
            </Text>
          </View>

          <View className="gap-4">
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
                  placeholder="••••••••"
                  isPassword
                  autoComplete="current-password"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.password?.message}
                />
              )}
            />

            {error && (
              <Text className="text-sm text-red-500 text-center">
                {(error as Error).message ?? 'Giriş başarısız, tekrar deneyin.'}
              </Text>
            )}

            <Button
              label="Giriş Yap"
              onPress={handleSubmit((data) => login(data))}
              isLoading={isPending}
            />
          </View>

          <View className="flex-row justify-center gap-1">
            <Text className="text-sm text-gray-500">Hesabın yok mu?</Text>
            <Link href="/(auth)/register" asChild>
              <Text className="text-sm font-semibold text-blue-600">Kayıt Ol</Text>
            </Link>
          </View>
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
