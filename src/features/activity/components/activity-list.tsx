import { StyleSheet, View } from 'react-native';
import { Button, EmptyState, Divider } from '@/shared/components/ui';
import { ActivityListItem } from './activity-list-item';
import { Colors, BorderRadius, Spacing } from '@/shared/constants';
import type { ActivityItem } from '@/shared/types/api';

interface ActivityListProps {
  items: ActivityItem[];
  onShowMore?: () => void;
}

export function ActivityList({ items, onShowMore }: ActivityListProps) {
  if (items.length === 0) {
    return <EmptyState message="No recent activity" icon="tray.fill" />;
  }

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={item.id}>
          {index > 0 && <Divider />}
          <ActivityListItem item={item} />
        </View>
      ))}

      {onShowMore && (
        <View style={styles.showMoreContainer}>
          <Button
            title="Show More"
            variant="ghost"
            size="medium"
            onPress={onShowMore}
            testID="show-more-button"
            fullWidth
            style={styles.showMoreButton}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  showMoreContainer: {
    marginTop: Spacing.md,
  },
  showMoreButton: {
    backgroundColor: Colors.light.infoBackground,
    borderRadius: BorderRadius.base,
  },
});
