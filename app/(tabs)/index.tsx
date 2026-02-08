import { BalanceCard, useMerchantData } from '@/features/merchant';
import { LoadingState, ScreenContainer, ScreenHeader, ScreenScroll, ScreenSection } from '@/shared/components';
import { ErrorState } from '@/shared/components/ui/error-state';

export default function HomeScreen() {

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

      </ScreenScroll>
    </ScreenContainer>
  );
}