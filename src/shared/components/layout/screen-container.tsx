import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Edge } from 'react-native-safe-area-context';
import { ThemedView } from '@/shared/components/ui/themed-view';
import type { ReactNode } from 'react';

interface ScreenContainerProps {
  children: ReactNode;
  edges?: Edge[];
  testID?: string;
}

export function ScreenContainer({
  children,
  edges = ['top', 'left', 'right'],
  testID,
}: ScreenContainerProps) {
  return (
    <ThemedView style={styles.container} testID={testID}>
      <SafeAreaView style={styles.safeArea} edges={edges}>
        {children}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
