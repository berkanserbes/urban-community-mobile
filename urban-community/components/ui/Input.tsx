import { forwardRef, useState } from 'react';
import { TextInput, View, Text, TouchableOpacity, type TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { label, error, isPassword = false, ...props },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="gap-1">
      {label && (
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</Text>
      )}
      <View className="relative">
        <TextInput
          ref={ref}
          secureTextEntry={isPassword && !showPassword}
          className={`h-12 px-4 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-base ${
            error
              ? 'border-red-500'
              : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
          } ${isPassword ? 'pr-12' : ''}`}
          placeholderTextColor="#9CA3AF"
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-3 p-1"
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-xs text-red-500">{error}</Text>}
    </View>
  );
});
