import { ScreenContainer, ScreenHeader, ScreenScroll } from '@/shared/components';

export default function HomeScreen() {
  return (
    <ScreenContainer testID="home-screen">
      <ScreenScroll>
        <ScreenHeader title="Business Account" />

        {/* <ScreenSection title="Account Balance">
        </ScreenSection>

        <ScreenSection title="Recent Activity">
        </ScreenSection> */}

      </ScreenScroll>
    </ScreenContainer>
  );
}