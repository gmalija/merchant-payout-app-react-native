import { StyleSheet, View } from 'react-native';
import { ThemedView } from '@/shared/components/ui/themed-view';
import { ThemedText } from '@/shared/components/ui/themed-text';
import { Spacing } from '@/shared/constants';
import type { ReactNode } from 'react';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  spacing?: number;
}

export function ScreenHeader({
  title,
  subtitle,
  action,
  spacing = Spacing.xl,
}: ScreenHeaderProps) {
  return (
    <ThemedView style={{ marginBottom: spacing }}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <ThemedText type="title">{title}</ThemedText>
          {subtitle && (
            <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
          )}
        </View>
        {action && <View style={styles.actionContainer}>{action}</View>}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  subtitle: {
    marginTop: Spacing.xs,
  },
  actionContainer: {
    marginLeft: Spacing.base,
  },
});
