import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      className="flex-row items-center gap-2"
      hitSlop={8}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 4,
          borderWidth: 2,
          borderColor: checked ? '#2563EB' : '#D1D5DB',
          backgroundColor: checked ? '#2563EB' : '#ffffff',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {checked && <Ionicons name="checkmark" size={13} color="white" />}
      </View>
      <Text className="text-sm text-gray-700 dark:text-gray-300">{label}</Text>
    </Pressable>
  );
}
