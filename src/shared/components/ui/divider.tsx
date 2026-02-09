/**
 * Divider Component
 * Reusable divider with theming
 */
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useColorScheme } from '@/shared/hooks/use-color-scheme';
import { Colors, BorderWidth } from '@/shared/constants';

interface DividerProps {
  spacing?: number;
  style?: ViewStyle;
}

export function Divider({ spacing = 0, style }: DividerProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: isDark ? Colors.gray[900] : Colors.gray[300],
          marginVertical: spacing,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  divider: {
    height: BorderWidth.thin,
  },
});
