import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/shared/components/ui/themed-text';
import { formatCurrency } from '@/shared/utils/currency';
import type { ActivityItem } from '@/shared/types/api';
import { Colors } from '@/shared/constants';

interface ActivityListItemProps {
  item: ActivityItem;
  showDate?: boolean;
}

export function ActivityListItem({ item, showDate = false }: ActivityListItemProps) {
  const isNegative = item.amount < 0;

  return (
    <View style={styles.container} testID={`activity-item-${item.id}`}>
      <View style={styles.content}>
        <ThemedText style={styles.description} numberOfLines={1}>
          {item.description}
        </ThemedText>
        {showDate && (
          <ThemedText style={styles.date} testID={`activity-date-${item.id}`}>
            {item.date}
          </ThemedText>
        )}
      </View>
      <ThemedText
        style={[
          styles.amount,
          isNegative ? styles.negativeAmount : styles.positiveAmount,
        ]}
        testID={`activity-amount-${item.id}`}
      >
        {formatCurrency(item.amount, item.currency)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  content: {
    flex: 1,
  },
  description: {
    fontSize: 14,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    opacity: 0.6,
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
  },
  negativeAmount: {
    color: Colors.error,
  },
  positiveAmount: {
    color: Colors.success,
  },
});