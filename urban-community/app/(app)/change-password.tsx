import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { z } from 'zod';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { useAuthStore } from '@/features/auth';
import { useChangePassword } from '@/features/user';

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Mevcut şifre zorunlu'),
    newPassword: z
      .string()
      .min(6, 'Şifre en az 6 karakter uzunluğunda olmalıdır')
      .regex(/[A-Z]/, 'Şifre en az bir büyük harf içermelidir')
      .regex(/[a-z]/, 'Şifre en az bir küçük harf içermelidir')
      .regex(/[0-9]/, 'Şifre en az bir rakam içermelidir'),
    confirmNewPassword: z.string(),
  })
  .refine((d) => d.newPassword !== d.currentPassword, {
    message: 'Yeni şifre mevcut şifreden farklı olmalıdır',
    path: ['newPassword'],
  })
  .refine((d) => d.newPassword === d.confirmNewPassword, {
    message: 'Şifreler eşleşmiyor',
    path: ['confirmNewPassword'],
  });

type FormValues = z.infer<typeof schema>;

export default function ChangePasswordScreen() {
  const user = useAuthStore((s) => s.user);
  const changePassword = useChangePassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  function onSubmit(values: FormValues) {
    if (!user) return;
    changePassword.mutate({
      userId: user.id,
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      confirmNewPassword: values.confirmNewPassword,
    });
  }

  return (
    <ScreenContainer>
      <View className="gap-5">
        <View className="gap-1">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">Şifre Değiştir</Text>
          <Text className="text-gray-500 dark:text-gray-400 text-sm">
            Güvenliğiniz için güçlü bir şifre seçin
          </Text>
        </View>

        <FormField label="Mevcut Şifre" error={errors.currentPassword?.message}>
          <Controller
            control={control}
            name="currentPassword"
            render={({ field: { onChange, value } }) => (
              <PasswordInput
                value={value}
                onChangeText={onChange}
                placeholder="Mevcut şifreniz"
                hasError={!!errors.currentPassword}
              />
            )}
          />
        </FormField>

        <FormField label="Yeni Şifre" error={errors.newPassword?.message}>
          <Controller
            control={control}
            name="newPassword"
            render={({ field: { onChange, value } }) => (
              <PasswordInput
                value={value}
                onChangeText={onChange}
                placeholder="En az 6 karakter"
                hasError={!!errors.newPassword}
              />
            )}
          />
        </FormField>

        <FormField label="Yeni Şifre (Tekrar)" error={errors.confirmNewPassword?.message}>
          <Controller
            control={control}
            name="confirmNewPassword"
            render={({ field: { onChange, value } }) => (
              <PasswordInput
                value={value}
                onChangeText={onChange}
                placeholder="Şifrenizi tekrar girin"
                hasError={!!errors.confirmNewPassword}
              />
            )}
          />
        </FormField>

        <Pressable
          onPress={handleSubmit(onSubmit)}
          disabled={changePassword.isPending}
          className="bg-blue-600 rounded-xl py-4 items-center active:opacity-80 disabled:opacity-50 mt-2"
        >
          {changePassword.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-base">Şifreyi Güncelle</Text>
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

function PasswordInput({
  hasError,
  ...props
}: React.ComponentProps<typeof TextInput> & { hasError?: boolean }) {
  return (
    <TextInput
      secureTextEntry
      className={`border rounded-xl px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 ${
        hasError ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'
      }`}
      placeholderTextColor="#9CA3AF"
      {...props}
    />
  );
}
