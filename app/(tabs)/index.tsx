import { ActivityList } from '@/features/activity';
import { BalanceCard, useMerchantData } from '@/features/merchant';
import { LoadingState, ScreenContainer, ScreenHeader, ScreenScroll, ScreenSection } from '@/shared/components';
import { ErrorState } from '@/shared/components/ui/error-state';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useMerchantData();

  if (isLoading) {
    return (
      <ScreenContainer>
        <LoadingState />
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer>
        <ErrorState message={error.message} onRetry={() => refetch()} />
      </ScreenContainer>
    );
  }

  if (!data) {
    return null;
  }

  // Show first 3 activity items on home screen
  const recentActivity = data.activity.slice(0, 3);

  return (
    <ScreenContainer testID="home-screen">
      <ScreenScroll>
        <ScreenHeader title="Business Account" />

        <ScreenSection title="Account Balance">
          <BalanceCard
            availableBalance={data.available_balance}
            pendingBalance={data.pending_balance}
            currency={data.currency}
          />
        </ScreenSection>

        <ScreenSection title="Recent Activity">
          <ActivityList
            items={recentActivity}
            onShowMore={() => router.push('/modal-activities')}
          />
        </ScreenSection>

      </ScreenScroll>
    </ScreenContainer>
  );
}