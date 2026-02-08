import { useMemo } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/shared/components/ui/themed-text';
import { LoadingState, ErrorState, EmptyState, Divider } from '@/shared/components/ui';
import { ScreenContainer } from '@/shared/components/layout';
import { ActivityDetailItem, useActivityInfinite } from '@/features/activity';
import { Colors, Layout, Opacity, Spacing, Typography } from '@/shared/constants';

export default function ModalScreen() {
  const router = useRouter();
  const {
    data,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useActivityInfinite();

  // Flatten pages into single array of items
  const items = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderItem = ({ item }: { item: (typeof items)[0] }) => (
    <ActivityDetailItem item={item} />
  );

  const renderSeparator = () => <Divider />;

  const renderFooter = () => {
    // Only show footer loading when we have items and are loading more
    if (!isFetchingNextPage || items.length === 0) return null;

    return (
      <View style={styles.footer} testID="loading-more-indicator">
        <ActivityIndicator size="small" />
        <ThemedText style={styles.footerText}>Loading more...</ThemedText>
      </View>
    );
  };

  const renderEmptyComponent = () => {
    if (isLoading) {
      return <LoadingState message="Loading activity..." />;
    }

    if (error) {
      return <ErrorState message={error.message} onRetry={() => refetch()} />;
    }

    return <EmptyState message="No activity found" icon="tray.fill" />;
  };

  return (
    <ScreenContainer testID="modal-activities">
      <View style={styles.header}>
        <ThemedText type="title">Recent Activity</ThemedText>
        <Pressable onPress={() => router.back()} testID="close-button">
          <ThemedText style={styles.doneButton}>Done</ThemedText>
        </Pressable>
      </View>
      <Divider />

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={renderSeparator}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyComponent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        testID="activity-list"
        style={styles.list}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.base,
  },
  doneButton: {
    color: Colors.primary,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
  },
  list: {
    flex: 1,
  },
  footer: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    gap: Layout.gap.base,
  },
  footerText: {
    opacity: Opacity.secondary,
  },
})