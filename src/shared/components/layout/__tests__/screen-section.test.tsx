import { render, screen } from '@testing-library/react-native';
import { ScreenSection } from '../screen-section';
import { Text } from 'react-native';

describe('ScreenSection', () => {
  it('should render children without title', () => {
    render(
      <ScreenSection>
        <Text>Section Content</Text>
      </ScreenSection>
    );

    expect(screen.getByText('Section Content')).toBeTruthy();
  });

  it('should render title and children', () => {
    render(
      <ScreenSection title="Section Title">
        <Text>Section Content</Text>
      </ScreenSection>
    );

    expect(screen.getByText('Section Title')).toBeTruthy();
    expect(screen.getByText('Section Content')).toBeTruthy();
  });

  it('should not render title when not provided', () => {
    render(
      <ScreenSection>
        <Text>Content Only</Text>
      </ScreenSection>
    );

    expect(screen.getByText('Content Only')).toBeTruthy();
  });

  it('should render multiple children', () => {
    render(
      <ScreenSection title="Multiple Items">
        <Text>First</Text>
        <Text>Second</Text>
        <Text>Third</Text>
      </ScreenSection>
    );

    expect(screen.getByText('Multiple Items')).toBeTruthy();
    expect(screen.getByText('First')).toBeTruthy();
    expect(screen.getByText('Second')).toBeTruthy();
    expect(screen.getByText('Third')).toBeTruthy();
  });

  it('should apply custom spacing', () => {
    const { UNSAFE_getByType } = render(
      <ScreenSection title="Title" spacing={40}>
        <Text>Content</Text>
      </ScreenSection>
    );

    const { ThemedView } = require('@/shared/components/ui/themed-view');
    const themedView = UNSAFE_getByType(ThemedView);
    expect(themedView.props.style).toMatchObject({ marginBottom: 40 });
  });
});
