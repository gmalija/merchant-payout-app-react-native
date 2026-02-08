import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { ThemedText } from '@/shared/components/ui/themed-text';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'large';
  testID?: string;
}

export function LoadingState({
  message = 'Loading...',
  size = 'large',
  testID = 'loading-indicator',
}: LoadingStateProps) {
  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityLabel={message}
      accessibilityLiveRegion="polite"
    >
      <ActivityIndicator size={size} testID={testID} accessibilityLabel="Loading" />
      {message && <ThemedText style={styles.text}>{message}</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  text: {
    marginTop: 12,
    opacity: 0.7,
  },
});