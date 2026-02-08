import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/shared/components/ui/themed-text';
import { IconSymbol } from './icon-symbol';
import { Spacing, IconSize, Opacity, Colors } from '@/shared/constants';

interface EmptyStateProps {
  message: string;
  icon?: string;
  testID?: string;
}

export function EmptyState({
  message,
  icon,
  testID = 'empty-state',
}: EmptyStateProps) {
  return (
    <View
      style={styles.container}
      testID={testID}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`Empty state: ${message}`}
    >
      {icon && <IconSymbol name={icon as any} size={IconSize.lg} color={Colors.gray[500]} />}
      <ThemedText style={styles.text}>{message}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl + Spacing.sm,
  },
  text: {
    opacity: Opacity.disabled,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});