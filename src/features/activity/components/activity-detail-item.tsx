import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/shared/components/ui/themed-text';
import { formatCurrency } from '@/shared/utils/currency';
import { formatDate } from '@/shared/utils/date';
import type { ActivityItem } from '@/shared/types/api';
import { Colors } from '@/shared/constants';

interface ActivityDetailItemProps {
  item: ActivityItem;
}

const TYPE_LABELS: Record<ActivityItem['type'], string> = {
  deposit: 'Deposit',
  payout: 'Payout',
  refund: 'Refund',
  fee: 'Fee',
};

const STATUS_LABELS: Record<ActivityItem['status'], string> = {
  completed: 'Completed',
  pending: 'Pending',
  processing: 'Processing',
  failed: 'Failed',
};

export function ActivityDetailItem({ item }: ActivityDetailItemProps) {
  const isNegative = item.amount < 0;
  const typeLabel = TYPE_LABELS[item.type];
  const statusLabel = STATUS_LABELS[item.status];

  return (
    <View style={styles.container} testID={`activity-detail-item-${item.id}`}>
      <View style={styles.leftContent}>
        <ThemedText style={styles.type} testID={`activity-type-${item.id}`}>
          {typeLabel}
        </ThemedText>
        <ThemedText style={styles.description} numberOfLines={2}>
          {item.description}
        </ThemedText>
        <ThemedText style={styles.date} testID={`activity-formatted-date-${item.id}`}>
          {formatDate(item.date)}
        </ThemedText>
      </View>
      <View style={styles.rightContent}>
        <ThemedText
          style={[
            styles.amount,
            isNegative ? styles.negativeAmount : styles.positiveAmount,
          ]}
          testID={`activity-detail-amount-${item.id}`}
        >
          {formatCurrency(item.amount, item.currency)}
        </ThemedText>
        <ThemedText style={styles.status} testID={`activity-status-${item.id}`}>
          {statusLabel}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 16,
  },
  leftContent: {
    flex: 1,
    gap: 4,
  },
  rightContent: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 4,
  },
  type: {
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
  },
  date: {
    fontSize: 13,
    opacity: 0.6,
  },
  amount: {
    fontSize: 20,
    fontWeight: '600',
  },
  negativeAmount: {
    color: Colors.error,
  },
  positiveAmount: {
    color: Colors.success,
  },
  status: {
    fontSize: 13,
    opacity: 0.6,
  },
});