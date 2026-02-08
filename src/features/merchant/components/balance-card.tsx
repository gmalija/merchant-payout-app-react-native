import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/shared/components/ui/themed-text';
import { formatCurrency } from '@/shared/utils/currency';
import type { Currency } from '@/shared/types/api';

interface BalanceCardProps {
  availableBalance: number;
  pendingBalance: number;
  currency: Currency;
}

export function BalanceCard({
  availableBalance,
  pendingBalance,
  currency,
}: BalanceCardProps) {
  return (
    <View style={styles.balanceRow}>
      <View style={styles.balanceItem}>
        <ThemedText style={styles.label}>Available</ThemedText>
        <ThemedText style={styles.amount} testID="available-balance">
          {formatCurrency(availableBalance, currency)}
        </ThemedText>
      </View>

      <View style={styles.balanceItem}>
        <ThemedText style={styles.label}>Pending</ThemedText>
        <ThemedText style={styles.amount} testID="pending-balance">
          {formatCurrency(pendingBalance, currency)}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  balanceItem: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  amount: {
    fontSize: 20,
    fontWeight: '600',
  },
});