import { ScreenContainer, ScreenScroll, ScreenHeader } from '@/shared/components';
import { PayoutFlow } from '@/features/payouts';

export default function PayoutsScreen() {
  return (
    <ScreenContainer>
      <ScreenScroll>
        <ScreenHeader title="Send Payout" />
        <PayoutFlow />
      </ScreenScroll>
    </ScreenContainer>
  );
}