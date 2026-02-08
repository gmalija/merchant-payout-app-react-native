import { StyleSheet } from 'react-native';
import { ThemedView } from '@/shared/components/ui/themed-view';
import { ThemedText } from '@/shared/components/ui/themed-text';
import { Spacing } from '@/shared/constants';
import type { ReactNode } from 'react';

interface ScreenSectionProps {
  title?: string;
  children: ReactNode;
  spacing?: number;
}

export function ScreenSection({
  title,
  children,
  spacing = Spacing.xl,
}: ScreenSectionProps) {
  return (
    <ThemedView style={{ marginBottom: spacing }}>
      {title && (
        <ThemedText type="subtitle" style={styles.title}>
          {title}
        </ThemedText>
      )}
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: Spacing.md,
  },
});
