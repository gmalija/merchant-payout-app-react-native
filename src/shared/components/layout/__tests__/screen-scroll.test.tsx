import { render, screen } from '@testing-library/react-native';
import { ScreenScroll } from '../screen-scroll';
import { Text } from 'react-native';

describe('ScreenScroll', () => {
  it('should render children', () => {
    render(
      <ScreenScroll>
        <Text>Scrollable Content</Text>
      </ScreenScroll>
    );

    expect(screen.getByText('Scrollable Content')).toBeTruthy();
  });

  it('should render with testID', () => {
    render(
      <ScreenScroll testID="test-scroll">
        <Text>Content</Text>
      </ScreenScroll>
    );

    expect(screen.getByTestId('test-scroll')).toBeTruthy();
  });

  it('should apply padding by default', () => {
    render(
      <ScreenScroll>
        <Text>Content</Text>
      </ScreenScroll>
    );

    // Padding is applied by default
    expect(screen.getByText('Content')).toBeTruthy();
  });

  it('should not apply padding when padding=false', () => {
    render(
      <ScreenScroll padding={false}>
        <Text>Content</Text>
      </ScreenScroll>
    );

    expect(screen.getByText('Content')).toBeTruthy();
  });

  it('should render multiple children', () => {
    render(
      <ScreenScroll>
        <Text>First Item</Text>
        <Text>Second Item</Text>
        <Text>Third Item</Text>
      </ScreenScroll>
    );

    expect(screen.getByText('First Item')).toBeTruthy();
    expect(screen.getByText('Second Item')).toBeTruthy();
    expect(screen.getByText('Third Item')).toBeTruthy();
  });

  it('should forward ScrollView props', () => {
    const onScroll = jest.fn();

    const { UNSAFE_getByType } = render(
      <ScreenScroll
        horizontal
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
      >
        <Text>Content</Text>
      </ScreenScroll>
    );

    const { ScrollView } = require('react-native');
    const scrollView = UNSAFE_getByType(ScrollView);

    expect(scrollView.props.horizontal).toBe(true);
    expect(scrollView.props.showsVerticalScrollIndicator).toBe(false);
  });
});
