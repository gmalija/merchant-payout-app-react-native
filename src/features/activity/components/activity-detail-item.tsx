import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/shared/components/ui/themed-text';
import { formatCurrency, formatDate } from '@/shared/utils';
import type { ActivityItem } from '@/shared/types/api';
import { Colors, Layout, Opacity, Spacing, Typography } from '@/shared/constants';

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
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.base,
    gap: Layout.gap.base,
  },
  leftContent: {
    flex: 1,
    gap: Layout.gap.xs,
  },
  rightContent: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: Layout.gap.xs,
  },
  type: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
  },
  description: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.regular,
  },
  date: {
    fontSize: Typography.fontSize.sm,
    opacity: Opacity.secondary,
  },
  amount: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.regular,
  },
  negativeAmount: {
    color: Colors.error,
  },
  positiveAmount: {
    color: Colors.success,
  },
  status: {
    fontSize: Typography.fontSize.sm,
    opacity: Opacity.secondary,
  },
});