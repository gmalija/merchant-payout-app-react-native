import { StyleSheet, type ViewStyle } from 'react-native';
import { ThemedView, type ThemedViewProps } from '@/shared/components/ui/themed-view';
import { useColorScheme } from '@/shared/hooks/use-color-scheme';
import { Colors, Spacing, BorderRadius } from '@/shared/constants';

interface CardProps extends ThemedViewProps {
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: number;
  style?: ViewStyle;
}

export function Card({
  variant = 'filled',
  padding = Spacing.base,
  style,
  children,
  ...rest
}: CardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const backgroundColor = isDark ? Colors.dark.surface : Colors.light.surface;
  // const borderColor = isDark ? Colors.dark.border : Colors.light.border;

  return (
    <ThemedView
      style={[
        styles.base,
        { backgroundColor, padding },
        // variant === 'elevated' && styles.elevated,
        // variant === 'outlined' && [
        //   styles.outlined,
        //   { borderColor },
        // ],
        style,
      ]}
      {...rest}
    >
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.md,
  },
  // elevated: {
  //   ...Shadows.base,
  // },
  outlined: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
});
