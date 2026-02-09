import { StyleSheet, View, ViewStyle } from 'react-native';
import { ThemedText } from '@/shared/components/ui/themed-text';
import { ThemedView } from '@/shared/components/ui/themed-view';
import { Button, Card, IconSymbol } from '@/shared/components/ui';
import { formatCurrency } from '@/shared/utils/currency';
import { Colors, Spacing, Typography, BorderRadius, ComponentSizes } from '@/shared/constants';
import { useThemeColor } from '@/shared/hooks/use-theme-color';
import type { Currency } from '@/shared/types/api';

interface PayoutSuccessProps {
  amount: number;
  currency: Currency;
  payoutId: string;
  onDone: () => void;
}

export function PayoutSuccess({ amount, currency, payoutId, onDone }: PayoutSuccessProps) {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <IconSymbol
            name="checkmark.circle.fill"
            size={ComponentSizes.icon.lg}
            color={Colors.white}
          />
        </View>

        <ThemedText style={styles.title}>Payout Completed</ThemedText>
        <ThemedText style={styles.subtitle}>
          Your payout of {formatCurrency(amount * 100, currency)} has been processed successfully.
        </ThemedText>

        <Button
          title="Create Another Payout"
          variant="primary"
          size="large"
          onPress={onDone}
          fullWidth
          testID="success-done-button"
          style={styles.doneButton}
        />
      </View>
    </ThemedView>
  );
}

interface PayoutErrorProps {
  error: string;
  onRetry: () => void;
  onCancel: () => void;
}

export function PayoutError({ error, onRetry, onCancel }: PayoutErrorProps) {
  const errorBgColor = useThemeColor(
    { light: Colors.light.errorBackground, dark: Colors.dark.errorBackground },
    'background'
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, styles.errorIconContainer]}>
          <IconSymbol
            name="x.square.fill"
            size={ComponentSizes.icon.lg}
            color={Colors.white}
          />
        </View>

        <ThemedText style={styles.title}>Payout Failed</ThemedText>
        <ThemedText style={styles.subtitle}>We couldn&apos;t process your payout</ThemedText>

        <Card style={StyleSheet.flatten([styles.errorCard, { backgroundColor: errorBgColor }]) as ViewStyle}>
          <ThemedText style={styles.errorMessage} testID="error-message">
            {error}
          </ThemedText>
        </Card>

        <View style={styles.actions}>
          <Button
            title="Cancel"
            variant="outline"
            size="large"
            onPress={onCancel}
            style={styles.button}
            testID="error-cancel-button"
          />
          <Button
            title="Try Again"
            variant="primary"
            size="large"
            onPress={onRetry}
            style={styles.button}
            testID="error-retry-button"
          />
        </View>
      </View>
    </ThemedView>
  );
}

interface InsufficientFundsProps {
  requestedAmount: number;
  currency: Currency;
  availableBalance: number;
  onCancel: () => void;
}

export function InsufficientFunds({
  requestedAmount,
  currency,
  availableBalance,
  onCancel,
}: InsufficientFundsProps) {
  const shortage = requestedAmount - availableBalance;
  const dividerColor = useThemeColor(
    { light: Colors.light.border, dark: Colors.dark.border },
    'border'
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, styles.warningIconContainer]}>
          <IconSymbol
            name="exclamationmark.triangle.fill"
            size={ComponentSizes.icon.lg}
            color={Colors.white}
          />
        </View>

        <ThemedText style={styles.title}>Insufficient Funds</ThemedText>
        <ThemedText style={styles.subtitle}>You don&apos;t have enough balance for this payout</ThemedText>

        <Card style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Requested Amount</ThemedText>
            <ThemedText style={styles.detailValue} testID="insufficient-requested">
              {formatCurrency(requestedAmount, currency, false)}
            </ThemedText>
          </View>

          <View style={[styles.divider, { backgroundColor: dividerColor }]} />

          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Available Balance</ThemedText>
            <ThemedText style={styles.detailValue} testID="insufficient-available">
              {formatCurrency(availableBalance, currency, false)}
            </ThemedText>
          </View>

          <View style={[styles.divider, { backgroundColor: dividerColor }]} />

          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Short by</ThemedText>
            <ThemedText style={styles.errorAmount} testID="insufficient-shortage">
              {formatCurrency(shortage, currency, false)}
            </ThemedText>
          </View>
        </Card>

        <ThemedText style={styles.infoText}>
          Please reduce the payout amount or wait for more funds to become available in your
          account.
        </ThemedText>

        <Button
          title="Go Back"
          variant="primary"
          size="large"
          onPress={onCancel}
          fullWidth
          testID="insufficient-back-button"
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.success,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIconContainer: {
    backgroundColor: Colors.error,
  },
  warningIconContainer: {
    backgroundColor: Colors.warning,
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  doneButton: {
    marginTop: Spacing.xl,
  },
  detailsCard: {
    padding: Spacing.base,
    gap: Spacing.md,
  },
  errorCard: {
    padding: Spacing.base,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payoutIdRow: {
    flexDirection: 'column',
    gap: Spacing.sm,
  },
  detailLabel: {
    fontSize: Typography.fontSize.sm,
    opacity: 0.7,
  },
  detailValue: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
  },
  payoutIdValue: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    flexWrap: 'wrap',
  },
  successAmount: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.success,
  },
  errorAmount: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.error,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary,
  },
  divider: {
    height: 1,
  },
  errorMessage: {
    fontSize: Typography.fontSize.sm,
    color: Colors.error,
    textAlign: 'center',
  },
  infoText: {
    fontSize: Typography.fontSize.sm,
    textAlign: 'center',
    opacity: 0.7,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  button: {
    flex: 1,
  },
});
