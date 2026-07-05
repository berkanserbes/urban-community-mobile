import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { ScrollView, View, type ScrollViewProps } from 'react-native';

interface ScreenContainerProps extends ScrollViewProps {
  scrollable?: boolean;
  safeAreaEdges?: Edge[];
}

export function ScreenContainer({
  children,
  scrollable = true,
  className = '',
  safeAreaEdges,
  ...props
}: ScreenContainerProps) {
  const content = scrollable ? (
    <ScrollView
      contentContainerClassName="flex-grow px-6 pb-6"
      keyboardShouldPersistTaps="handled"
      {...props}
    >
      {children}
    </ScrollView>
  ) : (
    <View className="flex-1 px-6 pb-6">{children}</View>
  );

  return (
    <SafeAreaView edges={safeAreaEdges} className={`flex-1 bg-white dark:bg-gray-900 ${className}`}>
      {content}
    </SafeAreaView>
  );
}
