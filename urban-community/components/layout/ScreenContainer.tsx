import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View, type ScrollViewProps } from 'react-native';

interface ScreenContainerProps extends ScrollViewProps {
  scrollable?: boolean;
}

export function ScreenContainer({
  children,
  scrollable = true,
  className = '',
  ...props
}: ScreenContainerProps) {
  const content = scrollable ? (
    <ScrollView
      contentContainerClassName="flex-grow p-6"
      keyboardShouldPersistTaps="handled"
      {...props}
    >
      {children}
    </ScrollView>
  ) : (
    <View className="flex-1 p-6">{children}</View>
  );

  return (
    <SafeAreaView className={`flex-1 bg-white dark:bg-gray-900 ${className}`}>
      {content}
    </SafeAreaView>
  );
}
