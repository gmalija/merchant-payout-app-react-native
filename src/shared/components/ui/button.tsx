import { StyleSheet, Pressable, ActivityIndicator, type PressableProps, type ViewStyle } from 'react-native';
import { ThemedText } from '@/shared/components/ui/themed-text';
import { Colors, Spacing, BorderRadius, Typography, Opacity, MinTouchTarget, BorderWidth } from '@/shared/constants';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export function Button({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  onPress,
  testID,
  style,
  accessibilityLabel,
  accessibilityHint,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{
        disabled: isDisabled,
        busy: loading,
      }}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        isDisabled && variant === 'primary' && styles.disabledPrimary,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? Colors.white : Colors.primary}
          accessibilityLabel="Loading"
        />
      ) : (
        <ThemedText
          style={[
            styles.text,
            styles[`text_${variant}`],
            styles[`textSize_${size}`],
            isDisabled && styles.disabledText,
          ]}
        >
          {title}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.base,
  },
  // Variants
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.gray[600],
  },
  outline: {
    backgroundColor: Colors.transparent,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.primary,
  },
  ghost: {
    backgroundColor: Colors.transparent,
  },
  // Sizes - Updated for minimum touch target
  size_small: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + Spacing.xs / 2,
    minHeight: MinTouchTarget.small,
  },
  size_medium: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm + Spacing.xs,
    minHeight: MinTouchTarget.small,
  },
  size_large: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md + Spacing.xs / 2,
    minHeight: MinTouchTarget.medium,
  },
  // States
  disabled: {
    opacity: Opacity.full,
  },
  disabledPrimary: {
    backgroundColor: Colors.light.surfaceVariant,
  },
  pressed: {
    opacity: Opacity.pressed,
  },
  fullWidth: {
    width: '100%',
  },
  disabledText: {
    color: Colors.light.disabledText,
  },
  // Text styles
  text: {
    fontWeight: Typography.fontWeight.semibold,
  },
  text_primary: {
    color: Colors.white,
  },
  text_secondary: {
    color: Colors.white,
  },
  text_outline: {
    color: Colors.primary,
  },
  text_ghost: {
    color: Colors.primary,
  },
  textSize_small: {
    fontSize: Typography.fontSize.base,
  },
  textSize_medium: {
    fontSize: Typography.fontSize.md,
  },
  textSize_large: {
    fontSize: Typography.fontSize.lg,
  },
});