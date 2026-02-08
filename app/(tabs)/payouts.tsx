import { ScreenContainer, ScreenScroll, ScreenHeader } from '@/shared/components';

export default function PayoutsScreen() {
  return (
    <ScreenContainer testID="payout-screen">
      <ScreenScroll>
        <ScreenHeader title="Initiate Payout" />
  
        {/* <ScreenSection title="Payout Amount">
        </ScreenSection> */}
  
      </ScreenScroll>
    </ScreenContainer>
  );
}