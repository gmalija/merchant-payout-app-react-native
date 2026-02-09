import { StyleSheet, ScrollView, type ScrollViewProps } from 'react-native';
import { ThemedView } from '@/shared/components/ui/themed-view';
import { Spacing } from '@/shared/constants';
import type { ReactNode } from 'react';

interface ScreenScrollProps extends Omit<ScrollViewProps, 'style'> {
  children: ReactNode;
  padding?: boolean;
}

export function ScreenScroll({
  children,
  padding = true,
  testID,
  ...rest
}: ScreenScrollProps) {
  return (
    <ScrollView style={styles.scroll} testID={testID} {...rest}>
      <ThemedView style={padding ? styles.content : undefined}>
        {children}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: Spacing.base,
  },
});
