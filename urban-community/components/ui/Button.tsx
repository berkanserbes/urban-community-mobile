import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  label: string;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
}

const variantClasses = {
  primary: {
    container: 'bg-blue-600 active:bg-blue-700',
    text: 'text-white',
  },
  secondary: {
    container: 'bg-gray-100 active:bg-gray-200 border border-gray-300',
    text: 'text-gray-800',
  },
  ghost: {
    container: 'active:bg-gray-100',
    text: 'text-blue-600',
  },
};

export function Button({
  onPress,
  label,
  isLoading = false,
  disabled = false,
  variant = 'primary',
}: ButtonProps) {
  const classes = variantClasses[variant];
  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className={`h-12 rounded-xl items-center justify-center px-6 ${classes.container} ${isDisabled ? 'opacity-50' : ''}`}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'primary' ? 'white' : '#2563EB'} />
      ) : (
        <Text className={`text-base font-semibold ${classes.text}`}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}
