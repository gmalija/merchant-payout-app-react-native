import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/shared/components/ui/themed-text';
import { Button } from './button';
import { Colors } from '@/shared/constants';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  testID?: string;
}

export function ErrorState({
  message,
  onRetry,
  retryLabel = 'Retry',
  testID = 'error-message',
}: ErrorStateProps) {
  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityRole="alert"
      accessibilityLabel={`Error: ${message}`}
      accessibilityLiveRegion="assertive"
    >
      <ThemedText style={styles.errorText} testID={testID}>
        {message}
      </ThemedText>
      {onRetry && (
        <Button
          title={retryLabel}
          onPress={onRetry}
          variant="primary"
          size="medium"
          accessibilityLabel={`${retryLabel}. Retry the failed operation`}
        />
      )}
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
  errorText: {
    color: Colors.error,
    textAlign: 'center',
    marginBottom: 16,
  },
});