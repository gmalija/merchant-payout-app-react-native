import { StyleSheet, View, Modal } from 'react-native';
import { ThemedText } from '@/shared/components/ui/themed-text';
import { ThemedView } from '@/shared/components/ui/themed-view';
import { Button } from '@/shared/components/ui';
import { formatCurrency } from '@/shared/utils/currency';
import { Colors, Spacing, Typography, BorderRadius, Opacity } from '@/shared/constants';
import type { Currency } from '@/shared/types/api';

interface PayoutConfirmationModalProps {
  visible: boolean;
  amount: number;
  currency: Currency;
  iban: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PayoutConfirmationModal({
  visible,
  amount,
  currency,
  iban,
  isLoading = false,
  onConfirm,
  onCancel,
}: PayoutConfirmationModalProps) {
  // Mask IBAN for display (show first 4 and last 4 characters)
  const maskedIban =
    iban.length > 8
      ? `${iban.slice(0, 4)}${'*'.repeat(iban.length - 8)}${iban.slice(-4)}`
      : iban;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      testID="payout-confirmation-modal"
      accessibilityViewIsModal={true}
    >
      <View style={styles.overlay} accessible={false}>
        <ThemedView
          style={styles.container}
          accessibilityRole="alert"
          accessibilityLabel={`Confirm payout of ${formatCurrency(amount, currency, false)} to account ${maskedIban}`}
        >
          <View style={styles.content}>
            <ThemedText style={styles.title}>Confirm Payout</ThemedText>

            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Amount:</ThemedText>
                <ThemedText style={styles.detailValue} testID="confirm-amount">
                  {formatCurrency(amount * 100, currency)}
                </ThemedText>
              </View>

              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Currency:</ThemedText>
                <ThemedText style={styles.detailValue} testID="confirm-currency">
                  {currency}
                </ThemedText>
              </View>

              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>IBAN:</ThemedText>
                <ThemedText style={styles.detailValue} testID="confirm-iban">
                  {maskedIban}
                </ThemedText>
              </View>
            </View>

            <View style={styles.actions}>
              <Button
                title="Cancel"
                variant="secondary"
                size="large"
                onPress={onCancel}
                disabled={isLoading}
                style={styles.cancelButton}
                testID="confirm-cancel-button"
                accessibilityLabel="Cancel payout"
                accessibilityHint="Double tap to go back and edit the payout details"
              />
              <Button
                title="Confirm"
                variant="primary"
                size="large"
                onPress={onConfirm}
                loading={isLoading}
                disabled={isLoading}
                style={styles.confirmButton}
                testID="confirm-submit-button"
                accessibilityLabel="Confirm and execute payout"
                accessibilityHint="Double tap to confirm and process this payout"
              />
            </View>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    textAlign: 'center',
    marginBottom: Spacing.base,
  },
  detailsContainer: {
    gap: Spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  detailLabel: {
    fontSize: Typography.fontSize.base,
    opacity: Opacity.secondary,
  },
  detailValue: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.base,
    marginTop: Spacing.base,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.light.surface,
  },
  confirmButton: {
    flex: 1,
  },
});
