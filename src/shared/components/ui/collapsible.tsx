import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/shared/components/ui/themed-text';
import { ThemedView } from '@/shared/components/ui/themed-view';
import { IconSymbol } from '@/shared/components/ui/icon-symbol';
import { Colors, ComponentSizes, Layout, Opacity, Spacing } from '@/shared/constants/theme';
import { useColorScheme } from '@/shared/hooks/use-color-scheme';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? 'light';

  return (
    <ThemedView>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={Opacity.pressed}>
        <IconSymbol
          name="chevron.right"
          size={ComponentSizes.icon.sm}
          weight="medium"
          color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />

        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </TouchableOpacity>
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.gap.sm,
  },
  content: {
    marginTop: Layout.gap.sm,
    marginLeft: Spacing.xl,
  },
});
